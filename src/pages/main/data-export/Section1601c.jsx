import { useEffect, useRef, useState } from "react";
import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import FixedHeaderTable from "./FixedHeaderTable";
import use1601c from "../../../hooks/use1601c"; // Adjust path as needed
import { useEmployeeContext } from "../../../contexts/EmployeeProvider";

import { generate1601cPdf } from "../../../api/export.api";
import { useCompanyContext } from "../../../contexts/CompanyProvider";
import { useToastContext } from "../../../contexts/ToastProvider";

const statuses = ["APPROVED", "DRAFT", "FOR_APPROVAL", "REJECTED"];

const Section1601c = () => {
    const {
        formData, setFormData,
        rows,
        generateLoading,
        downloadLoading,
        columns,
        lockedKeys,
        handleGenerate,
        handleDownload,
        handleChangeCell
    } = use1601c();

    const { employees, mapEmployeeIdToEmployeeName } = useEmployeeContext();

    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
    const statusDropdownRef = useRef(null);
    const employeeDropdownRef = useRef(null);

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
        setFormData((prev) => ({
            ...prev,
            payrun_status: prev.payrun_status.includes(status)
                ? prev.payrun_status.filter((s) => s !== status)
                : [...prev.payrun_status, status],
        }));
    };

    const toggleEmployee = (employee_id) => {
        setFormData((prev) => ({
            ...prev,
            employee_ids: prev.employee_ids.includes(employee_id)
                ? prev.employee_ids.filter((e) => e !== employee_id)
                : [...prev.employee_ids, employee_id],
        }));
    };

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    const handleGenerate1601CPDF = async () => {
        console.log("🔵 [Section1601c] handleGenerate1601CPDF CLICKED!");
        console.log("🔵 Company:", company);
        console.log("🔵 Form Data:", formData);
        
        if (!company?.company_id) {
            console.log("❌ No company selected");
            addToast("No company selected", "error");
            return;
        }

        const dateObj = formData.date_end ? new Date(formData.date_end) : null;
        const year = dateObj ? dateObj.getFullYear() : null;
        const month = dateObj ? dateObj.getMonth() + 1 : null;
        console.log("🔵 Extracted year:", year, "month:", month); 

        if (!year || !month) {
            addToast("Please select a date range first.", "warning");
            return;
        }

        try {
            addToast(`Generating 1601C for ${month}/${year}...`, "info");
            const success = await generate1601cPdf(company.company_id, year, month);
            if (success) {
                addToast("PDF generated successfully and saved to Google Drive!", "success");
            }
        } catch (err) {
            addToast(err?.message || "Error generating PDF.", "error");
        }
    }; 
    return (
        <div className="flex flex-col">
            <div className="flex items-end justify-between gap-4 p-3">
                <form onSubmit={handleGenerate} className="flex items-end gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">From</label>
                        <input
                            value={formData.date_start}
                            onChange={(e) => setFormData((prev) => ({ ...prev, date_start: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">To</label>
                        <input
                            value={formData.date_end}
                            onChange={(e) => setFormData((prev) => ({ ...prev, date_end: e.target.value }))}
                            type="date"
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Employees</label>
                        <select
                            value={formData.active_employees}
                            onChange={(e) => setFormData((prev) => ({ ...prev, active_employees: e.target.value === "true" }))}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:cursor-pointer"
                        >
                            <option value={false}>All employees (active & inactive)</option>
                            <option value={true}>Active employees only</option>
                        </select>
                    </div>

                    {/* Export method */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Export method</label>
                        <select
                            value={formData.payrun_payment_or_period}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, payrun_payment_or_period: e.target.value }))
                            }
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:cursor-pointer"
                        >
                            <option value={"PAYMENT"}>Payment</option>
                            <option value={"PERIOD"}>Payrun Period</option>
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
                                {statuses.map((status) => (
                                    <label
                                        key={status}
                                        className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.payrun_status.includes(status)}
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
                                <div className="px-3 py-2 text-xs italic text-gray-500 border-b border-gray-200">
                                    By default, all active or inactive employees are included. Selecting employees
                                    will fetch 1601C totals for them only.
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {employees.map((employee, idx) => (
                                        <label
                                            key={idx}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.employee_ids.includes(employee.employee_id)}
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

                    <button
                        type="submit"
                        className="self-end rounded-xl bg-teal-600 px-3 py-1 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        Generate
                    </button>
                </form>

                {rows.length > 0 && (
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Download 1601c</label>
                        <button
                            onClick={handleDownload}
                            className="rounded-xl bg-orange-700 px-3 py-1 text-sm font-medium text-white hover:bg-orange-800"
                        >
                            Download
                        </button>

                        <div className="mt-2 flex gap-2">
                            <button type="button" 
                            onClick={handleGenerate1601CPDF}
                            className="rounded-xl bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">
                                Generate a PDF
                            </button>
                            <button type="button" className="rounded-xl bg-orange-500 px-3 py-1 text-xs font-medium text-white hover:bg-orange-600">
                                Save as Draft
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                {rows.length === 0 ? (
                    <StartIllustration title="Generate" label="Select data to generate from the selection." />
                ) : (
                    <FixedHeaderTable
                        columns={columns}
                        rows={rows}
                        onChangeCell={handleChangeCell}
                        lockedKeys={lockedKeys}
                    />
                )}
            </div>

            {(generateLoading || downloadLoading) && <LoadingBackground />}
        </div>
    );
};

export default Section1601c;