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
    meta = null
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

    const workbook = XLSX.utils.book_new();
    let worksheet;

    if (meta) {
        const metaRows = [
            ['Type', meta.type || ''],
            ['Start Date', meta.start_date || ''],
            ['End Date', meta.end_date || ''],
            ['Export Method', meta.export_method || ''],
            [] // empty row before table
        ];

        // Create sheet with meta first
        worksheet = XLSX.utils.aoa_to_sheet(metaRows);

        // Append table below meta
        XLSX.utils.sheet_add_json(worksheet, rows, {
            origin: metaRows.length,
            skipHeader: false
        });
    } else {
        // No meta → just the table
        worksheet = XLSX.utils.json_to_sheet(rows);
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

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
    meta = null,
) => {

    const allInnerKeys = Array.from(
        new Set(Object.values(data).flatMap(inner => Object.keys(inner)))
    );

    const employeeIds = Object.keys(data);

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
            row[payItemName] =
                data[empId]?.[payItemId] != null
                    ? Number(data[empId]?.[payItemId])
                    : 0;
        }

        const payslip = payslipMap.get(empId);

        row['Total Earnings'] = payslip?.total_earnings != null ? Number(payslip.total_earnings) : 0;
        row['Total Deductions'] = payslip?.total_deductions != null ? Number(payslip.total_deductions) : 0;
        row['Total Taxes'] = payslip?.total_taxes != null ? Number(payslip.total_taxes) : 0;
        row['Net Salary'] = payslip?.net_salary != null ? Number(payslip.net_salary) : 0;

        rows.push(row);
    }

    const workbook = XLSX.utils.book_new();

    let worksheet;

    // If meta exists → build sheet manually
    if (meta) {
        const metaRows = [
            ['Payrun Type', meta.payrun_type || ''],
            ['Payrun Start Date', meta.payrun_start_date || ''],
            ['Payrun End Date', meta.payrun_end_date || ''],
            ['Payment Date', meta.payment_date || ''],
            [] // empty row before table
        ];

        // Convert table rows to sheet
        const dataSheet = XLSX.utils.json_to_sheet(rows, { origin: 0 });

        // Create sheet from meta first
        worksheet = XLSX.utils.aoa_to_sheet(metaRows);

        // Append table below meta (after metaRows length)
        XLSX.utils.sheet_add_json(worksheet, rows, {
            origin: metaRows.length,
            skipHeader: false
        });

    } else {
        // No meta → normal behavior
        worksheet = XLSX.utils.json_to_sheet(rows);
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
    });

    const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream'
    });

    saveAs(blob, `${filename}.xlsx`);
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

/**
 * Downloads payrun-level employee summary from backend response
 *
 * @param {Array} data - Backend response array
 * @param {string} filename - Excel file name (without extension)
 * @param {string} sheetName - Sheet name
 */
export const downloadExcelLastPayrunSummary = (
    data, // payables
    summaries, //summaries such as name, net pay, etc
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

        //find the employee record on summaries
        const summary = summaries.find(s => s.employee_id === empId);

        const formatDate = (date) =>
            date ? new Date(date).toISOString().split('T')[0] : '';

        const row = {
            'Employee ID': summary.employee_id || '',
            'Employee Name': `${summary.first_name || ''} ${summary.last_name || ''}`.trim(),
            'Work Email': summary.work_email || '',
            'Payrun Start Date': formatDate(summary.payrun_start_date),
            'Payrun End Date': formatDate(summary.payrun_end_date),
            'Payment Date': formatDate(summary.payment_date),
            'Payrun Status': summary.payrun_status || '',
            // 'Total Earnings': Number(summary.total_earnings) || 0,
            // 'Total Deductions': Number(summary.total_deductions) || 0,
            // 'Total Taxes': Number(summary.total_taxes) || 0,
            // 'Net Salary': Number(summary.net_salary) || 0,
        };

        for (const payItemId of allInnerKeys) {
            const payItemName = mapPayitemIdToPayitemName(payItemId) || payItemId;
            row[payItemName] = data[empId]?.[payItemId] != null ? Number(data[empId]?.[payItemId]) : 0;
        }

        row['Total Earnings'] = Number(summary.total_earnings) || 0;
        row['Total Deductions'] = Number(summary.total_deductions) || 0;
        row['Total Taxes'] = Number(summary.total_taxes) || 0;
        row['Net Salary'] = Number(summary.net_salary) || 0;

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
