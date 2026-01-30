import { useState, useRef, useEffect } from "react";
import LoadingBackground from "../../../components/LoadingBackground";
import StartIllustration from "../../../components/Start";
import { useYtdContext } from "../../../contexts/YtdProvider";
import DataExportTable from "./Table";

const statuses = ['APPROVED', 'DRAFT', 'FOR_APPROVAL', 'REJECTED'];

const YtdSection = () => {
    const { dateRangeFormData, setDateRangeFormData, handleGenerateYTD, ytds, setYtds, handleDownload, ytdsLoading, downloadLoading } = useYtdContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleGenerateYTD();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
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

                    {/* Employees */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-xs font-medium text-gray-700">Employees</label>
                        <select
                            value={dateRangeFormData.active_employees}
                            onChange={(e) => setDateRangeFormData(prev => ({ ...prev, active_employees: e.target.value }))}
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
                            value={dateRangeFormData.payrun_payment_or_period}
                            onChange={(e) => setDateRangeFormData(prev => ({ ...prev, payrun_payment_or_period: e.target.value }))}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:cursor-pointer"
                        >
                            <option value={`PAYMENT`}>Payment </option>
                            <option value={`PERIOD`}>Payrun Period</option>
                        </select>
                    </div>

                    {/* Payrun Status Dropdown */}
                    <div className="relative flex flex-col" ref={dropdownRef}>
                        <label className="mb-1 text-xs font-medium text-gray-700">Payrun Status</label>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-40 rounded-full border border-gray-300 bg-white px-3 py-1 text-left text-sm hover:cursor-pointer"
                        >
                            Payrun status
                        </button>

                        {dropdownOpen && (
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

                    {/* Generate button */}
                    <button
                        type="submit"
                        className="self-end rounded-xl bg-teal-600 px-3 py-1 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        Generate
                    </button>
                </form>

                {/* Download button */}
                {ytds.length > 0 && (
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

