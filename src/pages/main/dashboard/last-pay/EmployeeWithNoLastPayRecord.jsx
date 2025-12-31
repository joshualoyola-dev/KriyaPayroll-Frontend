import { usePayrunContext } from "../../../../contexts/PayrunProvider";
import { formatDateToWords } from "../../../../utility/datetime.utility";

const EmployeeWithNoLastPayRecord = ({ className }) => {
    const { employeesWithNoLastPay, employeeLoading } = usePayrunContext();

    const SkeletonItem = () => (
        <div className="animate-pulse bg-white border border-gray-200 flex justify-between rounded-md p-3 text-sm">
            <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-1 text-xs flex flex-col justify-between">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );

    return (
        <div className={`bg-white rounded-lg p-4 flex flex-col ${className}`}>
            {/* Title stays fixed */}
            <div className="text-sm font-bold text-gray-700 mb-3">
                Inactive Employees (No Last Pay Runs)
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3">
                {employeeLoading ? (
                    <>
                        <SkeletonItem />
                        <SkeletonItem />
                        <SkeletonItem />
                    </>
                ) : employeesWithNoLastPay.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        No inactive employees found.
                    </div>
                ) : (
                    employeesWithNoLastPay.map((employee) => (
                        <div
                            key={employee.employee_id}
                            className="bg-white border border-gray-200 flex justify-between rounded-md p-3 text-sm"
                        >
                            <div>
                                <div className="font-medium text-gray-800">
                                    {employee.first_name} {employee.last_name}
                                </div>
                                <div className="text-gray-500 text-xs mb-2">
                                    ID: {employee.employee_id}
                                </div>
                            </div>
                            <div className="text-gray-600 text-xs space-y-1">
                                <div>Hired: {formatDateToWords(employee.date_hired)}</div>
                                <div>Ended: {employee.date_end ? formatDateToWords(employee.date_end) : 'None'}</div>
                                <div>Last Pay: {employee.release_date ? formatDateToWords(employee.release_date) : 'None'}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmployeeWithNoLastPayRecord;
