
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
