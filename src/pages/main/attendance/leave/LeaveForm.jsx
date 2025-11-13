import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useLeaveContext } from "../../../../contexts/LeaveProvider";

const LeaveForm = () => {
    const {
        handleRemoveRow,
        handleAddRow,
        handleResetForm,
        handleFieldChange,
        handleAddLeave,
        leavesFormData,
        isAddLeaveLoading
    } = useLeaveContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddLeave();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Table Header */}
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    {/* Header Row */}
                    <div className="grid grid-cols-[40px_150px_150px_200px_150px_120px_120px_120px] gap-3 p-3 bg-gray-50 rounded-t-lg border-b border-gray-200 text-sm font-medium text-gray-700">
                        <div></div>
                        <div>Employee Id *</div>
                        <div>Leave Date *</div>
                        <div>Leave Type</div>
                        <div>Leave Status</div>
                        <div>Is Halfday</div>
                        <div>Is Paid</div>
                        <div></div>
                    </div>

                    {/* Employee Rows */}
                    <div className="space-y-0">
                        {leavesFormData.map((leave, index) => (
                            <div key={leave.id} className="grid grid-cols-[40px_150px_150px_200px_150px_120px_120px_120px] gap-3 p-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                {/* Row Number */}
                                <div className="flex items-center justify-center text-sm text-gray-500 font-medium">
                                    {index + 1}
                                </div>

                                {/* Employee Id */}
                                <input
                                    type="text"
                                    value={leave.employee_id || ''}
                                    onChange={(e) => handleFieldChange(leave.id, 'employee_id', e.target.value)}
                                    placeholder="Employee Id"
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* Leave Date */}
                                <input
                                    type="date"
                                    value={leave.leave_date || ''}
                                    onChange={(e) => handleFieldChange(leave.id, 'leave_date', e.target.value || '')}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* Leave Type */}
                                <select
                                    value={leave.leave_type || 'SICK_LEAVE'}
                                    onChange={(e) => handleFieldChange(leave.id, 'leave_type', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="SICK_LEAVE">Sick Leave</option>
                                    <option value="VACATION_LEAVE">Vacation Leave</option>
                                    <option value="MATERNITY_LEAVE">Maternity Leave</option>
                                    <option value="PATERNITY_LEAVE">Paternity Leave</option>
                                    <option value="EMERGENCY_LEAVE">Emergency Leave</option>
                                    <option value="BEREAVEMENT_LEAVE">Bereavement Leave</option>
                                    <option value="PERSONAL_LEAVE">Personal Leave</option>
                                    <option value="OTHER">Other</option>
                                </select>

                                {/* Leave Status */}
                                <select
                                    value={leave.leave_status || 'PENDING'}
                                    onChange={(e) => handleFieldChange(leave.id, 'leave_status', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>

                                {/* Is Halfday */}
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={leave.is_half_day || false}
                                        onChange={(e) => handleFieldChange(leave.id, 'is_half_day', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>

                                {/* Is Paid */}
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={leave.is_paid || false}
                                        onChange={(e) => handleFieldChange(leave.id, 'is_paid', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>

                                {/* Remove Button */}
                                <div className="flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRow(leave.id)}
                                        disabled={leavesFormData.length === 1}
                                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        title="Remove row"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Row Button */}
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Add Another Row
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 gap-x-2">
                <button
                    type="button"
                    className="px-6 py-2 hover:bg-gray-300 text-sm bg-gray-200 rounded-full"
                    onClick={handleResetForm}
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    {isAddLeaveLoading ? "Loading ..." : "Add"}
                </button>
            </div>
        </form>
    );
};

export default LeaveForm;