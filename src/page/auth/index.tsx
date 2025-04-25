import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Alert, Divider } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      // Sử dụng authAPI để đăng nhập
      const res = await authAPI.login(values);
      console.log("🚀 ~ handleLogin ~ res:", res);

      // Kiểm tra response từ backend
      if (res.data && res.data.success === false) {
        // Xử lý lỗi từ backend
        const errorMessage = res.data.error || res.data.message || "Authentication failed!";
        toast.error(errorMessage);
        setError(errorMessage);
        return;
      }

      if (res.status !== 200) {
        toast.error("Authentication failed!");
        setError("Authentication failed!");
        return;
      }

      // Lấy dữ liệu người dùng và token từ response
      const responseData = res.data.data;

      if (!responseData || !responseData.user) {
        toast.error("User data not found!");
        setError("User data not found!");
        return;
      }

      const userData = responseData.user;
      const token = responseData.token;

      // Lưu thông tin vào localStorage
      localStorage.setItem('access_token', token); // Lưu JWT token
      localStorage.setItem('authorization', 'true');
      localStorage.setItem('user_id', userData._id);
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_name', userData.name);
      localStorage.setItem('user_isAdmin', userData.isAdmin.toString());
      localStorage.setItem('user_phone', userData.phone || '');
      localStorage.setItem('user_address', userData.address || '');

      toast.success("Login successful! Welcome back.");

      // Khởi tạo sự kiện auth-change để cập nhật trạng thái xác thực
      window.dispatchEvent(new Event('auth-change'));

      // Chuyển hướng dựa vào quyền admin
      navigate(userData.isAdmin ? "/admin/product" : '/');
    } catch (error: any) {
      // Xử lý lỗi từ response
      const errorResponse = error.response?.data;
      let errorMessage = "Something went wrong!";

      if (errorResponse) {
        errorMessage = errorResponse.error || errorResponse.message || errorMessage;
      }

      toast.error(errorMessage);
      console.error(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your account to continue</p>

        {error && (
          <Alert
            message="Login Error"
            description={error}
            type="error"
            showIcon
            closable
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}

        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
          className="space-y-4"
          disabled={loading}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email address!" }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              className="rounded-lg py-2"
              placeholder="Enter your email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="rounded-lg py-2"
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <div className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <a className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              className="w-full bg-blue-600 h-10 text-base font-medium rounded-lg"
              loading={loading}
              size="large"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Or</Divider>

        <div className="mb-4">
          <GoogleLoginButton />
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600 mb-2">Don't have an account?</p>
          <Link to="/register">
            <Button type="default" className="w-full rounded-lg h-10" size="large">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
