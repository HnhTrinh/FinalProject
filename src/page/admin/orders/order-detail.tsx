import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Descriptions, Table, Button, Spin, Tag, Input, Form, Modal, message, Steps, Row, Col, Select, Image, Typography
} from 'antd';
import {
  ShoppingOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { orderAPI, ORDER_STATUS } from '../../../services/api';




const { Option } = Select;

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
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
        const orderData = response.data.data;
        console.log('Order details:', orderData);
        setOrder(orderData);
        setCurrentStepFromStatus(orderData.status);



        // Set tracking form values if available
        if (orderData.trackingNumber) {
          trackingForm.setFieldsValue({
            trackingNumber: orderData.trackingNumber,
            carrier: orderData.carrier,
            estimatedDeliveryDate: orderData.estimatedDeliveryDate,
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
      case 'cancelled':
      case 'payment_failed':
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


  // Get color for status tag
  const getStatusTagColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return 'blue';
      case ORDER_STATUS.PROCESSING: return 'orange';
      case ORDER_STATUS.SHIPPED: return 'cyan';
      case ORDER_STATUS.DELIVERED: return 'green';
      case 'cancelled': return 'red';
      case 'payment_failed': return 'red';
      default: return 'default';
    }
  };

  // Table columns for order items
  const columns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'product',
      render: (_: string, record: any) => {
        // In the updated API, product is an object with name, price, pictureURL
        const productName = record.product?.name || 'Unknown Product';
        const imageUrl = record.product?.pictureURL;

        return (
          <div className="flex items-center">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={productName}
                width={50}
                height={50}
                className="object-cover rounded mr-3"
                preview={false}
              />
            )}
            <span>{productName}</span>
          </div>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: ['product', 'price'],
      key: 'price',
      render: (_: number, record: any) => `$${(record.product?.price || 0).toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      key: 'total',
      render: (record: any) => `$${((record.product?.price || 0) * (record.quantity || 1)).toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <div>
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" tip="Loading order details..." />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
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
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-4">Order #{order._id}</h1>
            <Tag color={getStatusTagColor(order.status)} className="text-base px-3 py-1">
              {order.status.toUpperCase()}
            </Tag>
          </div>
          <div>
            <Button onClick={() => navigate('/admin/orders')}>
              Back to Orders
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
                  {order.status === 'cancelled' ? 'Order Cancelled' : 'Payment Failed'}
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                {order.status === 'cancelled'
                  ? 'This order has been cancelled.'
                  : 'There was an issue with your payment. Please try again or contact customer support.'}
              </p>
            </div>
          )}
        </Card>

        {/* Order Details */}
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
          className="mb-6"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
                <Descriptions.Item label="Order Date">
                  {new Date(order.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  PayPal
                </Descriptions.Item>
                <Descriptions.Item label="Payment Date">
                  {order.paymentDate ? new Date(order.paymentDate).toLocaleString() : 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col span={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Customer Name">
                  {order.user?.name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {order.user?.email || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {order.user?.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {order.user?.address || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          {/* {order.trackingNumber && (
            <div className="mt-4">
              <Descriptions column={1} bordered>
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
              </Descriptions>
            </div>
          )} */}
        </Card>

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
            rowKey={(_, index) => `item-${index}`}
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


        {/* <Modal
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
        </Modal> */}
      </div>
    </div>
  );
};

export default AdminOrderDetail;
