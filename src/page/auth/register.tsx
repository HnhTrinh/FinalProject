import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { registerService } from "../../services/authen.service";
import { toast } from "react-toastify";
import { IUserData } from "../../types/authen.type";

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values: IUserData) => {
    try {
      const res = await registerService(values);
      if (res.status !== 201) {
        toast.error("Registration failed!");
        setError("Registration failed!");
        return;
      }
      
      toast.success("Registration successful! Please login.");
      navigate('/login');
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
      setError("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>
        <Form form={form} onFinish={handleRegister} layout="vertical" className="space-y-4">
          {error && (
            <div className="text-red-500 text-center text-sm mb-4">{error}</div>
          )}

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter your phone number!" }]}
          >
            <Input className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input className="rounded-lg" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-blue-600">
              Register
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            Already have an account?{" "}
            <Button type="link" onClick={() => navigate("/login")}>
              Login here
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;