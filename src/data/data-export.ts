// ./data/data-export.ts
//
// note: field_type can be 'string' | 'number'
// if field_type is 'number': convert item to number
//     dont have to worry about this during this stage, its more going to be important when editing a draft
//     reason for this is because everything will saved to database as string
//
//     for when a draft is loaded, items labeled 'number' will be converted into number
//
// note: field_code is so the backend knows where to get its data from
// field_name is for display purposes
//
// the frontend form can get this and then display it w/ its initialized values instead of having to declare each field and value individually

export type FieldType = "string" | "number";

export type FormTemplateField = Readonly<{
    field_code: string;
    field_name: string;
    field_type: FieldType;
    value: string | number;
}>;

// this is for FORM 1601-C
export const FORM_1601C_TEMPLATE = [
  { field_code: 'generated', field_name: 'Generated?', field_type: 'string', value: 'Yes' },

  // PART I – BASIC INFO
  { field_code: 'month', field_name: 'Month', field_type: 'string', value: '' },
  { field_code: 'year', field_name: 'Year', field_type: 'string', value: '' },
  { field_code: 'sheets_attached', field_name: 'Sheets Attached', field_type: 'number', value: 0 },
  { field_code: 'company_tin', field_name: 'TIN', field_type: 'string', value: '' },
  { field_code: 'rdo', field_name: 'RDO Code', field_type: 'string', value: '' },
  { field_code: 'company_name', field_name: 'Agent Name', field_type: 'string', value: '' },
  { field_code: 'company_address', field_name: 'Address', field_type: 'string', value: '' },
  { field_code: 'company_phone', field_name: 'Contact No', field_type: 'string', value: '' },
  { field_code: 'company_email', field_name: 'Email', field_type: 'string', value: '' },

  // FLAGS
  { field_code: 'specify', field_name: 'Specify(13A)', field_type: 'string', value: '' },
  { field_code: 'amended_return', field_name: 'Amended Return?', field_type: 'string', value: 'No' },
  { field_code: 'taxes_withheld', field_name: 'Taxes Withheld?', field_type: 'string', value: 'No' },
  { field_code: 'category', field_name: 'Category', field_type: 'string', value: 'Private' },
  { field_code: 'tax_relief', field_name: 'Tax Relief', field_type: 'string', value: 'No' },

  // PART II – COMPENSATION
  { field_code: 'total_compensation', field_name: 'Total Comp (14)', field_type: 'number', value: 0 },
  { field_code: 'minimum_wage', field_name: 'Min Wage (15)', field_type: 'number', value: 0 },
  {
    field_code: 'holiday_pay',
    field_name: 'Holiday Pay (16)',
    field_type: 'number',
    value: 0,
  },
  { field_code: 'thirteenth_month', field_name: '13th Month (17)', field_type: 'number', value: 0 },
  { field_code: 'de_minimis', field_name: 'De Minimis (18)', field_type: 'number', value: 0 },
  {
    field_code: 'mandatory_contributions',
    field_name: 'SSS/PHIC (19)',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'other_non_taxable',
    field_name: 'Other Non-Tax (20)',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'total_non_taxable',
    field_name: 'Total Non-Tax (21)',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'total_taxable_compensation',
    field_name: 'Total Taxable (22)',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'less_exempt',
    field_name: 'ess: Exempt (23)',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'net_taxable',
    field_name: 'Net Taxable (24)',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'tax_withheld',
    field_name: 'Tax Withheld (25)',
    field_type: 'number',
    value: 0,
  },
  { field_code: 'adjustment', field_name: 'Adjustment (26)', field_type: 'number', value: 0 },
  { field_code: 'tax_remittance', field_name: 'Tax Remittance (27)', field_type: 'number', value: 0 },
  { field_code: 'previous_remitted', field_name: 'Prev Remitted (28)', field_type: 'number', value: 0 },
  { field_code: 'other_remit', field_name: 'Other Remit (29)', field_type: 'number', value: 0 },
  { field_code: 'total_remit', field_name: 'Total Remit (30)', field_type: 'number', value: 0 },
  { field_code: 'tax_due', field_name: 'Tax Due (31)', field_type: 'number', value: 0 },

  // PART III – PENALTIES
  { field_code: 'surcharge', field_name: 'Surcharge (32)', field_type: 'number', value: 0 },
  { field_code: 'interest', field_name: 'Interest (33)', field_type: 'number', value: 0 },
  { field_code: 'compromise', field_name: 'Compromise (34)', field_type: 'number', value: 0 },
  { field_code: 'total_penalties', field_name: 'Total Penalties (35)', field_type: 'number', value: 0 },
  { field_code: 'total_amount_due', field_name: 'Total Amount Due (36)', field_type: 'number', value: 0 },

  // PART IV – SCHEDULE
  { field_code: 'prev_month_1', field_name: 'Prev Month 1 (MM/YYYY)', field_type: 'string', value: '' },
  { field_code: 'date_paid_1', field_name: 'Date Paid 1 (DD/MM/YYYY)', field_type: 'string', value: '' },
  { field_code: 'bank_1', field_name: 'Bank 1', field_type: 'string', value: '' },
  { field_code: 'ref_1', field_name: 'Ref 1', field_type: 'string', value: '' },
  { field_code: 'tax_paid_1', field_name: 'Tax Paid 1', field_type: 'number', value: 0 },
  { field_code: 'tax_due_1', field_name: 'Tax Due 1', field_type: 'number', value: 0 },
  { field_code: 'adjustment_1', field_name: 'Adjustment 1', field_type: 'number', value: 0 },

  { field_code: 'prev_month_2', field_name: 'Prev Month 2', field_type: 'string', value: '' },
  { field_code: 'date_paid_2', field_name: 'Date Paid 2', field_type: 'string', value: '' },
  { field_code: 'bank_2', field_name: 'Bank 2', field_type: 'string', value: '' },
  { field_code: 'ref_2', field_name: 'Ref 2', field_type: 'string', value: '' },
  { field_code: 'tax_paid_2', field_name: 'Tax Paid 2', field_type: 'number', value: 0 },
  { field_code: 'tax_due_2', field_name: 'Tax Due 2', field_type: 'number', value: 0 },
  { field_code: 'adjustment_2', field_name: 'Adjustment 2', field_type: 'number', value: 0 },

  { field_code: 'prev_month_3', field_name: 'Prev Month 3', field_type: 'string', value: '' },
  { field_code: 'date_paid_3', field_name: 'Date Paid 3', field_type: 'string', value: '' },
  { field_code: 'bank_3', field_name: 'Bank 3', field_type: 'string', value: '' },
  { field_code: 'ref_3', field_name: 'Ref 3', field_type: 'string', value: '' },
  { field_code: 'tax_paid_3', field_name: 'Tax Paid 3', field_type: 'number', value: 0 },
  { field_code: 'tax_due_3', field_name: 'Tax Due 3', field_type: 'number', value: 0 },
  { field_code: 'adjustment_3', field_name: 'Adjustment 3', field_type: 'number', value: 0 },

  { field_code: 'total_adjustment', field_name: 'Total Adj (Sch)', field_type: 'number', value: 0 },

  // PAYMENT DETAILS
  { field_code: 'zipcode', field_name: 'Zipcode', field_type: 'string', value: '' },
  { field_code: 'payment_type', field_name: 'Payment Type', field_type: 'string', value: '' },
  { field_code: 'pay_bank', field_name: 'Pay Bank', field_type: 'string', value: '' },
  { field_code: 'pay_number', field_name: 'Pay Number', field_type: 'string', value: '' },
  { field_code: 'pay_date', field_name: 'Pay Date', field_type: 'string', value: '' },
  { field_code: 'pay_amount', field_name: 'Pay Amount', field_type: 'number', value: 0 },
  { field_code: 'others', field_name: 'Others', field_type: 'string', value: '' },
];


