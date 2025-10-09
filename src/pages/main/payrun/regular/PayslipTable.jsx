import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";

const PayslipTable = ({ data, setData }) => {
    const employee_ids = Object.keys(data);
    const payitem_ids = Array.from(
        new Set(employee_ids.flatMap((employee_id) => Object.keys(data[employee_id])))
    ).sort((a, b) => {
        const numA = parseInt(a.split("-").pop(), 10);
        const numB = parseInt(b.split("-").pop(), 10);
        return numA - numB;
    });

    const { mapPayitemIdToPayitemName } = usePayitemContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();

    const handleChange = (employee_id, payitem_id, value) => {
        // Only allow numbers (empty string is allowed too)
        const numericValue = value.replace(/[^0-9]/g, "");
        setData((prev) => ({
            ...prev,
            [employee_id]: {
                ...prev[employee_id],
                [payitem_id]: numericValue,
            },
        }));
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium">
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
                            <td className="border border-gray-300 px-4 py-2">{mapEmployeeIdToEmployeeName(employee_id)}</td>

                            <td className="border border-gray-300 px-4 py-2">{employee_id}</td>
                            {payitem_ids.map((payitem_id) => (
                                <td key={payitem_id} className="border border-gray-300 px-2 py-1">
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        value={data[employee_id][payitem_id] ?? ""}
                                        onChange={(e) =>
                                            handleChange(employee_id, payitem_id, e.target.value)
                                        }
                                        className="w-full roundedpx-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PayslipTable;
