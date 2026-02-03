import payroll_api from "../configs/payroll_api.config";

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