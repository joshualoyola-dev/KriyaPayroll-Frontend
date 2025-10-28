import payroll_api from "../configs/payroll_api.config";

export const fetchAttendances = async (company_id, employee_id = null, from = null, to = null) => {
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

    return await payroll_api.get(`/api/v1/daily-records/companies/${company_id}/attendances?${query}&page=${1}&limit=${20}`);
};

export const addAttendances = async (company_id, formData) => {
    return await payroll_api.post(`/api/v1/daily-records/companies/${company_id}/attendances`, formData);
}


export const updateAttendance = async (company_id, employee_attendance_id, formData) => {
    return await payroll_api.patch(`/api/v1/daily-records/companies/${company_id}/attendances/${employee_attendance_id}`, formData);
}

export const deleteAttendance = async (company_id, employee_attendance_id) => {
    return await payroll_api.delete(`/api/v1/daily-records/companies/${company_id}/attendances/${employee_attendance_id}`);
}


export const validateDailyRecordOfOneEmployee = async (employee_id, from, to) => {
    return await payroll_api.get(`/api/v1/daily-records/validate/${employee_id}?from=${from}&to=${to}`)
};  