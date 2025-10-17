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
            row[payItemName] = data[empId]?.[payItemId] ?? '';
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
            "Employee ID": payslip.employee_id,
            "Employee Name": mapEmployeeIdToEmployeeName(payslip.employee_id) || "",
            "Total Earnings": payslip.total_earnings,
            "Total Deductions": payslip.total_deductions,
            "Total Taxes": payslip.total_taxes,
            "Net Salary": payslip.net_salary,
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
