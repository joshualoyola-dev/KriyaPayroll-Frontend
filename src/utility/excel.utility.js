import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Converts nested map-like data into an Excel file.
 * 
 * @param {Object} data - Structure: { employeeId: { payItemId: number } }
 * @param {Function} mapEmployeeIdToEmployeeName - (id: string) => string
 * @param {Function} mapPayitemIdToPayitemName - (id: string) => string
 */
export const downloadExcelMatrix = (
    data,
    mapEmployeeIdToEmployeeName,
    mapPayitemIdToPayitemName,
    filename,
    sheetName,
) => {
    const allInnerKeys = Array.from(
        new Set(Object.values(data).flatMap(inner => Object.keys(inner)))
    );
    const employeeIds = Object.keys(data);

    const rows = [];

    for (const empId of employeeIds) {
        const row = {
            'Employee ID': empId,
            'Employee Name': mapEmployeeIdToEmployeeName(empId) || ''
        };

        for (const payItemId of allInnerKeys) {
            const payItemName = mapPayitemIdToPayitemName(payItemId) || payItemId;
            row[payItemName] = data[empId]?.[payItemId] != null ? Number(data[empId]?.[payItemId]) : null;
        }

        rows.push(row);
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    //  Download as Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
};

export const downloadPayablesAndTotals = (
    data,
    mapEmployeeIdToEmployeeName,
    mapPayitemIdToPayitemName,
    filename,
    sheetName,
    payslips,
) => {
    const allInnerKeys = Array.from(
        new Set(Object.values(data).flatMap(inner => Object.keys(inner)))
    );
    const employeeIds = Object.keys(data);

    // Create a map for quick payslip lookup by employee_id
    const payslipMap = new Map();
    if (payslips && Array.isArray(payslips)) {
        payslips.forEach(slip => {
            payslipMap.set(slip.employee_id, slip);
        });
    }

    const rows = [];

    for (const empId of employeeIds) {
        const row = {
            'Employee ID': empId,
            'Employee Name': mapEmployeeIdToEmployeeName(empId) || ''
        };

        for (const payItemId of allInnerKeys) {
            const payItemName = mapPayitemIdToPayitemName(payItemId) || payItemId;
            row[payItemName] = data[empId]?.[payItemId] != null ? Number(data[empId]?.[payItemId]) : 0;
        }

        // Add payslip data
        const payslip = payslipMap.get(empId);
        if (payslip) {
            row['Total Earnings'] = payslip.total_earnings != null ? Number(payslip.total_earnings) : 0;
            row['Total Deductions'] = payslip.total_deductions != null ? Number(payslip.total_deductions) : 0;
            row['Total Taxes'] = payslip.total_taxes != null ? Number(payslip.total_taxes) : 0;
            row['Net Salary'] = payslip.net_salary != null ? Number(payslip.total_taxes) : 0;
        } else {
            row['Total Earnings'] = 0;
            row['Total Deductions'] = 0;
            row['Total Taxes'] = 0;
            row['Net Salary'] = 0;
        }

        rows.push(row);
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    //  Download as Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
};

export const downloadExcelPayrunSummary = (
    data,
    mapEmployeeIdToEmployeeName,
    sheetName = "Payrun Summary",
    filename = "Payrun-summary"
) => {
    try {
        // Validate data
        if (!Array.isArray(data) || data.length === 0) {
            console.error("No data to export");
            return;
        }

        // Transform data into desired Excel structure
        const rows = data.map(payslip => ({
            "Employee ID": payslip.employee_id || null,
            "Employee Name": mapEmployeeIdToEmployeeName(payslip.employee_id) || null,
            "Total Earnings": Number(payslip.total_earnings),
            "Total Deductions": Number(payslip.total_deductions),
            "Total Taxes": Number(payslip.total_taxes),
            "Net Salary": Number(payslip.net_salary),
        }));

        // Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Auto-fit columns (optional improvement)
        const columnWidths = Object.keys(rows[0]).map(key => ({
            wch: Math.max(key.length + 2, 15)
        }));
        worksheet["!cols"] = columnWidths;

        // Generate Excel file and trigger download
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${filename}.xlsx`);
    } catch (error) {
        console.error("Error generating Excel file:", error);
    }
};


// Helper function to convert Excel decimal time to HH:MM format
export const convertExcelTimeToHHMM = (value) => {
    if (!value && value !== 0) return '';

    let decimalTime;

    // If it's a string in HH:MM format already, validate and return
    if (typeof value === 'string') {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (timeRegex.test(value.trim())) {
            return value.trim();
        }
        // Try to parse as decimal string
        decimalTime = parseFloat(value);
        if (isNaN(decimalTime)) return '';
    } else if (typeof value === 'number') {
        decimalTime = value;
    } else {
        return '';
    }

    // Excel stores time as decimal (0-1) where 0 = 00:00, 1 = 24:00
    // Multiply by 24 to get hours
    const totalMinutes = Math.round(decimalTime * 24 * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;

    // Format as HH:MM
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
