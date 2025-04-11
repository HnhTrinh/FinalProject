// @ts-nocheck
import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Form, message, Space, Popconfirm, Spin, Select, Upload } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import { productAPI, authAPI, categoryAPI } from "../../services/api";



const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // Kiểm tra token và fetch data khi component mounts
  useEffect(() => {
    const { isAuthenticated, token } = authAPI.checkToken();
    console.log("Auth check on admin page:", { isAuthenticated, token });

    if (!isAuthenticated) {
      message.error("You must be logged in to access this page");
      navigate("/login");
      return;
    }

    fetchProducts();
    fetchCategories();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data.data || []);
      setLoadingCategories(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories");
      setLoadingCategories(false);
    }
  };

  const handleAddProduct = () => {
    form.resetFields();
    setIsEditing(false);
    setEditingProduct(null);
    setImageUrl("");
    setIsModalVisible(true);
  };

  const handleEditProduct = (product) => {
    const categoryValue = typeof product.category === 'object' && product.category !== null
      ? product.category._id || product.category.id
      : product.category;

    form.setFieldsValue({
      name: product.name,
      price: product.price,
      description: product.description,
      features: product.feature ? product.feature.join(", ") : "",
      amountInStore: product.amountInStore,
      category: categoryValue
    });
    setIsEditing(true);
    setEditingProduct(product);
    setImageUrl(product.pictureURL || "");
    setIsModalVisible(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productAPI.delete(id);
      message.success("Product deleted successfully.");
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      setUploading(true);
      const response = await productAPI.uploadImage(file);
      setImageUrl(response.data.secure_url);
      setUploading(false);
      onSuccess("ok");
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Image upload failed");
      setUploading(false);
      onError("Image upload failed");
    }
  };

  const handleSaveProduct = async (values) => {
    try {
      console.log("Form values:", values);

      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem("access_token");
      console.log("Token before API call:", token);

      const { features, ...restValues } = values;
      const featureArray = features.split(",").map((feature) => feature.trim());

      const productData = {
        ...restValues,
        feature: featureArray,
        pictureURL: imageUrl
      };

      console.log("Product data to be saved:", productData);

      if (isEditing && editingProduct) {
        // Update existing product
        const productId = editingProduct.id || editingProduct._id;
        console.log("Updating product with ID:", productId);
        await productAPI.update(productId, productData);
        message.success("Product updated successfully.");
      } else {
        // Create new product
        console.log("Creating new product");
        const response = await productAPI.create(productData);
        console.log("Create product response:", response);
        message.success("Product added successfully.");
      }

      setIsModalVisible(false);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error saving product:", error);
      console.error("Error details:", error.response?.data || error.message);
      message.error(`Failed to save product: ${error.response?.data?.message || error.message}`);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Amount",
      dataIndex: "amountInStore",
      key: "amountInStore"
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => {
        if (typeof record.category === 'object' && record.category !== null) {
          return record.category.name;
        }
        return record.category;
      }
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <img
          src={record.pictureURL}
          alt={record.name}
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id || record._id || 0)}
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
        <h2 className="text-3xl font-bold mb-6">Admin Product Management hihi</h2>

        {/* Product Table */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddProduct}
          className="mb-6"
        >
          Add Product
        </Button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={products}
            rowKey={(record) => record.id || record._id || ''}
            pagination={{ pageSize: 10 }}
          />
        )}

        {/* Modal for Adding/Editing Product */}
        <Modal
          title={isEditing ? "Edit Product" : "Add Product"}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={600}
        >
          <Form
            form={form}
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
              label="Product Price"
              name="price"
              rules={[{ required: true, message: "Please enter the product price!" }]}
            >
              <Input type="number" min={0} placeholder="Enter product price" />
            </Form.Item>

            <Form.Item
              label="Product Description"
              name="description"
              rules={[{ required: true, message: "Please enter the product description!" }]}
            >
              <Input.TextArea rows={4} placeholder="Enter product description" />
            </Form.Item>

            <Form.Item
              label="Product Features"
              name="features"
              rules={[{ required: true, message: "Please enter the product features!" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter product features (comma separated)"
              />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select the product category!" }]}
            >
              <Select
                placeholder="Select product category"
                loading={loadingCategories}
                options={categories.map(cat => ({
                  value: cat._id || cat.id,
                  label: cat.name
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Product Image"
              name="imageUrl"
              rules={[{ required: imageUrl ? false : true, message: "Please upload an image!" }]}
            >
              <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                accept="image/jpeg,image/png,image/gif"
                customRequest={handleImageUpload}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="product" className="w-20 h-20 object-cover rounded" />
                ) : uploading ? (
                  <div>
                    <LoadingOutlined />
                    <div>Uploading...</div>
                  </div>
                ) : (
                  <div>
                    <PlusOutlined />
                    <div>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label="Amount In Store"
              name="amountInStore"
              rules={[{ required: true, message: "Please enter the amount in store!" }]}
            >
              <Input type="number" min={0} placeholder="Enter amount in store" />
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
