

import { useCompareNetPayContext } from "../../../../contexts/CompareNetPayProvider";
import { formatDateToWords } from "../../../../utility/datetime.utility";
import ComparisonGraph from "./ComparisonGraph";

const CompareNetPay = () => {
    const {
        selectedPayruns,
        handleSelectPayruns,
        payrunsloading,
        payruns,
        handleRemoveSelectedPayruns,
        netSalariesPerPayrun
    } = useCompareNetPayContext();

    return (
        <div className="flex flex-col space-y-4 p-4 bg-white rounded-2xl border border-gray-200 mb-4">
            <div className="space-y-1">
                <h1 className="text-lg font-semibold text-gray-800">Net Pay Comparison</h1>
                <p className="text-xs text-gray-500">
                    This helps compare the different net pay from different payruns, allowing you to inspect the progression of salary
                </p>
            </div>

            {/* Payrun Selection */}
            <div>
                {payrunsloading ? (
                    <div className="w-full h-10 rounded-full bg-gray-200 animate-pulse"></div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                        <label className="text-sm text-gray-600">Select Payrun</label>
                        <select
                            onChange={handleSelectPayruns}
                            className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                        >
                            <option>Select Payrun</option>
                            {payruns
                                .filter(payrun =>
                                    !selectedPayruns.some(id => payrun.payrun_id === id)
                                )
                                .map(payrun => (
                                    <option
                                        key={payrun.payrun_id}
                                        value={payrun.payrun_id}
                                    >
                                        {payrun.status}-{payrun.payrun_type}: {formatDateToWords(payrun.payrun_start_date)} to {formatDateToWords(payrun.payrun_end_date)}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                )}
            </div>

            {/* Selected Payruns */}
            <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">Selected Payruns</p>
                <div className="flex flex-wrap gap-2">
                    {selectedPayruns.map((payrun_id, idx) => {
                        const payrun = payruns.find(payrun => payrun.payrun_id === payrun_id);
                        return (
                            <div
                                key={idx}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-gray-500 text-gray-500`}
                            >
                                <span className="font-medium truncate">
                                    {formatDateToWords(payrun.payrun_start_date)}–{formatDateToWords(payrun.payrun_end_date)}
                                </span>
                                <span className="opacity-75">
                                    {payrun.status} • {payrun.payrun_type}
                                </span>
                                <button
                                    onClick={() => handleRemoveSelectedPayruns(payrun_id)}
                                    className="ml-2 focus:outline-none font-medium hover hover:cursor-pointer"
                                    type="button"
                                >
                                    ×
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Table Placeholder */}
            <ComparisonGraph netSalariesPerPayrun={netSalariesPerPayrun} />
        </div>
    );
}

export default CompareNetPay;


