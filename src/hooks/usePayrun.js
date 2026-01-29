import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastProvider";
import { deleteOnePayrun, getAllLastPayrunSummaries, getCompanyPayruns, getEmployeeWithNoLastPay, getPayrun, getPayrunPayslipPayables, getPayslips, getPayslipsDraft } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { downloadExcelLastPayrunSummary, downloadPayablesAndTotals } from "../utility/excel.utility";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { usePayitemContext } from "../contexts/PayitemProvider";

const usePayrun = () => {
    const [payruns, setPayruns] = useState([]);
    const [isPayrunLoading, setIsPayrunLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [employeesWithNoLastPay, setEmployeesWithNoLastPay] = useState([]);
    const [employeeLoading, setEmployeeLoading] = useState(false); // this is for employee with no payrun record
    const navigate = useNavigate();

    const { addToast } = useToastContext();
    const { company } = useCompanyContext();
    const { mapEmployeeIdToEmployeeName } = useEmployeeContext();
    const { mapPayitemIdToPayitemName } = usePayitemContext();
    const location = useLocation();

    const handleFetchPayruns = useCallback(async () => {
        setIsPayrunLoading(true);

        try {
            const result = await getCompanyPayruns(company.company_id);
            setPayruns(result.data.payruns);
        } catch (error) {
            console.log('fetch payrun error: ', error);
            addToast("Failed to fetch payruns", "error");
        }
        finally {
            setIsPayrunLoading(false);
        }
    }, [company]);

    const handleClickPayrun = (payrun_id, payrun_type) => {
        navigate(`/payrun/${String(payrun_type).toLocaleLowerCase()}?payrun_id=${payrun_id}&payrun_type=${String(payrun_type).toLocaleLowerCase()}`);
    };

    useEffect(() => {
        if (!company) return;
        handleFetchPayruns();
    }, [handleFetchPayruns]);


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
        finally {
            setDeleteLoading(false);
        }
    };

    const handleNavigateSendPayslip = (payrun_id) => {
        navigate(`/payrun/send-payslips?payrun_id=${payrun_id}`);
    };

    const handleDownloadPayslipsExcel = async (payrun_id) => {
        setIsDownloading(true);
        try {
            const result = await getPayrunPayslipPayables(company.company_id, payrun_id);
            const resultPayrun = await getPayrun(company.company_id, payrun_id);

            let resultPayslips;
            if (resultPayrun.data.payrun.status === 'APPROVED') {
                resultPayslips = await getPayslips(company.company_id, payrun_id);
            } else {
                resultPayslips = await getPayslipsDraft(company.company_id, payrun_id);
            }

            const fileName = resultPayrun.data.payrun.payrun_title ?? 'Payslips';
            downloadPayablesAndTotals(result.data.payslips, mapEmployeeIdToEmployeeName, mapPayitemIdToPayitemName, fileName, 'Payslips', resultPayslips.data.payslips);
        } catch (error) {
            console.log('downloading payslips error ', error);
            addToast("Failed to download payslips", "error");
        }
        finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadAllLastPayrunsSummary = async () => {
        setIsDownloading(true);

        try {
            const result = await getAllLastPayrunSummaries(company.company_id);
            const { last_payrun_summaries, payables } = result.data.data;
            downloadExcelLastPayrunSummary(
                payables,
                last_payrun_summaries,
                mapPayitemIdToPayitemName,
                'All Last Pay Summaries',
                'Last Payrun Summaries'
            );
        } catch (error) {
            console.log(error);
            addToast("Failed to download all last payruns summaries", "error");
        }
        finally {
            setIsDownloading(false);
        }
    };

    const getInactiveEmployeeWithNoLastPayrunRecord = useCallback(async () => {
        setEmployeeLoading(true);
        try {
            const response = await getEmployeeWithNoLastPay(company.company_id);
            console.log('employees with no last payruns:', response);
            const { data: employees } = response.data;

            const modified = employees.map(employee => {
                if (employee.date_end) {
                    const releaseDate = new Date(employee.date_end);
                    releaseDate.setDate(releaseDate.getDate() + 30);

                    return {
                        ...employee,
                        release_date: releaseDate
                    };
                }

                return {
                    ...employee,
                    release_date: null
                };
            });

            setEmployeesWithNoLastPay(modified);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch inactive employees with no last payrun record", "error");
        }
        finally {
            setEmployeeLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!company) return;
        if (location.pathname !== '/dashboard') return;
        if (employeesWithNoLastPay.length > 0) return;

        getInactiveEmployeeWithNoLastPayrunRecord();
    }, [location.pathname, getInactiveEmployeeWithNoLastPayrunRecord]);

    return {
        payruns, setPayruns,
        handleFetchPayruns,
        isPayrunLoading, setIsPayrunLoading,
        handleClickPayrun,
        deleteLoading, setDeleteLoading,
        handleDeleteOnePayrun,
        handleNavigateSendPayslip,
        handleDownloadPayslipsExcel,
        isDownloading, setIsDownloading,
        handleDownloadAllLastPayrunsSummary,

        employeesWithNoLastPay,
        employeeLoading,
    };
};

export default usePayrun;