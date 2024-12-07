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

// Response Interceptor (Optional)
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (optional: redirect to login)
      console.log("Unauthorized, redirecting to login...");
      localStorage.removeItem("access_token"); // Remove token
      window.location.href = "/login"; // Redirect to login page
    }

    return Promise.reject(error); // Forward the error
  }
);

export default axiosInstance;
