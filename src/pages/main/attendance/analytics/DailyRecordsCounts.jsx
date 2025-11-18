import { XCircleIcon } from "@heroicons/react/24/solid";


import { useDailyRecordsAnalyticsContext } from "../../../../contexts/DailyRecordsAnalyticsProvider";
import DualBallLoading from "../../../../components/DualBallLoading";
import CountsTable from "./CountsTable";

export const DailyRecordsCounts = () => {
    const { handleOptionChange, handleResetOption, options, countsLoading, counts } = useDailyRecordsAnalyticsContext();
    const columns = ["employee_id", "employee_name", "attendance", "absence", "leave", "overtime", "restday"];

    return (
        <div className="flex flex-col space-y-4 p-4 bg-white rounded-2xl border border-gray-200">
            <div className="space-y-1">
                <h1 className="text-lg font-semibold text-gray-800">Daily Records Count</h1>
                <p className="text-xs text-gray-500">
                    Counts the number of daily records for the payrun period. <b>Payrun days</b> Helps identify employees with incomplete records.
                </p>
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-row items-center gap-1">
                    <label className="mb-1 text-xs  font-medium text-gray-700">From</label>
                    <input
                        type="date"
                        value={options.from}
                        onChange={(e) => handleOptionChange("from", e.target.value)}
                        className="w-40 rounded-full bg-white border border-gray-300 px-3 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                    />
                </div>

                {/* To */}
                <div className="flex flex-row gap-1 items-center">
                    <label className="mb-1 text-xs font-medium text-gray-700">To</label>
                    <input
                        type="date"
                        value={options.to}
                        onChange={(e) => handleOptionChange("to", e.target.value)}
                        className="w-40 bg-white rounded-full border border-gray-300 px-3 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                    />
                </div>

                {/* Is active */}
                <div className="flex flex-row gap-1 items-center">
                    <label className="mb-1 text-xs font-medium text-gray-700">Only Active</label>
                    <input
                        type="checkbox"
                        checked={options.is_active}
                        onChange={(e) => handleOptionChange("is_active", e.target.checked)}
                    />
                </div>

                {/* Payrun Period day */}
                <div className="flex flex-row gap-1 items-center">
                    <label className="mb-1 text-xs font-medium text-gray-700"># Days in Payrun</label>
                    <input
                        type="number"
                        value={options.payrun_days}
                        onChange={(e) => handleOptionChange("payrun_days", e.target.value)}
                        className="w-40 bg-white rounded-full border border-gray-300 px-3 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                    />
                </div>

                <div className="flex flex-row items-center gap-1 hover:cursor-pointer" onClick={handleResetOption}>
                    <XCircleIcon className="h-4 w-4 text-gray-400  hover:text-red-500" />
                </div>
            </div>
            {countsLoading
                ? <DualBallLoading />
                : <CountsTable data={counts} columns={columns} payrun_days={options.payrun_days} />
            }

        </div>


    );
};