const payitems = {
    "Basic Pay": "payitem-id-02", // Basic Pay
    "Night Differential": "payitem-id-03", // Night Differential
    "Regular OT": "payitem-id-07", // Regular OT
    "Special Holiday OT": "payitem-id-08", // Special Holiday OT
    "Regular Holiday OT": "payitem-id-09", // Regular Holiday OT
    "Rest Day OT": "payitem-id-04", // Rest Day Regular
    "Special Holiday Premium Pay": "payitem-id-05", // Special Holiday Premium Pay
    "Regular Holiday Premium Pay": "payitem-id-06", // Regular Holiday Premium Pay
    "PTO Conversion": "payitem-id-11", // PTO Conversion
    "Quarterly Bonus": "payitem-id-12", // Quarterly Bonus
    "Spot Bonus": "payitem-id-13", // Spot Bonus
    "13th Month Bonus - Taxable": "payitem-id-14", // 13th Month Bonus - Taxable
    "Team Lead Allowance": "payitem-id-27", // Team Lead Allowance
    "Recurring Other Taxable Pay": "payitem-id-25", // Recurring Taxable Pay - Other
    "14th Month Pay": "payitem-id-17", // 14th Month Bonus- Non Taxable
    "Anniversary Bonus": "payitem-id-19", // Anniversary Bonus
    "Retroactive Pay": "payitem-id-20", // Retroactive Taxable Pay - taxable from database of old
    "Tuition Fee Grant": "payitem-id-31", // Tuition Fee Grant
    "13th Month Bonus - Non-Taxable": "payitem-id-15", // 13th Month Bonus - Non-Taxable
    "Recurring Other Pay - Non-Taxable": "payitem-id-26", // Recurring  Non Taxable Pay - Other
    "Reimbursements": "payitem-id-32", // Reimbursements
    "Tax Refund - Previous Year": "payitem-id-22", // Tax Refund - Previous Year
    "Absences": "payitem-id-33", // Absences
    "Undertime/Tardiness": "payitem-id-36", // Undertime
    "HDMF (EE)": "payitem-id-43", // HDMF (EE)
    "SSS (EE)": "payitem-id-37", // SSS (EE)
    "SSS Provident Fund (EE)": "payitem-id-38", // SSS MPF (EE)
    "PHIC (EE)": "payitem-id-46", // PHIC (EE)
    "Other Pay Deduction - Taxable": "payitem-id-48", // Other Pay Deduction - Taxable
    "Other Pay Deduction - Non-Taxable": "payitem-id-49", // Other Pay Deduction - Non-Taxable
    "SSS Loan": "payitem-id-42", // SSS Loan (EE)
    "HDMF Loan": "payitem-id-45", // HDMF Loan (EE)
    "Salary Loan Repayment": "payitem-id-50", // Salary Loan Repayment
    "Company Advances Repayment": "payitem-id-51", // Company Advances Repayment
    "SSS (ER)": "payitem-id-39", // SSS (ER)
    "SSS (ECC)": "payitem-id-40", // SSS EC (ER)
    "PHIC (ER)": "payitem-id-47", // PHIC (ER)
    "HDMF (ER)": "payitem-id-44", // HDMF (ER)
    "SSS Provident Fund (ER)": "payitem-id-41", // SSS MPF (ER)
    "Tax Withheld": "payitem-id-01", // Tax Withheld
    "SSS Regular EE": "payitem-id-37", // SSS (EE)
    "ESPP Deduction": "payitem-id-49", // Other Pay Deduction - Non-Taxable
    "Clothing and Laundry Allowance (de Minimis)": "payitem-id-30", // Other Non-taxable pay
    "PHIC EE": "payitem-id-46", // PHIC (EE)
    "Regular Holiday": "payitem-id-06", // Regular Holiday Premium Pay
    "Regular Holiday Night Differential": "payitem-id-03", // Night Differential
    "Night Differential OT": "payitem-id-03", // Night Differential
    "Regular Holiday ND OT": "payitem-id-03", //  Night Differential
    "Rest Day": "payitem-id-04", // Rest Day Regular
    "Rest Day ND": "payitem-id-03", //  Night Differential
    "Rest Day ND OT": "payitem-id-03", //  Night Differential
    "Special Holiday": "payitem-id-05", // Special Holiday Premium Pay
    "Special Holiday ND": "payitem-id-03", //  Night Differential
    "Special Holiday ND OT": "payitem-id-03", //  Night Differential
    "Meal Allowance (taxable)": "payitem-id-29", // Other Taxable Pay
    "Medical Allowance (Taxable)": "payitem-id-29", // Other Taxable Pay
    "Transportation Allowance": "payitem-id-28", // Transportation Allowance
    "Other Pay (Taxable)": "payitem-id-29", // Other Taxable Pay
    "Other Pay (Non-Taxable)": "payitem-id-30", // Other Non-taxable pay
    "Previous Period Adjustment - Absences & Undertime": "payitem-id-33", // Absences
    "Previous Period - Absences & Undertime": "payitem-id-33", // Absences
    "14th Month Pay - Non-Taxable": "payitem-id-17", // 14th Month Bonus - Non Taxable
    "Tax Refund": "payitem-id-23", // Tax refund - Current Year
    "Other Company Deduction": "payitem-id-52", // Other Company Deduction
    "Other Pay/Bonus (Taxable)": "payitem-id-29", // Other Taxable Pay
    "Other (Non-Taxable)": "payitem-id-30", // Other Non-taxable pay
    "Recurring Other Pay/ Bonus (Taxable)": "payitem-id-25", // Recurring Taxable Pay - Other
    "Recurring Other Pay/ Bonus (Non- Taxable)": "payitem-id-26", // Recurring  Non Taxable Pay - Other
    "Anniversary Bonus (Taxable)": "payitem-id-19", // Anniversary Bonus
    "14th Month Pay (Non-Taxable)": "payitem-id-17", // 14th Month Bonus - Non Taxable
    "Other Pay/ Bonus (Taxable)": "payitem-id-29", // Other Taxable Pay
    "Reimbursements From Company": "payitem-id-32", // Reimbursements
    "Company Advances": "payitem-id-51", // Company Advances Repayment
    "Anniversary / Quarterly Bonus (Non-Taxable)": "payitem-id-19", // Anniversary Bonus
    "Recurring Other Pay/Bonus (Non-Taxable)": "payitem-id-26", // Recurring  Non Taxable Pay - Other
    "Recurring Other Pay/Bonus (Taxable)": "payitem-id-25", // Recurring Taxable Pay - Other
    "Tax Payable": "payitem-id-01", // Tax Withheld
    "Other Non Taxable Pay": "payitem-id-30", // Other Non-taxable pay
    "Other Non-Taxable Pay": "payitem-id-30", // Other Non-taxable pay
    "Augmented Pay": "payitem-id-24", // Augmented Pay
    "Other Taxable Pay": "payitem-id-29", // Other Taxable Pay
    "Other Pay Deduction Taxable": "payitem-id-48", // Other Pay Deduction - Taxable
    "Tax Refund 2024": "payitem-id-22", // Tax refund - Previous Year
    "14 Month": "payitem-id-17", // 14th Month Bonus- Non Taxable
    "Other Deduction - Housing Deduction": "payitem-id-49", // Other Pay Deduction - Non-Taxable
    "Housing Allowance - Non-Taxable Pay": "payitem-id-30" // Other Non-taxable pay
};
export const oldPayitemsNameToPayitemIDMap = (payitem) => {
    const payitemsMap = new Map(Object.entries(payitems));
    return payitemsMap.get(payitem);
};