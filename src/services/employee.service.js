import payroll_api from "../configs/payroll_api.config";

export const fetchEmployees = async () => {
    return await payroll_api.get(`/api/v1/employees`);
};

export const fetchEmployeesByCompanyId = async (company_id) => {
    return await payroll_api.get(`/api/v1/employees?company_id=${company_id}`);
};

export const fetchEmployeesByCompanyIdAndQuery = async (company_id, query) => {
    return await payroll_api.get(`/api/v1/employees?company_id=${company_id}&query=${query}`);
};



export const fetchEmployeeById = async (employee_id) => {
    return await payroll_api.get(`/api/v1/employees/${employee_id}`);
};

export const createEmployee = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/employees/companies/${company_id}`, formData);
};

export const updateEmployee = async (employee_id, formData) => {
    return await payroll_api.patch(`/api/v1/employees/${employee_id}`, formData);
};

export const updateEmployeeInfo = async (employee_id, formData) => {
    return await payroll_api.patch(`/api/v1/employees/${employee_id}/info`, formData);
};

export const addEmployeeSalary = async (company_id, employee_id, formData) => {
    return await payroll_api.post(`/api/v1/employees/${employee_id}/companies/${company_id}/salaries`, formData);
}

export const updateEmploymentStatus = async (company_id, employee_id, employement_status) => {
    return await payroll_api.patch(`/api/v1/employees/${employee_id}/companies/${company_id}/employment-status`, { employement_status });
}

export const getCheckEmployeesIfExist = async (company_id, concat_employee_ids) => {
    return await payroll_api.get(`/api/v1/employees/existence/companies/${company_id}?employee_ids=${concat_employee_ids}`)
};