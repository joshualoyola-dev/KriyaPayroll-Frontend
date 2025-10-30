import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

const TanStackTable = ({ data, columns, onRowClick, onDelete, limit, setLimit }) => {
    const [sorting, setSorting] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);


    // Add actions column to the existing columns
    const columnsWithActions = [
        ...columns,
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            setOpenDropdown(openDropdown === row.id ? null : row.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === row.id && (
                        <>
                            {/* Backdrop to close dropdown when clicking outside */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                <div className="py-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Handle update action
                                            console.log('Update clicked for:', row.original);
                                            setOpenDropdown(null);
                                        }}
                                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        Update
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onDelete) {
                                                // You can access the unique ID here - adjust based on your data structure
                                                // Common patterns: row.original.id, row.original._id, row.original.uuid, etc.
                                                onDelete(row.original.id || row.original._id || row.original);
                                            }
                                            setOpenDropdown(null);
                                        }}
                                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ),
            size: 60, // Fixed width for actions column
        }
    ];

    const table = useReactTable({
        data,
        columns: columnsWithActions,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    const handleRowClick = (row, event) => {
        // Check if the click came from the actions column
        const isActionsColumn = event.target.closest('[data-actions-column]');

        if (!isActionsColumn && onRowClick) {
            onRowClick(row.original, row);
        }
    };

    return (
        <div className="space-y-4 w-full">
            {/* Results Count */}
            <div className="flex justify-end">
                <div className="flex items-center space-x-2">
                    <label htmlFor="limit-select" className="text-sm text-gray-700">
                        Show row:
                    </label>
                    <select
                        id="limit-select"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                        }}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>300</option>
                        <option value={500}>500</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm w-full">
                <div className="w-full">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            style={{
                                                width: header.id === 'actions' ? '60px' : 'auto'
                                            }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={`flex items-start space-x-2 ${header.column.getCanSort()
                                                        ? 'cursor-pointer select-none hover:text-gray-700'
                                                        : ''
                                                        }`}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <span className="break-words leading-tight">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </span>
                                                    {header.column.getCanSort() && (
                                                        <div className="flex flex-col flex-shrink-0">
                                                            <ChevronUpIcon
                                                                className={`h-3 w-3 ${header.column.getIsSorted() === 'asc'
                                                                    ? 'text-blue-600'
                                                                    : 'text-gray-300'
                                                                    }`}
                                                            />
                                                            <ChevronDownIcon
                                                                className={`h-3 w-3 -mt-1 ${header.column.getIsSorted() === 'desc'
                                                                    ? 'text-blue-600'
                                                                    : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                        } ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={(e) => handleRowClick(row, e)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 text-xs text-gray-900 text-center"
                                            {...(cell.column.id === 'actions' ? { 'data-actions-column': true } : {})}
                                        >
                                            <div className="whitespace-normal break-words">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {table.getRowModel().rows.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            <p className="text-lg font-medium">No Records found</p>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {table.getPageCount() > 1 && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Page {table.getState().pagination.pageIndex + 1} of{' '}
                                {table.getPageCount()}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </button>
                                {/* Page Numbers */}
                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                                        const pageIndex = table.getState().pagination.pageIndex;
                                        const startPage = Math.max(0, pageIndex - 2);
                                        const currentPage = startPage + i;
                                        if (currentPage >= table.getPageCount()) return null;
                                        return (
                                            <button
                                                key={currentPage}
                                                onClick={() => table.setPageIndex(currentPage)}
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === pageIndex
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {currentPage + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-sm text-gray-700">
                                {table.getState().pagination.pageSize *
                                    table.getState().pagination.pageIndex +
                                    1}
                                -{' '}
                                {Math.min(
                                    table.getState().pagination.pageSize *
                                    (table.getState().pagination.pageIndex + 1),
                                    table.getPrePaginationRowModel().rows.length
                                )}
                                {' '}of {table.getPrePaginationRowModel().rows.length}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TanStackTable;