
const serializeTableGeneral = (table) => {
  const obj = {};
  for (const [id, inner] of table) {
    obj[id] = Object.fromEntries(inner);
  }
  return obj;
};

export const mockSum1601c = () => {
  const company_id = 'OCBPO';

  const row = new Map();

  // Company info
  row.set('company_name', 'Fullsuite');
  row.set('company_email', 'fullsuite@getfullsuite.com');
  row.set('company_tin', 'TIN123456789');
  row.set('company_phone', '+1-555-123-4567');
  row.set(
    'company_address',
    '5th Fl, Fullsuite Pod, Kisad Rd, Ben Palispis Hwy, B2600, Benguet'
  );

  const total_compensation = 16000;
  const total_taxes = 1000;
  const minimum_wage = 0;
  const holiday_pay = 500;
  const overtime_pay = 1000;
  const night_diff_nd_hazard = 2000;
  const de_minimis = 0;
  const mandatory_contributions = 1000;
  const thirteenth_month = 1000;
  const other_non_taxable = 1000;
  const taxable_not_subject = 1000;

  const holiday_ot_nd_hazard =
    holiday_pay + overtime_pay + night_diff_nd_hazard;

  const total_non_taxable =
    minimum_wage +
    holiday_ot_nd_hazard +
    thirteenth_month +
    de_minimis +
    mandatory_contributions +
    other_non_taxable;

  const net_taxable_compensation =
    total_compensation - total_non_taxable - taxable_not_subject;

  row.set('total_compensation', total_compensation);
  row.set('total_taxes', total_taxes);
  row.set('minimum_wage', minimum_wage);
  row.set('holiday_pay', holiday_pay);
  row.set('overtime_pay', overtime_pay);
  row.set('night_diff_nd_hazard', night_diff_nd_hazard);
  row.set('thirteenth_month', thirteenth_month);
  row.set('de_minimis', de_minimis);
  row.set('mandatory_contributions', mandatory_contributions);
  row.set('other_non_taxable', other_non_taxable);
  row.set('taxable_not_subject', taxable_not_subject);

  row.set('holiday_ot_nd_hazard', holiday_ot_nd_hazard);
  row.set('total_non_taxable', total_non_taxable);
  row.set('net_taxable_compensation', net_taxable_compensation);

  row.set('gross_compensation', total_compensation);
  row.set('taxable_compensation', net_taxable_compensation);

  return serializeTableGeneral(new Map([[company_id, row]]));
};

export const mockSum2316 = () => {
  const result = new Map();

  const employees = [
    { employee_id: 'emp-001', last_name: 'Garcia', first_name: 'Juan', middle_name: 'D' },
    { employee_id: 'emp-002', last_name: 'Reyes', first_name: 'Maria', middle_name: 'S' },
    { employee_id: 'emp-003', last_name: 'Lopez', first_name: 'Carlos', middle_name: null },
  ];

  for (const emp of employees) {
    const row = new Map();

    const total_compensation = 25000 + Math.floor(Math.random() * 10000);
    const total_taxes_withheld = Math.floor(total_compensation * 0.1);
    const minimum_wage = 10000;
    const holiday_pay = 500;
    const overtime_pay = 1000;
    const nightDiffNdHazard = 200;
    const thirteenth_month = 1000;
    const de_minimis = 500;
    const mandatory_contributions = 1200;
    const other_non_taxable = 300;
    const taxable_not_subject = 800;

    const holidayOtNdHazard = holiday_pay + overtime_pay + nightDiffNdHazard;
    const total_non_taxable =
      minimum_wage + holidayOtNdHazard + thirteenth_month + de_minimis + mandatory_contributions + other_non_taxable;
    const net_taxable_compensation = total_compensation - total_non_taxable - taxable_not_subject;

    row.set('total_compensation', total_compensation);
    row.set('total_taxes_withheld', total_taxes_withheld);
    row.set('minimum_wage', minimum_wage);
    row.set('holiday_pay', holiday_pay);
    row.set('holiday_overtime_night_diff_hazard', holidayOtNdHazard);
    row.set('thirteenth_month', thirteenth_month);
    row.set('de_minimis', de_minimis);
    row.set('mandatory_contributions', mandatory_contributions);
    row.set('other_non_taxable', other_non_taxable);
    row.set('taxable_not_subject', taxable_not_subject);
    row.set('total_non_taxable', total_non_taxable);
    row.set('net_taxable_compensation', net_taxable_compensation);

    // 2316 aliases
    row.set('gross_compensation', total_compensation);
    row.set('taxable_compensation', net_taxable_compensation);
    row.set('total_taxes', total_taxes_withheld);

    const employeeName = [emp.last_name, emp.first_name, emp.middle_name || ''].filter(Boolean).join(', ');
    row.set('employee_name', employeeName);

    result.set(emp.employee_id, row);
  }

  return serializeTableGeneral(result);
};

export const mockSum1601cDiv = () => {
  const data = mockSum1601c();
    return <div><pre>{JSON.stringify(data, null, 2)}</pre>; </div>;
}

export const mockSum2316Div = () => {
  const data = mockSum2316();
    return <div><pre>{JSON.stringify(data, null, 2)}</pre>; </div>;
}

import { FORM_1601C_TEMPLATE } from './form1601c_template';

// --- UTILITY: convert template array to Map ---
const templateToMap = (template) => {
  const map = new Map();
  for (const field of template) {
    map.set(field.field_code, field.value);
  }
  return map;
};

