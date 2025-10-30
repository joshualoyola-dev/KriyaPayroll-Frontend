import payroll_api from "../configs/payroll_api.config";

export const fetchOvertimes = async (company_id, employee_id = null, from = null, to = null, limit) => {
    let query = '';
    if (employee_id) {
        query = `${query}&employee_id=${employee_id}`;
    }
    if (from) {
        query = `${query}&from=${from}`;
    }
    if (to) {
        query = `${query}&to=${to}`;
    }

    return await payroll_api.get(`/api/v1/daily-records/companies/${company_id}/overtimes?${query}page=${1}&limit=${Number(limit)}`);
};

export const addOneOvertime = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/daily-records/companies/${company_id}/overtimes`, formData);
}

export const updateOneOvertime = async (company_id, employee_overtime_id, formData) => {
    return await payroll_api.patch(`/api/v1/daily-records/companies/${company_id}/overtimes/${employee_overtime_id}`, formData);
}

export const deleteOneOvertime = async (company_id, employee_overtime_id) => {
    return await payroll_api.delete(`/api/v1/daily-records/companies/${company_id}/overtimes/${employee_overtime_id}`);
}