import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";

const FinalPayslipTable = ({ payslips = [] }) => {
    const headers = ["Name", "Taxes", "Deductions", "Earnings", "Net Pay"];
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();

    return (
        <div className="w-full rounded-2xl border border-gray-200 overflow-hidden">
            <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                scope="col"
                                className="px-4 py-3 font-medium"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {payslips.length > 0 ? (
                        payslips.map((payslip, idx) => (
                            <tr
                                key={idx}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-3">{mapEmployeeIdToEmployeeName(payslip.employee_id)}</td>
                                <td className="px-4 py-3">{payslip.total_taxes}</td>
                                <td className="px-4 py-3">{payslip.total_deductions}</td>
                                <td className="px-4 py-3">{payslip.total_earnings}</td>
                                <td className="px-4 py-3">{payslip.net_salary}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={headers.length}
                                className="px-4 py-6 text-center text-gray-400"
                            >
                                No payslips available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FinalPayslipTable;
