import { useEffect, useRef, useState } from "react";
import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import DataExportTable from "./Table";
import { useCompanyContext } from "../../../contexts/CompanyProvider";
import { useToastContext } from "../../../contexts/ToastProvider";
import { useEmployeeContext } from "../../../contexts/EmployeeProvider";
import { convertToISO8601 } from "../../../utility/datetime.utility";
import { fetch2316Data } from "../../../services/data-export.service";

import { download2316Pdf } from "../../../api/export.api";

const statuses = ["APPROVED", "DRAFT", "FOR_APPROVAL", "REJECTED"];

const defaultFormData = {
    date_start: "",
    date_end: "",
    active_employees: true,
    payrun_payment_or_period: "PAYMENT",
    payrun_status: ["APPROVED"],
    employee_ids: [],
};

const Section2316 = () => {
    const [formData, setFormData] = useState({ ...defaultFormData });
    const [data, setData] = useState([]);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGenerateLoading(true);
        try {
            if (!company?.company_id) {
                addToast("No company selected", "error");
                return;
            }

            const date_start = convertToISO8601(formData.date_start);
            const date_end = convertToISO8601(formData.date_end);
            if (!date_start || !date_end) {
                addToast("Please select a valid date range", "warning");
                return;
            }

            const activeEmployeesBool = formData.active_employees ? "true" : "false";
            const res = await fetch2316Data(
                company.company_id,
                date_start,
                date_end,
                activeEmployeesBool,
                formData.payrun_payment_or_period,
                formData.payrun_status,
                formData.employee_ids,
            );

            setData(res?.data?.data2316 ?? []);
        } finally {
            setGenerateLoading(false);
        }
    };
const handleDownload = async () => {
        setDownloadLoading(true);
        try {
            // Placeholder: wire download logic when backend/export format is ready.
            return;
        } finally {
            setDownloadLoading(false);
        }
    };

    const handleGeneratePDF = async () => {
        // 1. Basic Validation
        if (!company?.company_id) {
            addToast("No company selected", "error");
            return;
        }

        // Extracts the year from the "To" date picker
        const year = formData.date_end ? new Date(formData.date_end).getFullYear() : null;

        if (!year) {
            addToast("Please select a date range to determine the tax year.", "warning");
            return;
        }

        setDownloadLoading(true);

        try {
            addToast(`Preparing BIR 2316 for year ${year}...`, "info");

            // 2. Call the function from your export.api file
            const result = await download2316Pdf(company.company_id, year);

            if (result) {
                addToast("PDF generated and downloaded successfully.", "success");
            }
        } catch (error) {
            console.error("PDF Export Error:", error);
            addToast("Failed to connect to the PDF service.", "error");
        } finally {
            setDownloadLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Top controls row (same layout as YTD) */}
            <div className="flex items-end justify-between gap-4 p-3">
                <form onSubmit={handleSubmit} className="flex items-end gap-4">
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
                            onChange={(e) => setFormData((prev) => ({ ...prev, payrun_payment_or_period: e.target.value }))}
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
                                    <label key={status} className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm">
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
                                    By default, all active or inactive employees are included. Selecting employees will fetch 2316 for them only.
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

                {/* Actions (same as 1601c) */}
                {data.length === 0 ? (
                    <></>
                ) : (
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Download 2316</label>
                        <button
                            onClick={handleDownload}
                            className="rounded-xl bg-orange-600 px-3 py-1 text-sm font-medium text-white hover:bg-orange-700"
                        >
                            Download
                        </button>

                        <div className="mt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={handleGeneratePDF} // <--- This connects the click to your function
                                disabled={downloadLoading}  // <--- This prevents double-clicks while loading
                                className="rounded-xl bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                               {downloadLoading ? "Generating..." : "Generate a PDF"}
                            </button>
                            <button
                                type="button"
                                className="rounded-xl bg-orange-500 px-3 py-1 text-xs font-medium text-white hover:bg-orange-600"
                            >
                                Save as Draft
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Data table */}
            <div>
                {data.length === 0 ? (
                    <StartIllustration title="Generate" label="Select data to generate from the selection." />
                ) : (
                    <DataExportTable data={data} setData={setData} />
                )}
            </div>

            {(generateLoading || downloadLoading) && <LoadingBackground />}
        </div>
    );
};

export default Section2316;

