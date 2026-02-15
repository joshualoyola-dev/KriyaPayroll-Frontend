import axios from 'axios';
import env from '../configs/env.config';

// Use environment variable if available, fallback to localhost for development
// Ensure API_URL includes /api/v1 if not already present
const baseUrl = env.VITE_PAYROLL_BACKEND_URL || "http://localhost:5000";
const API_URL = baseUrl.includes('/api/v1') ? baseUrl : `${baseUrl}/api/v1`; 

// Helper for Auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  const companyAccessToken = localStorage.getItem('companyAccessToken');
  
  return { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'x-company-access-token': companyAccessToken || '',
      'Content-Type': 'application/json'
    },
    timeout: 120000 // 2 minute timeout for PDF generation
  };
};

/**
 * Generates BIR Form 2316 PDF and saves it to Google Drive
 * @param companyId - The company ID
 * @param year - The tax year (e.g., 2025)
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const generate2316Pdf = async (
  companyId: string, 
  year: number
): Promise<boolean> => {
  try {
    console.log(`[Frontend] ==========================================`);
    console.log(`[Frontend] Requesting 2316 PDF generation`);
    console.log(`[Frontend] Company ID: ${companyId}`);
    console.log(`[Frontend] Year: ${year}`);
    console.log(`[Frontend] API URL: ${API_URL}`);
    console.log(`[Frontend] Full URL: ${API_URL}/data-exports/company/${companyId}/2316/generate`);
    console.log(`[Frontend] ==========================================`);
    
    const response = await axios.post(
      `${API_URL}/data-exports/company/${companyId}/2316/generate`,
      { year },
      getAuthHeaders() 
    );
    
    console.log(`[Frontend] Response received:`, response.status, response.data);

    // Validate response
    if (!response.data || !response.data.success) {
      throw new Error("Invalid response from server");
    }
    
    console.log(`[Frontend] ✅ 2316 PDF generated successfully and saved to Google Drive`);
    
    return true;
  } catch (error: any) {
    console.error("[Frontend] ❌ 2316 PDF Generation Failed:", error);
    return false;
  }
};

/**
 * Generates BIR Form 1601C PDF and saves it to Google Drive
 * @param companyId - The company ID
 * @param year - The tax year (e.g., 2025)
 * @param month - The month (1-12)
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const generate1601cPdf = async (
  companyId: string, 
  year: number, 
  month: number
): Promise<boolean> => {
  try {
    console.log(`[Frontend] ==========================================`);
    console.log(`[Frontend] Requesting 1601C PDF generation`);
    console.log(`[Frontend] Company ID: ${companyId}`);
    console.log(`[Frontend] Year: ${year}, Month: ${month}`);
    console.log(`[Frontend] API URL: ${API_URL}`);
    console.log(`[Frontend] Full URL: ${API_URL}/data-exports/company/${companyId}/1601c/generate`);
    console.log(`[Frontend] ==========================================`);
    
    const response = await axios.post(
      `${API_URL}/data-exports/company/${companyId}/1601c/generate`,
      { year, month }, 
      getAuthHeaders() 
    );
    
    console.log(`[Frontend] Response received:`, response.status, response.data);

    // Validate response
    if (!response.data || !response.data.success) {
      throw new Error("Invalid response from server");
    }
    
    console.log(`[Frontend] ✅ 1601C PDF generated successfully and saved to Google Drive`);
    
    return true;
  } catch (error: any) {
    console.error("[Frontend] ❌ 1601C PDF Generation Failed:", error);
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.response?.data?.error ||
      error?.message ||
      "PDF generation failed";
    throw new Error(msg);
  }
};