import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastProvider";
import { getPayslipsDraft, sendOnePayslip } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";

const usePayslip = () => {
    const [payslips, setPayslips] = useState([]);
    const [isPayslipsLoading, setIsPayslipsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToastContext();
    const { company } = useCompanyContext();

    const handleFetchPayslips = async (payrun_id) => {
        setIsPayslipsLoading(true);
        try {
            const result = await getPayslipsDraft(payrun_id);
            console.log('payslips content for sending: ', result);
            setPayslips(result.data.payslips);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch payslips", "error");
        }
        finally {
            setIsPayslipsLoading(false);
        }
    }

    const handleSendFinalPayslip = async () => {
        setIsSending(true);
        try {
            const failedPayslips = [];

            for (const payslip of payslips) {
                try {
                    await sendOnePayslip(company.company_id, payslip.employee_id, payslip.payrun_id, payslip.payslip_draft_id);
                    addToast(`Successfully sent payslip to employee ${payslip.employee_id}`, "success");
                } catch (error) {
                    console.log(error);
                    addToast(`failed to send payslip to employee ${payslip.employee_id}`, "error");
                    failedPayslips.push(payslip);
                }
            }
            if (failedPayslips.length > 0) {
                setPayslips(failedPayslips);
                addToast("Check the following payslips and resolve errors", "warning");
            }
            else {
                addToast("Successfully sent all payslips", "success");
                navigate('/payrun');
            }
        } catch (error) {
            console.log(error);
            addToast("An error occured", "error");
        }
        finally {
            setIsSending(false);
        }

    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const payrun_id = params.get("payrun_id");

        if (payrun_id) {
            handleFetchPayslips(payrun_id);
        }

    }, [location.search]);



    return {
        isSending, setIsSending,
        isPayslipsLoading, setIsPayslipsLoading,
        payslips, setPayslips,
        handleSendFinalPayslip
    }
};

export default usePayslip;