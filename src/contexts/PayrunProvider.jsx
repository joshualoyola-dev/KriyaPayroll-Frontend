import { createContext, useContext } from "react";
import usePayrun from "../hooks/usePayrun";

//context
const PayrunContext = createContext();

//provider
export const PayrunProvider = ({ children }) => {
    const payrun = usePayrun();


    return (
        <PayrunContext.Provider value={{ ...payrun }}>
            {children}
        </PayrunContext.Provider>
    );
};

//hooks/consumer
export const usePayrunContext = () => useContext(PayrunContext);