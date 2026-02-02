import { useState, useEffect, useMemo } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { getCompanyPayruns, getPayslipsTotals } from "../services/payrun.service";
import { convertToISO8601 } from "../utility/datetime.utility";
import { fetch1601cColumns } from "../services/data-export.service";

const defaultFormData = {
    date_start: "",
    date_end: "",
    active_employees: 0,
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
    const [columnsLoading, setColumnsLoading] = useState(false);

    const { company } = useCompanyContext();
    const { activeEmployees, employees } = useEmployeeContext();
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
            } catch (error) {
                addToast("Failed to load 1601C columns", "error");
            } finally {
                setColumnsLoading(false);
            }
        };
        loadColumns();
    }, [addToast]);

    const activeEmployeeIdSet = useMemo(() => new Set((activeEmployees ?? []).map(e => e.employee_id)), [activeEmployees]);
    const employeeIdSet = useMemo(() => new Set((employees ?? []).map(e => e.employee_id)), [employees]);

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

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        setGenerateLoading(true);
        try {
            if (columns.length === 0) {
                addToast("Columns are not loaded yet.", "warning");
                return;
            }
            const date_start = convertToISO8601(formData.date_start);
            const date_end = convertToISO8601(formData.date_end);

            const payrunsRes = await getCompanyPayruns(company.company_id);
            const payruns = payrunsRes?.data?.payruns ?? [];

            const start = new Date(date_start);
            const end = new Date(date_end);
            const payrunsInRange = payruns.filter((p) => {
                const d = new Date(p?.payment_date ?? p?.payrun_end_date);
                return d >= start && d <= end;
            });

            let summedTotalComp = 0;
            let summedTaxesWithheld = 0;

            for (const payrun of payrunsInRange) {
                const totalsRes = await getPayslipsTotals(company.company_id, payrun.payrun_id, payrun.status || "APPROVED");
                const totalsTable = totalsRes?.data?.totals ?? {};

                for (const [employee_id, totals] of Object.entries(totalsTable)) {
                    if (Number(formData.active_employees) === 1 && !activeEmployeeIdSet.has(employee_id)) continue;
                    if (employeeIdSet.size > 0 && !employeeIdSet.has(employee_id)) continue;

                    summedTotalComp += toNumber(totals?.["total_earnings"]);
                    summedTaxesWithheld += toNumber(totals?.["total_taxes"]);
                }
            }

            const baseRow = ensureRowShape({
                "Total Comp (14)": formatMoney(summedTotalComp),
                "Tax Withheld (25)": formatMoney(summedTaxesWithheld),
            }, columns);

            for (const key of zeroDefaultKeys) {
                if (!baseRow[key]) baseRow[key] = "0";
            }

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

    const handleDownload = async () => {
        setDownloadLoading(true);
        try {
            // Logic for download goes here
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