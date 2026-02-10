import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import NoAccess from "../../../components/NoAccess";
import env from "../../../configs/env.config";
import { userHasFeatureAccess } from "../../../utility/access-controll.utility";
import { getFormTypeById, getHistoryPath, SECTION_2316_COLUMNS } from "../../../configs/data-export.config";
import DataExportGenerateForm from "./DataExportGenerateForm";
import FixedHeaderTable from "./FixedHeaderTable";
import { useYtdContext } from "../../../contexts/YtdProvider";
import use1601c from "../../../hooks/use1601c";
import { useCompanyContext } from "../../../contexts/CompanyProvider";
import { useToastContext } from "../../../contexts/ToastProvider";
import { convertToISO8601 } from "../../../utility/datetime.utility";
import { downloadExcel1601c } from "../../../utility/excel.utility";
import { fetch2316Data, createTaxExportHistory, getTaxExportDetail, updateTaxExportHistory } from "../../../services/data-export.service";

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

/** BIR 2316: recompute derived fields so formulas stay correct */
const recompute2316Row = (row) => {
    const r = { ...row };
    const g19 = toNum(r.gross_compensation);
    const nonTax20 = toNum(r.total_non_taxable);
    const prev22 = toNum(r.previous_taxable_compensation);
    const tax25A = toNum(r.tax_withheld_current_employer);
    const tax25B = toNum(r.tax_withheld_previous_employer);
    const credit27 = toNum(r.tax_credit);

    r.taxable_compensation = g19 - nonTax20;                                    // 21 = 19 - 20
    r.gross_taxable_compensation = (g19 - nonTax20) + prev22;                   // 23 = 21 + 22
    r.total_tax_withheld = tax25A + tax25B;                                    // 26 = 25A + 25B
    r.total_tax_withheld_after_credit = tax25A + tax25B - credit27;             // 28 = 26 - 27

    const n29 = toNum(r.non_taxable_basic_smw);
    const n30 = toNum(r.non_taxable_holiday_pay);
    const n31 = toNum(r.non_taxable_overtime_pay);
    const n32 = toNum(r.non_taxable_night_shift);
    const n33 = toNum(r.non_taxable_hazard_pay);
    const n34 = toNum(r.non_taxable_thirteenth_month);
    const n35 = toNum(r.non_taxable_de_minimis);
    const n36 = toNum(r.non_taxable_contributions);
    const n37 = toNum(r.non_taxable_other_compensation);
    r.total_non_taxable_compensation = n29 + n30 + n31 + n32 + n33 + n34 + n35 + n36 + n37; // 38

    r.total_taxable_compensation = toNum(r.taxable_compensation);               // 52 = 21
    return r;
};

const defaultFormData = {
    date_start: "",
    date_end: "",
    active_employees: true,
    payrun_payment_or_period: "PAYMENT",
    payrun_status: ["APPROVED"],
    employee_ids: [],
};

