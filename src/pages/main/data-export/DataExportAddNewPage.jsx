import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import NoAccess from "../../../components/NoAccess";
import env from "../../../configs/env.config";
import { userHasFeatureAccess } from "../../../utility/access-controll.utility";
import { getFormTypeById, getHistoryPath } from "../../../configs/data-export.config";
import DataExportGenerateForm from "./DataExportGenerateForm";
import FixedHeaderTable from "./FixedHeaderTable";
import { useYtdContext } from "../../../contexts/YtdProvider";
import use1601c from "../../../hooks/use1601c";
import { useCompanyContext } from "../../../contexts/CompanyProvider";
import { useToastContext } from "../../../contexts/ToastProvider";
import { convertToISO8601 } from "../../../utility/datetime.utility";
import { downloadExcel1601c } from "../../../utility/excel.utility";
import { normalizeTemplateValues } from "../../../data/data-form.data";
import { fetchTemplate, fetch2316Data, createTaxExportHistory, getTaxExportDetail, updateTaxExportHistory } from "../../../services/data-export.service";
import { generate2316Pdf, generate1601cPdf } from "../../../api/export.api";

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

// Fields that are auto-calculated and must be skipped during validation
const COMPUTED_2316_FIELDS = new Set([
    "taxable_compensation",
    "gross_taxable_compensation",
    "total_tax_withheld",
    "total_tax_withheld_after_credit",
    "total_non_taxable_compensation",
    "total_taxable_compensation",
]);

// Merge backend field_code-keyed values into the template array
const mergeTemplate2316WithBackend = (template, backendRow) => {
    return normalizeTemplateValues(
        template.map((f) => ({
            ...f,
            value: backendRow[f.field_code] !== undefined ? backendRow[f.field_code] : (f.value ?? ""),
        }))
    );
};

