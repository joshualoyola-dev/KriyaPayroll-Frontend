//converts into ISO 18601 String format: YYYY-MM-DD format 
export const convertToISO8601 = (date) => {
    if (!date) return null;

    const d = new Date(date);

    if (isNaN(d)) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Converts "YYYY-MM-DD HH:MM:SS" → "YYYY-MM-DDTHH:MM" (for datetime-local input)
export const toDatetimeLocalString = (dateTimeString) => {
    if (!dateTimeString) return '';
    return dateTimeString.slice(0, 16).replace(' ', 'T');
};

// Converts "YYYY-MM-DDTHH:MM" → "YYYY-MM-DD HH:MM:SS" (for backend)
export const toSqlDateTimeString = (inputValue) => {
    if (!inputValue) return '';
    return inputValue.replace('T', ' ') + ':00';
};

//convert date object into YYYY-MM-DD HH:MM:SS
export const convertToDatetimeString = (datetime) => {
    if (!datetime) return null; // handle null or undefined

    const date = new Date(datetime);

    // Extract UTC values (no local timezone conversion)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getYYYYMMDDPartOfUTCDate = (date) => {
    return String(date).split('T')[0];
}

export const getNearestDateRangePerPayrollPeriod = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1; // 1-indexed month
    const year = d.getFullYear();

    let startDay, endDay;

    if (day <= 15) {
        // Payrun period 1-15
        startDay = 1;
        endDay = 15;
    } else {
        // Payrun period 16-end of month
        startDay = 16;
        // get last day of month
        endDay = new Date(year, month, 0).getDate(); // day 0 of next month = last day of current month
    }

    // Format as YYYY-MM-DD
    const formatDate = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    return {
        from: formatDate(year, month, startDay),
        to: formatDate(year, month, endDay)
    };
}

export const formatDateToWords = (date) => {
    const d = new Date(date);

    const months = [
        "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
        "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
    ];

    const month = months[d.getUTCMonth()];
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();

    return `${month} ${day}, ${year}`;
};