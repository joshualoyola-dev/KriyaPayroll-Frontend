import { createContext, useContext } from "react";
import useWithholding from "../hooks/useWithholding";


const WithholdingContext = createContext();

export const WithholdingProvider = ({ children }) => {
    const withholding = useWithholding();

    return (
        <WithholdingContext.Provider value={{ ...withholding }} >
            {children}
        </WithholdingContext.Provider>
    );
};


export const useWithholdingContext = () => useContext(WithholdingContext);