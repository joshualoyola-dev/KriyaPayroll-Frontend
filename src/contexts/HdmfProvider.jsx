import { createContext, useContext } from "react";
import useHdmf from "../hooks/useHdmf";


//context
const HdmfContext = createContext();

//provider
export const HdmfProvider = ({ children }) => {
    const hdfm = useHdmf();

    return (
        <HdmfContext.Provider value={{ ...hdfm }} >
            {children}
        </HdmfContext.Provider>
    );
}

//consumer/hook
export const useHdmfContext = () => useContext(HdmfContext);