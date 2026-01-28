import { useCallback, useEffect, useState } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { getSalariesPerPayrun } from "../services/payrun.service";
import { useToastContext } from "../contexts/ToastProvider";
import { formatDateToWords } from "../utility/datetime.utility";
import { usePayrunContext } from "../contexts/PayrunProvider";

const useCompareNetPay = () => {
    const [selectedPayruns, setSelectedPayruns] = useState([]); // payrun_id's
    const [netSalariesPerPayrun, setNetSalariesPerPayrun] = useState([]);
    const [salariesLoading, setSalariesLoading] = useState(false);

    const { payruns } = usePayrunContext();
    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    useEffect(() => {
        if (!payruns) return;

        const firstTwoIds = payruns.filter(p => p.payrun_type === 'REGULAR').slice(0, 2).map(p => p.payrun_id);
        setSelectedPayruns(firstTwoIds);
    }, []);

    const handlefetchPayrunNetSalaries = useCallback(async () => {
        setSalariesLoading(true);
        try {
            const result = await getSalariesPerPayrun(company.company_id, selectedPayruns.join(','));
            setNetSalariesPerPayrun(result.data.netSalariesPerPayrun);
        } catch (error) {
            addToast(`Failed to fetch payruns salaries: ${error.message}`, "error");
        }
        finally {
            setSalariesLoading(false);
        }
    }, [selectedPayruns]);

    useEffect(() => {
        if (!company) return;
        if (selectedPayruns.length === 0) return;

        handlefetchPayrunNetSalaries();
    }, [handlefetchPayrunNetSalaries]);

    const handleSelectPayruns = (e) => {
        const payrun_id = e.target.value;
        setSelectedPayruns(prev => [...prev, payrun_id]);
    };

    const handleRemoveSelectedPayruns = (payrun_id) => {
        setSelectedPayruns(prev => prev.filter(id => id !== payrun_id));
    };


    const mapPayrunIdToReadableName = (payrun_id) => {
        const payrun = payruns.find(p => p.payrun_id === payrun_id);
        return `${formatDateToWords(payrun.payrun_start_date)} to ${formatDateToWords(payrun.payrun_end_date)}`
    };



    return {
        handleSelectPayruns,
        handleRemoveSelectedPayruns,
        selectedPayruns, setSelectedPayruns,
        payruns,
        netSalariesPerPayrun, setNetSalariesPerPayrun,
        handlefetchPayrunNetSalaries,
        salariesLoading, setSalariesLoading,
        mapPayrunIdToReadableName
    };
};

export default useCompareNetPay;