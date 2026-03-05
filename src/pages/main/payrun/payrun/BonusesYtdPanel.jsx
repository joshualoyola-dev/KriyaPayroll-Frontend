import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { useEmployeeContext } from "../../../../contexts/EmployeeProvider";
import DualBallLoading from "../../../../components/DualBallLoading";
import { BONUS_THRESHOLD } from "../../../../hooks/useSharedRunningPayrunOperation";

const STATUS_OPTIONS = [
    { label: "Draft", value: "DRAFT" },
    { label: "For Approval", value: "FOR_APPROVAL" },
    { label: "Rejected", value: "REJECTED" },
];

const BonusesYtdPanel = ({ isOpen, isLoading, data, form, handleFormChange, handleStatusToggle, handleFetch }) => {
    const { mapPayitemIdToPayitemName } = usePayitemContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();

    if (!isOpen) return null;

    const allPayitemIds = data
        ? [...new Set(
            Object.values(data).flatMap(empRow =>
                Object.keys(empRow).filter(k => k !== "total")
            )
        )]
        : [];

    const exceedingCount = data
        ? Object.values(data).filter(row => (row.total ?? 0) > BONUS_THRESHOLD).length
        : 0;

    return (
        <div className="mt-3 bg-gray-50 border border-yellow-200 rounded-xl p-3">
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
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Status</label>
                    {STATUS_OPTIONS.map(opt => (
                        <label key={opt.value} className="flex items-center gap-1 cursor-pointer text-xs text-gray-700 select-none">
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

                {/* Fetch button */}
                <button
                    onClick={handleFetch}
                    disabled={isLoading}
                    className="ml-auto px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? "Loading..." : "Check YTD"}
                </button>
            </div>

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
                                    <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold sticky left-0 bg-gray-100 whitespace-nowrap">Employee</th>
                                    {allPayitemIds.map(id => (
                                        <th key={id} className="text-right px-3 py-2 border-b border-gray-200 font-semibold whitespace-nowrap">
                                            {mapPayitemIdToPayitemName(id)}
                                        </th>
                                    ))}
                                    <th className="text-right px-3 py-2 border-b border-gray-200 font-semibold whitespace-nowrap bg-gray-100">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data).map(([emp_id, row]) => {
                                    const total = row.total ?? 0;
                                    const isExceeding = total > BONUS_THRESHOLD;
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
                                            {allPayitemIds.map(id => (
                                                <td key={id} className="text-right px-3 py-1.5 border-b border-gray-100 text-gray-600 tabular-nums">
                                                    {(row[id] ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                                </td>
                                            ))}
                                            <td className={`text-right px-3 py-1.5 border-b border-gray-100 font-semibold tabular-nums ${isExceeding ? "text-yellow-800" : "text-gray-800"}`}>
                                                {total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
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

