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

/** 2316 table columns: key = backend field_code, label = BIR 2316 header (exact order for /data-export/2316/new) */
export const SECTION_2316_COLUMNS = [
    { key: "year", label: "Year" },
    { key: "period_start", label: "Period From" },
    { key: "period_end", label: "Period To" },
    { key: "employee_tin", label: "Employee TIN" },
    { key: "employee_name", label: "Employee Name" },
    { key: "employee_rdo", label: "RDO" },
    { key: "employee_registered_address", label: "Employee Address" },
    { key: "employee_registered_zip", label: "Zip Registered" },
    { key: "employee_local_zip", label: "Zip Local" },
    { key: "employee_local_address", label: "Local Address" },
    { key: "employee_foreign_address", label: "Foreign Address" },
    { key: "employee_birth_date", label: "Birth Date" },
    { key: "employee_contact_number", label: "Contact Number" },
    { key: "smw_daily_rate", label: "SMW Day" },
    { key: "smw_monthly_rate", label: "SMW Month" },
    { key: "is_minimum_wage_earner", label: "Is MWE?" },
    { key: "company_tin", label: "Employer TIN" },
    { key: "company_name", label: "Employer Name" },
    { key: "company_address", label: "Employer Address" },
    { key: "employer_zip", label: "Employer Zip" },
    { key: "employer_type", label: "Employer Type" },
    { key: "previous_employer_tin", label: "Prev TIN" },
    { key: "previous_employer_name", label: "Prev Name" },
    { key: "previous_employer_address", label: "Prev Address" },
    { key: "previous_employer_zip", label: "Prev Zip" },
    { key: "gross_compensation", label: "19 Gross Comp" },
    { key: "total_non_taxable", label: "20 Less Non-Tax" },
    { key: "taxable_compensation", label: "21 Taxable Comp" },
    { key: "previous_taxable_compensation", label: "22 Add Prev Taxable" },
    { key: "gross_taxable_compensation", label: "23 Gross Taxable" },
    { key: "income_tax_due", label: "24 Tax Due" },
    { key: "tax_withheld_current_employer", label: "25A Withheld Present" },
    { key: "tax_withheld_previous_employer", label: "25B Withheld Prev" },
    { key: "total_tax_withheld", label: "26 Total Taxes" },
    { key: "tax_credit", label: "27 Tax Credit" },
    { key: "total_tax_withheld_after_credit", label: "28 Total Withheld" },
    { key: "non_taxable_basic_smw", label: "29 Basic/SMW" },
    { key: "non_taxable_holiday_pay", label: "30 Holiday Pay" },
    { key: "non_taxable_overtime_pay", label: "31 Overtime" },
    { key: "non_taxable_night_shift", label: "32 Night Shift" },
    { key: "non_taxable_hazard_pay", label: "33 Hazard Pay" },
    { key: "non_taxable_thirteenth_month", label: "34 13th Month Exempt" },
    { key: "non_taxable_de_minimis", label: "35 De Minimis" },
    { key: "non_taxable_contributions", label: "36 Contributions" },
    { key: "non_taxable_other_compensation", label: "37 Salaries/Others" },
    { key: "total_non_taxable_compensation", label: "38 Total Non-Tax" },
    { key: "taxable_basic_compensation", label: "39 Basic Taxable" },
    { key: "taxable_representation", label: "40 Representation" },
    { key: "taxable_transportation", label: "41 Transportation" },
    { key: "taxable_cola", label: "42 COLA" },
    { key: "taxable_housing", label: "43 Housing" },
    { key: "taxable_other_a_label", label: "44A Others" },
    { key: "taxable_other_a_amount", label: "44A Others Amount" },
    { key: "taxable_other_b_label", label: "44B Others" },
    { key: "taxable_other_b_amount", label: "44B Others Amount" },
    { key: "taxable_commission", label: "45 Commission" },
    { key: "taxable_profit_sharing", label: "46 Profit Sharing" },
    { key: "taxable_fees", label: "47 Fees" },
    { key: "taxable_thirteenth_month", label: "48 Taxable 13th" },
    { key: "taxable_hazard_pay", label: "49 Hazard Taxable" },
    { key: "taxable_overtime_pay", label: "50 Overtime Taxable" },
    { key: "taxable_51a_label", label: "51A Others" },
    { key: "taxable_51a_amount", label: "51A Others AMOUNT" },
    { key: "taxable_51b_label", label: "51B Others" },
    { key: "taxable_51b_amount", label: "51B Others AMOUNT" },
    { key: "total_taxable_compensation", label: "52 Total Taxable" },
];
