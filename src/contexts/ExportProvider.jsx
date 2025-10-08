import { createContext, useContext } from "react";
import useExport from "../hooks/useExport";


//context
const ExportContext = createContext();

//provider
export const ExportProvider = ({ children }) => {
    const exportData = useExport();


    return (
        <ExportContext.Provider value={{ ...exportData }} >
            {children}
        </ExportContext.Provider>
    );
}

//hooks/consumer
export const useExportContext = () => useContext(ExportContext);