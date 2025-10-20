import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'; // Added missing imports
import { useRestdayContext } from "../../../../contexts/RestdayProvider";
import { toDatetimeLocalString, toSqlDateTimeString } from "../../../../utility/datetime.utility";

const RestdayForm = () => {
    const { handleAddRestdays, restdayFormData, handleFieldChange, handleAddRow, handleRemoveRow, isAddRestdayLoading, handleResetForm } = useRestdayContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddRestdays();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Table Header */}
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    {/* Header Row */}
                    <div className="grid grid-cols-[40px_150px_150px_200px_200px_120px_120px_120px_120px_120px_140px_120px_80px_120px] gap-3 p-3 bg-gray-50 rounded-t-lg border-b border-gray-200 text-sm font-medium text-gray-700">
                        <div></div>
                        <div>Employee Id *</div>
                        <div>Restday Date *</div>
                        <div>Time In</div>
                        <div>Time Out</div>
                        <div>Hours Rendered</div>
                        <div>Hours Worked</div>
                        <div>Undertime</div>
                        <div>Tardiness</div>
                        <div>ND Same Day</div>
                        <div>ND Next Day</div>
                        <div>Shift Type</div>
                        <div></div>
                    </div>

                    {/* Employee Rows */}
                    <div className="space-y-0">
                        {restdayFormData.map((rd, index) => (
                            <div key={rd.id} className="grid grid-cols-[40px_150px_150px_200px_200px_120px_120px_120px_120px_120px_140px_120px_80px_120px] gap-3 p-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                {/* Row Number */}
                                <div className="flex items-center justify-center text-sm text-gray-500 font-medium">
                                    {index + 1}
                                </div>

                                {/* Employee Id */}
                                <input
                                    type="text"
                                    value={rd.employee_id || ''}
                                    onChange={(e) => handleFieldChange(rd.id, 'employee_id', e.target.value)}
                                    placeholder="Employee Id"
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* Restday Date - Fixed field name from attendance_date to restday_date */}
                                <input
                                    type="date"
                                    value={rd.restday_date || ''}
                                    onChange={(e) => handleFieldChange(rd.id, 'restday_date', e.target.value || '')}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                {/* Time In */}
                                <input
                                    type="datetime-local"
                                    value={toDatetimeLocalString(rd.time_in)}
                                    onChange={(e) => handleFieldChange(rd.id, 'time_in', toSqlDateTimeString(e.target.value))}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                {/* Time Out */}
                                <input
                                    type="datetime-local"
                                    value={toDatetimeLocalString(rd.time_out)}
                                    onChange={(e) => handleFieldChange(rd.id, 'time_out', toSqlDateTimeString(e.target.value))}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                {/* Hours rendered*/}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={rd.hours_rendered || ''}
                                    onChange={(e) => handleFieldChange(rd.id, 'hours_rendered', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                {/* Hours worked */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={rd.hours_worked || ''}
                                    onChange={(e) => handleFieldChange(rd.id, 'hours_worked', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                {/* Undertime */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={rd.undertime || ''}
                                    onChange={(e) => handleFieldChange(rd.id, 'undertime', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                {/* tardiness */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={rd.tardiness || ''}
                                    onChange={(e) => handleFieldChange(rd.id, 'tardiness', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                {/* same day night_differential */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={rd.nd_sameday || ''}
                                    onChange={(e) => handleFieldChange(rd.id, 'nd_sameday', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                {/* next day night_differential */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={rd.nd_nextday || ''}
                                    onChange={(e) => handleFieldChange(rd.id, 'nd_nextday', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                {/* Shift type */}
                                <select
                                    value={rd.shift_type || 'REGULAR'}
                                    onChange={(e) => handleFieldChange(rd.id, 'shift_type', e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="REGULAR">Regular</option>
                                    <option value="SLIDE">Slide</option>
                                </select>

                                {/* Remove Button */}
                                <div className="flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRow(rd.id)}
                                        disabled={restdayFormData.length === 1}
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
                    disabled={isAddRestdayLoading}
                    className="px-6 py-2  bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAddRestdayLoading ? "Loading ..." : "Add"}
                </button>
            </div>
        </form>
    );
};

export default RestdayForm;