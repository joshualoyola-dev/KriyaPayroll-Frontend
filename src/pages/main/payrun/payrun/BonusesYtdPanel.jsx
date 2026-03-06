import { useState, useRef, useEffect } from "react";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import DualBallLoading from "../../../../components/DualBallLoading";
import { BONUS_THRESHOLD } from "../../../../hooks/useSharedRunningPayrunOperation";

const STATUS_OPTIONS = [
    { label: "Draft", value: "DRAFT" },
    { label: "For Approval", value: "FOR_APPROVAL" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
];

const BonusesYtdPanel = ({ isOpen, isLoading, data, form, handleFormChange, handleStatusToggle, handleFetch }) => {
    const { mapPayitemIdToPayitemName } = usePayitemContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [payitemDropdownOpen, setPayitemDropdownOpen] = useState(false);
    const [selectedPayitemIds, setSelectedPayitemIds] = useState([]);
    const statusDropdownRef = useRef(null);
    const payitemDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
                setStatusDropdownOpen(false);
            }
            if (payitemDropdownRef.current && !payitemDropdownRef.current.contains(e.target)) {
                setPayitemDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset payitem selection when data is cleared
    useEffect(() => {
        if (!data) setSelectedPayitemIds([]);
    }, [data]);

    if (!isOpen) return null;

    const allPayitemIds = data
        ? [...new Set(
            Object.values(data).flatMap(empRow => Object.keys(empRow))
        )]
        : [];

    const togglePayitem = (id) => {
        setSelectedPayitemIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const hasSelection = selectedPayitemIds.length > 0;

    const activePayitemIds = hasSelection
        ? selectedPayitemIds.filter(id => allPayitemIds.includes(id))
        : [];

    const computeTotal = (row) =>
        hasSelection
            ? activePayitemIds.reduce((sum, id) => sum + (row[id] ?? 0), 0)
            : null;

    const exceedingCount = data
        ? Object.values(data).filter(row => (computeTotal(row) ?? 0) > BONUS_THRESHOLD).length
        : 0;

    return (
        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
                {/* Date range */}
                <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">From</label>
                    <input
                        type="date"
                        value={form.start_date}
                        onChange={e => handleFormChange("start_date", e.target.value)}
                        className="w-28 rounded-full bg-white border border-gray-300 px-2 py-1 text-xs focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition cursor-pointer"
                    />
                </div>
                <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">To</label>
                    <input
                        type="date"
                        value={form.end_date}
                        onChange={e => handleFormChange("end_date", e.target.value)}
                        className="w-28 rounded-full bg-white border border-gray-300 px-2 py-1 text-xs focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition cursor-pointer"
                    />
                </div>

                {/* Filter by */}
                <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Filter by</label>
                    <select
                        value={form.filter_by}
                        onChange={e => handleFormChange("filter_by", e.target.value)}
                        className="rounded-full bg-white border border-gray-300 px-2 py-1 text-xs focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition cursor-pointer"
                    >
                        <option value="paymentDate">Payment Date</option>
                        <option value="titlePeriod">Pay Period</option>
                    </select>
                </div>

                {/* Statuses */}
                <div className="relative flex items-center gap-1" ref={statusDropdownRef}>
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Status</label>
                    <button
                        type="button"
                        onClick={() => setStatusDropdownOpen(prev => !prev)}
                        className="flex items-center gap-1 rounded-full bg-white border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition cursor-pointer"
                    >
                        {form.statuses.length === 0
                            ? "None"
                            : form.statuses.length === STATUS_OPTIONS.length
                                ? "All"
                                : STATUS_OPTIONS.filter(o => form.statuses.includes(o.value)).map(o => o.label).join(", ")
                        }
                        <svg className={`w-3 h-3 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {statusDropdownOpen && (
                        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                            {STATUS_OPTIONS.map(opt => (
                                <label
                                    key={opt.value}
                                    className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs text-gray-700 hover:bg-gray-50 select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.statuses.includes(opt.value)}
                                        onChange={() => handleStatusToggle(opt.value)}
                                        className="accent-teal-600"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Fetch button */}
                <button
                    onClick={handleFetch}
                    disabled={isLoading}
                    className="ml-auto px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? "Loading..." : "Check YTD"}
                </button>
            </div>

            {/* Total by row — only shown after data is loaded */}
            {data && allPayitemIds.length > 0 && (
                <div className="flex items-center gap-x-3 gap-y-2 pt-2 mb-3 border-t border-gray-200">
                    <span className="text-xs font-medium text-gray-500">Total by</span>
                    <div className="relative flex items-center gap-1" ref={payitemDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setPayitemDropdownOpen(prev => !prev)}
                            className="flex items-center gap-1 rounded-full bg-white border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition cursor-pointer"
                        >
                            {selectedPayitemIds.length === 0
                                ? <span className="text-gray-400 italic">Select pay items...</span>
                                : selectedPayitemIds.length === allPayitemIds.length
                                    ? "All pay items"
                                    : selectedPayitemIds.map(id => mapPayitemIdToPayitemName(id)).join(", ")
                            }
                            <svg className={`w-3 h-3 transition-transform ${payitemDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {payitemDropdownOpen && (
                            <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px]">
                                <label className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs font-semibold text-gray-700 hover:bg-gray-50 select-none border-b border-gray-100">
                                    <input
                                        type="checkbox"
                                        checked={selectedPayitemIds.length === allPayitemIds.length}
                                        onChange={() =>
                                            setSelectedPayitemIds(
                                                selectedPayitemIds.length === allPayitemIds.length ? [] : [...allPayitemIds]
                                            )
                                        }
                                        className="accent-teal-600"
                                    />
                                    All pay items
                                </label>
                                {allPayitemIds.map(id => (
                                    <label
                                        key={id}
                                        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs text-gray-700 hover:bg-gray-50 select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPayitemIds.includes(id)}
                                            onChange={() => togglePayitem(id)}
                                            className="accent-teal-600"
                                        />
                                        {mapPayitemIdToPayitemName(id)}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Results */}
            {isLoading && (
                <div className="py-4"><DualBallLoading /></div>
            )}

            {!isLoading && data && Object.keys(data).length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-3">No data found for the selected filters.</p>
            )}

            {!isLoading && data && Object.keys(data).length > 0 && (
                <>
                    {/* Summary banner */}
                    {exceedingCount > 0 && (
                        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-yellow-50 border border-yellow-300 rounded-lg text-xs text-yellow-800">
                            <span className="font-bold text-yellow-600">⚠</span>
                            <span>
                                <strong>{exceedingCount}</strong> employee{exceedingCount > 1 ? "s have" : " has"} exceeded the
                                <strong> ₱90,000</strong> tax-exempt threshold — next bonus may be subject to withholding tax.
                            </span>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600">
                                    <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold sticky left-0 z-[1] bg-gray-100 whitespace-nowrap">Employee</th>
                                    <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold sticky left-[160px] z-[1] bg-gray-100 whitespace-nowrap">Employee ID</th>
                                    {allPayitemIds.map(id => {
                                        const isSelected = selectedPayitemIds.includes(id);
                                        return (
                                            <th key={id} className={`text-right px-3 py-2 border-b border-gray-200 font-semibold whitespace-nowrap ${isSelected ? "bg-teal-100 text-teal-700" : ""}`}>
                                                {mapPayitemIdToPayitemName(id)}
                                            </th>
                                        );
                                    })}
                                    <th className="text-right px-3 py-2 border-b border-gray-200 font-semibold whitespace-nowrap bg-gray-100"> Selected Pay Items Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data).map(([emp_id, row]) => {
                                    const total = computeTotal(row);
                                    const isExceeding = total !== null && total > BONUS_THRESHOLD;
                                    return (
                                        <tr key={emp_id} className={isExceeding ? "bg-yellow-50" : "bg-white hover:bg-gray-50"}>
                                            <td className={`px-3 py-1.5 border-b border-gray-100 sticky left-0 min-w-[160px] ${isExceeding ? "bg-yellow-50" : "bg-white"}`}>
                                                <div className="font-medium text-gray-800">{mapEmployeeIdToEmployeeName(emp_id)}</div>
                                                {isExceeding && (
                                                    <div className="mt-0.5">
                                                        <span className="px-1.5 py-0.5 rounded-full bg-yellow-200 text-yellow-900 text-[10px] font-bold">⚠ Exceeds ₱90k</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className={`px-3 py-1.5 border-b border-gray-100 font-mono text-gray-500 whitespace-nowrap sticky left-[160px] ${isExceeding ? "bg-yellow-50" : "bg-white"}`}>
                                                {emp_id}
                                            </td>
                                            {allPayitemIds.map(id => {
                                                const isSelected = selectedPayitemIds.includes(id);
                                                return (
                                                    <td key={id} className={`text-right px-3 py-1.5 border-b border-gray-100 tabular-nums ${isSelected ? "bg-teal-100 text-teal-800 font-medium" : "text-gray-600"}`}>
                                                        {(row[id] ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                                    </td>
                                                );
                                            })}
                                            <td className={`text-right px-3 py-1.5 border-b border-gray-100 font-semibold tabular-nums ${isExceeding ? "text-yellow-800" : "text-gray-400"}`}>
                                                {total !== null
                                                    ? total.toLocaleString("en-PH", { minimumFractionDigits: 2 })
                                                    : <span className="italic text-gray-300">—</span>
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default BonusesYtdPanel;

