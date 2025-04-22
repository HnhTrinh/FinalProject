import { useEffect } from 'react';

const AuthInitializer = () => {
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('access_token');
      const isAuth = localStorage.getItem('authorization');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const isAdmin = localStorage.getItem('user_isAdmin');

      // Kiểm tra xem các thông tin cần thiết có đầy đủ không
      if (!token || isAuth !== 'true' || !email || !name || isAdmin === null) {
        console.warn('Auth data incomplete or invalid, clearing localStorage');
        // Nếu không hợp lệ, xóa tất cả dữ liệu trong localStorage
        localStorage.clear();
      }
    };

    initializeAuth();
  }, []);

  return null; // Component này không render gì cả
};

export default AuthInitializer;
