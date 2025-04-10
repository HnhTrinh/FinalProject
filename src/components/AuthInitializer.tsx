import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/user';
import { IUserData } from '../types/authen.type';

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('access_token');
      const isAuth = localStorage.getItem('authorization');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const isAdmin = localStorage.getItem('user_isAdmin') === 'true';

      if (token && isAuth === 'true' && email) {
        try {
          // Sử dụng thông tin từ localStorage để khôi phục trạng thái đăng nhập
          dispatch(login({
            id: localStorage.getItem('user_id') || '',
            email: email,
            name: name || '',
            isAdmin: isAdmin,
            // Các trường khác có thể để trống hoặc lấy từ localStorage nếu có lưu
            phone: localStorage.getItem('user_phone') || '',
            address: localStorage.getItem('user_address') || ''
          }));
        } catch (error) {
          console.error('Failed to initialize auth state:', error);
          // Xóa tất cả dữ liệu trong localStorage nếu có lỗi
          localStorage.clear();
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null; // Component này không render gì cả
};

export default AuthInitializer;
