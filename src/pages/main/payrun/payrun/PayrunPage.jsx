import { BanknotesIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { usePayrunContext } from "../../../../contexts/PayrunProvider";
import PayrunFilter from "./PayrunFilter";
import PayrunCard from "./PayrunCard";
import DualBallLoading from "../../../../components/DualBallLoading";
import LoadingBackground from "../../../../components/LoadingBackground";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import env from "../../../../configs/env.config";
import NoAccess from "../../../../components/NoAccess";

const PayrunPage = () => {
    const { payruns, isPayrunLoading, handleClickPayrun, handleDeleteOnePayrun, deleteLoading, handleNavigateSendPayslip, handleDownloadPayslipsExcel, isDownloading } = usePayrunContext();

    const [expandedSections, setExpandedSections] = useState({
        regular: true,
        special: true,
        last: true
    });

    const regularPayruns = payruns.filter(payrun => payrun.payrun_type === 'REGULAR');
    const specialPayruns = payruns.filter(payrun => payrun.payrun_type === 'SPECIAL');
    const lastPayruns = payruns.filter(payrun => payrun.payrun_type === 'LAST');

    const hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_PAYRUNS_VIEW);
    const hasDeleteAccess = userHasFeatureAccess(env.VITE_PAYROLL_DELETE_PAYRUN);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (!hasAccess) {
        return <NoAccess title={'Unauthorized'} label={'You are not allowed to access this resource'} />
    };

    const PayrunSection = ({ title, payruns, sectionKey, icon: Icon }) => (
        <div>
            <button
                onClick={() => toggleSection(sectionKey)}
                className="w-full flex items-center justify-between mb-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <span className="flex items-center text-sm font-semibold text-gray-600 gap-x-2">
                    <Icon className="w-5 h-5 text-teal-600" />
                    <p>{title}</p>
                </span>
                <ChevronDownIcon
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${expandedSections[sectionKey] ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {expandedSections[sectionKey] && (
                <div className="space-y-3">
                    {payruns?.map((payrun, idx) => (
                        <PayrunCard
                            key={idx}
                            payrun={payrun}
                            idx={idx}
                            oncClickCard={handleClickPayrun}
                            onDelete={sectionKey !== 'last' ? handleDeleteOnePayrun : undefined}
                            onNavigateSendPayslip={handleNavigateSendPayslip}
                            onDownloadPayslips={handleDownloadPayslipsExcel}
                            hasDeleteAccess={hasDeleteAccess}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <div className="w-full max-w-full">
                <PayrunFilter />
                {
                    isPayrunLoading
                        ? <DualBallLoading />
                        : <div className="flex flex-col pt-5 gap-y-3">
                            <PayrunSection
                                title="Regular Payrun"
                                payruns={regularPayruns}
                                sectionKey="regular"
                                icon={BanknotesIcon}
                            />
                            <PayrunSection
                                title="Special Payrun"
                                payruns={specialPayruns}
                                sectionKey="special"
                                icon={BanknotesIcon}
                            />
                            <PayrunSection
                                title="Last Payrun"
                                payruns={lastPayruns}
                                sectionKey="last"
                                icon={BanknotesIcon}
                            />
                        </div>
                }
                {(deleteLoading || isDownloading) && <LoadingBackground />}
            </div>
        </>
    )
};

export default PayrunPage;