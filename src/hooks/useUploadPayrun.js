import { useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { useNavigate } from "react-router-dom";
import { parseExcelFile } from "../utility/upload.utility";
import { oldPayitemsNameToPayitemIDMap } from "../utility/payitem.utility";

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
    const [payslipsLoading, setPayslipsLoading] = useState(false);
    const [employeesCheckLoading, setEmployeesCheckLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { addToast } = useToastContext();
    const navigate = useNavigate();

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

        setPayslipsLoading(true);

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
            setPayslipsLoading(false);
        }

    };

    const handleCheckEmployeesIfExist = () => {
        return;
    };

    const handleSave = () => {
        return;
    };

    return {
        options, setOptions,
        payslipsPayables, setPayslipsPayables,
        payslipsTotals, setPayslipsTotals,
        payslipsLoading, setPayslipsLoading,
        employeesCheckLoading, setEmployeesCheckLoading,
        isUploading, setIsUploading,
        handleCheckEmployeesIfExist,
        handleSave,


        handleClosePayrun,
        handleInputChange,
        uploadPayrunFile
    };
};

export default useUploadPayrun;