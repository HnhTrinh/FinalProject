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
    console.log("Token from localStorage:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Request headers:", config.headers);
    } else {
      console.warn("No token found in localStorage!");
    }

    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
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
  },
  checkToken: () => {
    const token = localStorage.getItem('access_token');
    return {
      isAuthenticated: !!token,
      token
    };
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
  },
  update: (id: any, data: any) => {
    return axiosInstance.put(`/products/${id}`, data);
  },
  delete: (id: any) => {
    return axiosInstance.delete(`/products/${id}`);
  },
  uploadImage: (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset');
    return axios.post('https://api.cloudinary.com/v1_1/dr55r3y3z/image/upload', formData);
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

// Category APIs
export const categoryAPI = {
  getAll: () => {
    return axiosInstance.get('/category');
  },
  getById: (id: any) => {
    return axiosInstance.get(`/category/${id}`);
  },
  create: (data: any) => {
    return axiosInstance.post('/category', data);
  },
  update: (id: any, data: any) => {
    return axiosInstance.put(`/category/${id}`, data);
  },
  delete: (id: any) => {
    return axiosInstance.delete(`/category/${id}`);
  }
};

export default axiosInstance;

