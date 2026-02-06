import payroll_api from "../configs/payroll_api.config";

/**
 * Sample history entries so the History page shows the full feature (DRAFT/SAVED/REJECTED cards).
 * Remove or set to [] when backend history API is wired.
 */
const getSampleHistoryEntries = (formTypeLabel) => [
    {
        id: "sample-1",
        payrollPeriodStart: "2025-01-01",
        payrollPeriodEnd: "2025-01-15",
        formType: formTypeLabel,
        status: "DRAFT",
        actionBy: "John Wick",
        actionAt: "2025-01-24",
        actionType: "DRAFTED",
    },
    {
        id: "sample-2",
        payrollPeriodStart: "2025-01-01",
        payrollPeriodEnd: "2025-01-15",
        formType: formTypeLabel,
        status: "REJECTED",
        actionBy: "John Wick",
        actionAt: "2025-01-24",
        actionType: "DELETED",
    },
    {
        id: "sample-3",
        payrollPeriodStart: "2025-01-01",
        payrollPeriodEnd: "2025-01-15",
        formType: formTypeLabel,
        status: "SAVED",
        actionBy: "John Wick",
        actionAt: "2025-01-24",
        actionType: "SAVED",
    },
    {
        id: "sample-4",
        payrollPeriodStart: "2025-01-01",
        payrollPeriodEnd: "2025-01-15",
        formType: formTypeLabel,
        status: "DRAFT",
        actionBy: "John Wick",
        actionAt: "2025-01-24",
        actionType: "DRAFTED",
    },
    {
        id: "sample-5",
        payrollPeriodStart: "2025-01-01",
        payrollPeriodEnd: "2025-01-15",
        formType: formTypeLabel,
        status: "SAVED",
        actionBy: "John Wick",
        actionAt: "2025-01-24",
        actionType: "SAVED",
    },
    {
        id: "sample-6",
        payrollPeriodStart: "2025-01-01",
        payrollPeriodEnd: "2025-01-15",
        formType: formTypeLabel,
        status: "REJECTED",
        actionBy: "John Wick",
        actionAt: "2025-01-24",
        actionType: "DELETED",
    },
];

/**
 * Fetch data export history entries by form type. Wire to real API when available.
 * When no API is wired, returns sample entries so the History UI matches the design.
 */
export const fetchDataExportHistory = async (formTypeId, params = {}) => {
    const { dateFrom, dateTo, status } = params;
    // TODO: replace with real endpoint when backend supports history list
    // const companyId = company?.company_id; from context when wired
    // const res = await payroll_api.get(`/api/v1/data-exports/company/${companyId}/${formTypeId}/history`, { params: { date_from: dateFrom, date_to: dateTo, status } });
    // return res?.data ?? { data: [] };
    const companyId = null;
    const formTypeLabel = formTypeId === "1601c" ? "1601C" : formTypeId === "2316" ? "2316" : "YTD";
    if (!companyId) {
        let sample = getSampleHistoryEntries(formTypeLabel);
        if (status && String(status).trim()) {
            sample = sample.filter((e) => e.status === status);
        }
        return { data: sample };
    }
    return { data: [] };
};

export const fetch1601cColumns = async () => {
    return await payroll_api.get("/api/v1/data-exports/1601c/columns");
};

export const fetch1601cData = async (company_id, date_start, date_end, active_employees) => {
    return await payroll_api.get(
        `/api/v1/data-exports/company/${company_id}/1601c?date_start=${date_start}&date_end=${date_end}&active_employees=${active_employees}`,
    );
};

export const fetch1601cDataAdvanced = async (
    company_id,
    date_start,
    date_end,
    active_employees,
    payrun_payment_or_period,
    payrun_status,
    employee_ids,
) => {
    const payrunStatusQuery = (payrun_status ?? []).join("&payrun_status=");
    const employeeIdsQuery = (employee_ids ?? []).join("&employee_ids=");

    return await payroll_api.get(
        `/api/v1/data-exports/company/${company_id}/1601c?date_start=${date_start}&date_end=${date_end}&active_employees=${active_employees}&payrun_payment_or_period=${payrun_payment_or_period}&payrun_status=${payrunStatusQuery}&employee_ids=${employeeIdsQuery}`,
    );
};

export const fetch2316Data = async (
    company_id,
    date_start,
    date_end,
    active_employees,
    payrun_payment_or_period,
    payrun_status,
    employee_ids,
) => {
    const payrunStatusQuery = (payrun_status ?? []).join("&payrun_status=");
    const employeeIdsQuery = (employee_ids ?? []).join("&employee_ids=");

    return await payroll_api.get(
        `/api/v1/data-exports/company/${company_id}/2316?date_start=${date_start}&date_end=${date_end}&active_employees=${active_employees}&payrun_payment_or_period=${payrun_payment_or_period}&payrun_status=${payrunStatusQuery}&employee_ids=${employeeIdsQuery}`,
    );
};

export const fetchYearToDate = async (
    company_id,
    date_start,
    date_end,
    active_employees,
    payrun_payment_or_period,
    payrun_status,
    employee_ids,
) => {
    const payrunStatusQuery = payrun_status.join('&payrun_status=');
    const employeeIdsQuery = employee_ids.join('&employee_ids=');
    return await payroll_api.get(`/api/v1/data-exports/company/${company_id}/ytds?date_start=${date_start}&date_end=${date_end}&active_employees=${active_employees}&payrun_payment_or_period=${payrun_payment_or_period}&payrun_status=${payrunStatusQuery}&employee_ids=${employeeIdsQuery}`);

};