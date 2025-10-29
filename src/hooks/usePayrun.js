import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastProvider";
import { deleteOnePayrun, getCompanyPayruns, getPayrun, getPayrunPayslipPayables, getPayslips, getPayslipsDraft } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { downloadExcelMatrix, downloadPayablesAndTotals } from "../utility/excel.utility";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { usePayitemContext } from "../contexts/PayitemProvider";

const usePayrun = () => {
    const [payruns, setPayruns] = useState([]);
    const [isPayrunLoading, setIsPayrunLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();

    const { addToast } = useToastContext();
    const { company } = useCompanyContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const { mapPayitemIdToPayitemName } = usePayitemContext();

    const handleFetchPayruns = async () => {
        setIsPayrunLoading(true);

        try {
            const result = await getCompanyPayruns(company.company_id);
            console.log('payruns: ', result);
            console.log('payruns on data: ', result.data.payruns);

            setPayruns(result.data.payruns);
        } catch (error) {
            console.log('fetch payrun error: ', error);
            addToast("Failed to fetch payruns", "error");
        }
        finally {
            setIsPayrunLoading(false);
        }
    };

    const handleClickPayrun = (payrun_id) => {
        navigate(`/payrun/regular?payrun_id=${payrun_id}`);
    };

    useEffect(() => {
        if (!company) return;

        handleFetchPayruns();
    }, [company]);


    const handleDeleteOnePayrun = async (payrun_id) => {
        setDeleteLoading(true);
        try {
            await deleteOnePayrun(company.company_id, payrun_id);
            await handleFetchPayruns();
            addToast("Successfully deleted payrun", "success");
        } catch (error) {
            console.log(error);
            addToast("Failed to delete payruns", "error");
        }
    };

    const handleNavigateSendPayslip = (payrun_id) => {
        navigate(`/payrun/send-payslips?payrun_id=${payrun_id}`);
    };

    const handleDownloadPayslipsExcel = async (payrun_id) => {
        try {
            const result = await getPayrunPayslipPayables(company.company_id, payrun_id);
            const resultPayrun = await getPayrun(company.company_id, payrun_id);

            let resultPayslips;
            if (resultPayrun.data.payrun.status === 'APPROVED') {
                resultPayslips = await getPayslips(payrun_id);
            } else {
                resultPayslips = await getPayslipsDraft(payrun_id);
            }

            const fileName = resultPayrun.data.payrun.payrun_title ?? 'Payslips';
            downloadPayablesAndTotals(result.data.payslips, mapEmployeeIdToEmployeeName, mapPayitemIdToPayitemName, fileName, 'Payslips', resultPayslips.data.payslips);
        } catch (error) {
            console.log('downloading payslips error ', error);
            addToast("Failed to download payslips", "error");
        }
    };

    return {
        payruns, setPayruns,
        handleFetchPayruns,
        isPayrunLoading, setIsPayrunLoading,
        handleClickPayrun,
        deleteLoading, setDeleteLoading,
        handleDeleteOnePayrun,
        handleNavigateSendPayslip,
        handleDownloadPayslipsExcel,
    };
};

export default usePayrun;