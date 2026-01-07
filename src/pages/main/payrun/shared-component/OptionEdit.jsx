import { ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { convertToISO8601, formatDateToWords } from "../../../../utility/datetime.utility";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import env from "../../../../configs/env.config";
import Tooltip from "../../../../components/Tooltip";
import { useSharedRunningPayrunOperationContext } from "../../../../contexts/SharedRunningPayrunOperationProvider";
import PayrunLogs from "./PayrunLogs";

const OptionEdit = () => {
    const { payitems } = usePayitemContext();
    const {
        payrun,
        handleClosePayrun,
        handleSaveEdit,
        handleChangeStatus,
        statusLoading,
        isSaving,
        handleAddPayitemToPayslips,
        toggleLogs, handleToggleLogs,
        logs,
        calculateTaxWithheld,
        handleToggleCalculateTaxWithhelds,
        employeeForLastPay,
    } = useSharedRunningPayrunOperationContext();

    const isForApproval = payrun.status === "FOR_APPROVAL";
    const isApproved = payrun.status === "APPROVED";

    // TODO: approved payrun feature
    /**
     *  add the feature access variable
     * update the env config to add the approved status access
     * update the env variable to add the approved status access
     * change the status button to allow change based on 2 access control. 
     *  */
    const hasChangedStatusAccess = userHasFeatureAccess(env.VITE_PAYROLL_CHANGE_PAYRUN_STATUS);
    const hasEditPayrunAccess = userHasFeatureAccess(env.VITE_PAYROLL_EDIT_PAYRUNS);
    const hasApprovedPayrunAccess = userHasFeatureAccess(env.VITE_PAYROLL_APPROVE_PAYRUN);
    const canApprovePayrun =
        hasChangedStatusAccess && hasApprovedPayrunAccess;

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
                        onClick={handleClosePayrun}
                        className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                    >
                        Close
                    </button>

                    {isSaving ? (
                        <span className="text-sm text-gray-500">Saving...</span>
                    ) : (
                        <div className="flex gap-x-2">
                            <Tooltip text={(!hasEditPayrunAccess || isApproved) ? "You have no access to edit this payrun or it is already approved" : ""}>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isForApproval || isApproved || !hasEditPayrunAccess}
                                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isForApproval || isApproved
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-teal-600 text-white hover:bg-teal-700"
                                        }`}
                                >
                                    Save
                                </button>
                            </Tooltip>
                            <Tooltip text={"Calculate the tax withheld for edited records. Otherwise, save all and calculate tax withheld for all records."}>
                                <input
                                    type="checkbox"
                                    value={calculateTaxWithheld}
                                    onChange={handleToggleCalculateTaxWithhelds}
                                    disabled={isForApproval || isApproved}
                                />
                            </Tooltip>
                        </div>
                    )}

                    {statusLoading ? (
                        <span className="text-sm text-gray-500">Loading...</span>
                    ) : (
                        // <Tooltip text={(!hasChangedStatusAccess || isApproved) ? "Approved or No Access" : ""}>
                        //     <select
                        //         value={payrun.status}
                        //         onChange={(e) => handleChangeStatus(e.target.value)}
                        //         disabled={isApproved || !hasChangedStatusAccess}
                        //         className={`px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${isApproved ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
                        //             }`}
                        //     >
                        //         <option value="DRAFT">Draft</option>
                        //         <option value="FOR_APPROVAL">For Approval</option>
                        //         <option value="APPROVED">Approved</option>
                        //         <option value="REJECTED">Rejected</option>
                        //     </select>
                        // </Tooltip>
                        <Tooltip
                            text={
                                !hasChangedStatusAccess
                                    ? "You have no access to change payrun status"
                                    : !hasApprovedPayrunAccess
                                        ? "You do not have access to approve payruns"
                                        : ""
                            }
                        >
                            <select
                                value={payrun.status}
                                onChange={(e) => handleChangeStatus(e.target.value)}
                                disabled={!hasChangedStatusAccess || isApproved}
                                className={`px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white
            ${!hasChangedStatusAccess || isApproved
                                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                        : "focus:ring-2 focus:ring-teal-500"
                                    }`}
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="FOR_APPROVAL">For Approval</option>

                                <option
                                    value="APPROVED"
                                    disabled={!canApprovePayrun}
                                >
                                    Approved
                                </option>

                                <option value="REJECTED">Rejected</option>
                            </select>
                        </Tooltip>

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

            {/* Add Payitem control - at the bottom with proper spacing */}
            <div className="flex items-center justify-end pt-4 border-t mt-4 border-gray-200">
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
