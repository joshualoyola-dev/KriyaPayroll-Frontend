
import { useState } from "react";
import { FolderArrowDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatDateToWords } from "../../../../utility/datetime.utility";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";

const PayrunCard = ({ payrun, idx, oncClickCard, onDelete, onNavigateSendPayslip, onDownloadPayslips, hasDeleteAccess }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const statusConfig = {
        DRAFT: {
            bg: "bg-slate-100",
            text: "text-slate-700",
            label: "Draft"
        },
        FOR_APPROVAL: {
            bg: "bg-blue-100",
            text: "text-blue-700",
            label: "For Approval"
        },
        APPROVED: {
            bg: "bg-emerald-100",
            text: "text-emerald-700",
            label: "Approved"
        },
        REJECTED: {
            bg: "bg-rose-100",
            text: "text-rose-700",
            label: "Rejected"
        },
    };

    const status = statusConfig[payrun.status];


    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        onDelete(payrun.payrun_id);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <>
        <div
            onClick={() => oncClickCard(payrun.payrun_id)}
            key={idx}
            className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group text-xs"
        >
            {/* Left: Status and Main Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${status.bg} ${status.text} shadow-sm`}
                    style={{ minWidth: 70, textAlign: 'center' }}
                >
                    {status.label}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-gray-900 truncate text-xs">
                            {payrun.payrun_type === 'LAST' ? payrun.payrun_title : formatDateToWords(payrun.payrun_start_date)}
                        </h3>
                        <span className="text-gray-400 text-xs">to</span>
                        <h3 className="font-semibold text-gray-900 truncate text-xs">
                            {formatDateToWords(payrun.payrun_end_date)}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500 font-medium">
                            {payrun.payrun_type === 'REGULAR' && 'Regular Payrun'}
                            {payrun.payrun_type === 'SPECIAL' && 'Special Payrun'}
                            {payrun.payrun_type === 'LAST' && 'Last Payrun'}
                        </span>
                        <span className="text-gray-300 text-xs">|</span>
                        <span className="text-xs text-gray-400">Updated {formatDateToWords(payrun.updated_at)}</span>
                    </div>
                </div>
            </div>

            {/* Right: Payment Date and Actions */}
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 flex-shrink-0">
                <div className="text-left md:text-right text-xs md:w-28">
                    <div className="text-gray-500">Payment Date</div>
                    <div className="font-semibold text-gray-900 text-xs">
                        {formatDateToWords(payrun.payment_date)}
                    </div>
                </div>
                <div className="flex items-center gap-1 md:gap-1 mt-2 md:mt-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownloadPayslips(payrun.payrun_id);
                        }}
                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                        title="Download payslips"
                    >
                        <FolderArrowDownIcon className="h-5 w-5" />
                    </button>
                    {payrun.status === "APPROVED" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigateSendPayslip(payrun.payrun_id);
                            }}
                            className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                            title="Send payslips"
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    )}
                    {hasDeleteAccess &&
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                            title="Delete"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    }
                </div>
            </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-2 animate-fadeIn">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Payrun?</h2>
                        <p className="text-sm text-gray-600">Are you sure you want to delete <span className="font-medium">{payrun.payrun_title}</span>? This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={handleCancelDelete}
                            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default PayrunCard;