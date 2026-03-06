export const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Converts "NON_TAXABLE" → "Non-taxable", "TAXABLE" → "Taxable"
export const formatPayitemGroup = (group) => {
    if (!group) return "";
    return group
        .toLowerCase()
        .split("_")
        .join("-")
        .replace(/^./, c => c.toUpperCase());
};
