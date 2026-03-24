import { useState, useContext, createContext } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

const getApiBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new Error(
      'API is not configured for production. Set VITE_API_URL in your Vercel project settings.'
    );
  }

  return API_BASE_URL.replace(/\/$/, '');
};

// API Helper
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const baseUrl = getApiBaseUrl();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============ Auth API ============
export const authAPI = {
  register: (email, password, name) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () => apiCall('/auth/profile'),

  updateProfile: (data) =>
    apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ============ Health Data API ============
export const healthAPI = {
  addData: (type, value, date, notes) =>
    apiCall('/health/data', {
      method: 'POST',
      body: JSON.stringify({ type, value, date, notes }),
    }),

  getData: (type, days = 30) =>
    apiCall(`/health/data?type=${type}&days=${days}`),

  getStats: () => apiCall('/health/stats'),

  deleteData: (id) =>
    apiCall(`/health/data/${id}`, { method: 'DELETE' }),
};

// ============ Medical Reports API ============
export const reportsAPI = {
  upload: async (title, reportType, findings, file) => {
    const baseUrl = getApiBaseUrl();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('report_type', reportType);
    formData.append('findings', JSON.stringify(findings || {}));
    if (file) formData.append('file', file);

    const response = await fetch(`${baseUrl}/reports/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getAll: (type) => apiCall(`/reports${type ? `?type=${type}` : ''}`),

  getOne: (id) => apiCall(`/reports/${id}`),

  downloadHealthReport: async () => {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/reports/download/health-report`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to download report');
    }

    return response.blob();
  },

  analyze: (id, reportContent) =>
    apiCall(`/reports/${id}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ reportContent }),
    }),

  delete: (id) => apiCall(`/reports/${id}`, { method: 'DELETE' }),
};

// ============ Medicines API ============
export const medicinesAPI = {
  search: (query) => apiCall(`/medicines?query=${query || ''}`),

  getDetails: (id) => apiCall(`/medicines/${id}`),

  verify: (medicineId, batchNumber) =>
    apiCall('/medicines/verify', {
      method: 'POST',
      body: JSON.stringify({ medicine_id: medicineId, batch_number: batchNumber }),
    }),

  addToProfile: (medicineId, dosage, frequency, startDate, endDate, notes) =>
    apiCall('/medicines/add', {
      method: 'POST',
      body: JSON.stringify({
        medicine_id: medicineId,
        dosage,
        frequency,
        start_date: startDate,
        end_date: endDate,
        notes,
      }),
    }),

  getUserMedicines: () => apiCall('/medicines/user/medicines'),
};

// ============ AI API (NEW - WITH GOOGLE GEMINI INTEGRATION) ============
export const aiAPI = {
  // Ask health questions
  askQuestion: (question, category = 'general') =>
    apiCall('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question, category }),
    }),

  // Get conversation history
  getConversation: (limit = 50, offset = 0) =>
    apiCall(`/ai/conversation?limit=${limit}&offset=${offset}`),

  // Get AI-powered health insights
  getHealthInsights: () => apiCall('/ai/insights'),

  // Get AI-powered health risk predictions
  predictHealthRisks: () => apiCall('/ai/predict-risks'),

  // Generate personalized health plan
  generateHealthPlan: (goals) =>
    apiCall('/ai/health-plan', {
      method: 'POST',
      body: JSON.stringify({ goals }),
    }),

  // Analyze medicine interactions
  analyzeMedicineInteractions: (medicineIds) =>
    apiCall('/ai/medicine-interactions', {
      method: 'POST',
      body: JSON.stringify({ medicineIds }),
    }),
};

// ============ Custom Hook for AI Features ============
export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const askQuestion = async (question, category) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiAPI.askQuestion(question, category);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiAPI.getHealthInsights();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const predictRisks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiAPI.predictHealthRisks();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generatePlan = async (goals) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiAPI.generateHealthPlan(goals);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkMedicineInteractions = async (medicineIds) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiAPI.analyzeMedicineInteractions(medicineIds);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    data,
    askQuestion,
    getInsights,
    predictRisks,
    generatePlan,
    checkMedicineInteractions,
  };
};

export default {
  apiCall,
  authAPI,
  healthAPI,
  reportsAPI,
  medicinesAPI,
  aiAPI,
  useAI,
};
