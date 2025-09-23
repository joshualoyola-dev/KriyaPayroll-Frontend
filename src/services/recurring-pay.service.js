import payroll_api from "../configs/payroll_api.config";

export const getRecurringPays = async (company_id, employee_id = null, from = null, to = null) => {
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

    return await payroll_api.get(`/api/v1/employees/companies/${company_id}/recurring-pays?${query}`)
};

export const addOneRecurringPay = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/employees/companies/${company_id}/recurring-pays`, formData);
};

export const updateOneRecurringPay = async (recurring_pay_id, formData) => {
    return await payroll_api.patch(`/api/v1/employees/recurring-pays/${recurring_pay_id}`, formData);
};

export const deleteOneRecurringPay = async (recurring_pay_id) => {
    return await payroll_api.delete(`/api/v1/employees/recurring-pays/${recurring_pay_id}`);
};

