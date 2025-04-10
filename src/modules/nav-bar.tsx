import { Menu, Button, Dropdown } from "antd";
import { HomeOutlined, ShopOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../redux/user";

const Navbar = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.clear();

    // Cập nhật trạng thái Redux
    dispatch(logout());

    // Chuyển hướng về trang chủ
    navigate('/');
  };



  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <Menu mode="horizontal" className="flex justify-between">
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

          <Menu.Item key="cart" icon={<ShoppingCartOutlined />} className="relative">
            <Link to="/cart">
              {totalItems > 0 && (
                <span className="absolute top-3 right-0 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
              Cart
            </Link>
          </Menu.Item>

          {isAuthenticated ? (
            <Menu.Item key="user">
              <Dropdown menu={{ items: [
                { key: 'profile', label: <span><b>Email:</b> {user?.email}</span> },
                ...(user?.isAdmin ? [{ key: 'admin', label: <Link to="/admin/product">Admin Dashboard</Link> }] : []),
                { key: 'logout', label: <span onClick={handleLogout}>Logout</span> }
              ]}} placement="bottomRight">
                <Button icon={<UserOutlined />} className="flex items-center">
                  <span className="ml-1">{user?.name || 'User'}</span>
                </Button>
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
