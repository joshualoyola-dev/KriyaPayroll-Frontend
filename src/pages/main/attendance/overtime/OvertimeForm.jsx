import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useOvertimeContext } from "../../../../contexts/OvertimeProvider";
const OvertimeForm = () => {
    // const { handleAddRow, handleResetForm, handleFieldChange, handleAddAttendances, attendanceFormData, handleRemoveRow, isAddAttendanceLoading } = useAttendanceContext();
    const { handleRemoveRow, handleAddRow, handleResetForm, handleFieldChange, handleAddOvertime, overtimeFormData, isAddOvertimeLoading } = useOvertimeContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddOvertime();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Table Header */}
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    {/* Header Row */}
                    <div className="grid grid-cols-[40px_150px_150px_200px_200px_120px_120px_120px_120px_120px_120px_120px] gap-3 p-3 bg-gray-50 rounded-t-lg border-b border-gray-200 text-sm font-medium text-gray-700">
                        <div></div>
                        <div>Employee Id *</div>
                        <div>Overtime Date *</div>
                        <div>OT Hours Rendered</div>
                        <div>OT Same Day</div>
                        <div>OT Next Day</div>
                        <div>ND OT</div>
                        <div>ND OT same day</div>
                        <div>ND OT next day</div>
                        <div>Overtime Type</div>
                        <div>Overtime Status</div>
                        <div></div>
                    </div>

                    {/* Employee Rows */}
                    <div className="space-y-0">
                        {overtimeFormData.map((ot, index) => (
                            <div key={ot.id} className="grid grid-cols-[40px_150px_150px_200px_200px_120px_120px_120px_120px_120px_120px_120px] gap-3 p-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                {/* Row Number */}
                                <div className="flex items-center justify-center text-sm text-gray-500 font-medium">
                                    {index + 1}
                                </div>

                                {/* Employee Id */}
                                <input
                                    type="text"
                                    value={ot.employee_id || ''}
                                    onChange={(e) => handleFieldChange(ot.id, 'employee_id', e.target.value)}
                                    placeholder="Employee Id"
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* Overtime Date */}
                                <input
                                    type="date"
                                    value={ot.overtime_date || ''}
                                    onChange={(e) => handleFieldChange(ot.id, 'overtime_date', e.target.value || '')}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* OT Hour Rendered */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ot.ot_hours || ''}
                                    onChange={(e) => handleFieldChange(ot.id, 'ot_hours', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* OT Hour Rendered Same day */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ot.ot_hsameday || ''}
                                    onChange={(e) => handleFieldChange(ot.id, 'ot_hsameday', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* OT Hour Rendered next day */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ot.ot_hnextday || ''}
                                    onChange={(e) => handleFieldChange(ot.id, 'ot_hnextday', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />


                                {/* OT ND */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ot.nd_ot_hours || ''}
                                    onChange={(e) => handleFieldChange(ot.id, 'nd_ot_hours', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* OT ND same day*/}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ot.ndot_hsameday || ''}
                                    onChange={(e) => handleFieldChange(ot.id, 'ndot_hsameday', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />


                                {/* OT ND next day*/}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ot.ndot_hnextday || ''}
                                    onChange={(e) => handleFieldChange(ot.id, 'ndot_hnextday', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* Overtime Type */}
                                <select
                                    value={ot.overtime_type || 'REGULAR'}
                                    onChange={(e) => handleFieldChange(ot.id, 'overtime_type', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    required
                                >
                                    <option value=""></option>
                                    <option value="REGULAR_DAY">Regular Day</option>
                                    <option value="REST_DAY">Rest Day</option>
                                    <option value="SPECIAL_HOLIDAY">Special Holiday</option>
                                    <option value="REGULAR_HOLIDAY">Regular Holiday</option>
                                    <option value="REST_DAY_SPECIAL_HOLIDAY">Rest Day & Speical Holiday</option>
                                    <option value="REST_DAY_REGULAR_HOLIDAY">Rest Day & Regular Holiday</option>
                                </select>

                                {/* Overtiem Status */}
                                <select
                                    value={ot.overtime_status || 'PENDING'}
                                    onChange={(e) => handleFieldChange(ot.id, 'overtime_status', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    required
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>

                                {/* Remove Button */}
                                <div className="flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRow(ot.id)}
                                        disabled={overtimeFormData.length === 1}
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
                    className="px-6 py-2 hover:bg-gray-300 text-sm bg-gray-200 rounded-full "
                    onClick={handleResetForm}
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="px-6 py-2  bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    {isAddOvertimeLoading ? "Loading ..." : "Add"}
                </button>
            </div>
        </form>
    );
};

export default OvertimeForm;