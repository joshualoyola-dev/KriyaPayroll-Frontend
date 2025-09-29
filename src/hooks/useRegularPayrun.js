/**
 * we have 3 cases: 
 * 1) generate a payrun
 * 2) payrun is already generated. for editing
 * 3) payrun is already generated. for viewing (i.e., approved)
 * 
 * 
 * to check for a currently selected regular payrun, we can rely on the url.
 * i.e., if it is /payruns/regular?payrun_id=123, we run a useeffect to get the record of payrun 123. 
 */

import { useEffect, useState } from "react";
import { usePayitemContext } from "../contexts/PayitemProvider";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { validateDailyRecordOfOneEmployee } from "../services/attendance.service";
import { convertToISO8601 } from "../utility/datetime.utility";
import { generateRegularPayrun, getPayrun, getPayrunPayslipPayables, saveEdit, saveRegularPayrunDraft } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { sanitizedPayslips } from "../utility/payrun.utility";

const formData = {
    date_from: '',
    date_to: '',
    payment_date: '',
    pay_items: [
        { 'pay-item-01': "Tax Withheld" },
        { 'pay-item-02': "Basic Pay" },
    ], //payitem_id : pay_item_name in the column
};

const useRegularPayrun = () => {
    const [payrun, setPayrun] = useState();

    const [options, setOptions] = useState({ ...formData }); //case 1, 2, 3
    const [isValidating, setIsValidating] = useState(false); //case 1,
    const [payslips, setPayslips] = useState([]); //case: 1, 2, 3
    const [payslipsLoading, setPayslipsLoading] = useState(false); //case: 1, 2, 3
    const [isSaving, setIsSaving] = useState(false); //use for both saving draft and save edit

    const { payitems } = usePayitemContext();
    const { activeEmployees } = useEmployeeContext();
    const { addToast } = useToastContext();
    const { company } = useCompanyContext();

    const location = useLocation();
    const navigate = useNavigate();

    const initializeRegularPayrun = async (payrun_id) => {
        //trigger the fetch of existing payrun
        //fetch payrun
        const resultPayrun = await getPayrun(company.company_id, payrun_id);
        console.log('fetched payrun: ', resultPayrun);
        setPayrun(resultPayrun.data.payrun);

        //populate the options

        //populate the payslips. this will cause the save draft to hide. 
        // and show the save edit or finalize
        const resultPayables = await getPayrunPayslipPayables(company.company_id, payrun_id);
        console.log('fetched payslip payables: ', resultPayables);
        setPayslips(resultPayables.data.payslips);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const payrun_id = params.get("payrun_id");

        if (payrun_id) {
            initializeRegularPayrun(payrun_id);
        }
    }, [location.search]);


    // Handle input changes
    const handleInputChange = (field, value) => {
        setOptions(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle payitem selection
    const handlePayitemChange = (payitemId) => {
        const selectedPayitem = payitems.find(item => item.payitem_id === payitemId);
        if (selectedPayitem) {
            const newPayItem = {
                [payitemId]: selectedPayitem.payitem_name
            };

            // Check if payitem already exists in the array
            const existingIndex = options.pay_items.findIndex(item =>
                Object.keys(item)[0] === payitemId
            );

            if (existingIndex === -1) {
                // Add new payitem
                setOptions(prev => ({
                    ...prev,
                    pay_items: [...prev.pay_items, newPayItem]
                }));
            }
        }
    };

    // Remove payitem from selection
    const removePayitem = (payitemId) => {
        setOptions(prev => ({
            ...prev,
            pay_items: prev.pay_items.filter(item =>
                Object.keys(item)[0] !== payitemId
            )
        }));
    };

    const validateEmployeesDailyRecordAgainstPayrunPeriod = async () => {
        setIsValidating(true);
        for (const employee of activeEmployees) {
            try {
                const result = await validateDailyRecordOfOneEmployee(
                    employee.employee_id,
                    convertToISO8601(options.date_from),
                    convertToISO8601(options.date_to)
                );

                if (!result.data.valid) {
                    addToast(`Employee ${employee.employee_id}'s doesn't match number of valid payrun days`, "error");
                    setIsValidating(false);
                    return false;
                }
            } catch (error) {
                console.log(error);
                addToast(`Error occured in validating employee's daily record: ${employee.employee_id}`, "error");
            }
        }
        setIsValidating(false);
        return true;
    };

    const handleGenerate = async () => {
        setPayslipsLoading(true);
        //turn payitems into flat array of ids
        const payitem_ids = options.pay_items.flatMap(payitem => Object.keys(payitem));

        try {
            const result = await generateRegularPayrun(company.company_id, { payitem_ids });
            console.log('generated payslip result', result);
            setPayslips(result.data.payslips);
        } catch (error) {
            console.log(error);
            addToast(`Error occured in generating payroll.`, "error");
        }
        finally {
            setPayslipsLoading(false);
        }
    }

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            const cleanedPayslips = sanitizedPayslips(payslips);
            console.log('cleaned payslips: ', cleanedPayslips);

            //logic for saving. 
            const payload = {
                payslips: cleanedPayslips,
                payrun_type: 'REGULAR',
                payrun_start_date: options.date_from,
                payrun_end_date: options.date_to,
                payment_date: options.payment_date,
                payrun_title: `REGULAR PAYRUN - ${Date.now()}`,
                generated_by: localStorage.getItem('system_user_id'),
                status: 'DRAFT',
            };
            const result = await saveRegularPayrunDraft(company.company_id, payload);
            console.log('result saving draft', result);
            addToast("Successfully saved regular payrun draft", "success");
            navigate('/payrun');
        } catch (error) {
            console.log(error);
            addToast(`Error occurred in saving payroll.`, "error");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleSaveEdit = async () => {
        setIsSaving(true);

        try {
            const cleanedPayslips = sanitizedPayslips(payslips);
            const payload = {
                payslips: cleanedPayslips,
            };
            const result = await saveEdit(company.company_id, payrun.payrun_id, payload);
            console.log('result saving edits', result);
            addToast("Successfully saved regular payrun edits", "success");
            handleCloseRegularPayrun();
        } catch (error) {
            console.log(error);
            addToast(`Error occurred in saving edits.`, "error");
        }
        finally {
            setIsSaving(false);
        }
    };

    const handleCloseRegularPayrun = () => {
        setPayrun(null);
        setPayslips([]);
        navigate('/payrun');
    };

    return {
        options, setOptions,
        //options controll
        handleInputChange, handlePayitemChange, removePayitem,

        handleGenerate,

        //validate
        isValidating, setIsValidating,
        validateEmployeesDailyRecordAgainstPayrunPeriod,

        //payslip
        payslips, setPayslips,
        payslipsLoading, setPayslipsLoading,
        isSaving, setIsSaving,
        handleSaveDraft,
        payrun, setPayrun,

        handleCloseRegularPayrun,
        handleSaveEdit,
    };
};

export default useRegularPayrun;