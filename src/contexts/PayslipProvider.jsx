import { createContext, useContext } from "react";
import usePayslip from "../hooks/usePayslip";

//context
const PayslipContext = createContext();

//provider
export const PayslipProvider = ({ children }) => {
    const payslip = usePayslip();

    return (
        <PayslipContext.Provider value={{ ...payslip }} >
            {children}
        </PayslipContext.Provider>
    );
};

//consumer/hook
export const usePayslipContext = () => useContext(PayslipContext);