import LoadingBackground from "../../../../components/LoadingBackground";
import { useRegularPayrunContext } from "../../../../contexts/RegularPayrunProvider";
import OptionEdit from "./OptionEdit";
import OptionGenerate from "./OptionGenerate";
import PayslipTable from "./PayslipTable";

const RegularPayrunPage = () => {
    const { payslips, setPayslips, payrun, payslipsLoading } = useRegularPayrunContext();

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
            {payslipsLoading && <LoadingBackground />}
        </>
    );
};

export default RegularPayrunPage;