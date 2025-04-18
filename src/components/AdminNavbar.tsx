import React, { useEffect, useState } from 'react';
import { Menu, Dropdown, Avatar, Tooltip, Modal, Form, Input, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  HomeOutlined,
  SettingOutlined,
  LockOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';

interface UserInfo {
  name?: string;
  email?: string;
  isAdmin?: boolean;
}

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordForm] = Form.useForm();

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage khi component mount
    const name = localStorage.getItem('user_name') || undefined;
    const email = localStorage.getItem('user_email') || undefined;
    const isAdmin = localStorage.getItem('user_isAdmin') === 'true';

    setUserInfo({ name, email, isAdmin });
  }, []);

  const handleLogout = () => {
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.clear();

    // Chuyển hướng về trang đăng nhập
    navigate('/login');

    // Hiển thị thông báo đăng xuất thành công
    toast.success("Đăng xuất thành công");
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (values: any) => {
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
    } catch (error: any) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Admin Controls */}
            <div className="flex items-center space-x-2">
              {/* Admin Navigation */}
              <div className="flex items-center">
                <Menu mode="horizontal" theme="dark" className="bg-transparent border-0">
                  <Menu.Item key="products" icon={<ShoppingOutlined />} className="hover:text-blue-400 transition-colors">
                    <Link to="/admin/product">Products</Link>
                  </Menu.Item>

                  <Menu.Item key="categories" icon={<AppstoreOutlined />} className="hover:text-blue-400 transition-colors">
                    <Link to="/admin/category">Categories</Link>
                  </Menu.Item>

                  <Menu.Item key="orders" icon={<ShoppingCartOutlined />} className="hover:text-blue-400 transition-colors">
                    <Link to="/admin/orders">Orders</Link>
                  </Menu.Item>
                </Menu>
              </div>

              {/* User Controls */}
              <div className="flex items-center ml-4 space-x-4">
                <Tooltip title="Go to Store">
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    <HomeOutlined style={{ fontSize: '18px' }} />
                    <span className="ml-1 hidden md:inline">Store</span>
                  </Link>
                </Tooltip>

                {/* User Menu */}
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'profile',
                        icon: <UserOutlined />,
                        label: (
                          <div className="py-1">
                            <div className="font-medium">{userInfo.name || 'Admin'}</div>
                            <div className="text-xs text-gray-500">{userInfo.email}</div>
                          </div>
                        ),
                      },
                      {
                        key: 'settings',
                        icon: <SettingOutlined />,
                        label: 'Settings',
                      },
                      {
                        type: 'divider',
                      },
                      {
                        key: 'changePassword',
                        icon: <KeyOutlined />,
                        label: <span onClick={() => setChangePasswordVisible(true)}>Đổi mật khẩu</span>,
                      },
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: <span onClick={handleLogout}>Logout</span>,
                        danger: true
                      },
                    ],
                  }}
                  placement="bottomRight"
                  arrow
                >
                  <div className="flex items-center cursor-pointer hover:text-blue-400 transition-colors">
                    <Avatar size="small" icon={<UserOutlined />} className="bg-blue-600" />
                    <span className="ml-1 hidden sm:inline">{userInfo.name || 'Admin'}</span>
                  </div>
                </Dropdown>
              </div>
            </div>

            {/* Right Side - Logo */}
            <div className="flex items-center">
              <Link to="/admin/product" className="flex items-center">
                <DashboardOutlined className="text-blue-400 text-xl mr-2" />
                <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Modal đổi mật khẩu */}
      <Modal
        title={
          <div className="flex items-center">
            <LockOutlined className="text-blue-400 mr-2" />
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
    </>
  );
};

export default AdminNavbar;
