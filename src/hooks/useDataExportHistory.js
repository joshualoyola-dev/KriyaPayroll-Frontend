import { useState, useCallback } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { fetchDataExportHistory, updateTaxExportHistory } from "../services/data-export.service";
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

    const companyId = company?.company_id ?? null;
    
    // Debug: log company state
    console.log('[useDataExportHistory] Company context:', { 
        company, 
        companyId, 
        hasCompany: !!company,
        formTypeId 
    });

    const loadHistory = useCallback(async (overrideFilters) => {
    if (!formTypeId) {
        console.warn('[useDataExportHistory] Missing formTypeId:', formTypeId);
        return;
    }
    if (!companyId) {
        console.warn('[useDataExportHistory] Missing companyId. Company context:', company);
        console.warn('[useDataExportHistory] Cannot fetch history without a selected company.');
        setEntries([]);
        return;
    }
    
    console.log(`[useDataExportHistory] Loading history for formType=${formTypeId}, companyId=${companyId}`);
    setLoading(true);
    try {
        const res = await fetchDataExportHistory(
            formTypeId,
            overrideFilters ?? filters,
            companyId
        );
        console.log(`[useDataExportHistory] API response:`, res?.data?.length || 0, 'entries');
        // Filter out entries with "GENERATED" status to avoid duplicates of "PDF" entries
        const allEntries = res?.data ?? [];
        const filteredEntries = allEntries.filter((entry) => entry.status !== "GENERATED");
        console.log(`[useDataExportHistory] After filtering GENERATED:`, filteredEntries.length, 'entries');
        setEntries(filteredEntries);
    } catch (error) {
        console.error('[useDataExportHistory] Error fetching history:', error);
        setEntries([]);
    } finally {
        setLoading(false);
    }
}, [formTypeId, companyId, filters]);

    const handleSearch = useCallback(() => {
        loadHistory();
    }, [loadHistory]);

    const handleFilterChange = useCallback(
        (key, value) => {
            setFilters((prev) => {
                const newFilters = { ...prev, [key]: value};
                loadHistory(newFilters);
                return newFilters;
            });
        },
        [loadHistory]
    );

    /** Soft delete: mark entry as DELETED so it stays on history and shows under Deleted filter */
    const handleDelete = useCallback(async (entryId) => {
        try {
            await updateTaxExportHistory(entryId, { status: "DELETED" });
            setEntries((prev) =>
                prev.map((e) =>
                    String(e.id) === String(entryId)
                        ? { ...e, status: "DELETED", actionType: "DELETED" }
                        : e
                )
            );
        } catch {
            // keep entry in list on error; user can retry or refresh
        }
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
        company, // Export company so page can check if it's loaded
    };
};

export default useDataExportHistory;