// this isfor FORM 2316
export const FORM_2316_TEMPLATE = [
  // META
  { field_code: 'is_generated', field_name: 'Generated?', field_type: 'string', default: 'No' },
  { field_code: 'year', field_name: 'Year', field_type: 'string', default: '' },
  { field_code: 'period_start', field_name: 'Period From', field_type: 'string', default: '' },
  { field_code: 'period_end', field_name: 'Period To', field_type: 'string', default: '' },

  // EMPLOYEE INFO
  { field_code: 'employee_tin', field_name: 'Employee TIN', field_type: 'string', default: '' },
  { field_code: 'employeeName', field_name: 'Employee Name', field_type: 'string', default: '' },
  { field_code: 'employee_rdo', field_name: 'RDO', field_type: 'string', default: '' },
  { field_code: 'employee_registered_address', field_name: 'Employee Address', field_type: 'string', default: '' },
  { field_code: 'employee_registered_zip', field_name: 'Zip Registered', field_type: 'string', default: '' },
  { field_code: 'employee_local_zip', field_name: 'Zip Local', field_type: 'string', default: '' },
  { field_code: 'employee_local_address', field_name: 'Local Address', field_type: 'string', default: '' },
  { field_code: 'employee_foreign_address', field_name: 'Foreign Address', field_type: 'string', default: '' },
  { field_code: 'employee_birth_date', field_name: 'Birth Date', field_type: 'string', default: '' },
  { field_code: 'employee_contact_number', field_name: 'Contact Number', field_type: 'string', default: '' },

  // EMPLOYMENT STATUS
  { field_code: 'smw_daily_rate', field_name: 'SMW Day', field_type: 'number', default: 0 },
  { field_code: 'smw_monthly_rate', field_name: 'SMW Month', field_type: 'number', default: 0 },
  { field_code: 'is_minimum_wage_earner', field_name: 'Is MWE?', field_type: 'string', default: 'No' },

  // EMPLOYER INFO
  { field_code: 'company_tin', field_name: 'Employer TIN', field_type: 'string', default: '' },
  { field_code: 'company_name', field_name: 'Employer Name', field_type: 'string', default: '' },
  { field_code: 'company_address', field_name: 'Employer Address', field_type: 'string', default: '' },
  { field_code: 'employer_zip', field_name: 'Employer Zip', field_type: 'string', default: '' },
  { field_code: 'employer_type', field_name: 'Employer Type', field_type: 'string', default: '' },

  // PREVIOUS EMPLOYER
  { field_code: 'previous_employer_tin', field_name: 'Prev TIN', field_type: 'string', default: '' },
  { field_code: 'previous_employer_name', field_name: 'Prev Name', field_type: 'string', default: '' },
  { field_code: 'previous_employer_address', field_name: 'Prev Address', field_type: 'string', default: '' },
  { field_code: 'previous_employer_zip', field_name: 'Prev Zip', field_type: 'string', default: '' },

  // SUMMARY
  { field_code: 'gross_compensation', field_name: '19 Gross Compensation', field_type: 'number', default: 0 },
  { field_code: 'total_non_taxable', field_name: '20 Less: Non-Taxable', field_type: 'number', default: 0 },
  { field_code: 'taxable_compensation', field_name: '21 Taxable Compensation', field_type: 'number', default: 0 },
  { field_code: 'previous_taxable_compensation', field_name: '22 Add Prev Taxable', field_type: 'number', default: 0 },
  { field_code: 'gross_taxable_compensation', field_name: '23 Gross Taxable', field_type: 'number', default: 0 },
  { field_code: 'income_tax_due', field_name: '24 Tax Due', field_type: 'number', default: 0 },

  // TAX WITHHELD
  { field_code: 'tax_withheld_current_employer', field_name: '25A Tax Withheld Present', field_type: 'number', default: 0 },
  { field_code: 'tax_withheld_previous_employer', field_name: '25B Tax Withheld Previous', field_type: 'number', default: 0 },
  { field_code: 'total_tax_withheld', field_name: '26 Total Taxes', field_type: 'number', default: 0 },
  { field_code: 'tax_credit', field_name: '27 Tax Credit', field_type: 'number', default: 0 },
  { field_code: 'total_tax_withheld_after_credit', field_name: '28 Total Withheld', field_type: 'number', default: 0 },

  // NON-TAXABLE BREAKDOWN
  { field_code: 'non_taxable_basic_smw', field_name: '29 Basic / SMW', field_type: 'number', default: 0 },
  { field_code: 'non_taxable_holiday_pay', field_name: '30 Holiday Pay', field_type: 'number', default: 0 },
  { field_code: 'non_taxable_overtime_pay', field_name: '31 Overtime', field_type: 'number', default: 0 },
  { field_code: 'non_taxable_night_shift', field_name: '32 Night Shift', field_type: 'number', default: 0 },
  { field_code: 'non_taxable_hazard_pay', field_name: '33 Hazard Pay', field_type: 'number', default: 0 },
  { field_code: 'non_taxable_thirteenth_month', field_name: '34 13th Month Exempt', field_type: 'number', default: 0 },
  { field_code: 'non_taxable_de_minimis', field_name: '35 De Minimis', field_type: 'number', default: 0 },
  { field_code: 'non_taxable_contributions', field_name: '36 Contributions', field_type: 'number', default: 0 },
  { field_code: 'non_taxable_other_compensation', field_name: '37 Salaries / Other', field_type: 'number', default: 0 },
  { field_code: 'total_non_taxable_compensation', field_name: '38 Total Non-Taxable', field_type: 'number', default: 0 },

  // TAXABLE BREAKDOWN
  { field_code: 'taxable_basic_compensation', field_name: '39 Basic Taxable', field_type: 'number', default: 0 },
  { field_code: 'taxable_representation', field_name: '40 Representation', field_type: 'number', default: 0 },
  { field_code: 'taxable_transportation', field_name: '41 Transportation', field_type: 'number', default: 0 },
  { field_code: 'taxable_cola', field_name: '42 COLA', field_type: 'number', default: 0 },
  { field_code: 'taxable_housing', field_name: '43 Housing', field_type: 'number', default: 0 },

  { field_code: 'taxable_other_a_label', field_name: '44A Others', field_type: 'string', default: '' },
  { field_code: 'taxable_other_a_amount', field_name: '44A Others Amount', field_type: 'number', default: 0 },
  { field_code: 'taxable_other_b_label', field_name: '44B Others', field_type: 'string', default: '' },
  { field_code: 'taxable_other_b_amount', field_name: '44B Others Amount', field_type: 'number', default: 0 },

  { field_code: 'taxable_commission', field_name: '45 Commission', field_type: 'number', default: 0 },
  { field_code: 'taxable_profit_sharing', field_name: '46 Profit Sharing', field_type: 'number', default: 0 },
  { field_code: 'taxable_fees', field_name: '47 Fees', default: 0 },
  { field_code: 'taxable_thirteenth_month', field_name: '48 Taxable 13th Month', field_type: 'number', default: 0 },
  { field_code: 'taxable_hazard_pay', field_name: '49 Hazard Taxable', field_type: 'number', default: 0 },
  { field_code: 'taxable_overtime_pay', field_name: '50 Overtime Taxable', field_type: 'number', default: 0 },

  { field_code: 'taxable_other_a_label', field_name: '51A Others', field_type: 'string', default: '' },
  { field_code: 'taxable_other_a_amount', field_name: '51A Others AMOUNT', field_type: 'number', default: 0 },
  { field_code: 'taxable_other_b_label', field_name: '51B Others', field_type: 'string', default: '' },
  { field_code: 'taxable_other_b_amount', field_name: '51A Others AMOUNT', field_type: 'number', default: 0 },

  { field_code: 'total_taxable_compensation', field_name: '52 Total Taxable', field_type: 'number', default: 0 },

];

