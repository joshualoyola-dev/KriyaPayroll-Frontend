import payroll_api from "../configs/payroll_api.config";

export const fetchYearToDate = async (
    company_id,
    date_start,
    date_end,
    active_employees,
    payrun_payment_or_period,
    payrun_status,
) => {
    const payrunStatusQuery = payrun_status.join('&payrun_status=');
    return await payroll_api.get(`/api/v1/data-exports/company/${company_id}/ytds?date_start=${date_start}&date_end=${date_end}&active_employees=${active_employees}&payrun_payment_or_period=${payrun_payment_or_period}&payrun_status=${payrunStatusQuery}`);
};