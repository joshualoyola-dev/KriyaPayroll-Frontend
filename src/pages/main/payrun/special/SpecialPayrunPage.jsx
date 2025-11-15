
import LoadingBackground from "../../../../components/LoadingBackground";
import { useSharedRunningPayrunOperationContext } from "../../../../contexts/SharedRunningPayrunOperationProvider";
import OptionEdit from "../shared-component/OptionEdit";
import OptionGenerate from "../shared-component/OptionGenerate";
import PayslipTable from "../shared-component/PayslipTable";

const SpecialPayrunPage = () => {
    const { payslips, setPayslips, payrun, payslipsLoading, isSaving, statusLoading, isInitializing } = useSharedRunningPayrunOperationContext();

    return (
        <>
            <div className="pb-4">
                {!payrun ? <OptionGenerate /> : <OptionEdit />}
            </div>
            <div className="overflow-x-auto">
                {payslips.length === 0
                    ? <div></div>
                    : <PayslipTable data={payslips} setData={setPayslips} />
                }
            </div>
            {(payslipsLoading || isSaving || statusLoading || isInitializing) && <LoadingBackground />}
        </>
    )
};

export default SpecialPayrunPage;