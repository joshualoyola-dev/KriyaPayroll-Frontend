import { useEffect, useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { fetchHdmfs, updateHdmfRecord } from "../services/contribution.service"; // Add update service
import { useUserContext } from "../contexts/UserProvider";
import { convertToISO8601 } from "../utility/datetime.utility";
import { useLocation } from "react-router-dom";

const useHdmf = () => {
    const [hdmfs, setHdmfs] = useState([]);
    const [hdmfsLoading, setHdmfsLoading] = useState(false);

    const { addToast } = useToastContext();
    const { user } = useUserContext();
    const location = useLocation();

    const handleFetchHdmfs = async () => {
        setHdmfsLoading(true);

        try {
            const result = await fetchHdmfs();
            console.log('hdmf res: ', result);

            setHdmfs(result.data.hdmfs.map(hdmf => (
                {
                    ...hdmf,
                    effective_date_start: convertToISO8601(hdmf.effective_date_start),
                    effective_date_end: convertToISO8601(hdmf.effective_date_end)
                }
            )));
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch hdmf", "error");
        } finally {
            setHdmfsLoading(false);
        }
    };

    const handleUpdateHdmf = async (id, updatedData) => {
        try {
            //clean and convert to appropriate type
            const payload = {
                total_rate: Number(updatedData.total_rate),
                employer_rate: Number(updatedData.employer_rate),
                employee_rate: Number(updatedData.employee_rate),
                effective_date_start: convertToISO8601(updatedData.effective_date_start),
                effective_date_end: convertToISO8601(updatedData.effective_date_end),
            };

            await updateHdmfRecord(id, payload);
            addToast("HDMF record updated successfully", "success");
            //refetch
            handleFetchHdmfs();
        } catch (error) {
            console.error('Error updating HDMF:', error);
            addToast("Failed to update HDMF record", "error");
            throw error;
        }
    };

    useEffect(() => {
        if (!user) return;

        if (location.pathname === '/configuration/contribution') {
            handleFetchHdmfs();
        }
    }, [user, location.pathname]);

    return {
        hdmfs,
        setHdmfs,
        hdmfsLoading,
        setHdmfsLoading,
        handleUpdateHdmf,
    };
};

export default useHdmf;