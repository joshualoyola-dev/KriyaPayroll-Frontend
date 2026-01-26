import LoadingBackground from "../../../../components/LoadingBackground";
import { useUploadPayrunContext } from "../../../../contexts/UploadPayrunProvider";
import OptionUpload from "../shared-component/OptionUpload";
import PayslipTable from "../shared-component/PayslipTable";
import ErrorModal from "./ErrorModal";

const UploadPayrunPage = () => {
    const { payslipsPayables,
        setPayslipsPayables,
        missingEmpIds,
        isLoading,
        payslipsTotals,
        payrunsDates,
        options
    } = useUploadPayrunContext();
    return (
        <>
            <div className="pb-4">
                <OptionUpload />
            </div>
            <div className="overflow-x-auto">
                {payslipsPayables.length === 0
                    ? <div></div>
                    : <PayslipTable
                        data={payslipsPayables}
                        setData={setPayslipsPayables}
                        totals={payslipsTotals}
                        startEndDates={payrunsDates ? payrunsDates : {}}
                        payrunType={options.payrun_type}
                    />
                }
            </div>
            {missingEmpIds.length > 0 && <ErrorModal />}
            {isLoading && <LoadingBackground />}
        </>
    );
};

export default UploadPayrunPage;