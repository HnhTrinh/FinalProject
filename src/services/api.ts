import axios from "axios";

// Export axiosInstance để có thể sử dụng ở các file khác
export const axiosInstance = axios.create({
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

    // Xử lý lỗi token hết hạn (401 Unauthorized) hoặc token không hợp lệ (400)
    if (error.response?.status === 401 ||
        (error.response?.status === 400 && error.response?.data?.error === 'Token is not valid')) {
      console.log('Token expired or invalid, clearing auth data...');

      // Xóa toàn bộ localStorage
      localStorage.clear();

      // Import toast từ react-toastify
      const { toast } = require('react-toastify');

      // Hiển thị thông báo token hết hạn
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");

      // Chuyển hướng về trang đăng nhập
      window.location.href = "/login";
    }

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
  // Thêm sản phẩm vào giỏ hàng
  addToCart: (values: any) => {
    return axiosInstance.post('/cart', values);
  },
  // Lấy tất cả sản phẩm trong giỏ hàng
  getCart: () => {
    return axiosInstance.get('/cart');
  },
  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: (values: any) => {
    return axiosInstance.put('/cart', values);
  },
  // Xóa sản phẩm khỏi giỏ hàng
  removeCartItem: (productId: any) => {
    return axiosInstance.delete('/cart', { data: { productId } });
  }
};

// Order APIs
export const orderAPI = {
  // Tạo đơn hàng mới
  createOrder: (orderData: any) => {
    return axiosInstance.post('/orders', orderData);
  },

  // Lấy thông tin đơn hàng theo ID
  getOrderById: (orderId: string) => {
    return axiosInstance.get(`/orders/${orderId}`);
  },

  // Lấy danh sách đơn hàng của người dùng
  getUserOrders: () => {
    return axiosInstance.get('/orders/user');
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: (orderId: string, status: string) => {
    return axiosInstance.put(`/orders/${orderId}/status`, { status });
  },

  // Xác nhận thanh toán PayPal
  verifyPayPalPayment: (paymentData: any) => {
    return axiosInstance.post('/orders/verify-payment', paymentData);
  }
};

// Định nghĩa các trạng thái đơn hàng
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  PAYMENT_FAILED: 'payment_failed'
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

