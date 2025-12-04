import { createContext, useContext } from "react";
import useCompareNetPay from "../hooks/useCompareNetPay";


//context
const CompareNetPayContext = createContext();


//provider
export const CompareNetPayProvider = ({ children }) => {
    const compareNet = useCompareNetPay();

    return (
        <CompareNetPayContext.Provider value={{ ...compareNet }} >
            {children}
        </CompareNetPayContext.Provider>
    );
}

//hooks/consumer
export const useCompareNetPayContext = () => useContext(CompareNetPayContext);