import React, { useState } from "react";
import { Table, Button, Modal, Input, Form, message, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AdminNavbar from "../../components/AdminNavbar";
import { categories } from "../../constant/category";

interface Category {
  id: number;
  name: string;
  image: string;
}

const AdminCategoryPage: React.FC = () => {
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const handleAddCategory = () => {
    setIsEditing(false);
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditing(true);
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryList(categoryList.filter((category) => category.id !== id));
    message.success("Category deleted successfully.");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSaveCategory = (values: any) => {
    if (isEditing && editingCategory) {
      // Edit existing category
      setCategoryList(
        categoryList.map((category) =>
          category.id === editingCategory.id ? { ...category, ...values } : category
        )
      );
      message.success("Category updated successfully.");
    } else {
      // Add new category
      const newCategory = {
        ...values,
        id: Math.max(0, ...categoryList.map(c => c.id)) + 1
      };
      setCategoryList([...categoryList, newCategory]);
      message.success("Category added successfully.");
    }
    setIsModalVisible(false);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Image",
      key: "image",
      render: (text: any, record: Category) => (
        <img src={record.image} alt={record.name} className="w-12 h-12 object-cover rounded" />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Category) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
          />
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDeleteCategory(record.id)}
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
      <AdminNavbar />
      <div className="container mx-auto p-6">
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
        <Table
          columns={columns}
          dataSource={categoryList}
          rowKey="id"
          pagination={false}
        />

        {/* Modal for Adding/Editing Category */}
        <Modal
          title={isEditing ? "Edit Category" : "Add Category"}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
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

            <Form.Item
              label="Image URL"
              name="image"
              rules={[{ required: true, message: "Please enter the image URL!" }]}
            >
              <Input placeholder="Enter image URL" />
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
