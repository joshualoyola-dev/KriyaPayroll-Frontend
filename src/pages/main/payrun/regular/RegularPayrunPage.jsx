import { useRegularPayrunContext } from "../../../../contexts/RegularPayrunProvider";
import PayrunOption from "./PayrunOption";
import PayslipTable from "./PayslipTable";

const RegularPayrunPage = () => {
    const { payslips, setPayslips, payrun } = useRegularPayrunContext();

    return (
        <>
            <div className="w-full max-w-full">
                <div className="pb-4">
                    <PayrunOption />
                </div>
            </div>
            {payslips.length === 0
                ? <div></div>
                : <PayslipTable data={payslips} setData={setPayslips} />
            }
        </>
    );
};

export default RegularPayrunPage;