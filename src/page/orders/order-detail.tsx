// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Steps, Card, Descriptions, Table, Button, Spin, Tag, Image, Typography, Divider, Alert } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined, CloseCircleOutlined, ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
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
            setOrder(response.data.data);
            setCurrentStepFromStatus(response.data.data.status);
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
      case ORDER_STATUS.CANCELLED:
      case ORDER_STATUS.PAYMENT_FAILED:
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
      case ORDER_STATUS.CANCELLED:
      case ORDER_STATUS.PAYMENT_FAILED:
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
          <span>{name || 'Unknown Product'}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      key: 'total',
      render: (record: any) => `$${(record.price * record.quantity).toFixed(2)}`,
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
              {order.status === ORDER_STATUS.CANCELLED ? 'Order Cancelled' : 'Payment Failed'}
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            {order.status === ORDER_STATUS.CANCELLED
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
            <p><strong>Payment Method:</strong> {order.paymentDetails?.paymentMethod || 'PayPal'}</p>
            {order.paymentDetails?.id && (
              <p><strong>Transaction ID:</strong> {order.paymentDetails.id}</p>
            )}
          </div>

          <div>
            <Typography.Title level={5}>Shipping Information</Typography.Title>
            <p><strong>Name:</strong> {order.shippingAddress?.name || 'N/A'}</p>
            <p><strong>Address:</strong> {order.shippingAddress?.address || 'N/A'}</p>
            <p><strong>Email:</strong> {order.paymentDetails?.payerEmail || 'N/A'}</p>
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
          rowKey={(record) => record._id || record.productId || record.product}
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

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
        >
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
