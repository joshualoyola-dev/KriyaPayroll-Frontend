import { useEmployeeContext } from "../../../contexts/EmployeeProvider";
import { usePayitemContext } from "../../../contexts/PayitemProvider";

const DataExportTable = ({ data, setData }) => {
    const employee_ids = Object.keys(data);
    const payitem_ids = Array.from(
        new Set(employee_ids.flatMap((employee_id) => Object.keys(data[employee_id])))
    );

    const { mapPayitemIdToPayitemName } = usePayitemContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
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
                                    {data[employee_id][payitem_id]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataExportTable;
