import axios from "axios"
import env from "../configs/env.config"

export const checkPDFGenerationService = () => {
    return axios.get(`${env.VITE_PDF_GENERATION_SERVICE_URL}/api/v1/health`);
};
