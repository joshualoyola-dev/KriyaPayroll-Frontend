import { useEffect, useState } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { getCompanyPayruns } from "../services/payrun.service";
import { useToastContext } from "../contexts/ToastProvider";
import { useLocation } from "react-router-dom";

const useCompareNetPay = () => {
    const [selectedPayruns, setSelectedPayruns] = useState([]); // payrun_id's
    const [payruns, setPayruns] = useState([]);
    const [payrunsloading, setpayrunsLoading] = useState(false);

    const location = useLocation();
    const { company } = useCompanyContext();
    const { addToast } = useToastContext();

    const handleFechPayruns = async () => {
        setpayrunsLoading(true);
        try {
            const result = await getCompanyPayruns(company.company_id);
            setPayruns(result.data.payruns);
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

    const handleSelectPayruns = (e) => {
        const payrun_id = e.target.value;
        setSelectedPayruns(prev => [...prev, payrun_id]);
    };

    const handleRemoveSelectedPayruns = (payrun_id) => {
        setSelectedPayruns(prev => prev.filter(id => id !== payrun_id));
    };

    return {
        handleSelectPayruns,
        handleRemoveSelectedPayruns,
        selectedPayruns, setSelectedPayruns,
        payruns,
        payrunsloading,
    };
};

export default useCompareNetPay;