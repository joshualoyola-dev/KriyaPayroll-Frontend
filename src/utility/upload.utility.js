import * as XLSX from 'xlsx';


export const normalizeHeader = (header) => {
    return header
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^\w]/g, '');
};

export const parseExcelDate = (value) => {
    if (typeof value === "number") {
        // Convert Excel serial to JS Date
        const excelDate = XLSX.SSF.parse_date_code(value);
        if (excelDate) {
            // Ensure only Y-M-D, no time portion
            return new Date(Date.UTC(excelDate.y, excelDate.m - 1, excelDate.d));
        }
    } else if (typeof value === "string" && value.trim()) {
        // Match YYYY-MM-DD exactly
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
        if (match) {
            const [, y, m, d] = match.map(Number);
            return new Date(Date.UTC(y, m - 1, d));
        }
    }
    return null;
};


// Helper function to parse Excel date/time values
export const parseExcelDateTime = (value) => {
    if (typeof value === "number") {
        // Convert Excel serial to JS Date
        const excelDate = XLSX.SSF.parse_date_code(value);
        if (excelDate) {
            return new Date(excelDate.y, excelDate.m - 1, excelDate.d, excelDate.H || 0, excelDate.M || 0, excelDate.S || 0);
        }
    } else if (typeof value === "string" && value.trim()) {
        const parsed = new Date(value);
        if (!isNaN(parsed)) {
            return parsed;
        }
    }
    return null;
};

// Helper function to format datetime for backend (YYYY-MM-DD HH:MM:SS)
export const formatDateTime = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Helper function to format date for backend (YYYY-MM-DD)
export const formatDateToISO18601 = (date) => {
    if (!date) return null;
    return date.toISOString().slice(0, 10);
};

export const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get first worksheet
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];

                // Convert to JSON with headers
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: '',
                    blankrows: false
                });

                if (jsonData.length === 0) {
                    reject(new Error('No data found in the Excel file'));
                    return;
                }

                // Convert array format to object format
                const headers = jsonData[0];
                const rows = jsonData.slice(1).map(row => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        // obj[header] = row[index] || '';
                        obj[header] = row[index] !== undefined && row[index] !== null ? row[index] : '';
                    });
                    return obj;
                });

                resolve(rows);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
};