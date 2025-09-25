import payroll_api from "../configs/payroll_api.config";


export const generateRegularPayrun = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/payruns/${company_id}/regular/generate`, formData)
};