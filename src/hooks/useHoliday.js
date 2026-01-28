import { useEffect, useState, useCallback } from "react";
import { useCompanyContext } from "../contexts/CompanyProvider";
import { useToastContext } from "../contexts/ToastProvider";
import { addOneHoliday, deleteOneHoliday, fetchEmployeesAttendanceOnHoliday, fetchHolidays, updateOneHoliday } from "../services/holiday.service";
import { convertToISO8601 } from "../utility/datetime.utility";
import { useLocation } from "react-router-dom";

const initialFormData = {
    holiday_date: '',
    holiday_name: '',
    holiday_type: 'REGULAR',
    holiday_rate: '',
};

const useHoliday = () => {
    const [holidays, setHolidays] = useState([]);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [holidaysLoading, setHolidaysLoading] = useState(false);
    const [showAddHoliday, setShowAddHoliday] = useState(false);
    const [showUpdateHoliday, setShowUpdateHoliday] = useState(false); // Added separate state for update modal
    const [holidayFormData, setHolidayFormData] = useState(initialFormData);
    const [addLoading, setAddLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [attendancesLoading, setAttendancesLoading] = useState(false);
    const [updateHolidayFormData, setUpdateHolidayFormData] = useState(initialFormData); // Initialize with initialFormData
    const [updateLoading, setUpdateLoading] = useState(false);

    const { company } = useCompanyContext();
    const { addToast } = useToastContext();
    const location = useLocation();

    const handleFetchHolidays = useCallback(async () => {
        if (!company?.company_id) return;

        setHolidaysLoading(true);
        try {
            const result = await fetchHolidays(company.company_id);
            setHolidays(result.data.holidays || []);
        } catch (error) {
            console.error('Failed to fetch holidays:', error);
            addToast("Failed to fetch holidays", "error");
        } finally {
            setHolidaysLoading(false);
        }
    }, [company, addToast]);

    const handleFetchEmployeesAttendanceOnHoliday = useCallback(async () => {
        setAttendancesLoading(true);
        try {
            const result = await fetchEmployeesAttendanceOnHoliday(company.company_id, selectedHoliday.holiday_date);
            console.log('holiday att: ', result);

            setAttendances(result.data.attendances);
        } catch (error) {
            console.error('Failed to fetch attendances:', error);
            addToast("Failed to fetch employees attendance on holiday", "error");
        }
        finally {
            setAttendancesLoading(false);
        }
    }, [company, selectedHoliday]);

    useEffect(() => {
        if (!selectedHoliday) return;
        if (!company) return;

        handleFetchEmployeesAttendanceOnHoliday();
    }, [handleFetchEmployeesAttendanceOnHoliday])

    useEffect(() => {
        if (location.pathname === '/attendance/holiday') {
            handleFetchHolidays();
        }
    }, [company, handleFetchHolidays, location.pathname]);

    //populate the update form if there is a selected
    useEffect(() => {
        if (!selectedHoliday) return;

        setUpdateHolidayFormData({ ...selectedHoliday });
    }, [selectedHoliday]);

    const handleChangeSelectedHoliday = (holiday) => {
        setSelectedHoliday(holiday);
    };

    const handleShowAddHolidayModal = () => {
        setShowAddHoliday(prev => !prev);
        // Reset form when closing modal
        if (showAddHoliday) {
            setHolidayFormData(initialFormData);
        }
    };

    // Added separate handler for update modal
    const handleShowUpdateHolidayModal = () => {
        setShowUpdateHoliday(prev => !prev);
        // Reset form when closing modal
        if (showUpdateHoliday) {
            setUpdateHolidayFormData(initialFormData);
        }
    };

    // Added handler to open update modal with selected holiday
    const handleEditHoliday = (holiday) => {
        setSelectedHoliday(holiday);
        setShowUpdateHoliday(true);
    };

    const handleFormChange = (field, value) => {
        setHolidayFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddHoliday = async () => {
        setAddLoading(true);
        try {
            const payload = {
                ...holidayFormData,
                holiday_date: convertToISO8601(holidayFormData.holiday_date),
                holiday_rate: Number(holidayFormData.holiday_rate),
            };

            await addOneHoliday(company.company_id, payload);
            addToast("Holiday added successfully", "success");
            setHolidayFormData(initialFormData);
            setShowAddHoliday(false);
            await handleFetchHolidays();
        } catch (error) {
            console.error('Failed to add holiday:', error);
            addToast(error.response?.data?.message || "Failed to add holiday", "error");
        } finally {
            setAddLoading(false);
        }
    };

    const handleDeleteHoliday = async (company_holiday_id) => {
        setDeleteLoading(company_holiday_id);
        try {
            await deleteOneHoliday(company.company_id, company_holiday_id);
            addToast("Holiday deleted successfully", "success");
            await handleFetchHolidays();
            // Clear selection if deleted holiday was selected
            if (selectedHoliday?.company_holiday_id === company_holiday_id) {
                setSelectedHoliday(null);
            }
        } catch (error) {
            console.error('Failed to delete holiday:', error);
            addToast(error.response?.data?.message || "Failed to delete holiday", "error");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleUpdateFormChange = (field, value) => {
        setUpdateHolidayFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdateHoliday = async () => {
        setUpdateLoading(true);

        try {
            const payload = {
                ...updateHolidayFormData,
                holiday_date: convertToISO8601(updateHolidayFormData.holiday_date),
                holiday_rate: Number(updateHolidayFormData.holiday_rate),
            };
            await updateOneHoliday(company.company_id, selectedHoliday.company_holiday_id, payload);

            // Added success handling
            addToast("Holiday updated successfully", "success");
            setShowUpdateHoliday(false);
            await handleFetchHolidays();

            // Update selected holiday with new data
            setSelectedHoliday(prev => ({ ...prev, ...payload }));

        } catch (error) {
            console.log(error);
            addToast(error.response?.data?.message || "Failed to update holiday", "error");
        }
        finally {
            setUpdateLoading(false);
        }
    };

    return {
        holidays,
        selectedHoliday,
        holidaysLoading,
        showAddHoliday,
        showUpdateHoliday, // Added to return
        holidayFormData,
        addLoading,
        deleteLoading,
        handleChangeSelectedHoliday,
        handleShowAddHolidayModal,
        handleShowUpdateHolidayModal, // Added to return
        handleEditHoliday, // Added to return
        handleAddHoliday,
        handleFormChange,
        handleDeleteHoliday,
        handleFetchHolidays,
        attendances,
        setAttendances,
        attendancesLoading,
        setAttendancesLoading,
        handleFetchEmployeesAttendanceOnHoliday,
        handleUpdateFormChange,
        updateHolidayFormData,
        setUpdateHolidayFormData,
        handleUpdateHoliday,
        updateLoading,
    };
};

export default useHoliday;