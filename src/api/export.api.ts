import axios from 'axios';

// 🚨 DOUBLE CHECK: This must match your Backend URL
const API_URL = "http://localhost:5000/api/v1"; 

// Helper for Auth and Blob response
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    responseType: 'blob' as const 
  };
};

// --- Function for 2316 ---
export const download2316Pdf = async (companyId: string, year: number) => {
  try {
    console.log(`Requesting 2316 PDF for Company: ${companyId}, Year: ${year}...`);
    
    const response = await axios.post(
      `${API_URL}/data-export/company/${companyId}/2316/generate`,
      { year },
      getAuthHeaders() 
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BIR_2316_${year}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("❌ 2316 PDF Download Failed:", error);
    alert("Failed to generate 2316 PDF.");
    return false;
  }
};

// --- Function for 1601C ---
export const download1601cPdf = async (companyId: string, year: number, month: number) => {
  try {
    console.log(`Requesting 1601C PDF for Company: ${companyId}, Period: ${month}-${year}...`);
    
    const response = await axios.post(
      `${API_URL}/data-export/company/${companyId}/1601c/generate`,
      { year, month }, 
      getAuthHeaders() 
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BIR_1601C_${month}_${year}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("❌ 1601C PDF Download Failed:", error);
    alert("Failed to generate 1601C PDF.");
    return false;
  }
};