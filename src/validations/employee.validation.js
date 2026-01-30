
// Helper function to validate required date fields
export const validateEmployeeData = (employee) => {
    const errors = [];

    // Check required text fields
    if (!employee.first_name?.trim()) errors.push("First name is required");
    if (!employee.last_name?.trim()) errors.push("Last name is required");
    if (!employee.personal_email?.trim()) errors.push("Personal email is required");
    if (!employee.work_email?.trim()) errors.push("Work email is required");
    if (!employee.job_title?.trim()) errors.push("Job title is required");
    if (!employee.department?.trim()) errors.push("Department is required");

    // Check required date fields
    if (!employee.date_hired) errors.push("Date hired is required");
    if (!employee.date) errors.push("Base pay start date is required");
    if (!employee.change_type?.trim()) errors.push("Change type is required");


    //shifts 
    if (!employee.shift_start?.trim()) errors.push("Shift start time is required");
    if (!employee.shift_end?.trim()) errors.push("Shift end time is required");
    if (!employee.shift_hours || employee.shift_hours <= 0) errors.push("Shift hours is required and must be greater than 0");


    // Check required numeric fields
    if (!employee.base_pay || employee.base_pay <= 0) errors.push("Base pay is required and must be greater than 0");

    return errors;
};
