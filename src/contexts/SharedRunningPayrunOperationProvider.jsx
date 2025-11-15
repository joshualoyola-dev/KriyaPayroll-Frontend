import { createContext, useContext } from "react"
import useSharedRunningPayrunOperation from "../hooks/useSharedRunningPayrunOperation";



//context
const SharedRunningPayrunOperationContext = createContext();

//provider
export const SharedRunningPayrunOperationProvider = ({ children }) => {
    const sharedOperations = useSharedRunningPayrunOperation();


    return (
        <SharedRunningPayrunOperationContext.Provider value={{ ...sharedOperations }} >
            {children}
        </SharedRunningPayrunOperationContext.Provider>
    );
}


//consumer/hooks
export const useSharedRunningPayrunOperationContext = () => useContext(SharedRunningPayrunOperationContext);