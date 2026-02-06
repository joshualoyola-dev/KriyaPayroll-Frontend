import { useEffect, useRef, useState } from "react";
import { useEmployeeContext } from "../../../contexts/EmployeeProvider";

const PAYRUN_STATUS_OPTIONS = ["APPROVED", "DRAFT", "FOR_APPROVAL", "REJECTED"];

/**
 * Shared generate form fields for YTD / 2316 / 1601C. No hardcoded values—driven by props.
 */
const DataExportGenerateForm = ({
    dateStart,
    dateEnd,
    onDateStartChange,
    onDateEndChange,
    activeEmployees,
    onActiveEmployeesChange,
    payrunPaymentOrPeriod,
    onPayrunPaymentOrPeriodChange,
    payrunStatus,
    onPayrunStatusToggle,
    employeeIds,
    onEmployeeToggle,
    onSubmit,
    loading,
}) => {
    const { employees, mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
    const statusDropdownRef = useRef(null);
    const employeeDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
                setStatusDropdownOpen(false);
            }
            if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(e.target)) {
                setEmployeeDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 p-3">
            <div className="flex flex-col">
                <label className="mb-1 text-xs font-medium text-gray-700">From</label>
                <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => onDateStartChange(e.target.value)}
                    className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 text-xs font-medium text-gray-700">To</label>
                <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => onDateEndChange(e.target.value)}
                    className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 text-xs font-medium text-gray-700">Employees</label>
                <select
                    value={activeEmployees === true ? "true" : "false"}
                    onChange={(e) => onActiveEmployeesChange(e.target.value === "true")}
                    className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                >
                    <option value="false">All employees (active & inactive)</option>
                    <option value="true">Active employees only</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="mb-1 text-xs font-medium text-gray-700">Export method</label>
                <select
                    value={payrunPaymentOrPeriod}
                    onChange={(e) => onPayrunPaymentOrPeriodChange(e.target.value)}
                    className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                >
                    <option value="PAYMENT">Payment</option>
                    <option value="PERIOD">Payrun Period</option>
                </select>
            </div>
            <div className="relative flex flex-col" ref={statusDropdownRef}>
                <label className="mb-1 text-xs font-medium text-gray-700">Payrun Status</label>
                <button
                    type="button"
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                >
                    Payrun status
                </button>
                {statusDropdownOpen && (
                    <div className="absolute top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50 py-1">
                        {PAYRUN_STATUS_OPTIONS.map((status) => (
                            <label
                                key={status}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={payrunStatus.includes(status)}
                                    onChange={() => onPayrunStatusToggle(status)}
                                    className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                {status}
                            </label>
                        ))}
                    </div>
                )}
            </div>
            <div className="relative flex flex-col" ref={employeeDropdownRef}>
                <label className="mb-1 text-xs font-medium text-gray-700">Employee Selection</label>
                <button
                    type="button"
                    onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
                    className="w-48 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                >
                    Select Employee
                </button>
                {employeeDropdownOpen && (
                    <div className="absolute top-full mt-1 w-56 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                        <div className="px-3 py-2 text-xs italic text-gray-500 border-b border-gray-200">
                            Select employees to include in the export.
                        </div>
                        <div className="divide-y divide-gray-100">
                            {(employees ?? []).map((emp) => (
                                <label
                                    key={emp.employee_id}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={employeeIds.includes(emp.employee_id)}
                                        onChange={() => onEmployeeToggle(emp.employee_id)}
                                        className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                    />
                                    {mapEmployeeIdToEmployeeName(emp.employee_id)}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Generating..." : "Generate"}
            </button>
        </form>
    );
};

export default DataExportGenerateForm;
