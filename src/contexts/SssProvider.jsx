import { createContext, useContext } from "react";
import useSSS from "../hooks/useSSS";

//constext
const SssContext = createContext();

//provider 
export const SssProvider = ({ children }) => {
    const sss = useSSS();

    return (
        <SssContext.Provider value={{ ...sss }} >
            {children}
        </SssContext.Provider>
    );
};

//hooks/consumer
export const useSssContext = () => useContext(SssContext);