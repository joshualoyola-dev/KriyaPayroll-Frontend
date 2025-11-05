import payroll_api from "../configs/payroll_api.config";

export const fetchRestdays = async (company_id, employee_id = null, from = null, to = null, limit) => {
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

    return await payroll_api.get(`/api/v1/daily-records/companies/${company_id}/restdays?${query}&page=${1}&limit=${Number(limit)}`);
};

export const addOneRestday = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/daily-records/companies/${company_id}/restdays`, formData);
}

export const updateOneRestday = async (company_id, employee_restday_id, formData) => {
    return await payroll_api.patch(`/api/v1/daily-records/companies/${company_id}/restdays/${employee_restday_id}`, formData);
}

export const deleteOneRestday = async (company_id, employee_restday_id) => {
    return await payroll_api.delete(`/api/v1/daily-records/companies/${company_id}/restdays/${employee_restday_id}`);
}