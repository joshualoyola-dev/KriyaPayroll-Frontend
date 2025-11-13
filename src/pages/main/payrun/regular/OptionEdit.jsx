import { ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { useRegularPayrunContext } from "../../../../contexts/RegularPayrunProvider";
import { convertToISO8601 } from "../../../../utility/datetime.utility";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import env from "../../../../configs/env.config";
import PayrunLogs from "../../../../components/PayrunLogs";

const OptionEdit = () => {
    const { payitems } = usePayitemContext();
    const {
        payrun,
        handleCloseRegularPayrun,
        handleSaveEdit,
        handleChangeStatus,
        statusLoading,
        isSaving,
        handleAddPayitemToPayslips,
        handleSaveAndCalculateTaxWitheld,
        toggleLogs, handleToggleLogs,
        logs,
    } = useRegularPayrunContext();

    const isForApproval = payrun.status === "FOR_APPROVAL";
    const isApproved = payrun.status === "APPROVED";

    const hasChangedStatusAccess = userHasFeatureAccess(env.VITE_PAYROLL_CHANGE_PAYRUN_STATUS);
    const hasEditPayrunAccess = userHasFeatureAccess(env.VITE_PAYROLL_EDIT_PAYRUNS)

    return (
        <div className="relative bg-white p-6 rounded-xl border border-gray-200">
            {/* Top controls section - with proper spacing */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">Payrun Details</h3>
                    <button
                        onClick={handleToggleLogs}
                        className="relative p-1 hover:bg-gray-100 rounded-full focus:outline-none"
                    >
                        <InformationCircleIcon className="w-4 h-4 text-gray-500" />
                        {toggleLogs && < PayrunLogs logs={logs} />}
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCloseRegularPayrun}
                        className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                    >
                        Close
                    </button>

                    {isSaving ? (
                        <span className="text-sm text-gray-500">Saving...</span>
                    ) : (
                        <div className="flex gap-x-2">
                            <button
                                onClick={handleSaveEdit}
                                disabled={isForApproval || isApproved || !hasEditPayrunAccess}
                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isForApproval || isApproved
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-teal-600 text-white hover:bg-teal-700"
                                    }`}
                                title={(!hasEditPayrunAccess || isApproved) ? "You have no access to edit this payrun or it is already approved" : ""}
                            >
                                Save
                            </button>

                            <button
                                onClick={handleSaveAndCalculateTaxWitheld}
                                disabled={isForApproval || isApproved || !hasEditPayrunAccess}
                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isForApproval || isApproved
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-teal-600 text-white hover:bg-teal-700"
                                    }`}
                                title={(!hasEditPayrunAccess || isApproved) ? "You have no access to edit this payrun or it is already approved" : ""}
                            >
                                Calculate Tax Withheld
                            </button>
                        </div>
                    )}

                    {statusLoading ? (
                        <span className="text-sm text-gray-500">Loading...</span>
                    ) : (
                        <select
                            value={payrun.status}
                            onChange={(e) => handleChangeStatus(e.target.value)}
                            disabled={isApproved || !hasChangedStatusAccess}
                            className={`px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${isApproved ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
                                }`}
                            title={!hasChangedStatusAccess ? "You don’t have access to change status" : ""}
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="FOR_APPROVAL">For Approval</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Date selection grid - now with clear spacing */}
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

            {/* Add Payitem control - at the bottom with proper spacing */}
            <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Add Pay Item:</label>
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                handleAddPayitemToPayslips(e.target.value);
                            }
                        }}
                        disabled={isForApproval || isApproved}
                        className={`w-48 px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white ${isForApproval || isApproved
                            ? "cursor-not-allowed bg-gray-100 text-gray-400"
                            : ""
                            }`}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select payitem...
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
            </div>
        </div>
    );
};

export default OptionEdit;
