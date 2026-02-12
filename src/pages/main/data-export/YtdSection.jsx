import { useState, useRef, useEffect } from "react";
import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import { useYtdContext } from "../../../contexts/YtdProvider";
import DataExportTable from "./Table";
import { useEmployeeContext } from "../../../contexts/EmployeeProvider";
import Tooltip from "../../../components/Tooltip";

const statuses = ['APPROVED', 'DRAFT', 'FOR_APPROVAL', 'REJECTED'];

const YtdSection = () => {
    const { dateRangeFormData, setDateRangeFormData, handleGenerateYTD, ytds, setYtds, handleDownload, ytdsLoading, downloadLoading } = useYtdContext();
    const { mapEmployeeIdToEmployeeName, employees } = useEmployeeContext();

    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);

    const statusDropdownRef = useRef(null);
    const employeeDropdownRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleGenerateYTD();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setStatusDropdownOpen(false);
            }
            if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
                setEmployeeDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const toggleStatus = (status) => {
        setDateRangeFormData(prev => ({
            ...prev,
            payrun_status: prev.payrun_status.includes(status)
                ? prev.payrun_status.filter(s => s !== status)
                : [...prev.payrun_status, status]
        }));
    };

    const toggleEmployee = (employee_id) => {
        setDateRangeFormData(prev => ({
            ...prev,
            employee_ids: prev.employee_ids.includes(employee_id)
                ? prev.employee_ids.filter(e => e !== employee_id)
                : [...prev.employee_ids, employee_id]
        }));
    };

    return (
        <div className="flex flex-col">
            {/* Top controls row */}
            <div className="flex items-end justify-between gap-4 p-3">
                {/* Date range form */}
                <form onSubmit={handleSubmit} className="flex items-end gap-4">
                    {/* From Date */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">From</label>
                        <input
                            value={dateRangeFormData.date_start}
                            onChange={(e) => setDateRangeFormData(prev => ({ ...prev, date_start: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    {/* To Date */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">To</label>
                        <input
                            value={dateRangeFormData.date_end}
                            onChange={(e) => setDateRangeFormData(prev => ({ ...prev, date_end: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    {/* Active only at export date or All at export period*/}
                    <div className="flex flex-col">
                        <Tooltip text={`Filter to active employees only when the export was made. 
                           When active, use case include 13th month pay YTD.
                           When false, use case include export on all payslips made between defined period, from which we can derive the total per payitems `}
                        >
                            <label className="mb-1 text-xs font-medium text-gray-700">Active Employees only</label>
                        </Tooltip>
                        <input
                            type="checkbox"
                            checked={dateRangeFormData.active_employees}
                            onChange={(e) => setDateRangeFormData(prev => ({ ...prev, active_employees: !dateRangeFormData.active_employees }))}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:cursor-pointer"
                        />
                    </div>

                    {/* Export method */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Export method</label>
                        <select
                            value={dateRangeFormData.payrun_payment_or_period}
                            onChange={(e) => setDateRangeFormData(prev => ({ ...prev, payrun_payment_or_period: e.target.value }))}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:cursor-pointer"
                        >
                            <option value={`PAYMENT`}>Payment </option>
                            <option value={`PERIOD`}>Payrun Period</option>
                        </select>
                    </div>


                    {/* Payrun Status Dropdown */}
                    <div className="relative flex flex-col" ref={statusDropdownRef}>
                        <label className="mb-1 text-xs font-medium text-gray-700">Payrun Status</label>
                        <button
                            type="button"
                            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-left text-sm hover:cursor-pointer"
                        >
                            Payrun status
                        </button>

                        {statusDropdownOpen && (
                            <div className="absolute top-full mt-1 w-40 rounded-md border border-gray-300 bg-white shadow-lg z-50">
                                {statuses.map(status => (
                                    <label key={status} className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm">
                                        <input
                                            type="checkbox"
                                            checked={dateRangeFormData.payrun_status.includes(status)}
                                            onChange={() => toggleStatus(status)}
                                        />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Employee Selection */}
                    <div className="relative flex flex-col" ref={employeeDropdownRef}>
                        <label className="mb-1 text-xs font-medium text-gray-700">Employee Selection</label>
                        <button
                            type="button"
                            onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-left text-sm hover:cursor-pointer"
                        >
                            Select Employee
                        </button>

                        {employeeDropdownOpen && (
                            <div className="absolute top-full mt-1 w-56 max-h-80 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg z-50">
                                {/* Info Note */}
                                <div className="px-3 py-2 text-xs italic text-gray-500 border-b border-gray-200">
                                    By default, all active or inactive employees are included. Selecting employees will fetch YTD for them only.
                                </div>

                                {/* Employee List */}
                                <div className="divide-y divide-gray-100">
                                    {employees.map((employee, idx) => (
                                        <label
                                            key={idx}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={dateRangeFormData.employee_ids.includes(employee.employee_id)}
                                                onChange={() => toggleEmployee(employee.employee_id)}
                                                className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            {mapEmployeeIdToEmployeeName(employee.employee_id)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>




                    {/* Generate button */}
                    <button
                        type="submit"
                        className="self-end rounded-xl bg-teal-600 px-3 py-1 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        Generate
                    </button>
                </form>

                {/* Download button */}
                {Object.keys(ytds).length > 0 && (
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Download YTD</label>
                        <button
                            onClick={handleDownload}
                            className="rounded-xl bg-orange-600 px-3 py-1 text-sm font-medium text-white hover:bg-orange-700"
                        >
                            Download
                        </button>
                    </div>
                )}

            </div>

            {/* Data table */}
            <div>
                {ytds.length === 0
                    ? <StartIllustration title="Generate" label="Select data to generate from the selection." />
                    : <DataExportTable data={ytds} setData={setYtds} />
                }
            </div>

            {/* Loading */}
            {(ytdsLoading || downloadLoading) && <LoadingBackground />}
        </div>
    );
};

export default YtdSection;

