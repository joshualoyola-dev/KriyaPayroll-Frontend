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

const formTypeToApi = (formTypeId) =>
    formTypeId === "1601c" ? "1601C" : formTypeId === "2316" ? "2316" : formTypeId;

/** Map backend tax export history record to the shape expected by DataExportHistoryPage */
const mapHistoryEntry = (h) => {
    const actionType =
        h.status === "DRAFT" ? "DRAFTED"
            : h.status === "SAVED" ? "SAVED"
                : h.status === "PDF" ? "PDF"
                    : h.status === "REJECTED" || h.status === "DELETED" ? "DELETED"
                        : h.status;
    const dFrom = h.period_from ? new Date(h.period_from) : null;
    const dTo = h.period_to ? new Date(h.period_to) : null;
    return {
        id: String(h.id),
        payrollPeriodStart: dFrom ? dFrom.toISOString().slice(0, 10) : "",
        payrollPeriodEnd: dTo ? dTo.toISOString().slice(0, 10) : "",
        formType: h.form_type || "",
        status: h.status || "",
        actionBy: h.created_by_user_name != null ? `${h.created_by_user_name}` : "",
        actionAt: h.created_at ? new Date(h.created_at).toISOString().slice(0, 10) : "",
        actionType,
    };
};

/**
 * Fetch data export history. When companyId is provided, calls GET /company/:id/tax-history.
 */
export const fetchDataExportHistory = async (formTypeId, params = {}, companyId = null) => {
    const { dateFrom, dateTo, status } = params;
    const formTypeLabel = formTypeId === "1601c" ? "1601C" : formTypeId === "2316" ? "2316" : "YTD";

    if (companyId) {
        try {
            const form_type = formTypeToApi(formTypeId);
            const query = new URLSearchParams({ form_type });

            if (status && String(status).trim().toUpperCase() !== "ALL") {
                query.set("status", status.trim().toUpperCase());
            }

            const url = `/api/v1/data-exports/company/${companyId}/tax-history?${query.toString()}`;
            console.log(`[fetchDataExportHistory] Calling API: ${url}`);
            
            const res = await payroll_api.get(url);
            console.log(`[fetchDataExportHistory] API response:`, res?.data);
            
            const list = res?.data?.histories ?? [];
            console.log(`[fetchDataExportHistory] Found ${list.length} histories, mapping...`);
            
            return { data: list.map(mapHistoryEntry) };
        } catch (error) {
            console.error('[fetchDataExportHistory] API error:', error);
            console.error('[fetchDataExportHistory] Error details:', error?.response?.data || error?.message);
            console.error('[fetchDataExportHistory] Status:', error?.response?.status);
            return { data: [] };
        }
    }

    let sample = getSampleHistoryEntries(formTypeLabel);
    if (status && String(status).trim()) {
        sample = sample.filter((e) => e.status === status);
    }
    return { data: sample };
};

/**
 * Create a tax export (draft, PDF, or saved) and store in DB (tax_export_history).
 * @param {string|number} companyId
 * @param {{ form_type: string, period_from: string, period_to: string, contents: object, status?: string }} payload
 */
export const createTaxExportHistory = async (companyId, payload) => {
    const { form_type, period_from, period_to, contents, status } = payload;
    const formTypeApi = form_type === "1601c" ? "1601C" : form_type || "";
    const res = await payroll_api.post(
        `/api/v1/data-exports/company/${companyId}/tax-history`,
        { form_type: formTypeApi, period_from, period_to, contents: contents || {}, ...(status && { status }) },
    );
    return res?.data;
};

/**
 * Delete a tax export history record by id (removes from DB).
 * @param {string|number} id - tax_export_history id (from API, usually string)
 */
export const deleteTaxExportHistory = async (id) => {
    await payroll_api.delete(`/api/v1/data-exports/tax-history/${id}`);
};

/**
 * Fetch a single tax export history record (for editing).
 * @param {string|number} id - tax_export_history id
 * @returns {Promise<{ id, form_type, status, period_from, period_to, form_data_snapshot, ... }>}
 */
export const getTaxExportDetail = async (id) => {
    const res = await payroll_api.get(`/api/v1/data-exports/tax-history/${id}`);
    return res?.data?.history ?? null;
};

/**
 * Update a tax export history record (e.g. after editing draft).
 * @param {string|number} id - tax_export_history id
 * @param {{ contents?: object, status?: string, rejection_reason?: string }} payload
 */
export const updateTaxExportHistory = async (id, payload) => {
    await payroll_api.post(`/api/v1/data-exports/tax-history/${id}`, payload);
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