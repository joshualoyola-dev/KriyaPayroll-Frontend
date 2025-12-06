import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { useSharedRunningPayrunOperationContext } from "../../../../contexts/SharedRunningPayrunOperationProvider";
import { useToastContext } from "../../../../contexts/ToastProvider";
import EmployeeSelection from "./EmployeeSelection";
import { formatDateToWords } from "../../../../utility/datetime.utility";

const OptionGenerate = () => {
    const { payitems } = usePayitemContext();
    const {
        options, handleInputChange,
        handlePayitemChange, removePayitem,
        handleGenerate, isValidating,
        handleSaveDraft, payslips, payslipsLoading,
        isSaving,
        payrunType,
        handleClosePayrun,
        employeeForLastPay
    } = useSharedRunningPayrunOperationContext();
    const { addToast } = useToastContext();


    const handleSubmit = async (e) => {
        e.preventDefault();
        //for special and last, check if there is atleast one selected employee
        if (String(payrunType).toUpperCase() === 'SPECIAL' || String(payrunType).toUpperCase() === 'LAST') {
            if (options.employee_ids.length === 0) {
                return addToast("Select at least one employee to run payrun", "error");
            }
        }

        //for last payrun, check it date_end is already added
        if (String(payrunType).toUpperCase() === 'LAST') {
            if (!employeeForLastPay.date_end) {
                return addToast("Add the date end of employee first in the employee record", "error");
            }
        }

        //generate
        handleGenerate();
    }

    return (
        <div className="relative bg-white p-6 rounded-xl border border-gray-200">
            {/* Top controls section - with proper spacing */}
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Payrun Details</h3>
                {(Object.keys(payslips).length === 0) &&
                    <button
                        onClick={handleClosePayrun}
                        className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                    >
                        Close
                    </button>
                }
                {(Object.keys(payslips).length > 0) && (
                    <div className="space-x-2">
                        <button
                            onClick={handleClosePayrun}
                            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSaveDraft}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                        >
                            {isSaving ? "Saving..." : "Save Draft"}
                        </button>
                    </div>
                )}
            </div>

            {/* Main form grid */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6"
            >
                {/* Date From */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                        Date From
                    </label>
                    <input
                        type="date"
                        value={options.date_from}
                        onChange={(e) => handleInputChange('date_from', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                    />
                </div>

                {/* Date To */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                        Date To
                    </label>
                    <input
                        type="date"
                        value={options.date_to}
                        onChange={(e) => handleInputChange('date_to', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                    />
                </div>

                {/* Payment Date */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                        Payment Date
                    </label>
                    <input
                        type="date"
                        value={options.payment_date}
                        onChange={(e) => handleInputChange('payment_date', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                    />
                </div>

                {/* Pay Items */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                        Pay Items
                    </label>
                    <div className="relative">
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    handlePayitemChange(e.target.value);
                                    e.target.value = ''; // Reset select after selection
                                }
                            }}
                            className="w-full px-3 py-2.5 pr-10 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none cursor-pointer text-gray-500"
                            defaultValue=""
                        >
                            <option value="" disabled>Select Payitems</option>
                            {payitems
                                .filter(item =>
                                    !options.pay_items.some(selectedItem =>
                                        Object.keys(selectedItem)[0] === item.payitem_id
                                    )
                                )
                                .map((item) => (
                                    <option key={item.payitem_id} value={item.payitem_id} className="text-gray-900">
                                        {item.payitem_name}
                                    </option>
                                ))
                            }
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Generate Button */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                        Generate
                    </label>
                    <button
                        type="submit"
                        disabled={isValidating || payslipsLoading}
                        className="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-3xl disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                    >
                        {isValidating || payslipsLoading ? "Loading..." : "Generate"}
                    </button>
                </div>

                {/* Employee Selection */}
                {(String(payrunType).toUpperCase() === 'SPECIAL' || String(payrunType).toUpperCase() === 'LAST') && <EmployeeSelection />}


            </form>

            {/* Selected Payitems */}
            {options.pay_items.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-3">Selected Pay Items:</p>
                    <div className="flex flex-wrap gap-2">
                        {options.pay_items.map((item, idx) => {
                            const payitemId = Object.keys(item)[0];
                            const payitemName = item[payitemId];
                            return (
                                <div
                                    key={idx}
                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs text-teal-700 bg-teal-50 border border-teal-200"
                                >
                                    <span className="font-medium">{payitemName}</span>
                                    <button
                                        onClick={() => removePayitem(payitemId)}
                                        className="ml-2 text-teal-600 hover:text-teal-800 focus:outline-none text-lg leading-none font-semibold"
                                        type="button"
                                        aria-label={`Remove ${payitemName}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Render employee details for last payrun */}
            {employeeForLastPay && (
                <div className="pt-4 border-t border-gray-200 mt-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">Employee for Last Payroll:</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-800">
                        <span className="font-semibold">{employeeForLastPay.first_name} {employeeForLastPay.last_name}</span> |
                        <span>Employee ID: {employeeForLastPay.employee_id}</span> |
                        <span>Date Hired: {formatDateToWords(employeeForLastPay.date_hired)}</span> |
                        <span>Date End: {employeeForLastPay.date_end ? formatDateToWords(employeeForLastPay.date_end) : 'None'}</span>
                    </div>
                </div>
            )}



        </div>
    );
};

export default OptionGenerate;