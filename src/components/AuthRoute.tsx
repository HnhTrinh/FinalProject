import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthRouteProps {
  /**
   * Loại route:
   * - 'admin': Chỉ cho phép admin truy cập
   * - 'user': Chỉ cho phép người dùng đã đăng nhập truy cập
   * - 'public': Chỉ cho phép người dùng chưa đăng nhập truy cập
   */
  routeType: 'admin' | 'user' | 'public';
}

/**
 * Component AuthRoute xử lý tất cả các loại route trong ứng dụng
 * - admin: Chỉ cho phép admin truy cập, chuyển hướng đến trang chủ nếu không phải admin
 * - user: Chỉ cho phép người dùng đã đăng nhập truy cập, chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
 * - public: Chỉ cho phép người dùng chưa đăng nhập truy cập, chuyển hướng đến trang chủ hoặc admin nếu đã đăng nhập
 */
const AuthRoute: React.FC<AuthRouteProps> = ({ routeType }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Hiển thị loading trong khi kiểm tra
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Xử lý các loại route khác nhau
  switch (routeType) {
    case 'admin':
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      if (isAuthenticated === false) {
        console.log('Admin route: Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      // Nếu không phải admin, chuyển hướng đến trang chủ
      if (!isAdmin) {
        console.log('Admin route: Not admin, redirecting to home');
        return <Navigate to="/" replace />;
      }
      // Nếu là admin, hiển thị nội dung
      console.log('Admin route: Authenticated as admin, showing content');
      return <Outlet />;

    case 'user':
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      if (isAuthenticated === false) {
        console.log('User route: Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      // Nếu đã đăng nhập (admin hoặc user thường), hiển thị nội dung
      console.log('User route: Authenticated, showing content');
      return <Outlet />;

    case 'public':
      // Nếu đã đăng nhập và đang truy cập trang đăng nhập hoặc đăng ký
      if (isAuthenticated === true && (location.pathname === '/login' || location.pathname === '/register')) {
        const redirectTo = isAdmin ? '/admin/product' : '/';
        console.log('Public route: Already authenticated, redirecting to', redirectTo);
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
      }
      // Nếu chưa đăng nhập hoặc đang truy cập trang khác, hiển thị nội dung
      console.log('Public route: Not authenticated or accessing other page, showing content');
      return <Outlet />;

    default:
      return <Outlet />;
  }
};

export default AuthRoute;
