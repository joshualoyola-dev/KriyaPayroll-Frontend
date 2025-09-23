// Counts valid days excluding given weekdays
export const diffDaysExcluding = (from, to, excludeDays = []) => {
    const excludeSet = new Set(excludeDays);

    // Normalize times to midnight
    let start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    let end = new Date(to.getFullYear(), to.getMonth(), to.getDate());

    if (start > end) [start, end] = [end, start]; // swap if needed

    let count = 0;
    while (start <= end) {
        if (!excludeSet.has(start.getDay())) {
            count++;
        }
        start.setDate(start.getDate() + 1);
    }
    

    return count;
};

// Ensures "to" is greater than "from" and validates working_days if provided
export const validateFromAndTo = (from, to, working_days = null, excludeDays = []) => {
    if (!(from instanceof Date) || !(to instanceof Date)) return false;

    // Ensure "to" is strictly greater than "from"
    if (to <= from) return false;

    // If working_days is provided, check against calculated difference
    if (working_days !== null) {
        const actualWorkingDays = diffDaysExcluding(from, to, excludeDays);
        if (actualWorkingDays !== working_days) return false;
    }

    return true;
};