// --- MOCK 1601C FORM ---
export const mockForm1601c = () => {
  const row = templateToMap(FORM_1601C_TEMPLATE);

  // Fill company info
  row.set('company_name', 'Fullsuite');
  row.set('company_email', 'fullsuite@getfullsuite.com');
  row.set('company_tin', 'TIN123456789');
  row.set('company_phone', '+1-555-123-4567');
  row.set('company_address', '5th Fl, Fullsuite Pod, Kisad Rd, Ben Palispis Hwy, B2600, Benguet');

  // Fill Part II – Compensation
  const total_compensation = 16000;
  const minimum_wage = 5000;
  const holiday_pay = 500;
  const overtime_pay = 1000;
  const night_diff_nd_hazard = 200;
  const thirteenth_month = 1000;
  const de_minimis = 500;
  const mandatory_contributions = 1000;
  const other_non_taxable = 300;
  const taxable_not_subject = 800;

  const holiday_ot_nd_hazard = holiday_pay + overtime_pay + night_diff_nd_hazard;
  const total_non_taxable =
    minimum_wage + holiday_ot_nd_hazard + thirteenth_month + de_minimis + mandatory_contributions + other_non_taxable;
  const net_taxable_compensation = total_compensation - total_non_taxable - taxable_not_subject;

  row.set('total_compensation', total_compensation);
  row.set('minimum_wage', minimum_wage);
  row.set('holiday_pay', holiday_pay);
  row.set('thirteenth_month', thirteenth_month);
  row.set('de_minimis', de_minimis);
  row.set('mandatory_contributions', mandatory_contributions);
  row.set('other_non_taxable', other_non_taxable);
  row.set('total_non_taxable', total_non_taxable);
  row.set('total_taxable_compensation', net_taxable_compensation);
  row.set('net_taxable', net_taxable_compensation);
  row.set('tax_withheld', 1000);
  row.set('tax_remittance', 1000);
  row.set('total_remit', 1000);
  row.set('tax_due', 500);

  // PART III – Penalties
  row.set('surcharge', 0);
  row.set('interest', 0);
  row.set('compromise', 0);
  row.set('total_penalties', 0);
  row.set('total_amount_due', row.get('tax_due') + row.get('total_penalties'));

  // PART IV – Schedule (mock 3 months)
  // Month 1
row.set(`prev_month_1`, `01/2025`);
row.set(`date_paid_1`, `01/02/2026`);
row.set(`bank_1`, 'Bank of Test');
row.set(`ref_1`, `REF1`);
row.set(`tax_paid_1`, 500);
row.set(`tax_due_1`, 500);
row.set(`adjustment_1`, 0);

// Month 2
row.set(`prev_month_2`, `02/2025`);
row.set(`date_paid_2`, `02/02/2026`);
row.set(`bank_2`, 'Bank of Test');
row.set(`ref_2`, `REF2`);
row.set(`tax_paid_2`, 500);
row.set(`tax_due_2`, 500);
row.set(`adjustment_2`, 0);

// Month 3
row.set(`prev_month_3`, `03/2025`);
row.set(`date_paid_3`, `03/02/2026`);
row.set(`bank_3`, 'Bank of Test');
row.set(`ref_3`, `REF3`);
row.set(`tax_paid_3`, 500);
row.set(`tax_due_3`, 500);
row.set(`adjustment_3`, 0);

  row.set('total_adjustment', 0);

  // Payment details
  row.set('zipcode', '2600');
  row.set('payment_type', 'Check');
  row.set('pay_bank', 'Fullsuite Bank');
  row.set('pay_number', 'CHK123456');
  row.set('pay_date', '02/05/2026');
  row.set('pay_amount', row.get('tax_remittance'));
  row.set('others', 'N/A');

  return Object.fromEntries(row); // return as plain object
};

// --- JSX RENDER TEST ---
export const mockForm1601cDiv = () => {
  const data = mockForm1601c();
  return <div><pre>{JSON.stringify(data, null, 2)}</pre></div>;
};


// mock saved 1601c form
export const mockForm = () => ({
  id: 12345,
  form_type: '1601C',
  status: 'DRAFT',
  period_from: '2026-01-01T00:00:00.000Z',
  period_to: '2026-01-31T23:59:59.999Z',
  created_by_user_id: 7,
  form_data_snapshot: mockForm1601c(),
  rejection_reason: null,
  created_at: '2026-02-05T02:00:00.000Z',
  updated_at: '2026-02-05T02:00:00.000Z'
});

export const mockFormList = () => ([
  {
    id: 12345,
    form_type: '1601C',
    status: 'DRAFT',
    period_from: '2026-01-01T00:00:00.000Z',
    period_to: '2026-01-31T23:59:59.999Z',
    created_by_user_id: 7,
    rejection_reason: null,
    created_at: '2026-02-05T02:00:00.000Z'
  },
  {
    id: 12344,
    form_type: '2316',
    status: 'APPROVED',
    period_from: '2025-01-01T00:00:00.000Z',
    period_to: '2025-12-31T23:59:59.999Z',
    created_by_user_id: 4,
    rejection_reason: null,
    created_at: '2025-12-31T23:00:00.000Z'
  }
]);

export const mockFormDetail = () => ({
  id: 12345,
  form_type: '1601C',
  status: 'SUBMITTED',
  period_from: '2026-01-01T00:00:00.000Z',
  period_to: '2026-01-31T23:59:59.999Z',
  created_by_user_id: 7,
  form_data_snapshot: {
    company_name: 'Fullsuite',
    total_earnings: 120000,
    total_taxes: 15000,
    notes: 'Draft form for review'
  },
  rejection_reason: null,
  created_at: '2026-02-05T02:00:00.000Z',
  updated_at: '2026-02-05T03:00:00.000Z'
});