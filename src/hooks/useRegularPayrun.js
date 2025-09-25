import { useEffect, useState } from "react";
import { usePayitemContext } from "../contexts/PayitemProvider";
import { useEmployeeContext } from "../contexts/EmployeeProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { validateDailyRecordOfOneEmployee } from "../services/attendance.service";
import { convertToISO8601 } from "../utility/datetime.utility";
import { generateRegularPayrun } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";

const formData = {
    date_from: '',
    date_to: '',
    payment_date: '',
    pay_items: [
        { 'pay-item-01': "Tax Withheld" },
        { 'pay-item-02': "Basic Pay" },
    ], //payitem_id : pay_item_name in the column
}

const useRegularPayrun = () => {
    const [options, setOptions] = useState({ ...formData });
    const [isValidating, setIsValidating] = useState(false);

    const { payitems } = usePayitemContext();
    const { activeEmployees } = useEmployeeContext();
    const { addToast } = useToastContext();
    const { company } = useCompanyContext();

    useEffect(() => {
        console.log("running regular payrun hook");
    }, []);

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
        const allValid = await validateEmployeesDailyRecordAgainstPayrunPeriod();
        if (!allValid) {
            addToast("Fix the daily record first", "warning");
            return;
        }


        //turn payitems into flat array of ids
        const payitem_ids = options.pay_items.flatMap(payitem => Object.keys(payitem));


        try {
            const result = await generateRegularPayrun(company.company_id, { payitem_ids });
            console.log('result', result);

        } catch (error) {
            console.log(error);
            addToast(`Error occured in generating payroll.`, "error");
        }
    }


    return {
        options, setOptions,
        //options controll
        handleInputChange, handlePayitemChange, removePayitem,

        handleGenerate,

        //validate
        isValidating, setIsValidating,
    };
};

export default useRegularPayrun;