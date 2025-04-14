import React, { useEffect, useState } from 'react';
import { Menu, Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, AppstoreOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

interface UserInfo {
  name?: string;
  email?: string;
  isAdmin?: boolean;
}

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({});

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
  };

  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <Menu mode="horizontal" theme="dark" className="flex justify-between bg-gray-800">
          <Menu.Item key="admin" className="font-bold text-lg">
            <Link to="/admin/product">Admin Dashboard</Link>
          </Menu.Item>

          <Menu.Item key="products" icon={<ShoppingOutlined />}>
            <Link to="/admin/product">Products</Link>
          </Menu.Item>

          <Menu.Item key="categories" icon={<AppstoreOutlined />}>
            <Link to="/admin/category">Categories</Link>
          </Menu.Item>

          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Orders</Link>
          </Menu.Item>

          <Menu.Item key="store">
            <Link to="/">Go to Store</Link>
          </Menu.Item>

          <Menu.Item key="user">
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: <span><b>Email:</b> {userInfo.email}</span>,
                  },
                  {
                    key: 'logout',
                    label: (
                      <span onClick={handleLogout}>
                        <LogoutOutlined /> Logout
                      </span>
                    ),
                  },
                ],
              }}
              placement="bottomRight"
            >
              <div className="flex items-center text-white cursor-pointer">
                <UserOutlined />
                <span className="ml-1">{userInfo.name || 'Admin'}</span>
              </div>
            </Dropdown>
          </Menu.Item>

        </Menu>
      </div>
    </div>
  );
};

export default AdminNavbar;
