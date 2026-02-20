import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PayrunFilter = ({ status, onStatusChange, fromDate, toDate, onFromDateChange, onToDateChange, onSearch }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        setIsDropdownOpen(false);
        navigate(`/payrun/${option}?payrun_type=${option}`);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isDropdownOpen) return;
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);


    const filtersApplied = (status && status !== 'All') || fromDate || toDate;

    return (
        <div className="flex items-center justify-between gap-1 w-full text-xs">
            {/* Left: Compact Filters */}
            <div className="flex flex-row gap-1 items-center flex-wrap">
                {/* Date */}
                <label className="text-xs font-medium text-gray-700">From</label>
                <input
                    type="date"
                    className="w-28 rounded-full bg-white border border-gray-300 px-2 py-1 text-xs focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition cursor-pointer"
                    value={fromDate}
                    onChange={e => onFromDateChange(e.target.value)}
                />
                <label className="text-xs font-medium text-gray-700 ml-1">To</label>
                <input
                    type="date"
                    className="w-28 rounded-full bg-white border border-gray-300 px-2 py-1 text-xs focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition cursor-pointer"
                    value={toDate}
                    onChange={e => onToDateChange(e.target.value)}
                />
                <label className="text-xs font-medium text-gray-700 ml-2">Status</label>
                <select
                    className="px-2 py-1 border border-gray-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-24 bg-white cursor-pointer transition"
                    value={status}
                    onChange={e => onStatusChange(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="DRAFT">Draft</option>
                    <option value="FOR_APPROVAL">For Approval</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                {filtersApplied && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 border border-teal-200 text-[10px] font-semibold">Filters Applied</span>
                )}
            </div>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen((open) => !open)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-full text-xs transition cursor-pointer min-w-[60px]"
                >
                    New +
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                        <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl"
                            onClick={() => handleOptionClick("regular")}
                        >
                            Regular Payrun
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => handleOptionClick("special")}
                        >
                            Special
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-xl"
                            onClick={() => handleOptionClick("last")}
                        >
                            Last
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-xl"
                            onClick={() => handleOptionClick("upload")}
                        >
                            Upload
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
    export default PayrunFilter;
