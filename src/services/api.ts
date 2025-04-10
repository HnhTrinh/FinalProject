import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data: any) => {
    return axiosInstance.post('/auth/login', data);
  },
  register: (data: any) => {
    return axiosInstance.post('/auth/register', data);
  }
};

// Product APIs
export const productAPI = {
  getAll: () => {
    return axiosInstance.get('/products');
  },
  getById: (id: any) => {
    return axiosInstance.get(`/products/${id}`);
  },
  create: (data: any) => {
    return axiosInstance.post('/products', data);
  }
};

// Cart APIs
export const cartAPI = {
  addToCart: (values: any) => {
    return axiosInstance.post('/cart', values);
  },
  getCart: (userId: any) => {
    return axiosInstance.get(`/cart/${userId}`);
  }
};

// User APIs
export const userAPI = {
  getUser: (email: any) => {
    return axiosInstance.get(`/user/${email}`);
  }
};

export default axiosInstance;

