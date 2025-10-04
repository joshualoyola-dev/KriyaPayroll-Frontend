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

