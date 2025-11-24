import LoadingBackground from "../../../../components/LoadingBackground";
import { useUploadPayrunContext } from "../../../../contexts/UploadPayrunProvider";
import OptionUpload from "../shared-component/OptionUpload";
import PayslipTableUpload from "../shared-component/PayslipTableUpload";
import ErrorModal from "./ErrorModal";

const UploadPayrunPage = () => {
    const { payslipsPayables, setPayslipsPayables, missingEmpIds, isLoading, payslipsTotals } = useUploadPayrunContext();
    return (
        <>
            <div className="pb-4">
                <OptionUpload />
            </div>
            <div className="overflow-x-auto">
                {payslipsPayables.length === 0
                    ? <div></div>
                    : <PayslipTableUpload data={payslipsPayables} setData={setPayslipsPayables} totals={payslipsTotals} />
                }
            </div>
            {missingEmpIds.length > 0 && <ErrorModal />}
            {isLoading && <LoadingBackground />}
        </>
    );
};

export default UploadPayrunPage;