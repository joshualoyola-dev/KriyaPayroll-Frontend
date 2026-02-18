import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { ChevronDownIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import NoAccess from "../../../components/NoAccess";
import LoadingBackground from "../../../components/LoadingBackground";
import env from "../../../configs/env.config";
import { userHasFeatureAccess } from "../../../utility/access-controll.utility";
import {
    getFormTypeById,
    getAddNewPath,
    DATA_EXPORT_HISTORY_STATUSES,
    SECTION_2316_COLUMNS,
} from "../../../configs/data-export.config";
import useDataExportHistory from "../../../hooks/useDataExportHistory";
import { formatDateToWords } from "../../../utility/datetime.utility";
import { getTaxExportDetail, fetch1601cColumns } from "../../../services/data-export.service";
import FixedHeaderTable from "./FixedHeaderTable";

const STATUS_STYLES = {
    DRAFT: { bg: "bg-orange-100", text: "text-orange-700" },
    SAVED: { bg: "bg-emerald-100", text: "text-emerald-700" },
    PDF: { bg: "bg-blue-100", text: "text-blue-700" },
    REJECTED: { bg: "bg-rose-100", text: "text-rose-700" },
    DELETED: { bg: "bg-gray-200", text: "text-gray-700" },
};

const ACTION_LABELS = {
    DRAFTED: { by: "Drafted by", at: "Drafted at" },
    SAVED: { by: "Saved by", at: "Saved at" },
    PDF: { by: "PDF by", at: "PDF at" },
    DELETED: { by: "Deleted by", at: "Deleted at" },
};

const DataExportHistoryPage = () => {
    const { formType: formTypeParam } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    // Route is /data-export/ytd, /data-export/2316, /data-export/1601c (no :param), so get form type from pathname
    const formTypeFromPath = formTypeParam || location.pathname.replace("/data-export/", "").split("/")[0] || "ytd";
    const formTypeConfig = getFormTypeById(formTypeFromPath);
    const {
        entries,
        loading,
        filters,
        handleFilterChange,
        handleSearch,
        loadHistory,
        handleDelete,
        statusOptions,
    } = useDataExportHistory(formTypeFromPath);
    const statusDropdownRef = useRef(null);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    /** 1601c: preview modal — when set, show modal with entry data */
    const [previewEntryId, setPreviewEntryId] = useState(null);

    // Show page when user has feature access, or when permissions not loaded yet (so the History UI is visible like the design)
    let hasAccess = false;
    try {
        hasAccess = userHasFeatureAccess(env.VITE_PAYROLL_DATA_EXPORTS);
        if (!hasAccess) {
            const raw = localStorage.getItem("service_features_access");
            const list = JSON.parse(raw || "[]");
            if (!Array.isArray(list) || list.length === 0) hasAccess = true;
        }
    } catch {
        hasAccess = true;
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
                setStatusDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!formTypeConfig) {
            navigate("/data-export/ytd", { replace: true });
            return;
        }
        loadHistory();
        // Only run when form type changes; Search button triggers loadHistory manually
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formTypeFromPath]);

    if (!hasAccess) {
        return (
            <NoAccess
                title="Unauthorized"
                label="You are not allowed to access this resource"
            />
        );
    }

    if (!formTypeConfig) {
        return null;
    }

    const currentStatusLabel = statusOptions.find((s) => s.value === filters.status)?.label ?? (filters.status || "All");

    return (
        <>
            <div className="w-full max-w-full">
                {/* Page title - large, bold */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {formTypeConfig.historyTitle}
                </h1>

                {/* Filter and action bar - horizontal, status on far right */}
                <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-700 mb-1">
                                Date From
                            </label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                                className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-700 mb-1">
                                Date To
                            </label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                                className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-1.5 transition"
                        >
                            Search
                        </button>
                        <Link
                            to={getAddNewPath(formTypeFromPath)}
                            className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-1.5 transition inline-flex items-center gap-1"
                        >
                            + Add New
                        </Link>
                    </div>

                    {/* Status filter dropdown - orange button, far right */}
                    <div className="relative" ref={statusDropdownRef}>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <button
                            type="button"
                            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                            className="flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 px-4 py-1.5 text-sm font-medium hover:bg-orange-100 transition"
                        >
                            {currentStatusLabel}
                            <ChevronDownIcon className="h-4 w-4" />
                        </button>
                        {statusDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 bg-white shadow-lg z-20 py-1">
                                {statusOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            handleFilterChange("status", opt.value);
                                            setStatusDropdownOpen(false);
                                      
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Entry list */}
                <div className="space-y-3">
                    {entries.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            No records found. Use filters and Search, or add a new entry.
                        </div>
                    )}
                    {entries.map((entry) => (
                        <HistoryEntryCard
                            key={entry.id}
                            entry={entry}
                            formTypeLabel={formTypeConfig.label}
                            formTypeFromPath={formTypeFromPath}
                            onView={() => setPreviewEntryId(entry.id)}
                            onEdit={() => navigate(getAddNewPath(formTypeFromPath) + `?edit=${entry.id}`)}
                            onDelete={() => {
                                if (window.confirm("Delete this entry? This cannot be undone.")) {
                                    handleDelete(entry.id);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
            {(formTypeFromPath === "1601c" || formTypeFromPath === "2316") && previewEntryId && (
                <PreviewModal
                    formTypeFromPath={formTypeFromPath}
                    entryId={previewEntryId}
                    onClose={() => setPreviewEntryId(null)}
                    onOpenFull={(id) => {
                        setPreviewEntryId(null);
                        navigate(getAddNewPath(formTypeFromPath) + `?edit=${id}`);
                    }}
                />
            )}
            {loading && <LoadingBackground />}
        </>
    );
};

function HistoryEntryCard({ entry, formTypeLabel, formTypeFromPath, onView, onEdit, onDelete }) {
    const statusStyle = STATUS_STYLES[entry.status] ?? {
        bg: "bg-gray-100",
        text: "text-gray-700",
    };
    const actionLabels = ACTION_LABELS[entry.actionType] ?? {
        by: "By",
        at: "At",
    };
    const periodLabel =
        entry.payrollPeriodStart && entry.payrollPeriodEnd
            ? `Payroll for ${formatDateToWords(entry.payrollPeriodStart)} to ${formatDateToWords(entry.payrollPeriodEnd)}`
            : "Payroll period";
    const canPreview = (formTypeFromPath === "1601c" || formTypeFromPath === "2316") && typeof onView === "function";

    return (
        <div
            role={canPreview ? "button" : undefined}
            tabIndex={canPreview ? 0 : undefined}
            title={canPreview ? "Click to preview data" : undefined}
            onClick={canPreview ? (e) => { if (!e.target.closest("button")) onView(); } : undefined}
            onKeyDown={canPreview ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onView(); } } : undefined}
            className={`flex items-center justify-between p-5 rounded-xl border border-gray-800 bg-white transition-colors ${canPreview ? "cursor-pointer hover:bg-gray-50/50 hover:border-teal-300" : "hover:bg-gray-50/50"}`}
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{periodLabel}</p>
                <p className="text-xs text-gray-500 mt-0.5">Form Type: {formTypeLabel}</p>
                {entry.actionBy && (
                    <p className="text-xs text-gray-600 mt-1">
                        {actionLabels.by}: {entry.actionBy}
                    </p>
                )}
                {entry.actionAt && (
                    <p className="text-xs text-gray-500">
                        {actionLabels.at}: {formatDateToWords(entry.actionAt)}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                {entry.status === "DRAFT" && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </>
                )}
                <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold uppercase ${statusStyle.bg} ${statusStyle.text}`}
                >
                    {entry.status}
                </span>
            </div>
        </div>
    );
}

/** Modal that fetches and shows 1601c or 2316 entry data as read-only preview */
function PreviewModal({ formTypeFromPath, entryId, onClose, onOpenFull }) {
    const [detail, setDetail] = useState(null);
    const [columns, setColumns] = useState([]);
    const [lockedKeys, setLockedKeys] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const is2316 = formTypeFromPath === "2316";

    useEffect(() => {
        if (!entryId) return;
        let cancelled = false;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                if (is2316) {
                    const detailRes = await getTaxExportDetail(entryId);
                    if (cancelled) return;
                    if (!detailRes) {
                        setError("Entry not found");
                        return;
                    }
                    setDetail(detailRes);
                    setColumns(SECTION_2316_COLUMNS);
                    setLockedKeys(new Set(SECTION_2316_COLUMNS.map((c) => c.key)));
                } else {
                    const [detailRes, columnsRes] = await Promise.all([
                        getTaxExportDetail(entryId),
                        fetch1601cColumns(),
                    ]);
                    if (cancelled) return;
                    if (!detailRes) {
                        setError("Entry not found");
                        return;
                    }
                    setDetail(detailRes);
                    const colList = columnsRes?.data?.columns ?? [];
                    setColumns(colList);
                    setLockedKeys(new Set(colList.map((c) => c.key)));
                }
            } catch (err) {
                if (!cancelled) setError(err?.message ?? "Failed to load preview");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [entryId, is2316]);

    const snapshot = detail?.form_data_snapshot ?? {};
    let rows = [];
    if (is2316) {
        if (Array.isArray(snapshot.rows) && snapshot.rows.length > 0) {
            rows = SECTION_2316_COLUMNS.length
                ? snapshot.rows.map((rowRaw) =>
                    SECTION_2316_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: rowRaw[col.key] ?? "" }), {})
                )
                : snapshot.rows;
        } else if (snapshot && typeof snapshot === "object" && !snapshot.template) {
            const singleRow = SECTION_2316_COLUMNS.length
                ? SECTION_2316_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: snapshot[col.key] ?? "" }), {})
                : { ...snapshot };
            rows = [singleRow];
        }
    } else {
        const rowRaw = snapshot.template ?? snapshot;
        const row = columns.length
            ? columns.reduce((acc, col) => ({ ...acc, [col.key]: rowRaw[col.key] ?? "" }), {})
            : { ...rowRaw };
        rows = [row];
    }

    const periodFrom = detail?.period_from ? new Date(detail.period_from) : null;
    const periodTo = detail?.period_to ? new Date(detail.period_to) : null;
    const periodLabel =
        periodFrom && periodTo
            ? `Payroll for ${formatDateToWords(periodFrom.toISOString().slice(0, 10))} to ${formatDateToWords(periodTo.toISOString().slice(0, 10))}`
            : "Preview";

    const showTable = !loading && !error && columns.length > 0 && rows.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl max-w-[95vw] max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">{periodLabel}</h2>
                    <div className="flex items-center gap-2">
                       
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                            title="Close"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    {loading && (
                        <div className="flex items-center justify-center py-12 text-gray-500">
                            Loading preview…
                        </div>
                    )}
                    {error && (
                        <div className="py-8 text-center text-red-600 text-sm">{error}</div>
                    )}
                    {!loading && !error && columns.length > 0 && rows.length === 0 && (
                        <div className="py-8 text-center text-gray-500 text-sm">No data in this entry.</div>
                    )}
                    {showTable && (
                        <div className="overflow-x-auto max-h-[70vh]">
                            <FixedHeaderTable
                                columns={columns}
                                rows={rows}
                                onChangeCell={() => {}}
                                lockedKeys={lockedKeys}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DataExportHistoryPage;
