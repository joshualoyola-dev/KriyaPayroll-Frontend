import { useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { useNavigate } from "react-router-dom";
import { parseExcelFile } from "../utility/upload.utility";
import { oldPayitemsNameToPayitemIDMap } from "../utility/payitem.utility";
import { getCheckEmployeesIfExist } from "../services/employee.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import getErrorMessage from "../utility/error.utility";
import { sanitizedPayslips } from "../utility/payrun.utility";
import { usePayrunContext } from "../contexts/PayrunProvider";
import { saveUploadedPayrun } from "../services/payrun.service";

const formData = {
    date_from: '',
    date_to: '',
    payment_date: '',
    payrun_type: 'REGULAR',
    payrun_status: 'DRAFT',
};

const useUploadPayrun = () => {
    const [options, setOptions] = useState({ ...formData });
    const [payslipsPayables, setPayslipsPayables] = useState([]); //payables only
    const [payslipsTotals, setPayslipsTotals] = useState([]); // totals in payslips
    const [employeesCheckLoading, setEmployeesCheckLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [missingEmpIds, setMissingEmpIds] = useState([]);

    const { addToast } = useToastContext();
    const navigate = useNavigate();
    const { company } = useCompanyContext();
    const { handleFetchPayruns } = usePayrunContext();

    const handleClosePayrun = () => {
        setOptions({ ...formData });
        setPayslipsPayables([]);
        setPayslipsTotals([]);
        navigate('/payrun');
    };

    const handleInputChange = (field, value) => {
        setOptions(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const uploadPayrunFile = async (file) => {
        if (!file) {
            addToast("Please select a file", "error");
            return;
        };

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!['xlsx', 'xls'].includes(fileExtension)) {
            addToast("Please upload a CSV or Excel file", "error");
            return;
        }

        setIsLoading(true);

        try {
            let parsedData = [];
            parsedData = await parseExcelFile(file);

            if (parsedData.length === 0) {
                addToast("No data found in the file", "error");
                return;
            }

            // further processing
            const payslipPayablesData = {};
            const payslipTotalsData = {};

            parsedData.forEach(row => {
                const employeeId = row['Employee ID'];
                if (!employeeId) return;

                Object.keys(row).forEach(key => {
                    if (key === 'Employee ID') return; //skip header

                    if (!payslipPayablesData[employeeId]) {
                        payslipPayablesData[employeeId] = {};
                        payslipTotalsData[employeeId] = {};
                    }

                    const value = row[key];
                    if (value != undefined || value != null) {
                        if (key === "Total Earnings") {
                            payslipTotalsData[employeeId]['total_earnings'] = Number(value);
                        }
                        if (key === "Total Taxes") {
                            payslipTotalsData[employeeId]['total_taxes'] = Number(value);
                        }
                        if (key === "Total Deductions") {
                            payslipTotalsData[employeeId]['total_deductions'] = Number(value);
                        }
                        if (key === "Net Pay") {
                            payslipTotalsData[employeeId]['net_salary'] = Number(value);
                        }

                        //map it to the payitem id, anything that doesn't get mapped to, will not be inserted into 
                        //meaning it is not a payitem
                        const payitem_id = oldPayitemsNameToPayitemIDMap(key);
                        if (!payitem_id) return;
                        payslipPayablesData[employeeId][payitem_id] = Number(value);
                    }
                });
            });

            setPayslipsPayables(payslipPayablesData);
            setPayslipsTotals(payslipTotalsData);
            addToast("Successfully parsd data", "success");

            console.log('parsed data payslip: ', payslipPayablesData);
            console.log('parsed data totals: ', payslipTotalsData);

        } catch (error) {
            addToast(`Failed to process file: ${error.message}`, "error");
        }
        finally {
            setIsLoading(false);
        }

    };

    const handleCheckEmployeesIfExist = async () => {
        setIsLoading(true);

        const employee_ids = Object.keys(payslipsPayables);
        const concat_employee_ids = employee_ids.join(',');

        try {
            const result = await getCheckEmployeesIfExist(company.company_id, concat_employee_ids);
            const { missingEmployeeIds } = result.data;

            setMissingEmpIds(missingEmployeeIds);

            return missingEmployeeIds;
        } catch (error) {
            addToast(`Failed to check if employees exist: ${getErrorMessage(error)}`, "error");
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const cleanedPayables = sanitizedPayslips(payslipsPayables);
            const cleanedTotals = sanitizedPayslips(payslipsTotals);

            const payload = {
                payslips_payables: cleanedPayables,
                payslips_totals: cleanedTotals,
                payrun_start_date: options.date_from,
                payrun_end_date: options.date_to,
                payment_date: options.payment_date,
                payrun_title: `${options.payrun_type.toUpperCase()} PAYRUN: ${options.date_from} - ${options.date_to}`,
                generated_by: localStorage.getItem('system_user_id'),
                status: options.payrun_status,
                payrun_type: options.payrun_type,
            }
            await saveUploadedPayrun(company.company_id, payload);
            addToast("Successfully saved uploaded payrun", "success");
            await handleFetchPayruns();
            handleClosePayrun();
        } catch (error) {
            addToast(`Error occurred in saving payroll. ${getErrorMessage(error)}`, "error");
        }
        finally {
            setIsLoading(false);
        }
    };

    return {
        options, setOptions,
        payslipsPayables, setPayslipsPayables,
        payslipsTotals, setPayslipsTotals,
        employeesCheckLoading, setEmployeesCheckLoading,
        isLoading, setIsLoading,
        handleCheckEmployeesIfExist,
        handleSave,
        missingEmpIds, setMissingEmpIds,

        handleClosePayrun,
        handleInputChange,
        uploadPayrunFile,
    };
};

export default useUploadPayrun;