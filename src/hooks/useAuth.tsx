import React, { useState, useEffect } from 'react';

/**
 * Component LoadingSpinner để hiển thị trạng thái loading
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

/**
 * Custom hook để xử lý logic xác thực
 * @returns Trạng thái xác thực, thông tin người dùng và component loading
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra token và quyền admin
    const token = localStorage.getItem('access_token');
    const isAuth = localStorage.getItem('authorization') === 'true';
    const userIsAdmin = localStorage.getItem('user_isAdmin') === 'true';

    setIsAuthenticated(!!token && isAuth);
    setIsAdmin(userIsAdmin);
    setIsLoading(false);
  }, []);

  // Component loading để sử dụng trong các route
  const LoadingComponent = () => <LoadingSpinner />;

  return { isAuthenticated, isAdmin, isLoading, LoadingComponent };
};
