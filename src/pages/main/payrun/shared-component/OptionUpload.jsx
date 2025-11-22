import { useUploadPayrunContext } from "../../../../contexts/UploadPayrunProvider";

const OptionUpload = () => {
    const {
        payslipsPayables, isLoading, handleClosePayrun, options,
        handleInputChange, uploadPayrunFile,
        handleCheckEmployeesIfExist,
        handleSave,
    } = useUploadPayrunContext();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadPayrunFile(file);
        }
        e.target.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const missing = await handleCheckEmployeesIfExist();
        if (missing.length > 0) return;
        await handleSave();
    };

    return (
        <div className="relative bg-white p-6 rounded-xl border border-gray-200">
            {/* Top controls section - with proper spacing */}
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Payrun Details</h3>
                {(Object.keys(payslipsPayables).length > 0) && (
                    <div className="space-x-2">
                        <button
                            onClick={handleClosePayrun}
                            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            form="payrunForm"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                )}
            </div>

            {/* Main form grid */}
            <form
                id="payrunForm"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6"
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

                {/*  Payrun Type */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                        Payrun Type
                    </label>
                    <select
                        value={options.payrun_type}
                        onChange={(e) => handleInputChange('payrun_type', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                    >
                        <option value="REGULAR">Regular Payrun</option>
                        <option value="SPECIAL">Special Payrun</option>
                        <option value="LAST">Last Payrun</option>

                    </select>
                </div>

                {/*  Payrun Status */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                        Payrun Status
                    </label>
                    <select
                        value={options.payrun_status}
                        onChange={(e) => handleInputChange('payrun_status', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="FOR_APPROVAL">For Approval</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>

                    </select>
                </div>


                {/* Generate Button */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                        Select File
                    </label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-3xl disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                    />
                </div>
            </form>
        </div>
    );
};

export default OptionUpload;