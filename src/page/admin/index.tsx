import React, { useState } from "react";
import { Table, Button, Modal, Input, Form, message, Space, Popconfirm, Upload } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AdminNavbar from "../../components/AdminNavbar";

import { RcFile } from "antd/es/upload";
import { Product } from "../../types";
import { products } from "../../constant/product";

// Helper function for handling image upload
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG files!");
  }
  return isJpgOrPng;
};

const initialProducts: Product[] = [
  ...products
];

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // For image preview in modal

  const handleAddProduct = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setImageUrl(undefined);
    setIsModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setImageUrl(product?.image);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
    message.success("Product deleted successfully.");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSaveProduct = (values: any) => {
    const { features, ...restValues } = values;
    const featureArray = features.split(",").map((feature: string) => feature.trim()); // Split the features string into an array

    const newProduct = { ...restValues, id: products.length + 1, features: featureArray, imageUrl };
    if (isEditing && editingProduct) {
      // Edit existing product
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...restValues, features: featureArray, imageUrl } : product
        )
      );
      message.success("Product updated successfully.");
    } else {
      // Add new product
      setProducts([...products, newProduct]);
      message.success("Product added successfully.");
    }
    setIsModalVisible(false);
  };

  const handleImageChange = (info: any) => {
    if (info.file.status === "done") {
      // When image is uploaded, update the preview URL
      setImageUrl(info.file.response.url);
    } else if (info.file.status === "error") {
      message.error("Image upload failed.");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Image",
      key: "image",
      render: (text: any, record: Product) => (
        <img src={record.image} alt={record.name} className="w-12 h-12 object-cover rounded" />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Product) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
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
        <h2 className="text-3xl font-bold mb-6">Admin Product Management</h2>

      {/* Product Table */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddProduct}
        className="mb-6"
      >
        Add Product
      </Button>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={false}
      />

      {/* Modal for Adding/Editing Product */}
      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <Form
          initialValues={editingProduct || {}}
          onFinish={handleSaveProduct}
          layout="vertical"
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter the product name!" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input placeholder="Enter product price" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            label="Features"
            name="features"
            rules={[{ required: true, message: "Please enter the features!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter product features (comma separated)"
              defaultValue={editingProduct?.features.join(", ")}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter the category!" }]}
          >
            <Input placeholder="Enter product category" />
          </Form.Item>

          <Form.Item
            label="Product Image"
            name="imageUrl"
            valuePropName="file"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
              customRequest={({ file, onSuccess }) => {
                // Simulate image upload
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 1000);
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="product" className="w-20 h-20 object-cover rounded" />
              ) : (
                <div>
                  <PlusOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
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

export default AdminPage;
