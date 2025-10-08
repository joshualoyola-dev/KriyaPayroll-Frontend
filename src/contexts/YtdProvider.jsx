import { createContext, useContext } from "react";
import useYtd from "../hooks/useYtd";

//context
const YtdContext = createContext();

//provider
export const YtdProvider = ({ children }) => {
    const ytd = useYtd();
    return (
        <YtdContext.Provider value={{ ...ytd }}>
            {children}
        </YtdContext.Provider>
    );
}

//hooks/consumer
export const useYtdContext = () => useContext(YtdContext);