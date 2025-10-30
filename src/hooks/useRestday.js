import { useEffect, useState } from "react";
import { useToastContext } from "../contexts/ToastProvider";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { addOneRestday, deleteOneRestday, fetchRestdays } from "../services/restday.service";
import { formatDateToISO18601, normalizeHeader, parseExcelDate, parseExcelFile } from "../utility/upload.utility";
import useDebounce from "./useDebounce";

const formData = {
    employee_id: '',
    restday_date: '',
    time_in: '',
    time_out: '',
    hours_worked: '',
    hworked_sameday: '',
    hworked_nextday: '',
    undertime: '',
    tardiness: '',
    night_differential: '',
    nd_sameday: '',
    nd_nextday: '',
    shift_type: 'REGULAR',
};

const filterFields = {
    employee_id: '',
    from: '',
    to: '',
};


const useRestday = () => {
    const [restdays, setRestdays] = useState([]);
    const [restday, setRestday] = useState();
    const [isRestdaysLoading, setIsRestdaysLoading] = useState(false);
    const [showRestdayModal, setShowRestdayModal] = useState(false);
    const [isAddRestdayLoading, setIsAddRestdayLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [restdayFormData, setRestdayFormData] = useState([{
        id: Date.now(), ...formData
    }]);
    const [filters, setFilters] = useState({ ...filterFields });
    const [limit, setLimit] = useState(20);


    const debouncedQuery_employee_id = useDebounce(filters.employee_id, 800);
    const debouncedQuery_to = useDebounce(filters.to, 800);
    const debouncedQuery_from = useDebounce(filters.from, 800);

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();


    const handleFetchRestdays = async () => {
        setIsRestdaysLoading(true);

        try {
            const result = await fetchRestdays(
                company.company_id,
                debouncedQuery_employee_id || null,
                debouncedQuery_from || null,
                debouncedQuery_to || null,
                limit
            );
            setRestdays(result.data.restdays);
        } catch (error) {
            console.log('restday error', error);
            addToast("Failed to fetch restdays", "error");
        }
        finally {
            setIsRestdaysLoading(false);
        }
    };

    useEffect(() => {
        if (!company) return;
        handleFetchRestdays();
    }, [company, debouncedQuery_employee_id, debouncedQuery_to, debouncedQuery_from, limit]); // Added dependency array

    const handleAddRow = () => {
        const newRow = { ...formData, id: Date.now() };
        setRestdayFormData(prev => [...prev, newRow]);
    }

    const handleRemoveRow = (id) => {
        if (restdayFormData.length > 1) {
            setRestdayFormData(prev => prev.filter(row => row.id !== id));
        }
    };

    const handleFieldChange = (id, field, value) => {
        setRestdayFormData(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleResetForm = () => {
        setRestdayFormData([{ ...formData, id: Date.now() }]);
    };

    const handleAddRestdays = async () => {
        setIsAddRestdayLoading(true);

        try {
            const validRestdays = restdayFormData.filter(rd =>
                rd.employee_id && rd.employee_id.trim() && rd.restday_date
            );

            if (validRestdays.length === 0) {
                addToast("Please provide valid employee_id and restday date", "error");
                return;
            }

            const failedRestdays = [];

            for (const rd of validRestdays) {
                try {
                    const cleaned = { ...rd };
                    delete cleaned.id;

                    //string to numbers
                    const numberFields = [
                        'hours_worked',
                        'hworked_sameday',
                        'hworked_nextday',
                        'undertime',
                        'tardiness',
                        'night_differential',
                        'nd_sameday',
                        'nd_nextday',
                    ];

                    numberFields.forEach(field => {
                        if (cleaned[field] !== '' && cleaned[field] !== null && cleaned[field] !== undefined) {
                            const numValue = Number(cleaned[field]);
                            cleaned[field] = isNaN(numValue) ? null : numValue;
                        } else {
                            cleaned[field] = null;
                        }
                    });

                    // Handle empty datetime fields
                    if (!cleaned.time_in || cleaned.time_in === '') {
                        cleaned.time_in = null;
                    }
                    if (!cleaned.time_out || cleaned.time_out === '') {
                        cleaned.time_out = null;
                    }

                    await addOneRestday(company.company_id, cleaned);
                    addToast(`Successfully added restday for employee: ${cleaned.employee_id}`, "success");
                } catch (error) {
                    console.log(error);
                    addToast(`Failed to add restday for employee:${rd.employee_id}`, "error");
                    failedRestdays.push(rd);
                }
            }

            if (failedRestdays.length > 0) {
                setRestdayFormData(failedRestdays);
                await handleFetchRestdays();
            } else {
                handleResetForm();
                await handleFetchRestdays();
                //close modal
                handleShowRestdayModal();
            }
        } catch (error) {
            console.log(error);
            addToast("Failed to add restdays", "error");
        } finally {
            setIsAddRestdayLoading(false);
        }
    };


    const handleDeleteOneRestday = async (rowData) => {
        try {
            await deleteOneRestday(company.company_id, rowData.employee_restday_id);
            addToast("Records successfully deleted", "success");
            await handleFetchRestdays();
        } catch (error) {
            console.log(error);
            addToast("Failed to delete record", "error");
        }
    };

    const handleShowRestdayModal = () => {
        setShowRestdayModal(!showRestdayModal);
    }


    //handle row click
    const handleRowClick = (data, row) => {
        console.log('clicked: ', data);
    }

    const mapFileDataToForm = (data) => {
        const validShiftTypes = ['REGULAR', 'SLIDE'];

        return data.map((row, index) => {
            const mappedRow = { ...formData, id: Date.now() + index };

            // Get valid form keys
            const formKeys = Object.keys(formData);

            Object.entries(row).forEach(([key, value]) => {
                const normalizedKey = normalizeHeader(key);

                // Find matching form field
                const matchingField = formKeys.find(
                    (formKey) => normalizeHeader(formKey) === normalizedKey
                );

                if (matchingField && value !== null && value !== undefined && value !== "") {
                    // Handle employee_id (string)
                    if (matchingField === "employee_id") {
                        mappedRow[matchingField] = String(value).trim();
                    }
                    // Handle restday_date (date field - YYYY-MM-DD)
                    else if (matchingField === "restday_date") { // Fixed: was empty string
                        const parsedDate = parseExcelDate(value);
                        mappedRow[matchingField] = formatDateToISO18601(parsedDate);
                    }
                    // Handle decimal/number fields
                    else if ([
                        "hours_worked",
                        'hworked_sameday',
                        'hworked_nextday',
                        "undertime",
                        "tardiness",
                        "night_differential",
                        'nd_sameday',
                        'nd_nextday',
                    ].includes(matchingField)) {
                        const numValue = Number(value);
                        mappedRow[matchingField] = isNaN(numValue) ? '' : numValue.toString();
                    }
                    // Handle shift_type enum
                    else if (matchingField === "shift_type") {
                        const shiftValue = String(value).toUpperCase().trim();
                        mappedRow[matchingField] = validShiftTypes.includes(shiftValue) ? shiftValue : 'REGULAR';
                    }
                    // Everything else (fallback to string)
                    else {
                        mappedRow[matchingField] = String(value).trim();
                    }
                }
            });

            return mappedRow;
        });
    };

    const uploadRestdayFile = async (file) => {
        if (!file) {
            addToast("Please select a file", "error");
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
            addToast("Please upload a CSV or Excel file", "error");
            return;
        }

        setIsUploading(true);

        try {
            let parsedData = [];

            if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                parsedData = await parseExcelFile(file);
            }

            if (parsedData.length === 0) {
                addToast("No data found in the file", "error");
                return;
            }

            // Map the data to form structure
            const mappedData = mapFileDataToForm(parsedData);

            const validData = mappedData.filter(row =>
                row.employee_id && row.employee_id.trim() &&
                row.restday_date
            );

            if (validData.length === 0) {
                addToast("No valid restday data found in the file. Make sure employee_id and restday_date are provided.", "error");
                return;
            }

            // Update the form data
            setRestdayFormData(validData);

            addToast(`Successfully loaded ${validData.length} restday record(s) from file`, "success");

        } catch (error) {
            console.error('File upload error:', error);
            addToast(`Failed to process file: ${error.message}`, "error");
        } finally {
            setIsUploading(false);
        }
    };

    //reset fielter
    const handleResetFilter = () => {
        setFilters({ ...filterFields });
    };

    //handleChange fieldter
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };


    return {
        restdays, setRestdays,
        restday, setRestday,
        isRestdaysLoading, setIsRestdaysLoading,
        restdayFormData, setRestdayFormData, // Added missing exports

        //form manipulation 
        handleAddRow, handleRemoveRow, handleFieldChange, handleResetForm,
        handleAddRestdays, handleDeleteOneRestday,
        isAddRestdayLoading, setIsAddRestdayLoading,

        //modal
        showRestdayModal, setShowRestdayModal, // Added missing exports
        handleShowRestdayModal,
        handleRowClick,

        //upload
        uploadRestdayFile,
        isUploading, setIsUploading,

        //filter
        filters, setFilters,
        handleResetFilter, handleFilterChange,

        //pagination
        limit, setLimit
    };
};

export default useRestday;