import { useState, useEffect, useMemo } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { convertToISO8601 } from "../utility/datetime.utility";
import { fetch1601cData, fetchTemplate } from "../services/data-export.service";
import { indexTemplateByCode, normalizeTemplateValues } from "../data/data-form.data";
import { downloadExcel1601c } from "../utility/excel.utility";

const defaultFormData = {
    date_start: "",
    date_end: "",
    active_employees: true,
    payrun_payment_or_period: "PAYMENT",
    payrun_status: ["APPROVED"],
    employee_ids: [],
};

const toNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
};

const formatMoney = (value) => {
    const num = toNumber(value);
    return num.toFixed(2);
};

const ensureRowShape = (row, columns) => {
    const shaped = { ...row };
    const cols = Array.isArray(columns) ? columns : [];
    for (const col of cols) {
        if (col && col.key != null && !(col.key in shaped)) {
            shaped[col.key] = "";
        }
    }
    return shaped;
};


export const mergeTemplateWithBackend = (template, backendRow) => {
    return normalizeTemplateValues(
        template.map(f => ({
            ...f,
            value: backendRow[f.field_code] ?? f.value ?? "", // use backend value if exists
        }))
    );
}

// Convert template → row keyed by field_code
export const templateToRow = (template) => {
    return template.reduce((acc, f) => {
        acc[f.field_code] = f.value ?? "";
        return acc;
    }, {});
};


