/**
 * Data Export form types and options. Used by Sidebar, History, and Add New pages.
 * No hardcoded labels or paths in components—all derived from this config.
 */
export const DATA_EXPORT_FORM_TYPES = [
    { id: "ytd", label: "YTD", historyTitle: "YTD History" },
    { id: "2316", label: "2316", historyTitle: "2316 History" },
    { id: "1601c", label: "1601C", historyTitle: "1601C History" },
];

export const DATA_EXPORT_HISTORY_STATUSES = [
    { value: "", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "PDF", label: "PDF" },
    { value: "DELETED", label: "Deleted" },
];

export const getFormTypeById = (id) =>
    DATA_EXPORT_FORM_TYPES.find((t) => t.id === id) ?? null;

export const getHistoryPath = (formTypeId) => `/data-export/${formTypeId}`;
export const getAddNewPath = (formTypeId) => `/data-export/${formTypeId}/new`;

