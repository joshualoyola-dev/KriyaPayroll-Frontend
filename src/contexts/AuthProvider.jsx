import { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

//context
const AuthContext = createContext();

//provider
export const AuthProvider = ({ children }) => {
    const auth = useAuth();



    return (
        <AuthContext.Provider value={{ ...auth }}>
            {children}
        </AuthContext.Provider>
    );
};

//hooks/consumer
export const useAuthContext = () => useContext(AuthContext);