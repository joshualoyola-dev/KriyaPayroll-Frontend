import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { useRegularPayrunContext } from "../../../../contexts/RegularPayrunProvider";
import { useToastContext } from "../../../../contexts/ToastProvider";

const PayrunOption = () => {
    const { payitems } = usePayitemContext();
    const {
        options, handleInputChange,
        handlePayitemChange, removePayitem,
        handleGenerate, isValidating,
        validateEmployeesDailyRecordAgainstPayrunPeriod,
        payrun, handleSaveDraft, payslips
    } = useRegularPayrunContext();

    const { addToast } = useToastContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //validate
        const allValid = await validateEmployeesDailyRecordAgainstPayrunPeriod();
        if (!allValid) {
            addToast("Fix the daily record first", "warning");
            return;
        }

        //generate
        handleGenerate();
    }

    return (
        <div className="relative bg-white p-6 rounded-xl border border-gray-200">
            <div className="absolute top-4 right-4 gap-2">
                {(!payrun && Object.keys(payslips).length > 0) &&
                    <button
                        onClick={handleSaveDraft}
                        className="px-3 py-1  bg-teal-700 text-white hover:cursor-pointer"
                    >
                        Save Draft
                    </button>
                }

                {payrun &&
                    <>
                        <button
                            onClick={() => { }}
                            className="px-3 py-1  bg-teal-700 text-white hover:cursor-pointer"
                        >
                            Save edit
                        </button>

                        <button
                            onClick={() => { }}
                            className="px-3 py-1  bg-teal-700 text-white hover:cursor-pointer"
                        >
                            Finalize
                        </button>
                    </>
                }
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
                        className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2"
                        required
                        disabled={!payrun ? false : true}
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
                        className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2"
                        required
                        disabled={!payrun ? false : true}
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
                        className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2"
                        required
                        disabled={!payrun ? false : true}
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
                            className="w-full px-3 py-2.5 pr-10 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer text-gray-500"
                            defaultValue=""
                            disabled={!payrun ? false : true}
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


                {/* Draft/Generate  */}
                {
                    !payrun &&
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">
                            Generate
                        </label>
                        <button
                            type="submit"
                            // className="w-full px-3 py-2.5  bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-3xl "
                            className="inline-flex items-center px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-3xl "
                        >
                            {isValidating ? "Loading ..." : "Generate"}
                        </button>
                    </div>
                }
            </form>

            {/* Selected Payitems (if any) */}
            {
                options.pay_items.length > 0 && (
                    <div className="mb-6">
                        <p className="text-xs font-medium text-gray-600 mb-2">Selected Pay Items:</p>
                        <div className="flex flex-wrap gap-2">
                            {options.pay_items.map((item, idx) => {
                                const payitemId = Object.keys(item)[0];
                                const payitemName = item[payitemId];
                                return (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs text-teal-600 border border-blue-200"
                                    >
                                        <span>{payitemName}</span>
                                        <button
                                            onClick={() => removePayitem(payitemId)}
                                            className="ml-2 text-teal-500 hover:text-teal-700 focus:outline-none text-lg leading-none"
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
                )
            }


        </div >
    );
};

export default PayrunOption;