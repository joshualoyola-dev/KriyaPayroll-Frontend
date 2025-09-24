import payroll_api from "../configs/payroll_api.config";

//hdmf service
export const fetchHdmfs = async () => {
    return await payroll_api.get('/api/v1/contributions/hdmf');
};
export const updateHdmfRecord = async (hdmf_contribution_rate_id, formData) => {
    return await payroll_api.patch(`/api/v1/contributions/hdmf/${hdmf_contribution_rate_id}`, formData);
};

//phic service
export const fetchPhics = async () => {
    return await payroll_api.get('/api/v1/contributions/phic');
};
export const updatePhicRecord = async (phic_contribution_rate_id, formData) => {
    return await payroll_api.patch(`/api/v1/contributions/phic/${phic_contribution_rate_id}`, formData);
};

//sss service
export const fetchSSS = async () => {
    return await payroll_api.get('/api/v1/contributions/sss');
};
export const updateSSS = async (sss_contribution_rate_id, formData) => {
    return await payroll_api.patch(`/api/v1/contributions/sss/${sss_contribution_rate_id}`, formData);
};

//withholding 
export const fetchWithholdings = async () => {
    return await payroll_api.get('/api/v1/contributions/withholding');
};
export const updateWithholdings = async (withholding_tax_id, formData) => {
    return await payroll_api.patch(`/api/v1/contributions/withholding/${withholding_tax_id}`, formData);
};