import { createContext, useContext } from "react";
import useContribution from "../hooks/useContribution";


//context
const ContributionContext = createContext();

//provider
export const ContributionProvider = ({ children }) => {
    const contribution = useContribution();

    return (
        <ContributionContext.Provider value={{ ...contribution }} >
            {children}
        </ContributionContext.Provider>
    );
}

//consumer/hook
export const useContributionContext = () => useContext(ContributionContext);