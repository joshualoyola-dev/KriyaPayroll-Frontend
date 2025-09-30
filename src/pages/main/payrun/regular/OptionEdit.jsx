import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { useRegularPayrunContext } from "../../../../contexts/RegularPayrunProvider";

const OptionEdit = () => {
    const { payitems } = usePayitemContext();
    const {
        options, handleInputChange,


        payrun,
        handleCloseRegularPayrun,
        handleSaveEdit,
        handleChangeStatus,
        statusLoading,
        isSaving,
    } = useRegularPayrunContext();


    return (
        <div className="relative bg-white p-6 rounded-xl border border-gray-200">
            <div className="absolute top-4 right-4 gap-2">
                <button
                    onClick={handleCloseRegularPayrun}
                    className="px-3 py-1  bg-gray-600 text-white hover:cursor-pointer"
                >
                    Close
                </button>
                {
                    isSaving
                        ? "Loading..."
                        : <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1  bg-teal-700 text-white hover:cursor-pointer"
                        >
                            Save edit
                        </button>

                }
                <button
                    onClick={() => { }}
                    className="px-3 py-1  bg-teal-700 text-white hover:cursor-pointer"
                >
                    Finalize
                </button>

                {statusLoading
                    ? "Loading..."
                    : <select
                        value={payrun.status}
                        onChange={(e) => {
                            const status = e.target.value;
                            handleChangeStatus(status);
                        }}
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="FOR_APPROVAL">For Approval</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                }
            </div>

            {/* Main  grid */}
            <div
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
                        disabled={true}
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
                        disabled={true}
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
                        disabled={true}
                    />
                </div>


            </div>
        </div >
    );
};

export default OptionEdit;