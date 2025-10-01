import { createContext, useContext, useState, useCallback } from "react";
import {
    XCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/solid";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "error") => {
        // const id = Date.now();
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type, visible: true }]);

        // Auto-hide with fade-out
        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
            );
        }, 2500);

        // Remove from DOM after fade-out
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const getToastIcon = (type) => {
        switch (type) {
            case "error":
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case "warning":
                return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
            case "success":
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            default:
                return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl 
              shadow-lg text-sm font-medium backdrop-blur-md 
              bg-gray-100/80 border border-gray-200 
              transition-all duration-500 ease-in-out
              ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                    >
                        {getToastIcon(toast.type)}
                        <span className="text-gray-800">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToastContext = () => useContext(ToastContext);
