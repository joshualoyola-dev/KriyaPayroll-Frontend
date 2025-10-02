import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { useRegularPayrunContext } from "../../../../contexts/RegularPayrunProvider";
import { convertToISO8601 } from "../../../../utility/datetime.utility";

const OptionEdit = () => {
    const { payitems } = usePayitemContext();
    const {
        payrun,
        handleCloseRegularPayrun,
        handleSaveEdit,
        handleChangeStatus,
        statusLoading,
        isSaving,
        handleAddPayitemToPayslips
    } = useRegularPayrunContext();

    const isForApproval = payrun.status === "FOR_APPROVAL";
    const isApproved = payrun.status === "APPROVED";

    return (
        <div className="relative bg-white p-6 rounded-xl border border-gray-200">
            {/* Top-right controls */}
            <div className="absolute top-4 right-4 flex items-center gap-3">
                <button
                    onClick={handleCloseRegularPayrun}
                    className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                    Close
                </button>

                {isSaving ? (
                    <span className="text-sm text-gray-500">Saving...</span>
                ) : (
                    <button
                        onClick={handleSaveEdit}
                        disabled={isForApproval || isApproved}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isForApproval || isApproved
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-teal-600 text-white hover:bg-teal-700"
                            }`}
                    >
                        Save
                    </button>
                )}

                {statusLoading ? (
                    <span className="text-sm text-gray-500">Loading...</span>
                ) : (
                    <select
                        value={payrun.status}
                        onChange={(e) => handleChangeStatus(e.target.value)}
                        disabled={isApproved}
                        className={`px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${isApproved ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
                            }`}
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="FOR_APPROVAL">For Approval</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                )}
            </div>

            {/* Add Payitem control */}
            <div className="absolute bottom-4 right-4">
                <select
                    onChange={(e) => {
                        if (e.target.value) {
                            handleAddPayitemToPayslips(e.target.value);
                        }
                    }}
                    disabled={isForApproval || isApproved}
                    className={`w-40 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white ${isForApproval || isApproved ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
                        }`}
                    defaultValue=""
                >
                    <option value="" disabled>
                        + Add Payitem
                    </option>
                    {payitems.map((item) => (
                        <option
                            key={item.payitem_id}
                            value={item.payitem_id}
                            className="text-gray-700"
                        >
                            {item.payitem_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                {/* Date From */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Date From</label>
                    <div className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm">
                        {convertToISO8601(payrun.payrun_start_date)}
                    </div>
                </div>

                {/* Date To */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Date To</label>
                    <div className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm">
                        {convertToISO8601(payrun.payrun_end_date)}
                    </div>
                </div>

                {/* Payment Date */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Payment Date</label>
                    <div className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm">
                        {convertToISO8601(payrun.payment_date)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptionEdit;
