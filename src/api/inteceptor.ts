import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_API_URL, // Replace with your API's base URL
  timeout: 10000, // Request timeout in milliseconds
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Retrieve token from local storage
    console.log("🚀 ~ token:", token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error); // Forward the error
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401 ||
        (error.response?.status === 400 && error.response?.data?.error === 'Token is not valid')) {
      // Handle unauthorized error or invalid token
      console.log("Token expired or invalid, clearing auth data...");

      // Clear all localStorage items
      localStorage.clear();

      // Import toast from react-toastify
      const { toast } = require('react-toastify');

      // Show token expired message
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error); // Forward the error
  }
);

export default axiosInstance;
