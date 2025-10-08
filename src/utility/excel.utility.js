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
    mapPayitemIdToPayitemName
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Year-to-Date');

    //  Download as Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'year-to-date.xlsx');
};
