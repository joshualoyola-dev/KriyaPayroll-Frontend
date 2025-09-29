import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useToastContext } from "../contexts/ToastProvider";
import { getCompanyPayruns } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";

const usePayrun = () => {
    const [payruns, setPayruns] = useState([]);
    const [isPayrunLoading, setIsPayrunLoading] = useState(false);

    const location = useLocation();

    const { addToast } = useToastContext();
    const { company } = useCompanyContext();

    const handleFetchPayruns = async () => {
        setIsPayrunLoading(true);

        try {
            const result = await getCompanyPayruns(company.company_id);
            console.log('payruns: ', result);
            console.log('payruns on data: ', result.data.payruns);

            setPayruns(result.data.payruns);
        } catch (error) {
            console.log('fetch payrun error: ', error);
            addToast("Failed to fetch payruns", "error");
        }
        finally {
            setIsPayrunLoading(false);
        }
    };

    useEffect(() => {
        if (!company) return;

        handleFetchPayruns();
    }, [company]);

    // useEffect(() => {
    //     if (location.pathname === '/payrun') {
    //         return;
    //     };
    // }, [location]);

    return {
        payruns, setPayruns,
        handleFetchPayruns,
        isPayrunLoading, setIsPayrunLoading,
    };
};

export default usePayrun;