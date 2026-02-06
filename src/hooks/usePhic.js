import { useEffect, useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { useUserContext } from "../contexts/UserProvider";
import { fetchPhics, updatePhicRecord } from "../services/contribution.service";
import { convertToISO8601 } from "../utility/datetime.utility";
import { useLocation } from "react-router-dom";
import { useContributionContext } from "../contexts/ContributionProvider";

const usePhic = () => {
    const [phics, setPhics] = useState([]);
    const [phicsLoading, setPhicsLoading] = useState(false);

    const { addToast } = useToastContext();
    const { user } = useUserContext();
    const location = useLocation();

    const { selectedTab } = useContributionContext();

    const handleFetchPhics = async () => {
        setPhicsLoading(true);

        try {
            const result = await fetchPhics();
            console.log('phics: ', result);
            // setPhics(result.data.phics);
            setPhics(result.data.phics.map(phic => ({
                ...phic,
                effective_date_start: convertToISO8601(phic.effective_date_start),
                effective_date_end: convertToISO8601(phic.effective_date_end)
            })));

        } catch (error) {
            console.log(error);
            addToast("Failed to fetch phics", "error");
        } finally {
            setPhicsLoading(false);
        }
    };

    const handleUpdatePhic = async (id, updatedData) => {
        try {
            const payload = {
                total_rate: Number(updatedData.total_rate),
                employer_rate: Number(updatedData.employer_rate),
                employee_rate: Number(updatedData.employee_rate),
                effective_date_start: convertToISO8601(updatedData.effective_date_start),
                effective_date_end: convertToISO8601(updatedData.effective_date_end),
            };

            await updatePhicRecord(id, payload);
            addToast("Phic record updated successfully", "success");
            handleFetchPhics();
        } catch (error) {
            console.error('Error updating phic:', error);
            addToast("Failed to update phic record", "error");
        }
    };


    useEffect(() => {
        if (!user) return;
        if (selectedTab.id !== 'phic') return;
        if (location.pathname !== '/configuration/contribution') return;
        if (phics.length > 0) return;

        handleFetchPhics();
    }, [user, location.pathname, selectedTab]);

    return {
        phics, setPhics,
        phicsLoading, setPhicsLoading,
        handleFetchPhics,
        handleUpdatePhic,
    }
};

export default usePhic;