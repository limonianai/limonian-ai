// src/helpers/axiosConfig.js
import axios from "axios";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: "https://limonianai.online/api", // Your API base URL
  timeout: 30000, // 30 seconds timeout
});

// Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Auth error - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // You might want to redirect to login page here
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;