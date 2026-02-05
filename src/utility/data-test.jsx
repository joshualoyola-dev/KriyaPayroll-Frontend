
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


// --- MOCK 1601C FORM CONTENTS ---
// this is a json snapshot of one singular 1601c form
export const mockForm1601cContents = () => {
  const row = {};

  // --- PART I – BASIC INFO ---
  row['is_generated'] = 'Yes';
  row['month'] = '01';
  row['year'] = '2025';
  row['sheets_attached'] = 1;
  row['company_tin'] = 'TIN123456789';
  row['rdo'] = 'RDO123';
  row['company_name'] = 'Fullsuite';
  row['company_address'] = '5th Fl, Fullsuite Pod, Kisad Rd, Ben Palispis Hwy, B2600, Benguet';
  row['company_phone'] = '+1-555-123-4567';
  row['company_email'] = 'fullsuite@getfullsuite.com';

  // --- FLAGS ---
  row['specify'] = '';
  row['amended_return'] = 'No';
  row['taxes_withheld'] = 'Yes';
  row['category'] = 'Private';
  row['tax_relief'] = 'No';

  // --- PART II – COMPENSATION ---
  row['total_compensation'] = 16000;
  row['minimum_wage'] = 5000;
  row['holiday_pay'] = 500;
  row['overtime_pay'] = 1000;
  row['night_diff_nd_hazard'] = 200;
  row['thirteenth_month'] = 1000;
  row['de_minimis'] = 500;
  row['mandatory_contributions'] = 1000;
  row['other_non_taxable'] = 300;
  row['taxable_not_subject'] = 800;
  row['holiday_ot_nd_hazard'] = row['holiday_pay'] + row['overtime_pay'] + row['night_diff_nd_hazard'];
  row['total_non_taxable'] =
    row['minimum_wage'] + row['holiday_ot_nd_hazard'] + row['thirteenth_month'] + row['de_minimis'] + row['mandatory_contributions'] + row['other_non_taxable'];
  row['total_taxable_compensation'] = row['total_compensation'] - row['total_non_taxable'] - row['taxable_not_subject'];
  row['less_exempt'] = 0;
  row['net_taxable'] = row['total_taxable_compensation'];
  row['tax_withheld'] = 1000;
  row['adjustment'] = 0;
  row['tax_remittance'] = 1000;
  row['previous_remitted'] = 0;
  row['other_remit'] = 0;
  row['total_remit'] = 1000;
  row['tax_due'] = 500;

  // --- PART III – PENALTIES ---
  row['surcharge'] = 0;
  row['interest'] = 0;
  row['compromise'] = 0;
  row['total_penalties'] = 0;
  row['total_amount_due'] = row['tax_due'] + row['total_penalties'];

  // --- PART IV – SCHEDULE ---
  row['prev_month_1'] = '01/2025';
  row['date_paid_1'] = '01/02/2026';
  row['bank_1'] = 'Bank of Test';
  row['ref_1'] = 'REF1';
  row['tax_paid_1'] = 500;
  row['tax_due_1'] = 500;
  row['adjustment_1'] = 0;

  row['prev_month_2'] = '02/2025';
  row['date_paid_2'] = '02/02/2026';
  row['bank_2'] = 'Bank of Test';
  row['ref_2'] = 'REF2';
  row['tax_paid_2'] = 500;
  row['tax_due_2'] = 500;
  row['adjustment_2'] = 0;

  row['prev_month_3'] = '03/2025';
  row['date_paid_3'] = '03/02/2026';
  row['bank_3'] = 'Bank of Test';
  row['ref_3'] = 'REF3';
  row['tax_paid_3'] = 500;
  row['tax_due_3'] = 500;
  row['adjustment_3'] = 0;

  row['total_adjustment'] = 0;

  // --- PAYMENT DETAILS ---
  row['zipcode'] = '2600';
  row['payment_type'] = 'Check';
  row['pay_bank'] = 'Fullsuite Bank';
  row['pay_number'] = 'CHK123456';
  row['pay_date'] = '02/05/2026';
  row['pay_amount'] = row['tax_remittance'];
  row['others'] = 'N/A';

  return row;
};

// mock saved 1601c form
// this is one singular 1601c form. to be placed in history
// in history: snapshot will not be included unless clicked on
export const mockForm1601 = () => ({
  id: 12345,
  form_type: '1601C',
  status: 'DRAFT',
  period_from: '2026-01-01T00:00:00.000Z',
  period_to: '2026-01-31T23:59:59.999Z',
  created_by_user_id: 7,
  form_data_snapshot: mockForm1601cContents(),
  rejection_reason: null,
  created_at: '2026-02-05T02:00:00.000Z',
  updated_at: '2026-02-05T02:00:00.000Z'
});

// --- JSX RENDER TEST ---
export const mockForm1601cDiv = () => {
  const data = mockForm1601();
  return <div><pre>{JSON.stringify(data, null, 2)}</pre></div>;
};


// list of multiple forms
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
