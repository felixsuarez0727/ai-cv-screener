import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for faster responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  async healthCheck() {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  // Chat endpoint
  async sendMessage(message) {
    const response = await apiClient.post('/api/chat', { message });
    return response.data;
  },

  // Chat status
  async getChatStatus() {
    const response = await apiClient.get('/api/chat/status');
    return response.data;
  },
};

export default apiService; 