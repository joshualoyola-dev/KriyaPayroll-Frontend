import { convertToISO8601 } from "../../../../utility/datetime.utility";
import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";

const AttendanceList = ({ attendances }) => {
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();

    return (
        <div className="overflow-x-auto w-full">
            {/* Fixed header table */}
            <div className="max-h-[500px] overflow-y-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">
                                Employee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">
                                Attendance Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 tracking-wider">
                                Hours Worked
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 tracking-wider">
                                Night Differential
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendances.map((att, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                                    <div className="text-sm font-medium text-gray-900">
                                        {mapEmployeeIdToEmployeeName(att.employee_id)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {convertToISO8601(att.attendance_date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="inline-flex items-center px-3 py-1.5 text-sm text-gray-500">
                                        {att.hours_worked}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="inline-flex items-center px-3 py-1.5 text-sm text-gray-500">
                                        {att.night_differential}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceList;
