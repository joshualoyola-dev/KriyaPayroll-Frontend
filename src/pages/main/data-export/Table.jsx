import { useEmployeeContext } from "../../../contexts/EmployeeProvider";
import { usePayitemContext } from "../../../contexts/PayitemProvider";

const isTotalColumn = (payitem_id) => {
    if (!payitem_id) return false;
    if (payitem_id.startsWith("total_")) return true;
    return ["total_earnings", "total_deductions", "total_taxes", "net_salary"].includes(
        payitem_id
    );
};

const DataExportTable = ({ data, setData }) => {
    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    const employee_ids = Object.keys(data).sort((a, b) => {
        const numA = parseInt(a.split("-").pop(), 10);
        const numB = parseInt(b.split("-").pop(), 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
    });

    const payitem_ids = Array.from(
        new Set(employee_ids.flatMap((employee_id) => Object.keys(data[employee_id] || {})))
    );

    const { mapPayitemIdToPayitemName } = usePayitemContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();

    const handleChange = (employee_id, payitem_id, value) => {
        if (!setData) return;
        if (isTotalColumn(payitem_id)) return;

        setData((prev) => {
            const prevRow = prev?.[employee_id] || {};
            return {
                ...prev,
                [employee_id]: {
                    ...prevRow,
                    [payitem_id]: value,
                },
            };
        });
    };

    return (
        <div className="overflow-x-auto max-h-screen">
            <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100 sticky top-0 z-20">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium sticky left-0 bg-gray-100 z-30">
                            Employee
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium">
                            Employee Id
                        </th>
                        {payitem_ids.map((payitem_id) => (
                            <th
                                key={payitem_id}
                                className="border border-gray-300 px-4 py-2 text-left font-medium"
                            >
                                {mapPayitemIdToPayitemName(payitem_id)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employee_ids.map((employee_id) => (
                        <tr key={employee_id} className="odd:bg-white even:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 sticky left-0 bg-inherit z-10">
                                {mapEmployeeIdToEmployeeName(employee_id)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{employee_id}</td>
                            {payitem_ids.map((payitem_id) => {
                                const value = data[employee_id]?.[payitem_id] ?? "";
                                const locked = isTotalColumn(payitem_id);

                                return (
                                    <td key={payitem_id} className="border border-gray-300 px-2 py-1">
                                        {locked ? (
                                            <div className="text-right font-semibold text-gray-700">
                                                {value}
                                            </div>
                                        ) : (
                                            <input
                                                type="number"
                                                className="w-full border border-gray-200 rounded px-2 py-1 text-right text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                value={value}
                                                onChange={(e) =>
                                                    handleChange(employee_id, payitem_id, e.target.value)
                                                }
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataExportTable;