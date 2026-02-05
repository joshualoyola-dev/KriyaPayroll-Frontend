import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import NoAccess from "../../../components/NoAccess";
import env from "../../../configs/env.config";
import { userHasFeatureAccess } from "../../../utility/access-controll.utility";
import { getFormTypeById, getHistoryPath } from "../../../configs/data-export.config";
import DataExportGenerateForm from "./DataExportGenerateForm";
import { useYtdContext } from "../../../contexts/YtdProvider";
import use1601c from "../../../hooks/use1601c";
import { useCompanyContext } from "../../../contexts/CompanyProvider";
import { useToastContext } from "../../../contexts/ToastProvider";
import { convertToISO8601 } from "../../../utility/datetime.utility";
import { fetch2316Data } from "../../../services/data-export.service";

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
    // 2316 local state (no dedicated hook)
    const [formData2316, setFormData2316] = useState({ ...defaultFormData });
    const [loading2316, setLoading2316] = useState(false);

    useEffect(() => {
        if (!formTypeConfig) {
            navigate(getHistoryPath("ytd"), { replace: true });
        }
    }, [formTypeConfig, navigate]);

    const handleSuccess = () => {
        navigate(getHistoryPath(formTypeFromPath), { replace: true });
    };

    const handleSubmitYtd = async () => {
        await ytdContext.handleGenerateYTD();
        handleSuccess();
    };

    const handleSubmit1601c = async () => {
        await hook1601c.handleGenerate();
        handleSuccess();
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
            await fetch2316Data(
                company.company_id,
                date_start,
                date_end,
                activeEmployeesBool,
                formData2316.payrun_payment_or_period,
                formData2316.payrun_status,
                formData2316.employee_ids,
            );
            addToast("2316 data generated.", "success");
            handleSuccess();
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

    return (
        <>
            <div className="w-full max-w-full">
                <h1 className="text-xl font-bold text-gray-900 mb-4">
                    Add New — {formTypeConfig.historyTitle.replace(" History", "")}
                </h1>
                <DataExportGenerateForm {...formProps} />
                <div className="mt-8">
                    <StartIllustration
                        title="Generate"
                        label="Select data to generate from the selection."
                    />
                </div>
            </div>
            {(formProps.loading) && <LoadingBackground />}
        </>
    );
};

export default DataExportAddNewPage;
