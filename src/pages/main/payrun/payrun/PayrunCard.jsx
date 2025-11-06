import { FolderArrowDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { convertToISO8601 } from "../../../../utility/datetime.utility";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";

const PayrunCard = ({ payrun, idx, oncClickCard, onDelete, onNavigateSendPayslip, onDownloadPayslips }) => {
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

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(payrun.payrun_id);

        const confirmed = window.confirm(`Are you sure you want to delete ${payrun.payrun_title}? This action cannot be undone.`);
        if (confirmed) {
            onDelete(payrun.payrun_id);
        }
    }

    return (
        <div
            onClick={() => oncClickCard(payrun.payrun_id)}
            key={idx}
            className="flex items-center justify-between p-5 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
        >
            {/* Left section */}
            <div className="flex items-start gap-4 flex-1">
                <span
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold ${status.bg} ${status.text} whitespace-nowrap flex-shrink-0 w-24 text-center`}
                >
                    {status.label}
                </span>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                        {payrun.payrun_title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {convertToISO8601(payrun.payrun_start_date)} — {convertToISO8601(payrun.payrun_end_date)}
                    </p>
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-6 ml-6">
                <div className="text-right text-sm w-32">
                    <p className="text-gray-500 text-xs mb-0.5">Payment Date</p>
                    <p className="font-semibold text-gray-900">
                        {convertToISO8601(payrun.payment_date)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Updated {convertToISO8601(payrun.updated_at)}
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownloadPayslips(payrun.payrun_id);
                        }}
                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
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
                            className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Send payslips"
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrunCard;