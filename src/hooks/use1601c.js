import { useState, useEffect, useMemo } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { convertToISO8601 } from "../utility/datetime.utility";
import { fetch1601cColumns, fetch1601cDataAdvanced } from "../services/data-export.service";
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
    for (const col of columns) {
        if (!(col.key in shaped)) {
            shaped[col.key] = "";
        }
    }
    return shaped;
};

const use1601c = () => {
    const [formData, setFormData] = useState({ ...defaultFormData });
    const [rows, setRows] = useState([]);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [lockedKeys, setLockedKeys] = useState(new Set());
    const [zeroDefaultKeys, setZeroDefaultKeys] = useState([]);
    const [template, setTemplate] = useState([]);
    const [columnsLoading, setColumnsLoading] = useState(false);

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    // Load columns on mount
    useEffect(() => {
        const loadColumns = async () => {
            setColumnsLoading(true);
            try {
                const res = await fetch1601cColumns();
                const data = res?.data ?? {};
                setColumns(data.columns ?? []);
                setLockedKeys(new Set(data.lockedKeys ?? []));
                setZeroDefaultKeys(data.zeroDefaultKeys ?? []);
                setTemplate(data.template ?? []);
            } catch (error) {
                addToast("Failed to load 1601C columns", "error");
            } finally {
                setColumnsLoading(false);
            }
        };
        loadColumns();
    }, [addToast]);

    const recompute1601cRow = (row, columnsList) => {
        const totalComp = toNumber(row["Total Comp (14)"]);
        const minWage = toNumber(row["Min Wage (15)"]);
        const holidayPay = toNumber(row["Holiday Pay (16)"]);
        const thirteenth = toNumber(row["13th Month (17)"]);
        const deMinimis = toNumber(row["De Minimis (18)"]);
        const sssPhic = toNumber(row["SSS/PHIC (19)"]);
        const otherNonTax = toNumber(row["Other Non-Tax (20)"]);
        const exempt = toNumber(row["ess: Exempt (23)"]);

        const totalNonTax = minWage + holidayPay + thirteenth + deMinimis + sssPhic + otherNonTax;
        const totalTaxable = totalComp - totalNonTax;
        const netTaxable = totalTaxable - exempt;

        const taxWithheld = toNumber(row["Tax Withheld (25)"]);
        const adjustment = toNumber(row["Adjustment (26)"]);
        const taxRemittance = taxWithheld + adjustment;

        const prevRemitted = toNumber(row["Prev Remitted (28)"]);
        const otherRemit = toNumber(row["Other Remit (29)"]);
        const totalRemit = prevRemitted + otherRemit;
        const taxDue = taxRemittance - totalRemit;

        const surcharge = toNumber(row["Surcharge (32)"]);
        const interest = toNumber(row["Interest (33)"]);
        const compromise = toNumber(row["Compromise (34)"]);
        const totalPenalties = surcharge + interest + compromise;
        const totalAmountDue = taxDue + totalPenalties;

        const totalAdjSch = toNumber(row["Adjustment 1"]) + toNumber(row["Adjustment 2"]) + toNumber(row["Adjustment 3"]);

        return ensureRowShape({
            ...row,
            "Total Non-Tax (21)": formatMoney(totalNonTax),
            "Total Taxable (22)": formatMoney(totalTaxable),
            "Net Taxable (24)": formatMoney(netTaxable),
            "Tax Remittance (27)": formatMoney(taxRemittance),
            "Total Remit (30)": formatMoney(totalRemit),
            "Tax Due (31)": formatMoney(taxDue),
            "Total Penalties (35)": formatMoney(totalPenalties),
            "Total Amount Due (36)": formatMoney(totalAmountDue),
            "Total Adj (Sch)": formatMoney(totalAdjSch),
        }, columnsList);
    };

    const fillTemplateWithBackend = (tpl, backendRow = {}) => {
        const next = (tpl ?? []).map((f) => {
            if (!f?.field_code) return f;
            if (backendRow[f.field_code] === undefined) return f;
            return { ...f, value: backendRow[f.field_code] };
        });
        return normalizeTemplateValues(next);
    };

    const templateToRow = (tpl) => {
        const byCode = indexTemplateByCode(tpl);

        // Map template field_code -> current table column keys
        const map = {
            generated: "Generated?",
            month: "Month",
            year: "Year",
            sheets_attached: "Sheets Attached",
            tin: "TIN",
            company_tin: "TIN",
            rdo: "RDO Code",
            company_name: "Agent Name",
            company_address: "Address",
            company_phone: "Contact No",
            company_email: "Email",

            total_compensation: "Total Comp (14)",
            minimum_wage: "Min Wage (15)",
            holiday_overtime_night_diff_hazard: "Holiday Pay (16)",
            thirteenth_month: "13th Month (17)",
            de_minimis: "De Minimis (18)",
            mandatory_contributions: "SSS/PHIC (19)",
            other_non_taxable: "Other Non-Tax (20)",
            less_exempt: "ess: Exempt (23)",
            tax_withheld: "Tax Withheld (25)",
            total_taxes_withheld: "Tax Withheld (25)",

            amended_return: "Amended Return?",
            taxes_withheld_flag: "Taxes Withheld?",
            tax_relief: "Tax Relief",
            specify: "Specify(13A)",

            prev_month_1: "Prev Month 1",
            date_paid_1: "Date Paid 1",
            bank_1: "Bank 1",
            ref_1: "Ref 1",
            tax_paid_1: "Tax Paid 1",
            tax_due_1: "Tax Due 1",
            adjustment_1: "Adjustment 1",

            prev_month_2: "Prev Month 2",
            date_paid_2: "Date Paid 2",
            bank_2: "Bank 2",
            ref_2: "Ref 2",
            tax_paid_2: "Tax Paid 2",
            tax_due_2: "Tax Due 2",
            adjustment_2: "Adjustment 2",

            prev_month_3: "Prev Month 3",
            date_paid_3: "Date Paid 3",
            bank_3: "Bank 3",
            ref_3: "Ref 3",
            tax_paid_3: "Tax Paid 3",
            tax_due_3: "Tax Due 3",
            adjustment_3: "Adjustment 3",

            total_adjustment: "Total Adj (Sch)",
            payment_type: "Payment Type",
            pay_bank: "Pay Bank",
            pay_number: "Pay Number",
            pay_date: "Pay Date",
            pay_amount: "Pay Amount",
            others: "Others",

            zipcode: "Zipcode",
        };

        const row = {};
        for (const [code, colKey] of Object.entries(map)) {
            const item = byCode.get(code);
            if (!item) continue;
            row[colKey] = item.value;
        }
        return row;
    };

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        setGenerateLoading(true);
        try {
            if (columns.length === 0) {
                addToast("Columns are not loaded yet.", "warning");
                return;
            }
            if (!company?.company_id) {
                addToast("No company selected", "error");
                return;
            }
            const date_start = convertToISO8601(formData.date_start);
            const date_end = convertToISO8601(formData.date_end);

            if (!date_start || !date_end) {
                addToast("Please select a valid date range", "warning");
                return;
            }

            // 1) Call backend to compute/fill by field_code
            const activeEmployeesBool = formData.active_employees ? "true" : "false";
            const res = await fetch1601cDataAdvanced(
                company.company_id,
                date_start,
                date_end,
                activeEmployeesBool,
                formData.payrun_payment_or_period,
                formData.payrun_status,
                formData.employee_ids,
            );
            const companyRow = res?.data?.data1601c?.[company.company_id] ?? {};

            // 2) Merge backend values into template (then normalize number types)
            const filledTemplate = fillTemplateWithBackend(template, companyRow);

            // 3) Convert template -> table row keys used by FixedHeaderTable
            const templateRow = templateToRow(filledTemplate);

            const baseRow = ensureRowShape(templateRow, columns);

            for (const key of zeroDefaultKeys) {
                if (!baseRow[key] && baseRow[key] !== 0) baseRow[key] = "0";
            }

            // 4) Keep your existing frontend computed columns logic
            setRows([recompute1601cRow(baseRow, columns)]);
        } catch (error) {
            addToast("Error generating report", "error");
        } finally {
            setGenerateLoading(false);
        }
    };

    const handleChangeCell = (rowIdx, key, value) => {
        if (lockedKeys.has(key)) return;
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

    return {
        formData, setFormData,
        rows, setRows,
        generateLoading,
        downloadLoading,
        columns,
        lockedKeys,
        columnsLoading,
        handleGenerate,
        handleDownload,
        handleChangeCell
    };
};

export default use1601c;