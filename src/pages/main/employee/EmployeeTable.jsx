import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
    getPaginationRowModel
} from "@tanstack/react-table";
import { useState } from "react";
import { useEmployeeContext } from "../../../contexts/EmployeeProvider";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import { compactEmployeeColumns, fullEmployeeColumns } from "./tableConfigs";

const EmployeeTable = ({ isCardOpen = false }) => {
    const { employees, handleFetchEmployeeInfo } = useEmployeeContext();
    const [sorting, setSorting] = useState([]);

    // Choose columns based on whether card is open
    const columns = isCardOpen ? compactEmployeeColumns : fullEmployeeColumns;

    const table = useReactTable({
        data: employees,
        columns: columns,
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

    return (
        <div className="space-y-4">
            {/* Results Count */}
            {/* <div className="text-sm text-gray-500">
                Showing {table.getRowModel().rows.length} employees
            </div> */}

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isCardOpen ? 'px-3 py-3' : 'px-6 py-4'
                                                }`}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={`flex items-center space-x-2 ${header.column.getCanSort()
                                                        ? 'cursor-pointer select-none hover:text-gray-700'
                                                        : ''
                                                        }`}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <span>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </span>
                                                    {header.column.getCanSort() && (
                                                        <div className="flex flex-col">
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
                                    onClick={() => handleFetchEmployeeInfo(row.original.employee_id)}
                                    className={`cursor-pointer hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                                        }`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`whitespace-nowrap text-sm text-gray-900 ${isCardOpen ? 'px-3 py-3' : 'px-6 py-4'
                                                }`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                            <p className="text-lg font-medium">No employees found</p>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {table.getPageCount() > 1 && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
                                {table.getState().pagination.pageSize * table.getState().pagination.pageIndex + 1}-
                                {Math.min(
                                    table.getState().pagination.pageSize * (table.getState().pagination.pageIndex + 1),
                                    table.getPrePaginationRowModel().rows.length
                                )} of {table.getPrePaginationRowModel().rows.length}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeTable;