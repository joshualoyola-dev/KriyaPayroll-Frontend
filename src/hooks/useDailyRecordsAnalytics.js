import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";
import { useToastContext } from "../contexts/ToastProvider";
import { fetchDailyRecordsCount } from "../services/analytic.service";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useLocation } from "react-router-dom";
import { getNearestDateRangePerPayrollPeriod } from "../utility/datetime.utility";

const useDailyRecordsAnalytics = () => {
    const { from, to } = getNearestDateRangePerPayrollPeriod();
    const formData = {
        from,
        to,
        is_active: true,
        payrun_days: 10,
    };
    const [counts, setCounts] = useState([]);
    const [countsLoading, setCountsLoading] = useState(false);
    const [options, setOptions] = useState({ ...formData });

    const debouncedQuery_to = useDebounce(options.to, 800);
    const debouncedQuery_from = useDebounce(options.from, 800);
    const debouncedQuery_is_active = useDebounce(options.is_active, 800);


    const { addToast } = useToastContext();
    const { company } = useCompanyContext();
    const location = useLocation();

    const lastFetchedOptions = useRef({
        from: null,
        to: null,
        is_active: null,
    });

    const handleFetchAnalyticsCount = useCallback(async () => {
        if (!company) return;

        if (
            lastFetchedOptions.current.from === debouncedQuery_from &&
            lastFetchedOptions.current.to === debouncedQuery_to &&
            lastFetchedOptions.current.is_active === debouncedQuery_is_active
        ) {
            return;
        }

        setCountsLoading(true);
        try {
            const result = await fetchDailyRecordsCount(
                debouncedQuery_from,
                debouncedQuery_to,
                debouncedQuery_is_active,
                company.company_id
            );
            setCounts(result.data.counts);

            // Save the last fetched options
            lastFetchedOptions.current = {
                from: debouncedQuery_from,
                to: debouncedQuery_to,
                is_active: debouncedQuery_is_active,
            };
        } catch (error) {
            addToast(`Failed to fetch daily records analytics: ${error.message}`, "error");
        } finally {
            setCountsLoading(false);
        }
    }, [debouncedQuery_from, debouncedQuery_to, debouncedQuery_is_active, company]);



    useEffect(() => {
        if (!company) return;
        if (location.pathname !== '/dashboard') return;

        handleFetchAnalyticsCount();
    }, [location.pathname, handleFetchAnalyticsCount]);


    //reset option
    const handleResetOption = () => {
        setOptions({ ...formData });
    };
    //handle option change
    const handleOptionChange = (field, value) => {
        setOptions(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return {
        counts, setCounts,
        countsLoading, setCountsLoading,
        options, setOptions,
        handleResetOption,
        handleOptionChange
    };
};
export default useDailyRecordsAnalytics;
