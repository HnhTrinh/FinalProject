import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      // Sử dụng authAPI để đăng nhập
      const res = await authAPI.login(values);
      console.log("🚀 ~ handleLogin ~ res:", res)
      if (res.status !== 200) {
        toast.error("Authentication failed!");
        setError("Authentication failed!")
        return;
      }

      // Lấy dữ liệu người dùng và token từ response
      const responseData = res.data.data;
      console.log("responseBE:", responseData);

      if (!responseData || !responseData.user) {
        toast.error("User data not found!");
        setError("User data not found!")
        return;
      }

      const userData = responseData.user;
      const token = responseData.token;
      console.log("userData từ res.user:", userData);

      // Lưu thông tin vào localStorage
      localStorage.setItem('access_token', token); // Lưu JWT token
      localStorage.setItem('authorization', 'true');
      localStorage.setItem('user_id', userData._id);
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_name', userData.name);
      localStorage.setItem('user_isAdmin', userData.isAdmin.toString());
      localStorage.setItem('user_phone', userData.phone);
      localStorage.setItem('user_address', userData.address);

      toast.success("Authentication successful!");

      // Chuyển hướng dựa vào quyền admin
      navigate(userData.isAdmin ? "/admin/product" : '/');
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
