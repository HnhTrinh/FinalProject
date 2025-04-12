import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { IUserData } from "../../types/authen.type";
import { authAPI } from "../../services/api";

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values: IUserData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authAPI.register(values);
      console.log("🚀 ~ handleRegister ~ res:", res);

      // Kiểm tra response từ backend
      if (res.data && res.data.data.success === false) {
        // Xử lý lỗi từ backend
        const errorMessage = res.data.error || res.data.message || "Registration failed!";
        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      toast.success("Registration successful! Please login.");
      // Chuyển hướng đến trang đăng nhập sau 1 giây
      setTimeout(() => {
        navigate('/login');
      }, 1000);
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {error && (
          <Alert
            message="Registration Error"
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
          onFinish={handleRegister}
          layout="vertical"
          className="space-y-4"
          disabled={loading}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your full name!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              className="rounded-lg py-2"
              placeholder="Enter your full name"
            />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email address!" }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              className="rounded-lg py-2"
              placeholder="Enter your email address"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="rounded-lg py-2"
              placeholder="Create a password"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              { pattern: /^[0-9]{10,11}$/, message: "Please enter a valid phone number!" }
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              className="rounded-lg py-2"
              placeholder="Enter your phone number"
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input
              prefix={<HomeOutlined className="text-gray-400" />}
              className="rounded-lg py-2"
              placeholder="Enter your address"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 h-10 text-base font-medium rounded-lg"
              loading={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </Form.Item>

          <div className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;