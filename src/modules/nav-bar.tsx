// @ts-nocheck
import { Menu, Dropdown } from "antd";
import {
  HomeOutlined,
  ShopOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { cartAPI } from "../services/api";
import { toast } from "react-toastify";

// Biến toàn cục để lưu trữ hàm cập nhật số lượng sản phẩm
let updateCartBadgeCount = () => {};

// Hàm để các component khác có thể gọi để cập nhật số lượng sản phẩm
export const refreshCartCount = () => {
  updateCartBadgeCount();
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState('home');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra trạng thái xác thực khi component mount
  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('access_token');
    const isAuth = localStorage.getItem('authorization') === 'true';

    // Lấy thông tin người dùng từ các key riêng biệt
    const userInfo = {
      id: localStorage.getItem('user_id') || '',
      email: localStorage.getItem('user_email') || '',
      name: localStorage.getItem('user_name') || '',
      isAdmin: localStorage.getItem('user_isAdmin') === 'true',
      phone: localStorage.getItem('user_phone') || '',
      address: localStorage.getItem('user_address') || ''
    };

    // Chỉ xác thực nếu có token và authorization là true
    setIsAuthenticated(!!token && isAuth);
    setUser(userInfo);
  }, []);

  // Update current menu item based on location
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/') {
      setCurrent('home');
    } else if (pathname.startsWith('/products')) {
      setCurrent('products');
    } else if (pathname.startsWith('/contact')) {
      setCurrent('contact');
    } else if (pathname.startsWith('/cart')) {
      setCurrent('cart');
    } else if (pathname.startsWith('/login')) {
      setCurrent('login');
    } else if (pathname.startsWith('/register')) {
      setCurrent('register');
    }
  }, [location]);

  // Hàm lấy số lượng sản phẩm trong giỏ hàng
  const getCartCount = async () => {
    if (!isAuthenticated) {
      setCartItemCount(0);
      return;
    }

    try {
      const response = await cartAPI.getCart();
      if (response.data?.success) {
        const items = response.data.data?.items || [];
        // Tính tổng số lượng sản phẩm trong giỏ hàng
        const count = items.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(count);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  // Gán hàm cập nhật cho biến toàn cục
  updateCartBadgeCount = getCartCount;

  // Lấy số lượng sản phẩm trong giỏ hàng khi component mount hoặc trạng thái đăng nhập thay đổi
  useEffect(() => {
    // Gọi hàm lấy số lượng sản phẩm
    getCartCount();

    // Cập nhật số lượng sản phẩm mỗi 30 giây
    const intervalId = setInterval(getCartCount, 30000);

    // Dọn dẹp khi component unmount
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleLogout = () => {
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.clear();

    // Cập nhật trạng thái đăng nhập và thông tin người dùng
    // setIsAuthenticated(false);
    // setUser(null);
    setCartItemCount(0);

    // Chuyển hướng về trang chủ
    navigate("/login");

    // Hiển thị thông báo đăng xuất thành công
    toast.success("Đăng xuất thành công");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <Menu mode="horizontal" className="flex justify-between" selectedKeys={[current]}>
          <Menu.Item key="logo" className="font-bold text-lg">
            <Link to="/">Mobile Shop</Link>
          </Menu.Item>

          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>

          <Menu.Item key="products" icon={<ShopOutlined />}>
            <Link to="/products">Products</Link>
          </Menu.Item>

          <Menu.Item key="contact" icon={<PhoneOutlined />}>
            <Link to="/contact">Contact</Link>
          </Menu.Item>

          <Menu.Item
            key="cart"
            icon={<ShoppingCartOutlined />}
            className="relative"
          >
            <Link to="/cart">
              {cartItemCount > 0 && (
                <span className="absolute top-3 right-0 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
              Cart
            </Link>
          </Menu.Item>

          {isAuthenticated ? (
            <Menu.Item key="user">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "profile",
                      label: (
                        <span>
                          <b>Email:</b> {user?.email || 'N/A'}
                        </span>
                      ),
                    },
                    {
                      key: "orders",
                      label: (
                        <Link to="/orders">My Orders</Link>
                      ),
                    },
                    ...(user?.isAdmin
                      ? [
                        {
                          key: "admin",
                          label: (
                            <Link to="/admin/product">Admin Dashboard</Link>
                          ),
                        },
                      ]
                      : []),
                    {
                      key: "logout",
                      label: <span onClick={handleLogout}>Logout</span>,
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <div className="flex items-center cursor-pointer">
                  <UserOutlined />
                  <span className="ml-1">{user?.name || "User"}</span>
                </div>
              </Dropdown>
            </Menu.Item>
          ) : (
            <>
              <Menu.Item key="login">
                <Link to="/login">Login</Link>
              </Menu.Item>
              <Menu.Item key="register">
                <Link to="/register">Register</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </div>
    </header>
  );
};

export default Navbar;
