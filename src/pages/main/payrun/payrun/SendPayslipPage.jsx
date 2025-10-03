import { usePayslipContext } from "../../../../contexts/PayslipProvider";
import { convertToISO8601 } from "../../../../utility/datetime.utility";
import FinalPayslipTable from "./FinalPayslipTable";


const SendPayslipPage = () => {
    const { payrun, isPayrunLoading, payslips, isSending, isPayslipsLoading, handleSendFinalPayslip } = usePayslipContext();
    return (
        <div>
            <div className="flex justify-between pb-3">
                <div>
                    {isPayrunLoading ? (
                        <p className="text-gray-500 text-sm">Loading payrun...</p>
                    ) : payrun ? (
                        <div className="flex gap-x-3 justify-center items-center ">
                            <p className="text-sm font-bold text-gray-800">
                                {payrun.payrun_title}
                            </p>
                            <p className="test-sm">•</p>
                            <p className="text-sm text-gray-500">
                                {convertToISO8601(payrun.payrun_start_date)} –{" "}
                                {convertToISO8601(payrun.payrun_end_date)}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No Payrun Found</p>
                    )}
                </div>
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