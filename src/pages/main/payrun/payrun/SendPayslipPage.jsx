import { usePayslipContext } from "../../../../contexts/PayslipProvider";
import FinalPayslipTable from "./FinalPayslipTable";


const SendPayslipPage = () => {
    const { payslips, isSending, isPayslipsLoading, handleSendFinalPayslip } = usePayslipContext();

    return (
        <div>
            <div className="flex justify-end pb-3">
                <button
                    onClick={handleSendFinalPayslip}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium"
                >
                    {isSending ? "Loading..." : "Send Payslip"}
                </button>
            </div>
            {isPayslipsLoading
                ? "Loading..."
                : <FinalPayslipTable payslips={payslips} />
            }
        </div>
    );
};

export default SendPayslipPage;