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
  const { isAuthenticated, isAdmin, isLoading, LoadingComponent } = useAuth();

  // Hiển thị loading trong khi kiểm tra
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Xử lý các loại route khác nhau
  switch (routeType) {
    case 'admin':
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      // Nếu không phải admin, chuyển hướng đến trang chủ
      if (!isAdmin) {
        return <Navigate to="/" replace />;
      }
      // Nếu là admin, hiển thị nội dung
      return <Outlet />;

    case 'user':
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      // Nếu đã đăng nhập (admin hoặc user thường), hiển thị nội dung
      return <Outlet />;

    case 'public':
      // Nếu đã đăng nhập, chuyển hướng đến trang chủ hoặc trang admin
      if (isAuthenticated) {
        const redirectTo = isAdmin ? '/admin/product' : '/';
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
      }
      // Nếu chưa đăng nhập, hiển thị nội dung
      return <Outlet />;

    default:
      return <Outlet />;
  }
};

export default AuthRoute;
