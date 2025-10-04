import { UserIcon } from "@heroicons/react/24/solid";
import { convertToISO8601 } from "../../../../utility/datetime.utility";
import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";

const AttendanceList = ({ attendances }) => {
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    return (
        <div className="w-full space-y-3">
            {attendances.map((att, idx) => (
                <div
                    key={idx}
                    className="group flex items-center justify-between px-2 py-1 rounded-2xl border border-gray-100 bg-white"
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 p-0.5 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {mapEmployeeIdToEmployeeName(att.employee_id)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {convertToISO8601(att.attendance_date)}
                            </p>
                        </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="text-sm font-semibold">
                                {att.hours_worked}h
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceList;