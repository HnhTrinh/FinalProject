import { Menu } from "antd";
import { HomeOutlined, ShopOutlined, PhoneOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";


const Navbar = () => {
  // Get the cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Calculate the total number of items in the cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <Menu mode="horizontal" className="flex justify-between">
          {/* Logo */}
          <Menu.Item key="logo" className="font-bold text-lg">
            <Link to="/">Mobile Shop</Link>
          </Menu.Item>

          {/* Home Link */}
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>

          {/* Products Link */}
          <Menu.Item key="products" icon={<ShopOutlined />}>
            <Link to="/products">Products</Link>
          </Menu.Item>

          {/* Contact Link */}
          <Menu.Item key="contact" icon={<PhoneOutlined />}>
            <Link to="/contact">Contact</Link>
          </Menu.Item>

          {/* Cart Link with Item Count */}
          <Menu.Item key="cart" icon={<ShoppingCartOutlined />} className="relative">
            <Link to="/cart">
              {/* Cart Badge */}
              {totalItems > 0 && (
                <span className="absolute top-3 right-0 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
              Cart
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    </header>
  );
};

export default Navbar;
