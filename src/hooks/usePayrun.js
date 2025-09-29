import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastProvider";
import { getCompanyPayruns } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";

const usePayrun = () => {
    const [payruns, setPayruns] = useState([]);
    const [isPayrunLoading, setIsPayrunLoading] = useState(false);

    const navigate = useNavigate();

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

    const handleClickPayrun = (payrun_id) => {
        navigate(`/payrun/regular?payrun_id=${payrun_id}`);
    };

    useEffect(() => {
        if (!company) return;

        handleFetchPayruns();
    }, [company]);



    return {
        payruns, setPayruns,
        handleFetchPayruns,
        isPayrunLoading, setIsPayrunLoading,
        handleClickPayrun,
    };
};

export default usePayrun;