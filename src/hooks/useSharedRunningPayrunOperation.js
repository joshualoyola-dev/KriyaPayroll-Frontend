import { useCallback, useEffect, useState } from "react";
import { usePayitemContext } from "../contexts/PayitemProvider";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { convertToISO8601, formatDateToWords } from "../utility/datetime.utility";
import { generatePayrun, getPayrun, getPayrunPayslipPayables, getPayslipsTotals, saveEdit, savePayrunDraft, updateStatus } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { sanitizedPayslips } from "../utility/payrun.utility";
import { usePayrunContext } from "../contexts/PayrunProvider";
import { fetchPayrunLogs } from "../services/log.service";

const formData = {
    date_from: '',
    date_to: '',
    payment_date: '',
    pay_items: [
        { 'payitem-id-01': "Tax Withheld" },
        { 'payitem-id-02': "Basic Pay" },
    ], //payitem_id : pay_item_name in the column
    employee_ids: [],

    ytd_from: '2025-01-01',  //we'll generalize this into ytd - can be used for 13th month pay
    ytd_to: '2025-12-31',
    ytd_export_by_method: 'PAYMENT',
};

const useSharedRunningPayrunOperation = () => {
    const [payrun, setPayrun] = useState(null);
    const [options, setOptions] = useState({ ...formData }); //case 1, 2, 3
    const [payslips, setPayslips] = useState([]); //case: 1, 2, 3
    const [payslipsTotal, setPayslipTotal] = useState([]);
    const [oldPayslips, setOldPayslips] = useState([]);
    const [payslipsLoading, setPayslipsLoading] = useState(false); //case: 1, 2, 3
    const [isSaving, setIsSaving] = useState(false); //use for both saving draft and save edit
    const [statusLoading, setStatusLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [toggleLogs, setToggleLogs] = useState(false);
    const [calculateTaxWithheld, setCalculateTaxWithheld] = useState(false);
    const [payrunType, setPayrunType] = useState('REGULAR');
    const [toggleEmployeeSelections, setToggleEmployeeSelections] = useState(false);
    const [employeeForLastPay, setEmployeeForLastPay] = useState();

    const { payitems } = usePayitemContext();
    const { activeEmployees, employees } = useEmployeeContext();
    const { addToast } = useToastContext();
    const { company } = useCompanyContext();
    const { handleFetchPayruns } = usePayrunContext();



    const location = useLocation();
    const navigate = useNavigate();

    const initializePayrun = useCallback(async (payrun_id) => {
        setIsInitializing(true);
        try {
            //trigger the fetch of existing payrun
            //fetch payrun
            const resultPayrun = await getPayrun(company.company_id, payrun_id);
            setPayrun(resultPayrun.data.payrun);

            //populate the payslips. this will cause the save draft to hide. 
            // and show the save edit or finalize
            const resultPayables = await getPayrunPayslipPayables(company.company_id, payrun_id);
            setPayslips(resultPayables.data.payslips);
            setOldPayslips(resultPayables.data.payslips);

            // get payslips totals
            const resultPayablesTotals = await getPayslipsTotals(company.company_id, resultPayrun.data.payrun.payrun_id, resultPayrun.data.payrun.status);
            setPayslipTotal(resultPayablesTotals.data.totals);

            //reset the tax withheld option
            setCalculateTaxWithheld(false);
        } catch (error) {
            console.log(error);
            addToast("Failed to initialize the payrun", "error");
        }
        finally {
            setIsInitializing(false);
        }
    }, [company]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const payrun_id = params.get("payrun_id");
        const payrun_type = params.get("payrun_type");

        if (payrun_type) {
            setPayrunType(payrun_type);
        }

        if (!company) return;
        if (location.pathname !== '/payrun/regular' && location.pathname !== '/payrun/special' && location.pathname !== '/payrun/last') return;
        if (!payrun_id) return;

        initializePayrun(payrun_id);
    }, [location.search, location.pathname]);

    const getEmployeeForLastPayrun = () => {
        try {
            const employee_id = options.employee_ids[0];

            const employee = employees.find(e => e.employee_id === employee_id);
            setEmployeeForLastPay(employee);
        } catch (error) {
            console.log(error.message);
            addToast("Failed to find the employee for last pay", "error");
        }
    };

    useEffect(() => {
        if (!employees) return;
        if (options.employee_ids.length === 0) return;
        if (String(payrunType).toUpperCase() !== 'LAST') return;

        getEmployeeForLastPayrun();
    }, [options.employee_ids]);


    //extract the employee id from the first
    const getEmployeeForLastPayrunFromPayslips = () => {
        try {
            const employee_id = Object.keys(payslips)[0];
            const employee = employees.find(e => e.employee_id === employee_id);
            setEmployeeForLastPay(employee);
        } catch (error) {
            console.log(error.message);
            addToast("Failed to find the employee for last pay", "error");
        }
    }

    useEffect(() => {
        if (!payslips) return;
        if (!payrun) return;
        if (payrun.payrun_type !== 'LAST') return;

        getEmployeeForLastPayrunFromPayslips();
    }, [payrun, payslips]);



    const handleFetchPayrunLogs = async () => {
        setLogsLoading(true);
        try {
            const results = await fetchPayrunLogs(company.company_id, payrun.payrun_id);

            //we need to map the performed_by value to actual name
            const logsPerformedIdsMappedToName = results.data.logs.map(log => ({
                performed_by: log.performed_by,
                action: log.action,
                created_at: new Date(log.created_at).toLocaleString(),
            }));

            setLogs(logsPerformedIdsMappedToName);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch payrun logs", "error");
            setLogs([]);
        }
        finally {
            setLogsLoading(false);
        }
    }

    useEffect(() => {
        if (!payrun) return;

        handleFetchPayrunLogs();
    }, [payrun]);

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

    const handleGenerate = async () => {
        setPayslipsLoading(true);
        //turn payitems into flat array of ids
        const payitem_ids = options.pay_items.flatMap(payitem => Object.keys(payitem));

        try {
            const result = await generatePayrun(company.company_id,
                {
                    payitem_ids,
                    payrun_start_date: options.date_from,
                    payrun_end_date: options.date_to,
                    employee_ids: options.employee_ids, //if empty, means include all active in payrun
                    payrun_type: payrunType.toUpperCase(),
                    ytd_from: options.ytd_from,
                    ytd_to: options.ytd_to,
                    ytd_export_by_method: options.ytd_export_by_method,
                }
            );
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
                payrun_type: payrunType.toUpperCase(),
                payrun_start_date: options.date_from,
                payrun_end_date: options.date_to,
                payment_date: options.payment_date,
                payrun_title: `${String(payrunType).toUpperCase() === 'LAST' ? employeeForLastPay.last_name : payrunType.toUpperCase()}: ${formatDateToWords(options.date_from)} to ${formatDateToWords(options.date_to)}`,
                generated_by: localStorage.getItem('system_user_id'),
                status: 'DRAFT',
            };
            await savePayrunDraft(company.company_id, payload, payrunType.toLowerCase());
            addToast("Successfully saved payrun draft", "success");
            await handleFetchPayruns();
            handleClosePayrun();
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
            const result = await saveEdit(company.company_id, payrun.payrun_id, payload, calculateTaxWithheld, payrunType.toLowerCase());
            console.log('result saving edits', result);
            addToast("Successfully saved payrun edits", "success");
            await initializePayrun(payrun.payrun_id);
        } catch (error) {
            console.log(error);
            addToast(`Error occurred in saving edits.`, "error");
        }
        finally {
            setIsSaving(false);
        }
    };

    const handleClosePayrun = () => {
        setCalculateTaxWithheld(false);
        setToggleEmployeeSelections(false);
        setPayslipTotal([]);
        setPayslips([]);
        setOldPayslips([]);
        setOptions({ ...formData });
        setPayrun(null);
        setPayslips([]);
        setEmployeeForLastPay(null);
        navigate('/payrun');
    };

    const handleChangeStatus = async (status) => {
        setStatusLoading(true);

        try {
            const result = await updateStatus(company.company_id, payrun.payrun_id, { status });
            console.log('update status result: ', result);

            await handleFetchPayruns();
            await initializePayrun(payrun.payrun_id);
            addToast("Successfully updated status", "success");
        } catch (error) {
            console.log(error);
            addToast("Failed to updated status", "error");
        }
        finally {
            setStatusLoading(false);
        }
    };

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
            return updated;
        });
    };

    const handleToggleLogs = () => {
        setToggleLogs(!toggleLogs);
    }

    const handleToggleCalculateTaxWithhelds = () => {
        setCalculateTaxWithheld(!calculateTaxWithheld);
    }

    const handleEmployeeIdsChange = (employee_id) => {
        if (String(payrunType).toUpperCase() === 'LAST') {
            setOptions(prev => ({
                ...prev,
                employee_ids: prev.employee_ids.includes(employee_id) ? [] : [employee_id]
            }));
            return;
        }

        const value = employee_id;

        const exists = options.employee_ids.includes(value);

        setOptions(prev => ({
            ...prev,
            employee_ids: exists
                ? prev.employee_ids.filter(id => id !== value)
                : [...prev.employee_ids, value]
        }));
    };

    const handleToggleEmployeeSelections = () => {
        setToggleEmployeeSelections(!toggleEmployeeSelections);
    }

    return {
        options, setOptions,
        //options controll
        handleInputChange, handlePayitemChange, removePayitem,

        handleGenerate,

        //payslip
        payslips, setPayslips,
        payslipsLoading, setPayslipsLoading,
        isSaving, setIsSaving,
        handleSaveDraft,
        payrun, setPayrun,

        handleClosePayrun,
        handleSaveEdit,
        handleChangeStatus,
        statusLoading, setStatusLoading,
        handleAddPayitemToPayslips,

        //initialize
        isInitializing, setIsInitializing,

        //logs
        logs, setLogs,
        logsLoading, setLogsLoading,
        toggleLogs, handleToggleLogs,

        handleToggleCalculateTaxWithhelds,
        calculateTaxWithheld,

        payrunType, setPayrunType,
        handleEmployeeIdsChange,
        toggleEmployeeSelections, setToggleEmployeeSelections,
        handleToggleEmployeeSelections,

        payslipsTotal, setPayslipTotal,
        employeeForLastPay, setEmployeeForLastPay
    };
};

export default useSharedRunningPayrunOperation;