import { createContext, useContext } from "react";
import useUploadPayrun from "../hooks/useUploadPayrun";

// context
const UploadPayrunContext = createContext();

// provider
export const UploadPayrunProvider = ({ children }) => {
    const upload = useUploadPayrun();

    return (
        <UploadPayrunContext.Provider value={{ ...upload }}>
            {children}
        </UploadPayrunContext.Provider>
    );
};

// consumer/hooks
export const useUploadPayrunContext = () => useContext(UploadPayrunContext);