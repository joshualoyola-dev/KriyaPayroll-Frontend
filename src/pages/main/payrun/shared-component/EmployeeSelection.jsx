import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import { useSharedRunningPayrunOperationContext } from "../../../../contexts/SharedRunningPayrunOperationProvider";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

const EmployeeSelection = () => {
    const {
        options,
        handleEmployeeIdsChange,
        toggleEmployeeSelections,
        handleToggleEmployeeSelections
    } = useSharedRunningPayrunOperationContext();

    const { employees } = useEmployeeContext();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (toggleEmployeeSelections) {
                    handleToggleEmployeeSelections(); // close dropdown
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleEmployeeSelections, handleToggleEmployeeSelections]);

    return (
        <div className="space-y-2 relative w-full max-w-xs" ref={dropdownRef}>
            <label className="block text-xs font-medium text-gray-700">
                Employees
            </label>

            <div className="relative">
                {/* Dropdown Button */}
                <div
                    onClick={handleToggleEmployeeSelections}
                    className="flex justify-between items-center w-full px-3 py-2.5 border border-gray-300 rounded-3xl text-sm bg-white cursor-pointer text-gray-700 hover:border-gray-400 transition-all"
                >
                    <p>Select Employees</p>
                    {toggleEmployeeSelections ? (
                        <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                    )}
                </div>

                {/* Dropdown List */}
                {toggleEmployeeSelections && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-2xl space-y-1 shadow-lg max-h-96 overflow-y-auto py-2">
                        {employees.map((employee) => {
                            const isSelected = options.employee_ids.includes(
                                employee.employee_id
                            );

                            return (
                                <div
                                    key={employee.employee_id}
                                    onClick={() => handleEmployeeIdsChange(employee.employee_id)}
                                    className={`flex justify-between items-center px-3 py-2 cursor-pointer rounded-xl transition-colors ${isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <PlusCircleIcon className={`w-4 h-4 ${isSelected ? "text-white" : "text-gray-400"}`} />
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold">{`${employee.first_name} ${employee.last_name}`}</p>
                                            <p className="text-xs text-gray-500">{employee.employee_id}</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`text-xs font-medium px-2 py-1 rounded-lg ${employee.employement_status
                                            ? isSelected
                                                ? "bg-white text-blue-600"
                                                : "bg-green-100 text-green-800"
                                            : isSelected
                                                ? "bg-white text-blue-600"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {employee.employement_status ? "Active" : "Inactive"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}


export default EmployeeSelection;