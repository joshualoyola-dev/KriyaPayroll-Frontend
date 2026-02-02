// ./data/data-export.ts
// note: field_type can be 'string' | 'number'
// if field_type is 'number': convert item to number
    // dont have to worry about this during this stage, its more going to be important when editing a draft
    // reason for this is because everything will saved to database as string

    // for when a draft is loaded, items labeled 'number' will be converted into number



// note: field_code is so the backend knows where to get its data from
    // field_name is for display purposes

// the frontend form can get this and then display it w/ its initialized values instead of having to declare each field and value individually

// this is for FORM 1601-C
export const FORM_1601C_TEMPLATE =  [
  // META
  { field_code: 'generated', field_name: 'Generated?', field_type: 'string', value: 'Yes' },

  // PART I
  { field_code: 'month', field_name: 'Month', field_type: 'string', value: '' },
  { field_code: 'year', field_name: 'Year', field_type: 'string', value: '' },
  { field_code: 'sheets_attached', field_name: 'Sheets Attached', field_type: 'number', value: 0 },
  { field_code: 'tin', field_name: 'TIN', field_type: 'string', value: '' },
  { field_code: 'rdo', field_name: 'RDO', field_type: 'string', value: '' },
  { field_code: 'agent_name', field_name: 'Agent Name', field_type: 'string', value: '' },
  { field_code: 'address', field_name: 'Address', field_type: 'string', value: '' },
  { field_code: 'contact_no', field_name: 'Contact No', field_type: 'string', value: '' },
  { field_code: 'email', field_name: 'Email', field_type: 'string', value: '' },

  // PART II – COMPUTED
  { field_code: 'total_compensation', field_name: 'Total Compensation', field_type: 'number', value: 0 },
  { field_code: 'minimum_wage', field_name: 'Minimum Wage', field_type: 'number', value: 0 },
  {
    field_code: 'holiday_overtime_night_diff_hazard',
    field_name: 'Holiday / Overtime / Night Differential / Hazard Pay',
    field_type: 'number',
    value: 0,
  },
  { field_code: 'thirteenth_month', field_name: '13th Month', field_type: 'number', value: 0 },
  { field_code: 'de_minimis', field_name: 'De Minimis', field_type: 'number', value: 0 },
  {
    field_code: 'mandatory_contributions',
    field_name: 'SSS / SIS / PHI / Mandatory Contributions',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'other_non_taxable',
    field_name: 'Other Non-Taxable Compensation',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'total_non_taxable',
    field_name: 'Total Non-Taxable Compensation',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'less_taxable_other_than_mwe',
    field_name: 'Less: Taxable Compensation Not Subject to w/tax Other Than MWEs',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'net_taxable_compensation',
    field_name: 'Net Taxable Compensation',
    field_type: 'number',
    value: 0,
  },
  {
    field_code: 'total_taxes_withheld',
    field_name: 'Total Taxes Withheld',
    field_type: 'number',
    value: 0,
  },

  // FLAGS
  { field_code: 'amended_return', field_name: 'Amended Return?', field_type: 'string', value: 'No' },
  { field_code: 'taxes_withheld_flag', field_name: 'Taxes Withheld?', field_type: 'string', value: 'No' },
  { field_code: 'tax_relief', field_name: 'Tax Relief', field_type: 'string', value: 'No' },
  { field_code: 'specify', field_name: 'Specify', field_type: 'string', value: '' },

  // PART IV – SCHEDULE
  { field_code: 'prev_month_1_date', field_name: 'Prev Month 1 Date', field_type: 'string', value: '' },
  { field_code: 'tax_paid_1', field_name: 'Tax Paid 1', field_type: 'number', value: 0 },
  { field_code: 'adjustment_1', field_name: 'Adjustment 1', field_type: 'number', value: 0 },

  { field_code: 'prev_month_2_date', field_name: 'Prev Month 2 Date', field_type: 'string', value: '' },
  { field_code: 'tax_paid_2', field_name: 'Tax Paid 2', field_type: 'number', value: 0 },
  { field_code: 'adjustment_2', field_name: 'Adjustment 2', field_type: 'number', value: 0 },

  { field_code: 'prev_month_3_date', field_name: 'Prev Month 3 Date', field_type: 'string', value: '' },
  { field_code: 'tax_paid_3', field_name: 'Tax Paid 3', field_type: 'number', value: 0 },
  { field_code: 'adjustment_3', field_name: 'Adjustment 3', field_type: 'number', value: 0 },

  { field_code: 'zipcode', field_name: 'Zipcode', field_type: 'string', value: '' },
] as const;

// this isfor FORM 2316
export const FORM_2316_TEMPLATE = [
  // META
  { field_code: 'is_generated', field_name: 'Generated?', default: 'No' },
  { field_code: 'tax_year', field_name: 'Year', default: '' },
  { field_code: 'period_start', field_name: 'Period From', default: '' },
  { field_code: 'period_end', field_name: 'Period To', default: '' },

  // EMPLOYEE INFO
  { field_code: 'employee_tin', field_name: 'Employee TIN', default: '' },
  { field_code: 'employee_name', field_name: 'Employee Name', default: '' },
  { field_code: 'employee_rdo', field_name: 'RDO', default: '' },
  { field_code: 'employee_registered_address', field_name: 'Employee Address', default: '' },
  { field_code: 'employee_registered_zip', field_name: 'Zip Registered', default: '' },
  { field_code: 'employee_local_zip', field_name: 'Zip Local', default: '' },
  { field_code: 'employee_local_address', field_name: 'Local Address', default: '' },
  { field_code: 'employee_foreign_address', field_name: 'Foreign Address', default: '' },
  { field_code: 'employee_birth_date', field_name: 'Birth Date', default: '' },
  { field_code: 'employee_contact_number', field_name: 'Contact Number', default: '' },

  // EMPLOYMENT STATUS
  { field_code: 'smw_daily_rate', field_name: 'SMW Day', default: 0 },
  { field_code: 'smw_monthly_rate', field_name: 'SMW Month', default: 0 },
  { field_code: 'is_minimum_wage_earner', field_name: 'Is MWE?', default: 'No' },

  // EMPLOYER INFO
  { field_code: 'employer_tin', field_name: 'Employer TIN', default: '' },
  { field_code: 'employer_name', field_name: 'Employer Name', default: '' },
  { field_code: 'employer_address', field_name: 'Employer Address', default: '' },
  { field_code: 'employer_zip', field_name: 'Employer Zip', default: '' },
  { field_code: 'employer_type', field_name: 'Employer Type', default: '' },

  // PREVIOUS EMPLOYER
  { field_code: 'previous_employer_tin', field_name: 'Previous Employer TIN', default: '' },
  { field_code: 'previous_employer_name', field_name: 'Previous Employer Name', default: '' },
  { field_code: 'previous_employer_address', field_name: 'Previous Employer Address', default: '' },
  { field_code: 'previous_employer_zip', field_name: 'Previous Employer Zip', default: '' },

  // SUMMARY
  { field_code: 'gross_compensation', field_name: '19 Gross Compensation', default: 0 },
  { field_code: 'total_non_taxable', field_name: '20 Less: Non-Taxable', default: 0 },
  { field_code: 'taxable_compensation', field_name: '21 Taxable Compensation', default: 0 },
  { field_code: 'previous_taxable_compensation', field_name: '22 Add: Previous Taxable', default: 0 },
  { field_code: 'gross_taxable_compensation', field_name: '23 Gross Taxable', default: 0 },
  { field_code: 'income_tax_due', field_name: '24 Tax Due', default: 0 },

  // TAX WITHHELD
  { field_code: 'tax_withheld_current_employer', field_name: '25A Tax Withheld (Present)', default: 0 },
  { field_code: 'tax_withheld_previous_employer', field_name: '25B Tax Withheld (Previous)', default: 0 },
  { field_code: 'total_tax_withheld', field_name: '26 Total Taxes', default: 0 },
  { field_code: 'tax_credit', field_name: '27 Tax Credit', default: 0 },
  { field_code: 'total_tax_withheld_after_credit', field_name: '28 Total Withheld', default: 0 },

  // NON-TAXABLE BREAKDOWN
  { field_code: 'non_taxable_basic_smw', field_name: '29 Basic / SMW', default: 0 },
  { field_code: 'non_taxable_holiday_pay', field_name: '30 Holiday Pay', default: 0 },
  { field_code: 'non_taxable_overtime_pay', field_name: '31 Overtime', default: 0 },
  { field_code: 'non_taxable_night_shift', field_name: '32 Night Shift', default: 0 },
  { field_code: 'non_taxable_hazard_pay', field_name: '33 Hazard Pay', default: 0 },
  { field_code: 'non_taxable_thirteenth_month', field_name: '34 13th Month Exempt', default: 0 },
  { field_code: 'non_taxable_de_minimis', field_name: '35 De Minimis', default: 0 },
  { field_code: 'non_taxable_contributions', field_name: '36 Contributions', default: 0 },
  { field_code: 'non_taxable_other_compensation', field_name: '37 Salaries / Other', default: 0 },
  { field_code: 'total_non_taxable_compensation', field_name: '38 Total Non-Taxable', default: 0 },

  // TAXABLE BREAKDOWN
  { field_code: 'taxable_basic_compensation', field_name: '39 Basic Taxable', default: 0 },
  { field_code: 'taxable_representation', field_name: '40 Representation', default: 0 },
  { field_code: 'taxable_transportation', field_name: '41 Transportation', default: 0 },
  { field_code: 'taxable_cola', field_name: '42 COLA', default: 0 },
  { field_code: 'taxable_housing', field_name: '43 Housing', default: 0 },

  { field_code: 'taxable_other_a_label', field_name: '44A Others', default: '' },
  { field_code: 'taxable_other_a_amount', field_name: '44A Others Amount', default: 0 },
  { field_code: 'taxable_other_b_label', field_name: '44B Others', default: '' },
  { field_code: 'taxable_other_b_amount', field_name: '44B Others Amount', default: 0 },

  { field_code: 'taxable_commission', field_name: '45 Commission', default: 0 },
  { field_code: 'taxable_profit_sharing', field_name: '46 Profit Sharing', default: 0 },
  { field_code: 'taxable_fees', field_name: '47 Fees', default: 0 },
  { field_code: 'taxable_thirteenth_month', field_name: '48 Taxable 13th Month', default: 0 },
  { field_code: 'taxable_hazard_pay', field_name: '49 Hazard (Taxable)', default: 0 },
  { field_code: 'taxable_overtime_pay', field_name: '50 Overtime (Taxable)', default: 0 },

  { field_code: 'taxable_other_a_label', field_name: '51A Others', default: '' },
  { field_code: 'taxable_other_a_amount', field_name: '51A Others Amount', default: 0 },
  { field_code: 'taxable_other_b_label', field_name: '51B Others', default: '' },
  { field_code: 'taxable_other_b_amount', field_name: '51B Others Amount', default: 0 },

  { field_code: 'total_taxable_compensation', field_name: '52 Total Taxable', default: 0 },
] as const;