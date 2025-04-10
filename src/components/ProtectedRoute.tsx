import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra token và quyền admin
    const token = localStorage.getItem('access_token');
    const isAuth = localStorage.getItem('authorization') === 'true';
    const userIsAdmin = localStorage.getItem('user_isAdmin') === 'true';
    
    setIsAuthenticated(!!token && isAuth);
    setIsAdmin(userIsAdmin);
  }, []);

  // Hiển thị loading trong khi kiểm tra
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu không có token hoặc không được xác thực, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu yêu cầu quyền admin nhưng người dùng không phải admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Nếu đã xác thực và có đủ quyền, hiển thị nội dung
  return <Outlet />;
};

export default ProtectedRoute;
