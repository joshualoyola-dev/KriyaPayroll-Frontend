import { useState, useCallback } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { fetchDataExportHistory } from "../services/data-export.service";
import { DATA_EXPORT_HISTORY_STATUSES } from "../configs/data-export.config";

const defaultFilters = {
    dateFrom: "2025-01-01",
    dateTo: "2025-01-15",
    status: "",
};

/**
 * Hook for Data Export History page: list entries, filters, and actions.
 * No hardcoded data—entries come from API (stub returns [] until wired).
 */
const useDataExportHistory = (formTypeId) => {
    const { company } = useCompanyContext();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(defaultFilters);

    const loadHistory = useCallback(async () => {
        if (!formTypeId) return;
        setLoading(true);
        try {
            const res = await fetchDataExportHistory(formTypeId, {
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                status: filters.status,
            });
            setEntries(res?.data ?? []);
        } catch {
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, [formTypeId, filters.dateFrom, filters.dateTo, filters.status]);

    const handleSearch = useCallback(() => {
        loadHistory();
    }, [loadHistory]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleDelete = useCallback(async (entryId) => {
        // TODO: call API when backend supports delete
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
    }, []);

    const handleEdit = useCallback((entryId) => {
        // Navigate to edit or open form; handled by page via navigate
        return entryId;
    }, []);

    return {
        entries,
        loading,
        filters,
        setFilters,
        handleFilterChange,
        handleSearch,
        loadHistory,
        handleDelete,
        handleEdit,
        statusOptions: DATA_EXPORT_HISTORY_STATUSES,
        company,
    };
};

export default useDataExportHistory;
