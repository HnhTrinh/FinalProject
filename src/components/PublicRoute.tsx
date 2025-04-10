import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * PublicRoute component
 * Chỉ cho phép truy cập khi người dùng chưa đăng nhập
 * Nếu đã đăng nhập, chuyển hướng đến trang chủ hoặc trang admin (nếu là admin)
 */
const PublicRoute: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const token = localStorage.getItem('access_token');
    const isAuth = localStorage.getItem('authorization') === 'true';
    const userIsAdmin = localStorage.getItem('user_isAdmin') === 'true';
    
    setIsAuthenticated(!!token && isAuth);
    setIsAdmin(userIsAdmin);
    setIsLoading(false);
  }, []);

  // Hiển thị loading trong khi kiểm tra
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu đã đăng nhập, chuyển hướng đến trang chủ hoặc trang admin
  if (isAuthenticated) {
    const redirectTo = isAdmin ? '/admin/product' : '/';
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Nếu chưa đăng nhập, hiển thị nội dung
  return <Outlet />;
};

export default PublicRoute;
