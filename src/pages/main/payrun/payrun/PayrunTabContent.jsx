import { formatDateToWords } from "../../../../utility/datetime.utility";

const statusConfig = {
    DRAFT: { bg: "bg-slate-100", text: "text-slate-700", label: "Draft" },
    FOR_APPROVAL: { bg: "bg-blue-100", text: "text-blue-700", label: "For Approval" },
    APPROVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
    REJECTED: { bg: "bg-rose-100", text: "text-rose-700", label: "Rejected" },
};

const PayrunTabContent = ({
    payruns,
    handleClickPayrun,
    handleDownloadPayslipsExcel,
    handleNavigateSendPayslip,
    hasDeleteAccess,
    setPayrunToDelete,
    setShowDeleteModal,
}) => {
    if (!payruns?.length) {
        return <div className="text-center text-gray-400 text-sm py-8">No payruns found.</div>;
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-100 rounded-xl shadow-sm text-xs">
                <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <th className="px-4 py-2 text-left font-semibold">Status</th>
                        <th className="px-4 py-2 text-left font-semibold">Type</th>
                        <th className="px-4 py-2 text-left font-semibold">Title / Period</th>
                        <th className="px-4 py-2 text-left font-semibold">Payment Date</th>
                        <th className="px-4 py-2 text-left font-semibold">Updated</th>
                        <th className="px-4 py-2 text-center font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payruns.map((payrun) => {
                        const status = statusConfig[payrun.status] || { bg: "bg-gray-100", text: "text-gray-500", label: payrun.status };
                        return (
                            <tr
                                key={payrun.payrun_id}
                                className="hover:bg-gray-50 transition cursor-pointer text-xs text-gray-800"
                                onClick={() => handleClickPayrun(payrun.payrun_id, payrun.payrun_type)}
                            >
                                <td className="px-3 py-2 align-middle">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${status.bg} ${status.text} shadow-sm`} style={{ minWidth: 90, textAlign: 'center', display: 'inline-block' }}>{status.label}</span>
                                </td>
                                <td className="px-3 py-2 align-middle">
                                    <span className="text-gray-500 font-normal">
                                        {payrun.payrun_type === 'REGULAR' && 'Regular'}
                                        {payrun.payrun_type === 'SPECIAL' && 'Special'}
                                        {payrun.payrun_type === 'LAST' && 'Last'}
                                    </span>
                                </td>
                                <td className="px-3 py-2 align-middle">
                                    <span className="text-gray-900 font-normal truncate block">
                                        {payrun.payrun_type === 'LAST'
                                            ? payrun.payrun_title
                                            : `${formatDateToWords(payrun.payrun_start_date)} to ${formatDateToWords(payrun.payrun_end_date)}`}
                                    </span>
                                </td>
                                <td className="px-3 py-2 align-middle">
                                    <span className="text-gray-900 font-normal">{formatDateToWords(payrun.payment_date)}</span>
                                </td>
                                <td className="px-3 py-2 align-middle">
                                    <span className="text-gray-400 font-normal">{formatDateToWords(payrun.updated_at)}</span>
                                </td>
                                <td className="px-3 py-2 text-center align-middle">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={e => { e.stopPropagation(); handleDownloadPayslipsExcel(payrun.payrun_id); }}
                                            className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                                            title="Download payslips"
                                            tabIndex={0}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l-6-6m6 6l6-6" />
                                            </svg>
                                        </button>
                                        {payrun.status === "APPROVED" && (
                                            <button
                                                onClick={e => { e.stopPropagation(); handleNavigateSendPayslip(payrun.payrun_id); }}
                                                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                                                title="Send payslips"
                                                tabIndex={0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25v-1.5" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25l-5.25 5.25-5.25-5.25" />
                                                </svg>
                                            </button>
                                        )}
                                        {hasDeleteAccess && (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setPayrunToDelete(payrun);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                                                title="Delete"
                                                tabIndex={0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PayrunTabContent;
