import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { loginService } from "../../services/authen.service";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/user";
import { IUserData } from "../../types/authen.type";
import { getUser } from "../../services/user";
import { getCartService } from "../../services/cart";
import { CartItem } from "../../types";
import { addToCart } from "../../redux/cart";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [form] = Form.useForm();

  const fetchCart = async (user: IUserData) => {
    const res = await getCartService(user?.id || '')
    const data = res.data.items as any[]

    data.forEach(item => {
      const cartItem = {
        id: item.id,
        name: item.Product.name,
        pictureURL: item.Product.pictureURL,
        feature: item.Product.feature,
        quantity: item.amount,
        price: item.Product.price

      } as CartItem
      console.log("🚀 ~ fetchCart ~ cartItem:", cartItem)

      dispatch(addToCart(cartItem))
    })

  }

  const handleLogin = async (values: { email: string; password: string }) => {

    try {
      // Mock API Call
      const res = await loginService(values);

      if (res.status !== 200) {
        toast.error("Authentication failed!");
        setError("Authentication failed!")
        return;
      }

      const accessToken = res.data?.result as string;
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('authorization', 'true')


      const userRes = await getUser(values.email)

      const data = userRes.data.result as IUserData
      // Update Redux state
      dispatch(login({
        id: data.id,
        email: data.email,
        address: data.address,
        name: data.name,
        phone: data.phone,
        isAdmin: data.isAdmin
      }));

      toast.success("Authentication successful!");

      await fetchCart(data)

      navigate(data.isAdmin ? "/admin/product" : '/'); // Redirect to Admin page
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
      setError("Something went wrong!")
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <Form form={form} onFinish={handleLogin} layout="vertical" className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="text-red-500 text-center text-sm mb-4">{error}</div>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              placeholder="Enter your email"
              className="rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-600"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-600"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>Need help? <a href="#" className="text-blue-600">Contact support</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
