import payroll_api from "../configs/payroll_api.config";


export const getCompaniesService = async () => {
    return await payroll_api.get("/api/v1/companies/access/me");
};

export const getCompanyFullDetail = async (company_id) => {
    return await payroll_api.get(`/api/v1/companies/${company_id}`);
}

export const createCompany = async (formData) => {
    return await payroll_api.post("/api/v1/companies", formData);
};

export const createUserToManageCompany = async (user_ids, company_id) => {
    return await payroll_api.post(`/api/v1/companies/${company_id}/access`, { user_ids });
}

export const createCompanyPayrollFrequency = async (company_id, frequency) => {
    return await payroll_api.post(`/api/v1/companies/${company_id}/configuration/payroll-frequency`, { frequency })
};

export const createCompanyWorkingDays = async (company_id, number_of_days) => {
    return await payroll_api.post(`/api/v1/companies/${company_id}/configuration/working-days`, { number_of_days });
}

export const updateCompany = async (company_id, formData) => {
    return await payroll_api.patch(`/api/v1/companies/${company_id}`, formData);
};

export const updateCompanyInfo = async (company_id, formData) => {
    return await payroll_api.patch(`/api/v1/companies/${company_id}/info`, formData);
};





export const fetchCompanyWorkingDays = async (company_id) => {
    return await payroll_api.get(`/api/v1/companies/${company_id}/configuration/working-days`);
}


export const fetchCompanyPayrollFrequency = async (company_id) => {
    return await payroll_api.get(`/api/v1/companies/${company_id}/configuration/payroll-frequency`);
};


export const fetchCompanyNDRate = async (company_id) => {
    return await payroll_api.get(`/api/v1/companies/${company_id}/configuration/nd-rate`);
};

export const fetchCompanyRegularOTRate = async (company_id) => {
    return await payroll_api.get(`/api/v1/companies/${company_id}/configuration/regular-ot-rate`);
};

export const fetchCompanyRestdayRate = async (company_id) => {
    return await payroll_api.get(`/api/v1/companies/${company_id}/configuration/rest-day-rate`);
};


export const createCompanyNDRate = async (company_id, nd_rate) => {
    return await payroll_api.post(`/api/v1/companies/${company_id}/configuration/nd-rate`, { nd_rate });
};

export const createCompanyRegularOTRate = async (company_id, regular_ot_rate) => {
    return await payroll_api.post(`/api/v1/companies/${company_id}/configuration/regular-ot-rate`, { regular_ot_rate });
};

export const createCompanyRestdayRate = async (company_id, restday_rate) => {
    return await payroll_api.post(`/api/v1/companies/${company_id}/configuration/rest-day-rate`, { restday_rate });
};