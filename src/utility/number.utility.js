export const formatNumber = (value) => {
    if (!value) return "";
    const number = parseFloat(value);
    return isNaN(number) ? "" : number.toLocaleString();
};