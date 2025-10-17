import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastProvider";
import { getPayrun, getPayslips, sendOnePayslip } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { downloadExcelMatrix, downloadExcelPayrunSummary } from "../utility/excel.utility";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { usePayitemContext } from "../contexts/PayitemProvider";

const usePayslip = () => {
    const [payrun, setPayrun] = useState();
    const [payslips, setPayslips] = useState([]);
    const [isPayslipsLoading, setIsPayslipsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isPayrunLoading, setIsPayrunLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToastContext();
    const { company } = useCompanyContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const { mapPayitemIdToPayitemName } = usePayitemContext();

    const handleFetchPayrun = async (company_id, payrun_id) => {
        setIsPayrunLoading(true);
        try {
            const result = await getPayrun(company_id, payrun_id);
            console.log('payrun from sending payslip: ', result);

            setPayrun(result.data.payrun);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch payrun information", "error");
        }
        finally {
            setIsPayrunLoading(false);
        }
    };

    const handleFetchPayslips = async (payrun_id) => {
        setIsPayslipsLoading(true);
        try {
            const result = await getPayslips(payrun_id);
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
                    await sendOnePayslip(company.company_id, payslip.employee_id, payslip.payrun_id, payslip.payslip_id);
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
            handleFetchPayrun(company.company_id, payrun_id);

        }

    }, [location.search]);


    const handleDownloadPayslips = async () => {
        try {
            console.log('payslips before download: ', payslips);
            //transform payslips
            const cleanedPayslips = payslips.map(payslip => ({
                employee_id: payslip.employee_id,
                total_deductions: payslip.total_deductions,
                total_earnings: payslip.total_earnings,
                total_taxes: payslip.total_taxes,
                net_salary: payslip.net_salary,
            }));

            console.log('cleaned payslips: ', cleanedPayslips);
            downloadExcelPayrunSummary(cleanedPayslips, mapEmployeeIdToEmployeeName, 'Payrun Summary', 'Payrun-summary');

        } catch (error) {
            console.log(error);
            addToast("Failed to download payslips", "error");
        }
    };

    return {
        isSending, setIsSending,
        isPayslipsLoading, setIsPayslipsLoading,
        payslips, setPayslips,
        handleSendFinalPayslip,
        payrun, setPayrun,
        isPayrunLoading, setIsPayrunLoading,
        handleDownloadPayslips
    }
};

export default usePayslip;