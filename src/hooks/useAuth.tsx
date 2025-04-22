import { useState, useEffect } from 'react';

/**
 * Custom hook để xử lý logic xác thực
 * @returns Trạng thái xác thực và thông tin người dùng
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hàm kiểm tra trạng thái xác thực
  const checkAuthStatus = () => {
    const token = localStorage.getItem('access_token');
    const isAuth = localStorage.getItem('authorization') === 'true';
    const userIsAdmin = localStorage.getItem('user_isAdmin') === 'true';

    // Đảm bảo rằng cả token và isAuth đều phải tồn tại để xác thực
    const authenticated = !!token && isAuth;

    setIsAuthenticated(authenticated);
    setIsAdmin(authenticated && userIsAdmin);
    setIsLoading(false);
  };

  // Kiểm tra khi component mount và khi có sự kiện auth-change
  useEffect(() => {
    // Kiểm tra ban đầu
    checkAuthStatus();

    // Lắng nghe sự kiện auth-change
    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener('auth-change', handleAuthChange);

    // Cleanup
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  // Trả về các giá trị cần thiết
  return { isAuthenticated, isAdmin, isLoading };
};
