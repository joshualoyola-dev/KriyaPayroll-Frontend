import { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ContributionTable = ({
    data,
    columns,
    onEdit,
    editableColumns = [], // columns that can be edited
    keyField = 'id' // field to use as unique key
}) => {
    const [editingRow, setEditingRow] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const handleEditClick = (row, index) => {
        setEditingRow(index);
        const formData = {};
        editableColumns.forEach(col => {
            formData[col] = row[col] || '';
        });
        setEditFormData(formData);
    };

    const handleCancelEdit = () => {
        setEditingRow(null);
        setEditFormData({});
    };

    const handleInputChange = (column, value) => {
        setEditFormData(prev => ({
            ...prev,
            [column]: value
        }));
    };

    const handleSubmit = async () => {
        if (onEdit && editingRow !== null) {
            try {
                const rowData = data[editingRow];
                await onEdit(rowData[keyField], editFormData);
                setEditingRow(null);
                setEditFormData({});
            } catch (error) {
                console.error('Error updating row:', error);
            }
        }
    };

    const renderCell = (row, col, rowIndex) => {
        const isEditing = editingRow === rowIndex;
        const isEditable = editableColumns.includes(col);

        if (isEditing && isEditable) {
            return (
                <input
                    type="text"
                    value={editFormData[col] || ''}
                    onChange={(e) => handleInputChange(col, e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            );
        }

        return row[col] ?? "-";
    };

    const renderActionButtons = (row, rowIndex) => {
        const isEditing = editingRow === rowIndex;

        if (isEditing) {
            return (
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSubmit}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                        title="Save changes"
                    >
                        <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Cancel editing"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>
            );
        }

        return (
            <button
                onClick={() => handleEditClick(row, rowIndex)}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit row"
            >
                <PencilIcon className="h-4 w-4" />
            </button>
        );
    };

    return (
        <div className="overflow-x-auto rounded-2xl w-full border-gray-200">
            <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="px-4 py-3 font-medium">
                                {col.replace(/_/g, " ")}
                            </th>
                        ))}
                        <th className="px-4 py-3 font-medium w-16">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {data && data.length > 0 ? (
                        data.map((row, idx) => (
                            <tr
                                key={row[keyField] || idx}
                                className={`transition ${editingRow === idx
                                    ? 'bg-blue-50'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                {columns.map((col) => (
                                    <td key={col} className="px-4 py-3">
                                        {renderCell(row, col, idx)}
                                    </td>
                                ))}
                                <td className="px-4 py-3">
                                    {renderActionButtons(row, idx)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-400">
                                No records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ContributionTable;