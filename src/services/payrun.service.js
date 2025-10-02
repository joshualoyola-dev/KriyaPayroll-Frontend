import payroll_api from "../configs/payroll_api.config";

export const getPayrun = async (company_id, payrun_id) => {
    return await payroll_api.get(`/api/v1/payruns/${company_id}/regular/${payrun_id}`);
};

export const getPayrunPayslipPayables = async (company_id, payrun_id) => {
    return await payroll_api.get(`/api/v1/payruns/${company_id}/regular/${payrun_id}/payslip-payables`);
};

export const getCompanyPayruns = async (company_id) => {
    return await payroll_api.get(`/api/v1/payruns/${company_id}`);
};

export const generateRegularPayrun = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/regular/generate`, formData)
};

export const saveRegularPayrunDraft = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/regular/save-draft`, formData);
};

export const saveEdit = async (company_id, payrun_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/regular/save-edit/${payrun_id}`, formData);
};

export const updateStatus = async (company_id, payrun_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/regular/change-status/${payrun_id}`, formData);
};

export const deleteOnePayrun = async (company_id, payrun_id) => {
    return await payroll_api.delete(`/api/v1/payruns/${company_id}/regular/${payrun_id}`);
};

export const getPayslipsDraft = async (payrun_id) => {
    return await payroll_api.get(`/api/v1/payruns/${payrun_id}/payslips/draft`);
};

export const getPayslips = async (payrun_id) => {
    return await payroll_api.get(`/api/v1/payruns/${payrun_id}/payslips/approved`);
};

export const sendOnePayslip = async (company_id, employee_id, payrun_id, payslip_id) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/${payrun_id}/payslips/${payslip_id}/send-to/${employee_id}`);
};