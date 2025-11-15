import { createContext, useContext } from "react";
import useSpecialPayrun from "../hooks/useSpecialPayrun";


//context
const SpecialPayrunContext = createContext();

//provider
export const SpecialPayrunProvider = ({ children }) => {
    const specialPayrun = useSpecialPayrun();

    return (
        <SpecialPayrunContext.Provider value={{ ...specialPayrun }} >
            {children}
        </SpecialPayrunContext.Provider>
    );
}

//hooks/consumer
export const useSpecialPayrunContext = () => useContext(SpecialPayrunContext);