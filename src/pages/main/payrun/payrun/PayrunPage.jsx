import { PayrunFiltersProvider } from "../../../../contexts/PayrunFiltersProvider";
import { usePayrunContext } from "../../../../contexts/PayrunProvider";
import { userHasFeatureAccess } from "../../../../utility/access-controll.utility";
import env from "../../../../configs/env.config";
import NoAccess from "../../../../components/NoAccess";
import PayrunPageInner from "./PayrunPageInner";



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