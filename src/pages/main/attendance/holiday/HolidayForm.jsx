import { useHolidayContext } from "../../../../contexts/HolidayProvider";

const HolidayForm = () => {
    const {
        handleAddHoliday,
        addLoading,
        holidayFormData,
        handleFormChange,
        handleShowAddHolidayModal
    } = useHolidayContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddHoliday();
    };

    const handleCancel = () => {
        handleShowAddHolidayModal();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 px-5 py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Holiday Date *
                    </label>
                    <input
                        type="date"
                        value={holidayFormData.holiday_date}
                        onChange={(e) => handleFormChange('holiday_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Holiday Name *
                    </label>
                    <input
                        type="text"
                        value={holidayFormData.holiday_name || ''}
                        onChange={(e) => handleFormChange('holiday_name', e.target.value)}
                        placeholder="Enter holiday name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Holiday Type *
                    </label>
                    <select
                        value={holidayFormData.holiday_type || "REGULAR"}
                        onChange={(e) => handleFormChange('holiday_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
                    >
                        <option value="REGULAR">Regular</option>
                        <option value="SPECIAL">Special</option>
                        <option value="CUSTOM">Custom</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Holiday Rate *
                    </label>
                    <input
                        type="number"
                        value={holidayFormData.holiday_rate}
                        onChange={(e) => handleFormChange('holiday_rate', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={addLoading}
                    className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={addLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700"
                >
                    {addLoading ? (
                        <div className="flex items-center">
                            Loading...
                        </div>
                    ) : (
                        "Add Holiday"
                    )}
                </button>
            </div>
        </form>
    );
};

export default HolidayForm;