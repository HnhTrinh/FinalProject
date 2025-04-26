import React from "react";
import { Form, Input, Button, Space, Typography, Card, Col, Row, message, Divider } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ContactPage: React.FC = () => {
  const onFinish = (values: any) => {
    message.success("Your message has been sent!");
    console.log(values);
  };

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <Title level={2} className="text-center mb-8" style={{ color: "#333" }}>
        <strong>Get in Touch</strong>
      </Title>

      {/* Contact Form Section */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={18} md={12} lg={10}>
          <Card
            title="Contact Us"
            bordered={false}
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <Form name="contact" layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Your Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name!" }]}
              >
                <Input placeholder="Enter your name" style={{ borderRadius: "8px" }} />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[{ required: true, message: "Please enter your email!" }, { type: 'email', message: 'Please enter a valid email!' }]}
              >
                <Input placeholder="Enter your email" style={{ borderRadius: "8px" }} />
              </Form.Item>

              <Form.Item
                label="Your Message"
                name="message"
                rules={[{ required: true, message: "Please enter your message!" }]}
              >
                <Input.TextArea placeholder="Your message" rows={4} style={{ borderRadius: "8px" }} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                    fontSize: "16px",
                  }}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Contact Information Section */}
        <Col xs={24} sm={18} md={12} lg={10}>
          <Card
            title="Our Contact Information"
            bordered={false}
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Space size="middle">
                <MailOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <Text style={{ fontSize: "16px", color: "#333" }}>
                  support@mobileshop.com
                </Text>
              </Space>

              <Space size="middle">
                <PhoneOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <Text style={{ fontSize: "16px", color: "#333" }}>
                  +1 234 567 890
                </Text>
              </Space>

              <Space size="middle">
                <EnvironmentOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <Text style={{ fontSize: "16px", color: "#333" }}>
                  123 Mobile St, Tech City, USA
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider dashed />

      {/* Social Media Links Section */}
      <div className="text-center">
        <Title level={4} style={{ color: "#333" }}>
          Connect with Us
        </Title>
        <Space size="large" style={{ fontSize: "20px" }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style={{ width: "30px", height: "30px" }} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/256/3938/3938028.png" alt="Twitter" style={{ width: "30px", height: "30px" }} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style={{ width: "30px", height: "30px" }} />
          </a>
        </Space>
      </div>
    </div>
  );
};

export default ContactPage;
