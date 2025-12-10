import { useEffect, useState } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { getCompanyPayruns, getSalariesPerPayrun } from "../services/payrun.service";
import { useToastContext } from "../contexts/ToastProvider";
import { useLocation } from "react-router-dom";
import { formatDateToWords } from "../utility/datetime.utility";

const useCompareNetPay = () => {
    const [selectedPayruns, setSelectedPayruns] = useState([]); // payrun_id's
    const [payruns, setPayruns] = useState([]);
    const [payrunsloading, setpayrunsLoading] = useState(false);
    const [netSalariesPerPayrun, setNetSalariesPerPayrun] = useState([]);
    const [salariesLoading, setSalariesLoading] = useState(false);

    const location = useLocation();
    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    const handleFechPayruns = async () => {
        setpayrunsLoading(true);
        try {
            const result = await getCompanyPayruns(company.company_id);
            const fetchedPayruns = result.data.payruns;
            console.log('payruns: ', fetchedPayruns);

            setPayruns(fetchedPayruns);

            const firstTwoIds = fetchedPayruns.filter(p => p.payrun_type === 'REGULAR').slice(0, 2).map(p => p.payrun_id);

            setSelectedPayruns(firstTwoIds);
        } catch (error) {
            addToast(`Failed to fetch payruns: ${error.message}`, "error");
        }
        finally {
            setpayrunsLoading(false);
        }
    };

    useEffect(() => {
        if (!company) return;
        if (location.pathname !== '/dashboard') return;

        handleFechPayruns();
    }, [location.pathname, company]);

    const handlefetchPayrunNetSalaries = async () => {
        setSalariesLoading(true);
        try {
            const result = await getSalariesPerPayrun(company.company_id, selectedPayruns.join(','));
            console.log('net salaries per payrun result: ', result);
            setNetSalariesPerPayrun(result.data.netSalariesPerPayrun);
        } catch (error) {
            addToast(`Failed to fetch payruns salaries: ${error.message}`, "error");
        }
        finally {
            setSalariesLoading(false);
        }
    };

    useEffect(() => {
        if (!company) return;
        if (location.pathname !== '/dashboard') return;
        if (selectedPayruns.length === 0) return;

        handlefetchPayrunNetSalaries();
    }, [selectedPayruns]);

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
        payrunsloading,
        netSalariesPerPayrun, setNetSalariesPerPayrun,
        handlefetchPayrunNetSalaries,
        salariesLoading, setSalariesLoading,
        mapPayrunIdToReadableName
    };
};

export default useCompareNetPay;