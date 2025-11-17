import payroll_api from "../configs/payroll_api.config";

export const getPayrun = async (company_id, payrun_id) => {
    return await payroll_api.get(`/api/v1/payruns/${company_id}/${payrun_id}`);
};

export const getPayrunPayslipPayables = async (company_id, payrun_id) => {
    return await payroll_api.get(`/api/v1/payruns/${company_id}/regular/${payrun_id}/payslip-payables`);
};

export const getCompanyPayruns = async (company_id) => {
    return await payroll_api.get(`/api/v1/payruns/${company_id}`);
};

export const generatePayrun = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/generate`, formData)
};

export const savePayrunDraft = async (company_id, formData, payrun_type) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/${payrun_type}/save-draft`, formData);
};

export const saveEdit = async (company_id, payrun_id, formData, compute_tax_witheld = null, payrun_type) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/${payrun_type}/save-edit/${payrun_id}?compute_tax_witheld=${compute_tax_witheld}`, formData);
};

export const saveEditAndCalculateTaxWitheld = async (company_id, payrun_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/regular/save-edit/${payrun_id}/calculate-tax-witheld`, formData);
};

export const updateStatus = async (company_id, payrun_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/change-status/${payrun_id}`, formData);
};

export const deleteOnePayrun = async (company_id, payrun_id) => {
    return await payroll_api.delete(`/api/v1/payruns/${company_id}/${payrun_id}`);
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

export const sendMultiplePayslip = async (company_id, payrun_id, payload) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/${payrun_id}/payslips/send`, payload);
};