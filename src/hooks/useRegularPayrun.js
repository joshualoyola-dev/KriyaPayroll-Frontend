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
import { generateRegularPayrun, getPayrun, getPayrunPayslipPayables, saveEdit, saveRegularPayrunDraft, updateStatus } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { sanitizedPayslips } from "../utility/payrun.utility";
import { usePayrunContext } from "../contexts/PayrunProvider";

const formData = {
    date_from: '',
    date_to: '',
    payment_date: '',
    pay_items: [
        { 'payitem-id-01': "Tax Withheld" },
        { 'payitem-id-02': "Basic Pay" },
    ], //payitem_id : pay_item_name in the column
};

const useRegularPayrun = () => {
    const [payrun, setPayrun] = useState();
    const [options, setOptions] = useState({ ...formData }); //case 1, 2, 3
    const [isValidating, setIsValidating] = useState(false); //case 1,
    const [payslips, setPayslips] = useState([]); //case: 1, 2, 3
    const [oldPayslips, setOldPayslips] = useState([]);
    const [payslipsLoading, setPayslipsLoading] = useState(false); //case: 1, 2, 3
    const [isSaving, setIsSaving] = useState(false); //use for both saving draft and save edit
    const [statusLoading, setStatusLoading] = useState(false);


    const { payitems } = usePayitemContext();
    const { activeEmployees } = useEmployeeContext();
    const { addToast } = useToastContext();
    const { company } = useCompanyContext();
    const { handleFetchPayruns } = usePayrunContext();


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
        setOldPayslips(resultPayables.data.payslips);
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
            const result = await generateRegularPayrun(company.company_id, { payitem_ids, payrun_start_date: options.date_from, payrun_end_date: options.date_to }); console.log('generated payslip result', result);
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
                payrun_title: `REGULAR PAYRUN: ${options.date_from} - ${options.date_to}`,
                generated_by: localStorage.getItem('system_user_id'),
                status: 'DRAFT',
            };
            const result = await saveRegularPayrunDraft(company.company_id, payload);
            console.log('result saving draft', result);
            addToast("Successfully saved regular payrun draft", "success");
            await handleFetchPayruns();
            handleCloseRegularPayrun();
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
            const cleanedEditedPayslips = sanitizedPayslips(payslips);
            const cleanedOldPayslips = sanitizedPayslips(oldPayslips);
            const payload = {
                edited_payslips: cleanedEditedPayslips,
                old_payslips: cleanedOldPayslips
            };
            const result = await saveEdit(company.company_id, payrun.payrun_id, payload);
            console.log('result saving edits', result);
            addToast("Successfully saved regular payrun edits", "success");
            // handleCloseRegularPayrun();
            await initializeRegularPayrun(payrun.payrun_id);
        } catch (error) {
            console.log(error);
            addToast(`Error occurred in saving edits.`, "error");
        }
        finally {
            setIsSaving(false);
        }
    };


    const handleSaveAndCalculateTaxWitheld = async () => {
        setIsSaving(true);

        try {
            const cleanedEditedPayslips = sanitizedPayslips(payslips);
            const cleanedOldPayslips = sanitizedPayslips(oldPayslips);
            const payload = {
                edited_payslips: cleanedEditedPayslips,
                old_payslips: cleanedOldPayslips
            };
            const result = await saveEdit(company.company_id, payrun.payrun_id, payload, true);
            console.log('result calculating tax withheld', result);
            addToast("Successfully calculated tax withheld", "success");
            // handleCloseRegularPayrun();
            await initializeRegularPayrun(payrun.payrun_id);
        } catch (error) {
            console.log(error);
            addToast(`Error occurred in calculating tax withhelds.`, "error");
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

    const handleChangeStatus = async (status) => {
        setStatusLoading(true);

        try {
            const result = await updateStatus(company.company_id, payrun.payrun_id, { status });
            console.log('update status result: ', result);

            await handleFetchPayruns();
            await initializeRegularPayrun(payrun.payrun_id);
            addToast("Successfully updated status", "success");
        } catch (error) {
            console.log(error);
            addToast("Failed to updated status", "error");
        }
        finally {
            setStatusLoading(false);
        }
    };

    // const handleAddPayitemToPayslips = (payitem_id) => {
    //     console.log('payslips data for additinal payitems: ', payslips);


    // };

    const handleAddPayitemToPayslips = (payitem_id) => {
        setPayslips(prevPayslips => {
            // loop over employees and add payitem if missing
            const updated = {};
            for (const [employeeId, payitems] of Object.entries(prevPayslips)) {
                updated[employeeId] = {
                    ...payitems,
                    [payitem_id]: payitems[payitem_id] ?? 0, // add with default 0 if not exists
                };
            }
            console.log('updated payslips: ', updated);

            return updated;
        });
    };

    const handleSendPayslips = () => {
        navigate("/payrun/regular/send-payslip");
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
        handleChangeStatus,
        statusLoading, setStatusLoading,
        handleAddPayitemToPayslips,
        handleSendPayslips,
        handleSaveAndCalculateTaxWitheld
    };
};

export default useRegularPayrun;