import { createContext, useContext } from "react";
import usePhic from "../hooks/usePhic";

//context
const PhicContext = createContext();

//provider
export const PhicProvider = ({ children }) => {
    const phic = usePhic();

    return (
        <PhicContext.Provider value={{ ...phic }}>
            {children}
        </PhicContext.Provider>
    );
}

//consumer/hooks
export const usePhicContext = () => useContext(PhicContext);