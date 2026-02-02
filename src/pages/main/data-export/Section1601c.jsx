import { useEffect, useMemo, useState } from "react";
import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import FixedHeaderTable from "./FixedHeaderTable";
import { useCompanyContext } from "../../../contexts/CompanyProvider";
import { useEmployeeContext } from "../../../contexts/EmployeeProvider";
import { useToastContext } from "../../../contexts/ToastProvider";
import { getCompanyPayruns, getPayslipsTotals } from "../../../services/payrun.service";
import { convertToISO8601 } from "../../../utility/datetime.utility";
import { fetch1601cColumns } from "../../../services/data-export.service";

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

const getMonthAndYear = (dateString) => {
    if (!dateString) return { month: "", year: "" };
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { month: "", year: "" };
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = String(d.getUTCFullYear());
    return { month, year };
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

const recompute1601cRow = (row, columns) => {
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

    const totalAdjSch =
        toNumber(row["Adjustment 1"]) +
        toNumber(row["Adjustment 2"]) +
        toNumber(row["Adjustment 3"]);

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
    }, columns);
};

const Section1601c = () => {
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

    useEffect(() => {
        const loadColumns = async () => {
            setColumnsLoading(true);
            try {
                const res = await fetch1601cColumns();
                const data = res?.data ?? {};
                const cols = data.columns ?? [];
                const locked = data.lockedKeys ?? [];
                const zeroDefaults = data.zeroDefaultKeys ?? [];

                setColumns(cols);
                setLockedKeys(new Set(locked));
                setZeroDefaultKeys(zeroDefaults);
            } catch (error) {
                addToast("Failed to load 1601C columns", "error");
            } finally {
                setColumnsLoading(false);
            }
        };

        loadColumns();
    }, [addToast]);

    const activeEmployeeIdSet = useMemo(() => {
        return new Set((activeEmployees ?? []).map((e) => e.employee_id));
    }, [activeEmployees]);

    const employeeIdSet = useMemo(() => {
        return new Set((employees ?? []).map((e) => e.employee_id));
    }, [employees]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGenerateLoading(true);
        try {
            if (columns.length === 0) {
                addToast("Columns are not loaded yet. Please try again shortly.", "warning");
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

            // 1) Fetch payruns, filter by payment date within range
            const payrunsRes = await getCompanyPayruns(company.company_id);
            const payruns = payrunsRes?.data?.payruns ?? [];

            const start = new Date(date_start);
            const end = new Date(date_end);
            const payrunsInRange = payruns.filter((p) => {
                const payment = p?.payment_date ?? p?.payrun_end_date ?? p?.payrun_start_date;
                const d = new Date(payment);
                if (isNaN(d.getTime())) return false;
                return d >= start && d <= end;
            });

            // 2) Sum totals from payslips (per payrun -> per employee totals)
            let summedTotalComp = 0;
            let summedTaxesWithheld = 0;

            for (const payrun of payrunsInRange) {
                const payrun_id = payrun?.payrun_id;
                const status = payrun?.status ?? "APPROVED";
                if (!payrun_id) continue;

                const totalsRes = await getPayslipsTotals(company.company_id, payrun_id, status);
                const totalsTable = totalsRes?.data?.totals ?? {};

                for (const [employee_id, totals] of Object.entries(totalsTable)) {
                    // If user selected Active only, filter employees here
                    if (Number(formData.active_employees) === 1 && !activeEmployeeIdSet.has(employee_id)) {
                        continue;
                    }
                    // If employee list is available, ignore unknown ids
                    if (employeeIdSet.size > 0 && !employeeIdSet.has(employee_id)) {
                        continue;
                    }

                    summedTotalComp += toNumber(totals?.["total_earnings"]);
                    summedTaxesWithheld += toNumber(totals?.["total_taxes"]);
                }
            }

            // 3) Build one row aligned with your required header
            const baseRow = ensureRowShape(
                {
                    // Pull from payrun totals
                    "Total Comp (14)": formatMoney(summedTotalComp),
                    "Tax Withheld (25)": formatMoney(summedTaxesWithheld),
                },
                columns,
            );

            // Apply zero defaults from backend config
            for (const key of zeroDefaultKeys) {
                if (!(key in baseRow) || baseRow[key] === "" || baseRow[key] == null) {
                    baseRow[key] = "0";
                }
            }

            const computedRow = recompute1601cRow(baseRow, columns);
            setRows([computedRow]);
        } finally {
            setGenerateLoading(false);
        }
    };

    const handleDownload = async () => {
        setDownloadLoading(true);
        try {
            // Placeholder: wire download logic when backend/export format is ready.
            return;
        } finally {
            setDownloadLoading(false);
        }
    };

    const handleChangeCell = (rowIdx, key, value) => {
        setRows((prev) => {
            const next = [...prev];
            const current = next[rowIdx] ?? {};

            if (lockedKeys.has(key)) {
                return prev;
            }

            const updated = {
                ...current,
                [key]: value,
            };

            next[rowIdx] = recompute1601cRow(updated, columns);
            return next;
        });
    };

    return (
        <div className="flex flex-col">
            {/* Top controls row (same layout as YTD) */}
            <div className="flex items-end justify-between gap-4 p-3">
                <form onSubmit={handleSubmit} className="flex items-end gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">From</label>
                        <input
                            value={formData.date_start}
                            onChange={(e) => setFormData((prev) => ({ ...prev, date_start: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">To</label>
                        <input
                            value={formData.date_end}
                            onChange={(e) => setFormData((prev) => ({ ...prev, date_end: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Employees</label>
                        <select
                            value={formData.active_employees}
                            onChange={(e) => setFormData((prev) => ({ ...prev, active_employees: e.target.value }))}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        >
                            <option value={0}>All employees (active & inactive)</option>
                            <option value={1}>Active employees only</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="self-end rounded-xl bg-teal-600 px-3 py-1 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        Generate
                    </button>
                </form>

                {/* Actions (same positioning as YTD) */}
                {rows.length === 0 ? (
                    <></>
                ) : (
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Download 1601c</label>
                        <button
                            onClick={handleDownload}
                            className="rounded-xl bg-orange-700 px-3 py-1 text-sm font-medium text-white hover:bg-orange-700"
                        >
                            Download
                        </button>

                        <div className="mt-2 flex gap-2">
                            <button
                                type="button"
                                className="rounded-xl bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                                Generate a PDF
                            </button>
                            <button
                                type="button"
                                className="rounded-xl bg-orange-500 px-3 py-1 text-xs font-medium text-white hover:bg-orange-600"
                            >
                                Save as Draft
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Data table */}
            <div>
                {rows.length === 0 ? (
                    <StartIllustration title="Generate" label="Select data to generate from the selection." />
                ) : (
                    <FixedHeaderTable
                        columns={columns}
                        rows={rows}
                        onChangeCell={handleChangeCell}
                        lockedKeys={lockedKeys}
                    />
                )}
            </div>

            {(generateLoading || downloadLoading) && <LoadingBackground />}
        </div>
    );
};

export default Section1601c;

