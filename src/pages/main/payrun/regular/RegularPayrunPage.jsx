import LoadingBackground from "../../../../components/LoadingBackground";
import { useRegularPayrunContext } from "../../../../contexts/RegularPayrunProvider";
import PayslipTable from "../shared-component/PayslipTable";
import OptionEdit from "./OptionEdit";
import OptionGenerate from "./OptionGenerate";

const RegularPayrunPage = () => {
    const { payslips, setPayslips, payrun, payslipsLoading, isSaving, statusLoading, isInitializing } = useRegularPayrunContext();

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
    );
};

export default RegularPayrunPage;