const DataExportAddNewPage = () => {
    const { formType: formTypeParam } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit") || null;
    const formTypeFromPath = formTypeParam || location.pathname.replace("/data-export/", "").split("/")[0] || "ytd";
    const formTypeConfig = getFormTypeById(formTypeFromPath);
    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    let hasAccess = false;
    try {
        hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_DATA_EXPORTS);
        if (!hasAccess) {
            const raw = localStorage.getItem("service_features_access");
            const list = JSON.parse(raw || "[]");
            if (!Array.isArray(list) || list.length === 0) hasAccess = true;
        }
    } catch {
        hasAccess = true;
    }

    // YTD
    const ytdContext = useYtdContext();
    // 1601c
    const hook1601c = use1601c();
    // 2316 local state (no dedicated hook) — same flow as 1601c: generate then show table
    const [formData2316, setFormData2316] = useState({ ...defaultFormData });
    const [loading2316, setLoading2316] = useState(false);
    const [rows2316, setRows2316] = useState([]);

    useEffect(() => {
        if (!formTypeConfig) {
            navigate(getHistoryPath("ytd"), { replace: true });
        }
    }, [formTypeConfig, navigate]);

    // Load draft for edit when URL has ?edit=<id> (1601c)
    useEffect(() => {
        if (formTypeFromPath !== "1601c" || !editId || !hook1601c.columns?.length) return;
        let cancelled = false;
        const load = async () => {
            try {
                const detail = await getTaxExportDetail(editId);
                if (cancelled || !detail) return;
                const snapshot = detail.form_data_snapshot ?? {};
                const rowData = snapshot.template ?? snapshot;
                hook1601c.loadDraftForEdit(detail.period_from, detail.period_to, rowData);
            } catch {
                if (!cancelled) addToast("Failed to load draft for editing", "error");
            }
        };
        load();
        return () => { cancelled = true; };
    }, [formTypeFromPath, editId, hook1601c.columns?.length]);

    // Load draft for edit when URL has ?edit=<id> (2316)
    useEffect(() => {
        if (formTypeFromPath !== "2316" || !editId) return;
        let cancelled = false;
        const load = async () => {
            try {
                const detail = await getTaxExportDetail(editId);
                if (cancelled || !detail) return;
                const snapshot = detail.form_data_snapshot ?? {};
                const fromDate = detail.period_from ? new Date(detail.period_from).toISOString().slice(0, 10) : "";
                const toDate = detail.period_to ? new Date(detail.period_to).toISOString().slice(0, 10) : "";
                setFormData2316((prev) => ({ ...prev, date_start: fromDate, date_end: toDate }));
                const rows = Array.isArray(snapshot.rows) && snapshot.rows.length > 0
                    ? snapshot.rows.map((r) => recompute2316Row(r))
                    : (snapshot && typeof snapshot === "object" && !snapshot.template
                        ? [recompute2316Row(snapshot)]
                        : []);
                setRows2316(rows);
            } catch {
                if (!cancelled) addToast("Failed to load draft for editing", "error");
            }
        };
        load();
        return () => { cancelled = true; };
    }, [formTypeFromPath, editId]);

    const handleSuccess = () => {
        navigate(getHistoryPath(formTypeFromPath), { replace: true });
    };

    const handleSubmitYtd = async () => {
        await ytdContext.handleGenerateYTD();
        handleSuccess();
    };

    const handleSubmit1601c = async () => {
        await hook1601c.handleGenerate();
        addToast("1601C data generated from payrun.", "success");
    };

    const handleSubmit2316 = async () => {
        setLoading2316(true);
        try {
            if (!company?.company_id) {
                addToast("No company selected", "error");
                return;
            }
            const date_start = convertToISO8601(formData2316.date_start);
            const date_end = convertToISO8601(formData2316.date_end);
            if (!date_start || !date_end) {
                addToast("Please select a valid date range", "warning");
                return;
            }
            const activeEmployeesBool = formData2316.active_employees ? "true" : "false";
            const res = await fetch2316Data(
                company.company_id,
                date_start,
                date_end,
                activeEmployeesBool,
                formData2316.payrun_payment_or_period,
                formData2316.payrun_status,
                formData2316.employee_ids,
            );
            const data2316 = res?.data?.data2316 ?? {};
            const rowList = Object.values(data2316).map(recompute2316Row);
            setRows2316(rowList);
            addToast("2316 data generated from payrun.", "success");
        } catch (err) {
            addToast(err?.message || "Failed to generate 2316 data", "error");
        } finally {
            setLoading2316(false);
        }
    };

    const getFormProps = () => {
        const common = {
            onPayrunStatusToggle: (status) => {
                const toggle = (prev) => ({
                    ...prev,
                    payrun_status: prev.payrun_status.includes(status)
                        ? prev.payrun_status.filter((s) => s !== status)
                        : [...prev.payrun_status, status],
                });
                if (formTypeFromPath === "ytd") {
                    ytdContext.setDateRangeFormData(toggle(ytdContext.dateRangeFormData));
                } else if (formTypeFromPath === "1601c") {
                    hook1601c.setFormData(toggle(hook1601c.formData));
                } else {
                    setFormData2316(toggle(formData2316));
                }
            },
            onEmployeeToggle: (employee_id) => {
                const toggle = (prev) => ({
                    ...prev,
                    employee_ids: prev.employee_ids.includes(employee_id)
                        ? prev.employee_ids.filter((e) => e !== employee_id)
                        : [...prev.employee_ids, employee_id],
                });
                if (formTypeFromPath === "ytd") {
                    ytdContext.setDateRangeFormData(toggle(ytdContext.dateRangeFormData));
                } else if (formTypeFromPath === "1601c") {
                    hook1601c.setFormData(toggle(hook1601c.formData));
                } else {
                    setFormData2316(toggle(formData2316));
                }
            },
        };

        if (formTypeFromPath === "ytd") {
            const d = ytdContext.dateRangeFormData;
            return {
                dateStart: d.date_start,
                dateEnd: d.date_end,
                onDateStartChange: (v) =>
                    ytdContext.setDateRangeFormData((p) => ({ ...p, date_start: v })),
                onDateEndChange: (v) =>
                    ytdContext.setDateRangeFormData((p) => ({ ...p, date_end: v })),
                activeEmployees: d.active_employees,
                onActiveEmployeesChange: (v) =>
                    ytdContext.setDateRangeFormData((p) => ({ ...p, active_employees: v })),
                payrunPaymentOrPeriod: d.payrun_payment_or_period,
                onPayrunPaymentOrPeriodChange: (v) =>
                    ytdContext.setDateRangeFormData((p) => ({ ...p, payrun_payment_or_period: v })),
                payrunStatus: d.payrun_status ?? [],
                employeeIds: d.employee_ids ?? [],
                onSubmit: handleSubmitYtd,
                loading: ytdContext.ytdsLoading,
                ...common,
            };
        }
        if (formTypeFromPath === "1601c") {
            const d = hook1601c.formData;
            return {
                dateStart: d.date_start,
                dateEnd: d.date_end,
                onDateStartChange: (v) =>
                    hook1601c.setFormData((p) => ({ ...p, date_start: v })),
                onDateEndChange: (v) =>
                    hook1601c.setFormData((p) => ({ ...p, date_end: v })),
                activeEmployees: d.active_employees,
                onActiveEmployeesChange: (v) =>
                    hook1601c.setFormData((p) => ({ ...p, active_employees: v })),
                payrunPaymentOrPeriod: d.payrun_payment_or_period,
                onPayrunPaymentOrPeriodChange: (v) =>
                    hook1601c.setFormData((p) => ({ ...p, payrun_payment_or_period: v })),
                payrunStatus: d.payrun_status ?? [],
                employeeIds: d.employee_ids ?? [],
                onSubmit: handleSubmit1601c,
                loading: hook1601c.generateLoading,
                ...common,
            };
        }
        if (formTypeFromPath === "2316") {
            return {
                dateStart: formData2316.date_start,
                dateEnd: formData2316.date_end,
                onDateStartChange: (v) =>
                    setFormData2316((p) => ({ ...p, date_start: v })),
                onDateEndChange: (v) =>
                    setFormData2316((p) => ({ ...p, date_end: v })),
                activeEmployees: formData2316.active_employees,
                onActiveEmployeesChange: (v) =>
                    setFormData2316((p) => ({ ...p, active_employees: v })),
                payrunPaymentOrPeriod: formData2316.payrun_payment_or_period,
                onPayrunPaymentOrPeriodChange: (v) =>
                    setFormData2316((p) => ({ ...p, payrun_payment_or_period: v })),
                payrunStatus: formData2316.payrun_status ?? [],
                employeeIds: formData2316.employee_ids ?? [],
                onSubmit: handleSubmit2316,
                loading: loading2316,
                ...common,
            };
        }
        return null;
    };

    if (!hasAccess) {
        return (
            <NoAccess
                title="Unauthorized"
                label="You are not allowed to access this resource"
            />
        );
    }

    if (!formTypeConfig) {
        return null;
    }

    const formProps = getFormProps();
    if (!formProps) return null;

    const is1601c = formTypeFromPath === "1601c";
    const is2316 = formTypeFromPath === "2316";
    const show1601cTable = is1601c && hook1601c.rows?.length > 0;
    const show2316Table = is2316 && rows2316.length > 0;

    const handle2316CellChange = (rowIdx, key, value) => {
        setRows2316((prev) => {
            const next = [...prev];
            next[rowIdx] = recompute2316Row({ ...next[rowIdx], [key]: value });
            return next;
        });
    };

    const handle2316SaveDraft = async () => {
        if (!company?.company_id && !editId) {
            addToast("No company selected", "error");
            return;
        }
        const period_from = convertToISO8601(formData2316.date_start);
        const period_to = convertToISO8601(formData2316.date_end);
        if (!period_from || !period_to) {
            addToast("Please select a valid date range (From and To)", "warning");
            return;
        }
        try {
            if (editId) {
                await updateTaxExportHistory(editId, {
                    contents: { rows: rows2316 },
                });
                addToast("Draft updated", "success");
            } else {
                await createTaxExportHistory(company.company_id, {
                    form_type: "2316",
                    period_from,
                    period_to,
                    contents: { rows: rows2316 },
                });
                addToast("Draft saved to history", "success");
            }
            navigate(getHistoryPath("2316"), { replace: true });
        } catch (err) {
            addToast(err?.response?.data?.error || err?.message || "Failed to save draft", "error");
        }
    };

    const handle2316GeneratePdf = async () => {
        if (!company?.company_id && !editId) {
            addToast("No company selected", "error");
            return;
        }
        const period_from = convertToISO8601(formData2316.date_start);
        const period_to = convertToISO8601(formData2316.date_end);
        if (!period_from || !period_to) {
            addToast("Please select a valid date range (From and To)", "warning");
            return;
        }
        try {
            if (editId) {
                await updateTaxExportHistory(editId, {
                    status: "PDF",
                    contents: { rows: rows2316 },
                });
                addToast("Saved with status PDF", "success");
            } else {
                await createTaxExportHistory(company.company_id, {
                    form_type: "2316",
                    period_from,
                    period_to,
                    contents: { rows: rows2316 },
                    status: "PDF",
                });
                addToast("Saved with status PDF", "success");
            }
            navigate(getHistoryPath("2316"), { replace: true });
        } catch (err) {
            addToast(err?.response?.data?.error || err?.message || "Failed to save as PDF", "error");
        }
    };

    const handle2316Download = () => {
        if (rows2316.length === 0) return;
        const filename = `2316-export-${formData2316.date_start || "date"}-${formData2316.date_end || "date"}`.replace(/\//g, "-");
        downloadExcel1601c(SECTION_2316_COLUMNS, rows2316, filename, "2316");
    };

    const handle1601cSaveDraft = async () => {
        if (!company?.company_id && !editId) {
            addToast("No company selected", "error");
            return;
        }
        const period_from = convertToISO8601(hook1601c.formData?.date_start);
        const period_to = convertToISO8601(hook1601c.formData?.date_end);
        if (!period_from || !period_to) {
            addToast("Please select a valid date range (From and To)", "warning");
            return;
        }
        const row = hook1601c.rows?.[0];
        try {
            if (editId) {
                await updateTaxExportHistory(editId, {
                    contents: row ? { template: row } : {},
                });
                addToast("Draft updated", "success");
            } else {
                await createTaxExportHistory(company.company_id, {
                    form_type: "1601C",
                    period_from,
                    period_to,
                    contents: row ? { template: row } : {},
                });
                addToast("Draft saved to history", "success");
            }
            navigate(getHistoryPath("1601c"), { replace: true });
        } catch (err) {
            addToast(err?.response?.data?.error || err?.message || "Failed to save draft", "error");
        }
    };

    /** Save to DB with status "PDF" (create or update) when user clicks Generate a PDF */
    const handle1601cGeneratePdf = async () => {
        if (!company?.company_id && !editId) {
            addToast("No company selected", "error");
            return;
        }
        const period_from = convertToISO8601(hook1601c.formData?.date_start);
        const period_to = convertToISO8601(hook1601c.formData?.date_end);
        if (!period_from || !period_to) {
            addToast("Please select a valid date range (From and To)", "warning");
            return;
        }
        const row = hook1601c.rows?.[0];
        try {
            if (editId) {
                await updateTaxExportHistory(editId, {
                    status: "PDF",
                    contents: row ? { template: row } : {},
                });
                addToast("Saved with status PDF", "success");
            } else {
                await createTaxExportHistory(company.company_id, {
                    form_type: "1601C",
                    period_from,
                    period_to,
                    contents: row ? { template: row } : {},
                    status: "PDF",
                });
                addToast("Saved with status PDF", "success");
            }
            navigate(getHistoryPath("1601c"), { replace: true });
        } catch (err) {
            addToast(err?.response?.data?.error || err?.message || "Failed to save as PDF", "error");
        }
    };

    return (
        <>
            <div className="w-full max-w-full">
                <h1 className="text-xl font-bold text-gray-900 mb-4">
                    Add New — {formTypeConfig.historyTitle.replace(" History", "")}
                </h1>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <DataExportGenerateForm {...formProps} />
                    {show2316Table && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-gray-700">Download 2316</label>
                            <button
                                type="button"
                                onClick={handle2316Download}
                                className="rounded-xl bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800"
                            >
                                Download
                            </button>
                            <div className="flex flex-col gap-1.5 mt-1">
                                <button
                                    type="button"
                                    onClick={handle2316GeneratePdf}
                                    className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                >
                                    Generate a PDF
                                </button>
                                <button
                                    type="button"
                                    onClick={handle2316SaveDraft}
                                    className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                                >
                                    Save as Draft
                                </button>
                            </div>
                        </div>
                    )}
                    {show1601cTable && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-gray-700">Download 1601c</label>
                            <button
                                type="button"
                                onClick={hook1601c.handleDownload}
                                disabled={hook1601c.downloadLoading}
                                className="rounded-xl bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {hook1601c.downloadLoading ? "Downloading..." : "Download"}
                            </button>
                            <div className="flex flex-col gap-1.5 mt-1">
                                <button
                                    type="button"
                                    onClick={handle1601cGeneratePdf}
                                    disabled={Boolean(editId && viewOnlyMode)}
                                    className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Generate a PDF
                                </button>
                                <button
                                    type="button"
                                    onClick={handle1601cSaveDraft}
                                    disabled={Boolean(editId && viewOnlyMode)}
                                    className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save as Draft
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {is1601c && (
                    <div className="mt-4 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(getHistoryPath("1601c"), { replace: true })}
                            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                        >
                            ← Back to 1601C
                        </button>
                    </div>
                )}
                {is2316 && (
                    <div className="mt-4 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(getHistoryPath("2316"), { replace: true })}
                            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                        >
                            ← Back to 2316
                        </button>
                    </div>
                )}
                {!show1601cTable && !show2316Table && (
                    <div className="mt-8">
                        <StartIllustration
                            title="Generate"
                            label="Select date range and click Generate to fetch data from the payrun."
                        />
                    </div>
                )}
                {show1601cTable && (
                    <div className="mt-6">
                        <FixedHeaderTable
                            columns={hook1601c.columns}
                            rows={hook1601c.rows}
                            onChangeCell={hook1601c.handleChangeCell}
                            lockedKeys={hook1601c.lockedKeys}
                        />
                    </div>
                )}
                {show2316Table && (
                    <div className="mt-6">
                        <FixedHeaderTable
                            columns={SECTION_2316_COLUMNS}
                            rows={rows2316}
                            onChangeCell={handle2316CellChange}
                            lockedKeys={new Set()}
                        />
                    </div>
                )}
            </div>
            {(formProps.loading || hook1601c.downloadLoading || loading2316) && <LoadingBackground />}
        </>
    );
};

export default DataExportAddNewPage;