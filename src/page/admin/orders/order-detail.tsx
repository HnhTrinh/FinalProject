import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Descriptions, Table, Button, Spin, Tag, Input, Form, Modal, message, Timeline, Divider, Steps, Row, Col, Select, Image, Typography
} from 'antd';
import {
  ShoppingOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined,
  CloseCircleOutlined, EditOutlined, SaveOutlined, PrinterOutlined,
  MailOutlined, UserOutlined
} from '@ant-design/icons';
import { orderAPI, ORDER_STATUS } from '../../../services/api';
import AdminNavbar from '../../../components/AdminNavbar';

const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingForm] = Form.useForm();

  // Fetch order details
  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderById(id || '');

      if (response.data?.success) {
        setOrder(response.data.data);
        setCurrentStepFromStatus(response.data.data.status);

        // Set form values
        form.setFieldsValue({
          customerName: response.data.data.shippingAddress?.name,
          address: response.data.data.shippingAddress?.address,
          notes: response.data.data.notes || '',
        });

        // Set tracking form values if available
        if (response.data.data.trackingNumber) {
          trackingForm.setFieldsValue({
            trackingNumber: response.data.data.trackingNumber,
            carrier: response.data.data.carrier,
            estimatedDeliveryDate: response.data.data.estimatedDeliveryDate,
          });
        }
      } else {
        message.error(response.data?.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  // Chuyển đổi trạng thái đơn hàng thành step hiện tại
  const setCurrentStepFromStatus = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        setCurrentStep(0);
        break;
      case ORDER_STATUS.PROCESSING:
        setCurrentStep(1);
        break;
      case ORDER_STATUS.SHIPPED:
        setCurrentStep(2);
        break;
      case ORDER_STATUS.DELIVERED:
        setCurrentStep(3);
        break;
      case ORDER_STATUS.CANCELLED:
      case ORDER_STATUS.PAYMENT_FAILED:
        setCurrentStep(-1); // Trạng thái lỗi
        break;
      default:
        setCurrentStep(0);
    }
  };

  // Update order status
  const handleStatusChange = async (newStatus: string) => {
    try {
      // Trong thực tế, bạn cần tạo API này
      const response = await orderAPI.updateOrderStatus(id || '', newStatus);

      if (response.data?.success) {
        message.success(`Order status updated to ${newStatus.toUpperCase()}`);
        fetchOrderDetails(); // Refresh order data
      } else {
        message.error(response.data?.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  // Update shipping information
  const handleUpdateTracking = async (values: any) => {
    try {
      // Trong thực tế, bạn cần tạo API này
      const response = await orderAPI.updateOrderTracking(id || '', values);

      if (response.data?.success) {
        message.success('Tracking information updated');
        setTrackingModalVisible(false);
        fetchOrderDetails(); // Refresh order data
      } else {
        message.error(response.data?.message || 'Failed to update tracking information');
      }
    } catch (error) {
      console.error('Error updating tracking information:', error);
      message.error('Failed to update tracking information');
    }
  };

  // Update order details
  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();

      // Trong thực tế, bạn cần tạo API này
      const response = await orderAPI.updateOrderDetails(id || '', {
        shippingAddress: {
          name: values.customerName,
          address: values.address,
        },
        notes: values.notes,
      });

      if (response.data?.success) {
        message.success('Order details updated');
        setEditMode(false);
        fetchOrderDetails(); // Refresh order data
      } else {
        message.error(response.data?.message || 'Failed to update order details');
      }
    } catch (error) {
      console.error('Error updating order details:', error);
      message.error('Failed to update order details');
    }
  };

  // Send notification email
  const handleSendNotification = async () => {
    try {
      // Trong thực tế, bạn cần tạo API này
      const response = await orderAPI.sendOrderNotification(id || '');

      if (response.data?.success) {
        message.success('Notification email sent to customer');
      } else {
        message.error(response.data?.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      message.error('Failed to send notification');
    }
  };

  // Get color for status tag
  const getStatusTagColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return 'blue';
      case ORDER_STATUS.PROCESSING: return 'orange';
      case ORDER_STATUS.SHIPPED: return 'cyan';
      case ORDER_STATUS.DELIVERED: return 'green';
      case ORDER_STATUS.CANCELLED: return 'red';
      case ORDER_STATUS.PAYMENT_FAILED: return 'red';
      default: return 'default';
    }
  };

  // Table columns for order items
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'product',
      render: (name: string, record: any) => (
        <div className="flex items-center">
          {record.pictureURL && (
            <Image
              src={record.pictureURL}
              alt={name}
              width={50}
              height={50}
              className="object-cover rounded mr-3"
              preview={false}
            />
          )}
          <span>{name || (record.product?.name) || 'Unknown Product'}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${(price || 0).toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      key: 'total',
      render: (record: any) => `$${((record.price || 0) * (record.quantity || 1)).toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" tip="Loading order details..." />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="mb-6">The order you're looking for doesn't exist.</p>
          <Button type="primary" onClick={() => navigate('/admin/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-4">Order #{order._id}</h1>
            <Tag color={getStatusTagColor(order.status)} className="text-base px-3 py-1">
              {order.status.toUpperCase()}
            </Tag>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => navigate('/admin/orders')}>
              Back to Orders
            </Button>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
            >
              Print
            </Button>
            <Button
              type="primary"
              icon={<MailOutlined />}
              onClick={handleSendNotification}
            >
              Notify Customer
            </Button>
          </div>
        </div>

        {/* Order Progress */}
        <Card className="mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Order Status</h3>
            <Select
              value={order.status}
              style={{ width: 200 }}
              onChange={handleStatusChange}
            >
              <Option value={ORDER_STATUS.PENDING}>Pending</Option>
              <Option value={ORDER_STATUS.PROCESSING}>Processing</Option>
              <Option value={ORDER_STATUS.SHIPPED}>Shipped</Option>
              <Option value={ORDER_STATUS.DELIVERED}>Delivered</Option>
              <Option value={ORDER_STATUS.CANCELLED}>Cancelled</Option>
            </Select>
          </div>

          {currentStep >= 0 ? (
            <Steps
              current={currentStep}
              items={[
                {
                  title: 'Order Placed',
                  description: 'Payment confirmed',
                  icon: <ShoppingOutlined />,
                },
                {
                  title: 'Processing',
                  description: 'Order is being prepared',
                  icon: <CheckCircleOutlined />,
                },
                {
                  title: 'Shipped',
                  description: 'Order has been shipped',
                  icon: <CarOutlined />,
                },
                {
                  title: 'Delivered',
                  description: 'Order has been delivered',
                  icon: <HomeOutlined />,
                },
              ]}
            />
          ) : (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center text-red-600">
                <CloseCircleOutlined className="text-xl mr-2" />
                <span className="text-lg font-medium">
                  {order.status === ORDER_STATUS.CANCELLED ? 'Order Cancelled' : 'Payment Failed'}
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                {order.status === ORDER_STATUS.CANCELLED
                  ? 'This order has been cancelled.'
                  : 'There was an issue with your payment. Please try again or contact customer support.'}
              </p>
            </div>
          )}
        </Card>

        {/* Order Details */}
        <Row gutter={16} className="mb-6">
          <Col span={12}>
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span>Customer Information</span>
                  <Button
                    type="text"
                    icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                    onClick={() => {
                      if (editMode) {
                        handleSaveChanges();
                      } else {
                        setEditMode(true);
                      }
                    }}
                  >
                    {editMode ? 'Save' : 'Edit'}
                  </Button>
                </div>
              }
              className="h-full"
            >
              {editMode ? (
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="customerName"
                    label="Customer Name"
                    rules={[{ required: true, message: 'Please enter customer name' }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Shipping Address"
                    rules={[{ required: true, message: 'Please enter shipping address' }]}
                  >
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item
                    name="notes"
                    label="Order Notes"
                  >
                    <TextArea rows={3} />
                  </Form.Item>
                </Form>
              ) : (
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Customer Name">
                    {order.shippingAddress?.name || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {order.paymentDetails?.payerEmail || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Shipping Address">
                    {order.shippingAddress?.address || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Order Notes">
                    {order.notes || 'No notes'}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span>Order & Payment Information</span>
                  {order.status === ORDER_STATUS.PROCESSING && (
                    <Button
                      type="primary"
                      onClick={() => setTrackingModalVisible(true)}
                    >
                      Add Tracking
                    </Button>
                  )}
                </div>
              }
              className="h-full"
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
                <Descriptions.Item label="Order Date">
                  {new Date(order.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  {order.paymentDetails?.paymentMethod || 'PayPal'}
                </Descriptions.Item>
                <Descriptions.Item label="Payment ID">
                  {order.paymentDetails?.id || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  {order.paymentDetails?.status || 'N/A'}
                </Descriptions.Item>
                {order.trackingNumber && (
                  <>
                    <Descriptions.Item label="Tracking Number">
                      {order.trackingNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Carrier">
                      {order.carrier}
                    </Descriptions.Item>
                    {order.estimatedDeliveryDate && (
                      <Descriptions.Item label="Estimated Delivery">
                        {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                      </Descriptions.Item>
                    )}
                  </>
                )}
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* Order Items */}
        <Card
          title={
            <div className="flex justify-between items-center">
              <span>Order Items</span>
              <Typography.Text strong>Total: ${order.totalPrice?.toFixed(2)}</Typography.Text>
            </div>
          }
          className="mb-6">
          <Table
            dataSource={order.items}
            columns={columns}
            pagination={false}
            rowKey={(record) => record._id || record.productId}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3} className="text-right font-bold">
                  Total:
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} className="font-bold">
                  ${order.totalPrice?.toFixed(2)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Card>

        {/* Status History */}
        <Card title="Order History" className="mb-6">
          {order.statusHistory ? (
            <Timeline mode="left">
              {order.statusHistory.map((history: any, index: number) => (
                <Timeline.Item
                  key={index}
                  color={getStatusTagColor(history.status)}
                  label={new Date(history.timestamp).toLocaleString()}
                >
                  <p className="font-medium">{history.status.toUpperCase()}</p>
                  {history.note && <p className="text-gray-600">{history.note}</p>}
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Timeline mode="left">
              <Timeline.Item
                color={getStatusTagColor(order.status)}
                label={new Date(order.createdAt).toLocaleString()}
              >
                <p className="font-medium">ORDER CREATED</p>
                <p className="text-gray-600">Initial status: {order.status.toUpperCase()}</p>
              </Timeline.Item>
            </Timeline>
          )}
        </Card>

        {/* Tracking Modal */}
        <Modal
          title="Add Tracking Information"
          open={trackingModalVisible}
          onCancel={() => setTrackingModalVisible(false)}
          onOk={() => trackingForm.submit()}
          okText="Save Tracking"
        >
          <Form
            form={trackingForm}
            layout="vertical"
            onFinish={handleUpdateTracking}
          >
            <Form.Item
              name="trackingNumber"
              label="Tracking Number"
              rules={[{ required: true, message: 'Please enter tracking number' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="carrier"
              label="Carrier"
              rules={[{ required: true, message: 'Please select carrier' }]}
            >
              <Select>
                <Option value="fedex">FedEx</Option>
                <Option value="ups">UPS</Option>
                <Option value="usps">USPS</Option>
                <Option value="dhl">DHL</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="estimatedDeliveryDate"
              label="Estimated Delivery Date"
            >
              <Input type="date" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
