import { BanknotesIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { formatDateToWords } from "../../../../utility/datetime.utility";
import { useState } from "react";
import { PayrunFiltersProvider, usePayrunFiltersContext } from "../../../../contexts/PayrunFiltersProvider";
import { usePayrunContext } from "../../../../contexts/PayrunProvider";
import PayrunFilter from "./PayrunFilter";
import PayrunTabContent from "./PayrunTabContent";
import DualBallLoading from "../../../../components/DualBallLoading";
import LoadingBackground from "../../../../components/LoadingBackground";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import env from "../../../../configs/env.config";
import NoAccess from "../../../../components/NoAccess";


const PayrunPageInner = ({ payruns, isPayrunLoading, handleClickPayrun, handleDeleteOnePayrun, deleteLoading, handleNavigateSendPayslip, handleDownloadPayslipsExcel, isDownloading, handleDownloadAllLastPayrunsSummary, hasDeleteAccess }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [payrunToDelete, setPayrunToDelete] = useState(null);
    const {
        selectedTab,
        setSelectedTab,
        selectedStatus,
        setSelectedStatus,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        payrunTabs,
        payrunTypeMap,
        dateFilterType,
        setDateFilterType
    } = usePayrunFiltersContext();

    return (
        <div className="w-full max-w-full">
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

            <div className="pt-4 mb-4 w-full">
                <PayrunFilter
                    status={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                />
            </div>

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

            <div className="pt-5">
                {isPayrunLoading ? (
                    <DualBallLoading />
                ) : (
                    <PayrunTabContent
                        payruns={payrunTypeMap[selectedTab]}
                        handleClickPayrun={handleClickPayrun}
                        handleDownloadPayslipsExcel={handleDownloadPayslipsExcel}
                        handleNavigateSendPayslip={handleNavigateSendPayslip}
                        hasDeleteAccess={hasDeleteAccess}
                        setPayrunToDelete={setPayrunToDelete}
                        setShowDeleteModal={setShowDeleteModal}
                    />
                )}
            </div>
            
            {(deleteLoading || isDownloading) && <LoadingBackground />}

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
        </div>
    );
};

const PayrunPage = () => {
    const { 
        payruns, 
        isPayrunLoading, 
        handleClickPayrun, 
        handleDeleteOnePayrun, 
        deleteLoading, 
        handleNavigateSendPayslip, 
        handleDownloadPayslipsExcel, 
        isDownloading, 
        handleDownloadAllLastPayrunsSummary 
    } = usePayrunContext();

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_PAYRUNS_VIEW);
    const hasDeleteAccess = userHasFeatureAccess(env.VITE_PAYROLL_DELETE_PAYRUN);

    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    }

    return (
        <PayrunFiltersProvider payruns={payruns}>
            <PayrunPageInner
                payruns={payruns}
                isPayrunLoading={isPayrunLoading}
                handleClickPayrun={handleClickPayrun}
                handleDeleteOnePayrun={handleDeleteOnePayrun}
                deleteLoading={deleteLoading}
                handleNavigateSendPayslip={handleNavigateSendPayslip}
                handleDownloadPayslipsExcel={handleDownloadPayslipsExcel}
                isDownloading={isDownloading}
                handleDownloadAllLastPayrunsSummary={handleDownloadAllLastPayrunsSummary}
                hasDeleteAccess={hasDeleteAccess}
            />
        </PayrunFiltersProvider>
    );
};

export default PayrunPage;