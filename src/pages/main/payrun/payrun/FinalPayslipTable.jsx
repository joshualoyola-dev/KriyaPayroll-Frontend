import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import { usePayslipContext } from "../../../../contexts/PayslipProvider";

const FinalPayslipTable = () => {
    const headers = ["Select", "Name", "Taxes", "Deductions", "Earnings", "Net Pay"];
    const {
        payslips,
        selectedEmployeeIds,
        handleToggleEmployee,
        handleSelectAll,
        handleDeselectAll
    } = usePayslipContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();

    const allSelected = payslips.length > 0 && selectedEmployeeIds.length === payslips.length;
    const someSelected = selectedEmployeeIds.length > 0 && selectedEmployeeIds.length < payslips.length;

    return (
        <div className="w-full">
            {/* Selection Controls */}
            {payslips.length > 0 && (
                <div className="mb-4 flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                        {selectedEmployeeIds.length} of {payslips.length} selected
                    </span>
                </div>
            )}

            <div className="w-full rounded-2xl border border-gray-200 overflow-hidden">
                <table className="min-w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                        <tr>
                            {headers.map((header, idx) => (
                                <th
                                    key={header}
                                    scope="col"
                                    className={`px-4 py-3 font-medium ${idx === 0 ? 'w-16' : ''}`}
                                >
                                    {header === "Select" ? (
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            ref={input => {
                                                if (input) {
                                                    input.indeterminate = someSelected;
                                                }
                                            }}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    handleSelectAll();
                                                } else {
                                                    handleDeselectAll();
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-teal-600  cursor-pointer"
                                        />
                                    ) : (
                                        header
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {payslips.length > 0 ? (
                            payslips.map((payslip, idx) => (
                                <tr
                                    key={idx}
                                    className={`hover:bg-gray-50 transition-colors ${selectedEmployeeIds.includes(payslip.employee_id)
                                        ? 'bg-blue-50'
                                        : ''
                                        }`}
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployeeIds.includes(payslip.employee_id)}
                                            onChange={() => handleToggleEmployee(payslip.employee_id)}
                                            className="w-4 h-4 rounded border-gray-300 text-teal-600 cursor-pointer"
                                        />
                                    </td>
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
        </div>
    );
};

export default FinalPayslipTable;