// Convert template array → flat row object keyed by field_code
const templateToRow2316 = (template) => {
    return template.reduce((acc, f) => {
        acc[f.field_code] = f.value ?? "";
        return acc;
    }, {});
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
    const viewId = searchParams.get("view") || null; // New: view-only mode
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
    const [template2316, setTemplate2316] = useState([]);
    const [columns2316, setColumns2316] = useState([]);
    const [columnsLoading2316, setColumnsLoading2316] = useState(false);

    // Commit a fresh 2316 template into all derived state — mirrors applyTemplate in use1601c
    const applyTemplate2316 = (fetchedTemplate) => {
        setTemplate2316(fetchedTemplate);
        setColumns2316(fetchedTemplate.map((f) => ({ key: f.field_code, label: f.field_name })));
    };

    // Load 2316 template once on mount — mirrors use1601c's loadTemplate useEffect
    useEffect(() => {
        const loadTemplate = async () => {
            setColumnsLoading2316(true);
            try {
                const res = await fetchTemplate("2316");
                applyTemplate2316(res?.data?.template ?? []);
            } catch (err) {
                addToast(`Failed to load 2316 template: ${err?.message || err}`, "error");
            } finally {
                setColumnsLoading2316(false);
            }
        };
        loadTemplate();
    }, []); 
    useEffect(() => {
        if (!formTypeConfig) {
            navigate(getHistoryPath("ytd"), { replace: true });
        }
    }, [formTypeConfig, navigate]);

    // Load draft for edit/view when URL has ?edit=<id> or ?view=<id> (1601c)
    useEffect(() => {
        const id = editId || viewId;
        if (formTypeFromPath !== "1601c" || !id) return;
        if (!hook1601c || hook1601c.columnsLoading || !hook1601c.columns?.length) return;
        let cancelled = false;
        const load = async () => {
            try {
                const detail = await getTaxExportDetail(id);
                if (cancelled || !detail) return;
                const raw = detail.form_data_snapshot;
                const snapshot =
                    typeof raw === "string"
                        ? (() => {
                              try {
                                  return JSON.parse(raw);
                              } catch {
                                  return {};
                              }
                          })()
                        : raw ?? {};
                const rowData =
                    snapshot && typeof snapshot === "object" && !Array.isArray(snapshot)
                        ? snapshot.template ?? snapshot
                        : {};
                hook1601c.loadDraftForEdit(detail.period_from, detail.period_to, rowData);
            } catch {
                if (!cancelled) addToast("Failed to load draft for editing", "error");
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [formTypeFromPath, editId, viewId, hook1601c?.columnsLoading, hook1601c?.columns?.length]);

    // Load draft for edit/view when URL has ?edit=<id> or ?view=<id> (2316)
    // Now guards on template loaded, mirrors 1601c draft load pattern
    useEffect(() => {
        const id = editId || viewId;
        if (formTypeFromPath !== "2316" || !id) return;
        if (columnsLoading2316 || !columns2316?.length) return;
        let cancelled = false;
        const load = async () => {
            try {
                const detail = await getTaxExportDetail(id);
                if (cancelled || !detail) return;
                const raw = detail.form_data_snapshot ?? {};
                const snapshot =
                    typeof raw === "string"
                        ? (() => { try { return JSON.parse(raw); } catch { return {}; } })()
                        : raw ?? {};
                const fromDate = detail.period_from ? new Date(detail.period_from).toISOString().slice(0, 10) : "";
                const toDate = detail.period_to ? new Date(detail.period_to).toISOString().slice(0, 10) : "";
                setFormData2316((prev) => ({ ...prev, date_start: fromDate, date_end: toDate }));

                // Support both multi-row (snapshot.rows) and single-row (snapshot.template / snapshot)
                let rowsToLoad = [];
                if (Array.isArray(snapshot.rows) && snapshot.rows.length > 0) {
                    rowsToLoad = snapshot.rows;
                } else {
                    const rowData =
                        snapshot && typeof snapshot === "object" && !Array.isArray(snapshot)
                            ? (snapshot.template ?? snapshot)
                            : {};
                    if (Object.keys(rowData).length) rowsToLoad = [rowData];
                }

                // Merge each saved row against the template then recompute — mirrors loadDraftForEdit
                setRows2316(rowsToLoad.map((savedRow) => {
                    const filled = mergeTemplate2316WithBackend(template2316, savedRow);
                    return recompute2316Row(templateToRow2316(filled));
                }));
            } catch {
                if (!cancelled) addToast("Failed to load draft for editing", "error");
            }
        };
        load();
        return () => { cancelled = true; };
    }, [formTypeFromPath, editId, viewId, columnsLoading2316, columns2316?.length]);

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

            // Prefer fresh template from response, fall back to cached — mirrors handleGenerate in use1601c
            const activeTemplate = res?.data?.template?.length ? res.data.template : template2316;
            if (res?.data?.template?.length) applyTemplate2316(res.data.template);

            const rowList = Object.values(data2316).map((backendRow) => {
                const filled = mergeTemplate2316WithBackend(activeTemplate, backendRow);
                return recompute2316Row(templateToRow2316(filled));
            });
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
    const viewOnlyMode = !!viewId; // View-only mode when ?view= param is present
    const show1601cTable = is1601c && (hook1601c.columns?.length ?? 0) > 0 && (hook1601c.rows?.length ?? 0) > 0;
    // Also requires columns2316 to be loaded — mirrors show1601cTable guard
    const show2316Table = is2316 && columns2316.length > 0 && rows2316.length > 0;

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
        
        // Extract year from period_to for PDF generation
        const year = period_to ? new Date(period_to).getFullYear() : null;
        if (!year) {
            addToast("Could not determine year from date range", "error");
            return;
        }
        
        // Check if rows exist
        if (!rows2316 || rows2316.length === 0) {
            addToast("Please generate data first before creating a PDF", "error");
            return;
        }

        // Validate using columns2316 from template, skip computed and locked fields
        const emptyColumns = [];
        
        // Check all rows for empty columns
        for (const row of rows2316) {
            for (const column of columns2316) {
                const key = column.key;
                if (COMPUTED_2316_FIELDS.has(key)) continue;
                const value = row[key];
                if (
                    (value === null || value === undefined || value === "" || (typeof value === "string" && value.trim() === "")) &&
                    !emptyColumns.includes(column.label || key)
                ) {
                    emptyColumns.push(column.label || key);
                }
            }
        }
        if (emptyColumns.length > 0) {
            addToast(`Please fill up all columns. You cannot generate a PDF if not filling all columns. Missing: ${emptyColumns.slice(0, 3).join(", ")}${emptyColumns.length > 3 ? ` and ${emptyColumns.length - 3} more` : ""}`, "error");
            return;
        }
        try {
            if (editId) {
                await updateTaxExportHistory(editId, {
                    status: "PDF",
                    contents: { rows: rows2316 },
                });
            } else {
                await createTaxExportHistory(company.company_id, {
                    form_type: "2316",
                    period_from,
                    period_to,
                    contents: { rows: rows2316 },
                    status: "PDF",
                });
            }
            addToast(`Generating PDF for year ${year}...`, "info");
            const success = await generate2316Pdf(company.company_id, year);
            if (success) {
                addToast("PDF generated successfully and saved to Google Drive!", "success");
            } else {
                addToast("PDF generation failed", "error");
            }
            navigate(getHistoryPath("2316"), { replace: true });
        } catch (err) {
            console.error("Save or PDF Error:", err);
            addToast(err?.response?.data?.error || err?.message || "Failed to save or generate PDF", "error");
            navigate(getHistoryPath("2316"), { replace: true });
        }
    };

    const handle2316Download = () => {
        if (rows2316.length === 0) return;
        const filename = `2316-export-${formData2316.date_start || "date"}-${formData2316.date_end || "date"}`.replace(/\//g, "-");
        downloadExcel1601c(columns2316, rows2316, filename, "2316");
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

    /** Generate PDF and save to DB when user clicks Generate a PDF */
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
        const dateObj = period_to ? new Date(period_to) : null;
        const year = dateObj ? dateObj.getFullYear() : null;
        const month = dateObj ? dateObj.getMonth() + 1 : null;
        if (!year || !month) {
            addToast("Could not determine year/month from date range", "error");
            return;
        }
        const row = hook1601c.rows?.[0];
        if (!row) {
            addToast("Please generate data first before creating a PDF", "error");
            return;
        }
        const columns = hook1601c.columns || [];
        const emptyColumns = [];
        for (const column of columns) {
            const key = column.key;
            const value = row[key];
            if (value === null || value === undefined || value === "" || (typeof value === "string" && value.trim() === "")) {
                emptyColumns.push(column.label || key);
            }
        }
        if (emptyColumns.length > 0) {
            addToast(`Please fill up all columns. You cannot generate a PDF if not filling all columns. Missing: ${emptyColumns.slice(0, 3).join(", ")}${emptyColumns.length > 3 ? ` and ${emptyColumns.length - 3} more` : ""}`, "error");
            return;
        }
        try {
            if (editId) {
                await updateTaxExportHistory(editId, {
                    status: "PDF",
                    contents: row ? { template: row } : {},
                });
            } else {
                await createTaxExportHistory(company.company_id, {
                    form_type: "1601C",
                    period_from,
                    period_to,
                    contents: row ? { template: row } : {},
                    status: "PDF",
                });
            }
            addToast(`Generating PDF for ${month}/${year}...`, "info");
            const success = await generate1601cPdf(company.company_id, year, month);
            if (success) {
                addToast("PDF generated successfully and saved to Google Drive!", "success");
            } else {
                addToast("PDF generation failed", "error");
            }
            navigate(getHistoryPath("1601c"), { replace: true });
        } catch (err) {
            console.error("Save or PDF Error:", err);
            const msg = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data?.error || err?.message || "Failed to save or generate PDF";
            addToast(msg, "error");
            navigate(getHistoryPath("1601c"), { replace: true });
        }
    };

    return (
        <>
            <div className="w-full max-w-full">
                {/* Back button at top in view mode */}
                {viewOnlyMode && (is1601c || is2316) && (
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => navigate(getHistoryPath(formTypeFromPath), { replace: true })}
                            className="px-4 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-xl font-medium transition-colors"
                        >
                            ← Back to {formTypeConfig.label}
                        </button>
                    </div>
                )}
                <h1 className="text-xl font-bold text-gray-900 mb-4">
                    {viewOnlyMode ? "View" : "Add New"} — {formTypeConfig.historyTitle.replace(" History", "")}
                </h1>
                {/* Show form and action buttons only if NOT in view-only mode */}
                {!viewOnlyMode && (
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
                )}
                {/* Back button at bottom - only show if NOT in view mode (view mode has it at top) */}
                {!viewOnlyMode && (is1601c || is2316) && (
                    <div className="mt-4 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(getHistoryPath(formTypeFromPath), { replace: true })}
                            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                        >
                            ← Back to {formTypeConfig.label}
                        </button>
                    </div>
                )}
                {!show1601cTable && !show2316Table && (
                    <div className="mt-8">
                        {is1601c && (editId || viewId) && hook1601c.columnsLoading ? (
                            <p className="text-center text-gray-500">Loading {viewOnlyMode ? 'data' : 'draft'}…</p>
                        ) : is2316 && (editId || viewId) && columnsLoading2316 ? (
                            <p className="text-center text-gray-500">Loading {viewOnlyMode ? 'data' : 'draft'}…</p>
                        ) : (
                            !viewOnlyMode && (
                                <StartIllustration
                                    title="Generate"
                                    label="Select date range and click Generate to fetch data from the payrun."
                                />
                            )
                        )}
                    </div>
                )}
                {show1601cTable && (
                    <div className="mt-6">
                        <FixedHeaderTable
                            columns={hook1601c.columns}
                            rows={hook1601c.rows}
                            onChangeCell={viewOnlyMode ? undefined : hook1601c.handleChangeCell}
                              lockedKeys={viewOnlyMode ? new Set(hook1601c.columns.map(c => c.key)) : hook1601c.lockedKeys}
                        />
                    </div>
                )}
                {show2316Table && (
                    <div className="mt-6">
                        <FixedHeaderTable
                            columns={columns2316}
                            rows={rows2316}
                            onChangeCell={viewOnlyMode ? undefined : handle2316CellChange}
                            lockedKeys={viewOnlyMode ? new Set(columns2316.map(c => c.key)) : new Set()}                        />
                    </div>
                )}
            </div>
            {(formProps.loading || hook1601c.downloadLoading || loading2316) && <LoadingBackground />}
        </>
    );
};

export default DataExportAddNewPage;