import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const driveService = {
  createDrive: (data) => api.post('/drives', data),
  getDrives: () => api.get('/drives'), // For students
  getCompanyDrives: () => api.get('/drives/company'), // For company
  getDriveTest: (driveId) => api.get(`/drives/${driveId}/test`), // New: Fetch drive with questions
};

export const applicationService = {
  apply: (driveId) => api.post('/applications', { driveId }),
  submitTest: (data) => api.post('/applications/submit-test', data), // New: Submit test and create application
  getMyApplications: () => api.get('/applications/my'),
  getDriveApplications: (driveId) => api.get(`/applications/drive/${driveId}`),
  getRecommendedCandidates: (driveId) => api.get(`/applications/drive/${driveId}/recommended`), // Gemini Recommendation
  updateStatus: (appId, status, testScore) => api.put(`/applications/${appId}/status`, { status, testScore }),
  getStats: () => api.get('/applications/stats'),
};

export const studentService = {
  getRecommendedJobs: () => api.get('/student/recommended-jobs'),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getPendingUsers: (role) => api.get(`/admin/pending${role ? `?role=${role}` : ''}`),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
};

export default api;
