import { createContext, useContext } from "react";
import usePayrunFilters from "../hooks/usePayrunFilters";

const PayrunFiltersContext = createContext();

export const PayrunFiltersProvider = ({ children, payruns }) => {
    const filters = usePayrunFilters(payruns);
    return (
        <PayrunFiltersContext.Provider value={filters}>
            {children}
        </PayrunFiltersContext.Provider>
    );
};

export const usePayrunFiltersContext = () => useContext(PayrunFiltersContext);
