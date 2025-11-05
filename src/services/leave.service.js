import payroll_api from "../configs/payroll_api.config";

export const fetchLeaves = async (company_id, employee_id = null, from = null, to = null, limit) => {
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

    return await payroll_api.get(`/api/v1/daily-records/companies/${company_id}/leaves?${query}&page=${1}&limit=${Number(limit)}`);
};

export const addOneLeave = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/daily-records/companies/${company_id}/leaves`, formData);
}

export const updateOneLeave = async (company_id, employee_leave_id, formData) => {
    return await payroll_api.patch(`/api/v1/daily-records/companies/${company_id}/leaves/${employee_leave_id}`, formData);
}

export const deleteOneLeave = async (company_id, employee_leave_id) => {
    return await payroll_api.delete(`/api/v1/daily-records/companies/${company_id}/leaves/${employee_leave_id}`);
}