import payroll_api from "../configs/payroll_api.config";


//hdmf service
export const fetchHdmfs = async () => {
    return await payroll_api.get('/api/v1/contributions/hdmf');
};
export const updateHdmfRecord = async (hdmf_contribution_rate_id, formData) => {
    return await payroll_api.patch(`/api/v1/contributions/hdmf/${hdmf_contribution_rate_id}`, formData);
};

//phic service


//sss service


//withholding service