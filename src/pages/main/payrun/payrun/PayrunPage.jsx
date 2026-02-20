import { BanknotesIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { formatDateToWords } from "../../../../utility/datetime.utility";
import { useState } from "react";
import { usePayrunContext } from "../../../../contexts/PayrunProvider";
import PayrunFilter from "./PayrunFilter";
// import PayrunCard from "./PayrunCard";
import DualBallLoading from "../../../../components/DualBallLoading";
import LoadingBackground from "../../../../components/LoadingBackground";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import env from "../../../../configs/env.config";
import NoAccess from "../../../../components/NoAccess";

const PayrunPage = () => {

    const { payruns, isPayrunLoading, handleClickPayrun, handleDeleteOnePayrun, deleteLoading, handleNavigateSendPayslip, handleDownloadPayslipsExcel, isDownloading, handleDownloadAllLastPayrunsSummary } = usePayrunContext();

    // Modal state for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [payrunToDelete, setPayrunToDelete] = useState(null);

    
    const [selectedTab, setSelectedTab] = useState('regular');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [fromDate, setFromDateState] = useState("");
    const [toDate, setToDateState] = useState("");
    const [dateFilterActive, setDateFilterActive] = useState(false);

    // Instantly activate date filter on change
    const setFromDate = (val) => {
        setFromDateState(val);
        setDateFilterActive(!!val || !!toDate);
    };
    const setToDate = (val) => {
        setToDateState(val);
        setDateFilterActive(!!fromDate || !!val);
    };

    const payrunTabs = [
        { key: 'regular', label: 'Regular Payrun', icon: BanknotesIcon },
        { key: 'special', label: 'Special Payrun', icon: BanknotesIcon },
        { key: 'last', label: 'Last Payrun', icon: BanknotesIcon },
    ];

    // Filter by status
    const filterByStatus = (payrunsArr) => {
        if (selectedStatus === 'All') return payrunsArr;
        return payrunsArr.filter(payrun => payrun.status === selectedStatus);
    };

    // Filter by date range
    const filterByDate = (payrunsArr) => {
        if (!dateFilterActive || (!fromDate && !toDate)) return payrunsArr;
        return payrunsArr.filter(payrun => {
            const payrunDate = payrun.payrun_start_date ? payrun.payrun_start_date.slice(0, 10) : "";
            if (fromDate && toDate) {
                return payrunDate >= fromDate && payrunDate <= toDate;
            } else if (fromDate) {
                return payrunDate >= fromDate;
            } else if (toDate) {
                return payrunDate <= toDate;
            }
            return true;
        });
    };

    const applyAllFilters = (arr, type) => {
        let filtered = arr.filter(payrun => payrun.payrun_type === type);
        filtered = filterByStatus(filtered);
        filtered = filterByDate(filtered);
        return filtered;
    };

    const payrunTypeMap = {
        regular: applyAllFilters(payruns, 'REGULAR'),
        special: applyAllFilters(payruns, 'SPECIAL'),
        last: applyAllFilters(payruns, 'LAST'),
    };

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_PAYRUNS_VIEW);
    const hasDeleteAccess = userHasFeatureAccess(env.VITE_PAYROLL_DELETE_PAYRUN);


    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }


    // Tab content renderer (table version)
    const renderTabContent = () => {
        const currentPayruns = payrunTypeMap[selectedTab];
        if (!currentPayruns?.length) {
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
                        {currentPayruns.map((payrun, idx) => {
                            const statusConfig = {
                                DRAFT: { bg: "bg-slate-100", text: "text-slate-700", label: "Draft" },
                                FOR_APPROVAL: { bg: "bg-blue-100", text: "text-blue-700", label: "For Approval" },
                                APPROVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
                                REJECTED: { bg: "bg-rose-100", text: "text-rose-700", label: "Rejected" },
                            };
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
                                            {payrun.payrun_type === 'LAST' ? payrun.payrun_title : `${formatDateToWords(payrun.payrun_start_date)} to ${formatDateToWords(payrun.payrun_end_date)}`}
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


    return (
        <>
        <div className="w-full max-w-full">
            {/* Tabs */}
            <div className="flex gap-x-2 border-b border-gray-200 bg-white rounded-t-lg overflow-x-auto">
                {payrunTabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = selectedTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedTab(tab.key)}
                            className={`flex items-center cursor-pointer gap-x-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 focus:outline-none ${isActive ? 'border-teal-600 text-teal-600 bg-gray-50' : 'border-transparent text-gray-500 hover:text-teal-600 hover:bg-gray-50'}`}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Filter */}
            <div className="pt-4 mb-4 w-full">
                <PayrunFilter
                    status={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    // onSearch no longer needed
                />
            </div>

            {/* Download All Last Payrun Button (only for Last Payrun tab) */}
            {selectedTab === 'last' && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={handleDownloadAllLastPayrunsSummary}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-xs font-semibold shadow transition"
                        style={{ minHeight: 0 }}
                    >
                        Download All Last Payrun
                    </button>
                </div>
            )}

            {/* Tab Content */}
            <div className="pt-5">
                {isPayrunLoading ? <DualBallLoading /> : renderTabContent()}
            </div>
            {(deleteLoading || isDownloading) && <LoadingBackground />}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && payrunToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-2 animate-fadeIn">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Payrun?</h2>
                        <p className="text-sm text-gray-600">Are you sure you want to delete <span className="font-medium">{payrunToDelete.payrun_title}</span>? This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={() => { setShowDeleteModal(false); setPayrunToDelete(null); }}
                            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                if (payrunToDelete) handleDeleteOnePayrun(payrunToDelete.payrun_id);
                                setPayrunToDelete(null);
                            }}
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

export default PayrunPage;
