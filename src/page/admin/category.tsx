// @ts-nocheck
import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Form, message, Space, Popconfirm, Spin } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { categoryAPI, authAPI } from "../../services/api";

const AdminCategoryPage = () => {
  // Quản lý state đơn giản
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // Fetch data khi component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories");
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    form.resetFields();
    setIsEditing(false);
    setEditingCategory(null);
    setIsModalVisible(true);
  };

  const handleEditCategory = (data) => {
    form.setFieldsValue({
      name: data.name
    });
    setIsEditing(true);
    setEditingCategory(data);
    setIsModalVisible(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!id) {
      message.error("Category ID is required");
      return;
    }
    try {
      const response = await categoryAPI.delete(id);

      // Kiểm tra kết quả trả về từ API
      if (response.data && response.data.success === false) {
        // Hiển thị thông báo lỗi từ API
        message.error(response.data.message || "Failed to delete category");
        console.error("API error:", response.data);
        return;
      }

      message.success("Category deleted successfully.");
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error deleting category:", error);

      // Kiểm tra nếu có thông báo lỗi từ API
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Failed to delete category");
      } else {
        message.error("Failed to delete category");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSaveCategory = async (values) => {
    try {
      console.log("Form values:", values);

      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem("access_token");
      console.log("Token before API call:", token);

      const categoryData = {
        ...values
      };

      console.log("Category data to be saved:", categoryData);

      if (isEditing && editingCategory) {
        // Update existing category
        const categoryId = editingCategory._id || editingCategory.id;
        console.log("Updating category with ID:", categoryId);
        await categoryAPI.update(categoryId, categoryData);
        message.success("Category updated successfully.");
      } else {
        // Create new category
        console.log("Creating new category");
        const response = await categoryAPI.create(categoryData);
        console.log("Create category response:", response);
        message.success("Category added successfully.");
      }

      setIsModalVisible(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error saving category:", error);
      console.error("Error details:", error.response?.data || error.message);
      message.error(`Failed to save category: ${error.response?.data?.message || error.message}`);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
          />
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDeleteCategory(record._id || record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold mb-6">Category Management</h2>

        {/* Category Table */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCategory}
          className="mb-6"
        >
          Add Category
        </Button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={categories}
            rowKey={(record) => record._id || record.id || ''}
            pagination={{ pageSize: 10 }}
          />
        )}

        {/* Modal for Adding/Editing Category */}
        <Modal
          title={isEditing ? "Edit Category" : "Add Category"}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            onFinish={handleSaveCategory}
            layout="vertical"
          >
            <Form.Item
              label="Category Name"
              name="name"
              rules={[{ required: true, message: "Please enter the category name!" }]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>

            <div className="flex justify-end">
              <Button onClick={handleModalClose} className="mr-3">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategoryPage;
