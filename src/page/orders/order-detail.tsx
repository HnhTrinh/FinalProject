// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Steps, Card, Descriptions, Table, Button, Spin, Tag, Image, Typography, Divider, Alert } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined, CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { orderAPI, ORDER_STATUS } from '../../services/api';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Lấy thông tin đơn hàng từ API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await orderAPI.getOrderById(id);

          if (response.data?.success) {
            const orderData = response.data.data;
            console.log('Order details:', orderData);
            setOrder(orderData);
            setCurrentStepFromStatus(orderData.status);
          } else {
            toast.error(response.data?.message || 'Failed to fetch order details');
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

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

  // Lấy màu cho tag trạng thái
  const getStatusTagColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'blue';
      case ORDER_STATUS.PROCESSING:
        return 'orange';
      case ORDER_STATUS.SHIPPED:
        return 'cyan';
      case ORDER_STATUS.DELIVERED:
        return 'green';
      case 'cancelled':
      case 'payment_failed':
        return 'red';
      default:
        return 'default';
    }
  };

  // Định nghĩa cột cho bảng sản phẩm
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'product',
      render: (name: string, record: any) => {
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
      render: (price: number, record: any) => `$${(record.product?.price || 0).toFixed(2)}`,
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
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button type="primary" onClick={() => navigate('/orders')}>
          View All Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/orders')}
            className="mr-4"
          >
            Back to Orders
          </Button>
          <h1 className="text-2xl font-bold">Order #{order._id}</h1>
        </div>
        <Tag color={getStatusTagColor(order.status)} className="text-base px-3 py-1">
          {order.status.toUpperCase()}
        </Tag>
      </div>

      {/* Order Progress */}
      {currentStep >= 0 ? (
        <Card className="mb-6">
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
        </Card>
      ) : (
        <Card className="mb-6 bg-red-50">
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
        </Card>
      )}

      {/* Order Summary */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <Typography.Title level={5}>Order Summary</Typography.Title>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Order Status:</strong> <Tag color={getStatusTagColor(order.status)}>{order.status.toUpperCase()}</Tag></p>
            <p><strong>Payment Method:</strong> PayPal</p>
            {order.paymentDate && (
              <p><strong>Payment Date:</strong> {new Date(order.paymentDate).toLocaleString()}</p>
            )}
          </div>

          <div>
            <Typography.Title level={5}>Shipping Information</Typography.Title>
            <p><strong>Name:</strong> {order.user?.name || 'N/A'}</p>
            <p><strong>Address:</strong> {order.user?.address || 'N/A'}</p>
            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {order.user?.phone || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span>Order Items</span>
            <Typography.Text strong>Total: ${order.totalPrice?.toFixed(2)}</Typography.Text>
          </div>
        }
        className="mb-6"
      >
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

      {/* Tracking Information */}
      {order.trackingNumber && (
        <Card title="Tracking Information" className="mb-6">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tracking Number">{order.trackingNumber}</Descriptions.Item>
            {order.carrier && <Descriptions.Item label="Carrier">{order.carrier}</Descriptions.Item>}
            {order.estimatedDeliveryDate && (
              <Descriptions.Item label="Estimated Delivery">
                {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}


    </div>
  );
};

export default OrderDetail;
