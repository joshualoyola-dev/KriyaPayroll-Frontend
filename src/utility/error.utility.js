// utils/error.js
const getErrorMessage = (error, fallback = "Something went wrong") => {
    if (!error) return fallback;

    // If it's already a string
    if (typeof error === "string") return error;

    // Standard JS Error object
    if (error instanceof Error) return error.message;

    // Axios-style error with response
    if (error.response?.data) {
        if (typeof error.response.data === "string") {
            return error.response.data;
        }
        if (error.response.data.message) {
            return error.response.data.message;
        }
        if (error.response.data.error) {
            return error.response.data.error;
        }
    }

    // Fetch-style error with statusText
    if (error.statusText) return error.statusText;

    // If error has a message field
    if (error.message) return error.message;

    // Fallback to JSON stringify for debugging
    try {
        return JSON.stringify(error);
    } catch {
        return fallback;
    }
}

export const getResponseErrorMessage = (error, fallback = "Something went wrong") => {
    if (!error) return fallback;

    // Check if error has response structure
    if (error.response?.data) {
        // Check for different error message formats
        if (error.response.data.error) {
            return error.response.data.error;
        }
        if (error.response.data.message) {
            return error.response.data.message;
        }
        if (typeof error.response.data === "string") {
            return error.response.data;
        }
    }

    // Fallback to getErrorMessage for other error types
    return getErrorMessage(error, fallback);
}


export default getErrorMessage;