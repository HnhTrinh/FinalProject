// @ts-nocheck
import { Menu, Dropdown, Badge, Avatar, Modal, Form, Input, Button } from "antd";
import {
  HomeOutlined,
  ShopOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  MobileOutlined,
  LockOutlined,
  KeyOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { cartAPI, userAPI } from "../services/api";
import { toast } from "react-toastify";

// Biến toàn cục để lưu trữ hàm cập nhật số lượng sản phẩm
let updateCartBadgeCount = () => {};

// Hàm để các component khác có thể gọi để cập nhật số lượng sản phẩm
export const refreshCartCount = () => {
  updateCartBadgeCount();
};

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState('home');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordForm] = Form.useForm();

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
    setIsAuthenticated(false);
    setUser(null);
    setCartItemCount(0);

    // Khởi tạo sự kiện auth-change để cập nhật trạng thái xác thực
    window.dispatchEvent(new Event('auth-change'));

    // Hiển thị thông báo đăng xuất thành công
    toast.success("Đăng xuất thành công");

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (values) => {
    try {
      setChangePasswordLoading(true);

      const response = await userAPI.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });

      if (response.data?.success) {
        toast.success("Đổi mật khẩu thành công");
        setChangePasswordVisible(false);
        changePasswordForm.resetFields();
      } else {
        toast.error(response.data?.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Navigation and User Controls */}
          <div className="flex items-center space-x-1">
            {/* Main Navigation */}
            <Menu mode="horizontal" className="bg-transparent border-0" selectedKeys={[current]}>
              <Menu.Item key="home" icon={<HomeOutlined />} className="hover:text-blue-600 transition-colors">
                <Link to="/">Home</Link>
              </Menu.Item>

              <Menu.Item key="products" icon={<ShopOutlined />} className="hover:text-blue-600 transition-colors">
                <Link to="/products">Products</Link>
              </Menu.Item>

              <Menu.Item key="contact" icon={<PhoneOutlined />} className="hover:text-blue-600 transition-colors">
                <Link to="/contact">Contact</Link>
              </Menu.Item>
            </Menu>

            {/* User Controls */}
            <div className="flex items-center ml-4 space-x-4">
              {/* Cart Icon */}
              <Link to="/cart" className="relative flex items-center hover:text-blue-600 transition-colors">
                <Badge count={cartItemCount} showZero={false} size="small" color="#f56565">
                  <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                </Badge>
                <span className="ml-1 hidden sm:inline">Cart</span>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "profile",
                        icon: <UserOutlined />,
                        label: (
                          <div className="py-1">
                            <div className="font-medium">{user?.name || "User"}</div>
                            <div className="text-xs text-gray-500">{user?.email || 'N/A'}</div>
                          </div>
                        ),
                      },
                      {
                        key: "orders",
                        icon: <ShoppingOutlined />,
                        label: (
                          <Link to="/orders">My Orders</Link>
                        ),
                      },
                      ...(user?.isAdmin
                        ? [
                          {
                            key: "admin",
                            icon: <DashboardOutlined />,
                            label: (
                              <Link to="/admin/product">Admin Dashboard</Link>
                            ),
                          },
                        ]
                        : []),
                      {
                        type: 'divider',
                      },
                      {
                        key: "changePassword",
                        icon: <KeyOutlined />,
                        label: <span onClick={() => setChangePasswordVisible(true)}>Đổi mật khẩu</span>,
                      },
                      {
                        key: "logout",
                        icon: <LogoutOutlined />,
                        label: <span onClick={handleLogout}>Logout</span>,
                        danger: true
                      },
                    ],
                  }}
                  placement="bottomRight"
                  arrow
                >
                  <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    <Avatar size="small" icon={<UserOutlined />} className="bg-blue-500" />
                    <span className="ml-1 hidden sm:inline">{user?.name || "User"}</span>
                  </div>
                </Dropdown>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link to="/register" className="hover:text-blue-600 transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <MobileOutlined className="text-blue-600 text-2xl mr-2" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mobile Shop
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      <Modal
        title={
          <div className="flex items-center">
            <LockOutlined className="text-blue-600 mr-2" />
            <span>Đổi mật khẩu</span>
          </div>
        }
        open={changePasswordVisible}
        onCancel={() => {
          setChangePasswordVisible(false);
          changePasswordForm.resetFields();
        }}
        footer={null}
        maskClosable={false}
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setChangePasswordVisible(false);
                changePasswordForm.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={changePasswordLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Đổi mật khẩu
            </Button>
          </div>
        </Form>
      </Modal>
    </header>
  );
};

export default NavBar;
