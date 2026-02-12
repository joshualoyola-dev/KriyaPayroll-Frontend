import { useCallback, useEffect, useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { fetchSSS, updateSSS } from "../services/contribution.service";
import { useUserContext } from "../contexts/UserProvider";
import { convertToISO8601 } from "../utility/datetime.utility";
import { useLocation } from "react-router-dom";
import { useContributionContext } from "../contexts/ContributionProvider";

const useSSS = () => {
    const [ssss, setSSSS] = useState([]);
    const [ssssLoading, setSsssLoading] = useState(false);

    const { addToast } = useToastContext();
    const { user } = useUserContext();
    const location = useLocation();

    const { selectedTab } = useContributionContext();

    const handleFetchSss = useCallback(async () => {
        setSsssLoading(true);

        try {
            const result = await fetchSSS();
            console.log('sss', result);
            // setSSSS(result.data.ssss);
            setSSSS(result.data.ssss.map(sss => ({
                ...sss,
                effective_date_start: convertToISO8601(sss.effective_date_start),
                effective_date_end: convertToISO8601(sss.effective_date_end)
            })));
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch sss", "error");
        } finally {
            setSsssLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        //fetch if the user is on /configuration/contribution 
        if (location.pathname !== '/configuration/contribution') return;
        if (selectedTab.id != 'sss') return;
        if (ssss.length > 0) return;

        handleFetchSss();
    }, [user, location.pathname, handleFetchSss]);

    const handleUpdateSss = async (id, updatedData) => {
        try {
            const payload = {
                ...updatedData,
                salary_min: Number(updatedData.salary_min),
                salary_max: Number(updatedData.salary_max),

                employeer_regular_ss: Number(updatedData.employeer_regular_ss),
                employeer_regular_mpf: Number(updatedData.employeer_regular_mpf),
                employeer_regular_ec: Number(updatedData.employeer_regular_ec),

                employee_regular_ss: Number(updatedData.employee_regular_ss),
                employee_regular_mpf: Number(updatedData.employee_regular_mpf),

                effective_date_start: convertToISO8601(updatedData.effective_date_start),
                effective_date_end: convertToISO8601(updatedData.effective_date_end),
            };
            await updateSSS(id, payload);
            addToast("Successfully updated sss record", "success");
            handleFetchSss();
        } catch (error) {
            console.error('Error updating sss record:', error);
            addToast("Failed to update sss record", "error");
        }
    };

    return {
        ssss, setSSSS,
        ssssLoading, setSsssLoading,
        handleUpdateSss, handleFetchSss
    };
};

export default useSSS;