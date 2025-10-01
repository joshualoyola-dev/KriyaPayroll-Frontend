import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastProvider";
import { deleteOnePayrun, getCompanyPayruns } from "../services/payrun.service";
import { useCompanyContext } from "../contexts/CompanyProvider";

const usePayrun = () => {
    const [payruns, setPayruns] = useState([]);
    const [isPayrunLoading, setIsPayrunLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
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


    const handleDeleteOnePayrun = async (payrun_id) => {
        setDeleteLoading(true);
        try {
            await deleteOnePayrun(company.company_id, payrun_id);
            await handleFetchPayruns();
            addToast("Successfully deleted payrun", "success");
        } catch (error) {
            console.log(error);
            addToast("Failed to delete payruns", "error");
        }
    };

    const handleNavigateSendPayslip = (payrun_id) => {
        navigate(`/payrun/send-payslips?payrun_id=${payrun_id}`);
    };


    return {
        payruns, setPayruns,
        handleFetchPayruns,
        isPayrunLoading, setIsPayrunLoading,
        handleClickPayrun,
        deleteLoading, setDeleteLoading,
        handleDeleteOnePayrun,
        handleNavigateSendPayslip
    };
};

export default usePayrun;