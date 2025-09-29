import payroll_api from "../configs/payroll_api.config";

export const getCompanyPayruns = async (company_id) => {
    return await payroll_api.get(`/api/v1/payruns/${company_id}`);
};

export const generateRegularPayrun = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/regular/generate`, formData)
};

export const saveRegularPayrunDraft = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/regular/save-draft`, formData);
};