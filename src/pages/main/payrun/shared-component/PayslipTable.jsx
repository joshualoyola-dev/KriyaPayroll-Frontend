import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";

const PayslipTable = ({ data, setData }) => {
    // const employee_ids = Object.keys(data);
    const employee_ids = Object.keys(data).sort((a, b) => {
        const numA = parseInt(a.split("-").pop(), 10);
        const numB = parseInt(b.split("-").pop(), 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
    });
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
        // Allow numbers, one decimal point, and an optional leading minus sign
        const numericValue = value
            .replace(/(?!^)-|[^0-9.-]/g, "")
            .replace(/(\..*)\./g, "$1");

        setData((prev) => ({
            ...prev,
            [employee_id]: {
                ...prev[employee_id],
                [payitem_id]: numericValue,
            },
        }));
    };

    return (
        <div className="overflow-x-auto max-h-screen overflow-y-auto">
            <table className="border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium sticky left-0 top-0 z-30 bg-gray-100 shadow-sm whitespace-nowrap">
                            Employee
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-medium sticky left-40 top-0 z-30 bg-gray-100 shadow-sm whitespace-nowrap">
                            Employee Id
                        </th>
                        {payitem_ids.map((payitem_id) => (
                            <th
                                key={payitem_id}
                                className="border border-gray-300 px-4 py-2 text-left font-medium sticky top-0 z-20 bg-gray-100 shadow-sm whitespace-nowrap min-w-[120px]"
                            >
                                {mapPayitemIdToPayitemName(payitem_id)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employee_ids.map((employee_id, index) => (
                        <tr key={employee_id} className="odd:bg-white even:bg-gray-50">
                            <td className={`border border-gray-300 px-4 py-2 sticky left-0 z-20 whitespace-nowrap
                                 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                {mapEmployeeIdToEmployeeName(employee_id)}
                            </td>

                            <td className={`border border-gray-300 px-4 py-2 sticky left-40 z-20 whitespace-nowrap
                                 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                {employee_id}
                            </td>
                            {payitem_ids.map((payitem_id) => (
                                <td key={payitem_id} className="border border-gray-300 px-2 py-1 min-w-[120px]">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={data[employee_id][payitem_id] ?? ""}
                                        onChange={(e) => handleChange(employee_id, payitem_id, e.target.value)}
                                        className="w-full rounded px-2 py-1 text-sm"
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