const use1601c = () => {
    const [formData, setFormData] = useState({
        date_start: "",
        date_end: "",
        active_employees: true,
        payrun_payment_or_period: "PAYMENT",
        payrun_status: ["APPROVED"],
        employee_ids: [],
    });
    const [rows, setRows] = useState([]);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [template, setTemplate] = useState([]);
    const [columnsLoading, setColumnsLoading] = useState(false);

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    const applyTemplate = (fetchedTemplate) => {
        setTemplate(fetchedTemplate);
        setColumns(fetchedTemplate.map((f) => ({ key: f.field_code, label: f.field_name })));
    };

    useEffect(() => {
        if (!company?.company_id) return;

        const loadTemplate = async () => {
            setColumnsLoading(true);
            try {
                const res = await fetchTemplate("1601C");
                applyTemplate(res?.data?.template ?? []);
            } catch (err) {
                addToast(`Failed to load 1601C template: ${err?.message || err}`, "error");
            } finally {
                setColumnsLoading(false);
            }
        };

        loadTemplate();
    }, [company?.company_id]);

    const recompute1601cRow = (row, columnsList) => {
        const totalComp = toNumber(row["total_compensation"]);
        const minWage = toNumber(row["minimum_wage"]);
        const holidayPay = toNumber(row["holiday_pay"]);
        const thirteenth = toNumber(row["thirteenth_month"]);
        const deMinimis = toNumber(row["de_minimis"]);
        const sssPhic = toNumber(row["mandatory_contributions"]);
        const otherNonTax = toNumber(row["other_non_taxable"]);
        const exempt = toNumber(row["less_exempt"]);

        const totalNonTax = minWage + holidayPay + thirteenth + deMinimis + sssPhic + otherNonTax;
        const totalTaxable = totalComp - totalNonTax;
        const netTaxable = totalTaxable - exempt;

        const taxWithheld = toNumber(row["tax_withheld"]);
        const adjustment = toNumber(row["adjustment"]);
        const taxRemittance = taxWithheld + adjustment;

        const prevRemitted = toNumber(row["previous_remitted"]);
        const otherRemit = toNumber(row["other_remit"]);
        const totalRemit = prevRemitted + otherRemit;
        const taxDue = taxRemittance - totalRemit;

        const surcharge = toNumber(row["surcharge"]);
        const interest = toNumber(row["interest"]);
        const compromise = toNumber(row["compromise"]);
        const totalPenalties = surcharge + interest + compromise;
        const totalAmountDue = taxDue + totalPenalties;

        const totalAdjSch = toNumber(row["adjustment_1"]) + toNumber(row["adjustment_2"]) + toNumber(row["adjustment_3"]);

        return ensureRowShape({
            ...row,
            "total_non_taxable": formatMoney(totalNonTax),
            "total_taxable_compensation": formatMoney(totalTaxable),
            "net_taxable": formatMoney(netTaxable),
            "tax_remittance": formatMoney(taxRemittance),
            "total_remit": formatMoney(totalRemit),
            "tax_due": formatMoney(taxDue),
            "total_penalties": formatMoney(totalPenalties),
            "total_amount_due": formatMoney(totalAmountDue),
            "total_adjustment": formatMoney(totalAdjSch),
        }, columnsList);
    };


    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        if (!company?.company_id) {
            addToast("No company selected", "error");
            return;
        }
        const date_start = convertToISO8601(formData.date_start);
        const date_end = convertToISO8601(formData.date_end);

        if (!date_start || !date_end) return;
        setGenerateLoading(true);
        try {
            // 1) Call backend to compute/fill by field_code
            const activeEmployeesBool = formData.active_employees ? "true" : "false";
            const res = await fetch1601cData(
                company.company_id,
                date_start,
                date_end,
                activeEmployeesBool,
                formData.payrun_payment_or_period,
                formData.payrun_status,
                // formData.payrun_type,
                formData.employee_ids,
            );
            console.log("📄 Backend response for 1601C:", res?.data);
            const data = res?.data ?? {};
            console.log("Backend response for columns and template:", res?.data);
            // setColumns(data.columns ?? []);
            const fetchedTemplate = data.template ?? [];
            const backendRow = data.data1601c?.[company.company_id] ?? {};

            if (data.template?.length) {
                setTemplate(data.template);
                setColumns(data.template.map((f) => ({ key: f.field_code, label: f.field_name })));
            }
            const filledTemplate = mergeTemplateWithBackend(fetchedTemplate, backendRow);
            const tableRow = templateToRow(filledTemplate);

            setRows([(tableRow)]);

        } catch (error) {
            addToast(`Error generating report: ${error?.message || error}`, "error");

            addToast("Error generating report", "error");
        } finally {
            setGenerateLoading(false);
        }
    };

    const handleChangeCell = (rowIdx, key, value) => {
        setRows((prev) => {
            const next = [...prev];
            next[rowIdx] = recompute1601cRow({ ...next[rowIdx], [key]: value }, columns);
            return next;
        });
    };

    const handleDownload = () => {
        setDownloadLoading(true);
        try {
            if (!columns?.length || !rows?.length) {
                addToast("No data to download. Generate first.", "warning");
                return;
            }
            const filename = `1601c-export-${formData.date_start || "date"}-${formData.date_end || "date"}`.replace(/\//g, "-");
            downloadExcel1601c(columns, rows, filename, "1601C");
            addToast("1601C Excel downloaded.", "success");
        } catch (err) {
            addToast(err?.message || "Download failed", "error");
        } finally {
            setDownloadLoading(false);
        }
    };

    /** Load a draft from history into the form for editing (periodFrom/periodTo as ISO or YYYY-MM-DD, snapshotRow = form_data_snapshot.template or form_data_snapshot) */
    const loadDraftForEdit = (periodFrom, periodTo, snapshotRow) => {
        try {
            const fromStr = periodFrom ? (typeof periodFrom === "string" ? periodFrom.slice(0, 10) : periodFrom.toISOString?.()?.slice(0, 10)) : "";
            const toStr = periodTo ? (typeof periodTo === "string" ? periodTo.slice(0, 10) : periodTo.toISOString?.()?.slice(0, 10)) : "";
            setFormData((prev) => ({ ...prev, date_start: fromStr, date_end: toStr }));
            const row = snapshotRow && typeof snapshotRow === "object" && !Array.isArray(snapshotRow) ? snapshotRow : {};
            const cols = Array.isArray(columns) ? columns : [];
            // setRows([recompute1601cRow(row, cols)]);

            const filledTemplate = mergeTemplateWithBackend(template, row);
            const tableRow = templateToRow(filledTemplate);
            setRows([recompute1601cRow(tableRow)]);
        } catch (err) {
            addToast("Failed to load draft data", "error");
            setRows([]);
        }
    };

    return {
        formData, setFormData,
        rows, setRows,
        generateLoading,
        downloadLoading,
        columns, columnsLoading,
        handleGenerate,
        handleDownload,
        handleChangeCell,
        loadDraftForEdit,
    };
};



export default use1601c;