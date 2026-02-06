import { useCallback, useEffect, useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { useUserContext } from "../contexts/UserProvider";
import { fetchWithholdings, updateWithholdings } from "../services/contribution.service";
import { useLocation } from "react-router-dom";
import { useContributionContext } from "../contexts/ContributionProvider";

const useWithholding = () => {
    const [withholdings, setWithholdings] = useState([]);
    const [withholdingsLoading, setWithholdingsLoading] = useState(false);

    const { addToast } = useToastContext();
    const { user } = useUserContext();
    const location = useLocation();

    const { selectedTab } = useContributionContext();

    const handleFetchWithholdings = useCallback(async () => {
        setWithholdingsLoading(true);

        try {
            const result = await fetchWithholdings();
            setWithholdings(result.data.withholdings);
        } catch (error) {
            console.log(error);
            addToast("Failed to fetch hdmf", "error");
        } finally {
            setWithholdingsLoading(false);
        }
    }, []);

    const handleUpdateWithholding = async (id, updatedData) => {
        const payload = {
            ...updatedData,
            min_compensation: Number(updatedData.min_compensation),
            max_compensation: Number(updatedData.max_compensation),
            base_tax: Number(updatedData.base_tax),
            percent_over: Number(updatedData.percent_over),
            excess_over: Number(updatedData.excess_over),
        };

        try {
            await updateWithholdings(id, payload);
            //trigger refetch 
            await handleFetchWithholdings();
            addToast("Successfully updated withholding record", "success");
        } catch (error) {
            console.error('Error updating HDMF:', error);
            addToast("Failed to update HDMF record", "error");
            throw error;
        }
    };

    useEffect(() => {
        if (!user) return;
        if (selectedTab.id !== 'withholding') return;
        if (location.pathname !== '/configuration/contribution') return;
        if (withholdings.length > 0) return;

        handleFetchWithholdings();
    }, [user, location.pathname, selectedTab]);

    return {
        withholdings, setWithholdings,
        withholdingsLoading, setWithholdingsLoading,
        handleUpdateWithholding,

    };
};

export default useWithholding;