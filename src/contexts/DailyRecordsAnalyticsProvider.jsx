import { createContext, useContext } from "react";
import useDailyRecordsAnalytics from "../hooks/useDailyRecordsAnalytics";


// context 
const DailyRecordsAnalyticsContext = createContext();

// provider
export const DailyRecordsAnalyticsProvider = ({ children }) => {
    const analytics = useDailyRecordsAnalytics();
    return <DailyRecordsAnalyticsContext.Provider value={{ ...analytics }}>
        {children}
    </DailyRecordsAnalyticsContext.Provider>
};

// consumer/hooks
export const useDailyRecordsAnalyticsContext = () => useContext(DailyRecordsAnalyticsContext);