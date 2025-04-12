// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Steps, Card, Descriptions, Table, Button, Spin, Tag } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, CarOutlined, HomeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { orderAPI, ORDER_STATUS } from '../../services/api';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Lấy thông tin đơn hàng từ state hoặc API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        // Nếu có dữ liệu từ state, sử dụng nó
        if (location.state?.orderDetails) {
          setOrder(location.state.orderDetails);
          setCurrentStepFromStatus(location.state.orderDetails.status);
        }
        // Nếu không, gọi API để lấy dữ liệu
        else if (id) {
          const response = await orderAPI.getOrderById(id);

          if (response.data?.success) {
            setOrder(response.data.data);
            setCurrentStepFromStatus(response.data.data.status);
          } else {
            toast.error('Failed to fetch order details');
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
  }, [id, location.state]);

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
      dataIndex: 'product',
      key: 'product',
      render: (product: any) => product?.name || 'Unknown Product',
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
        <h1 className="text-2xl font-bold">Order #{order._id}</h1>
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

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Order Information" className="h-full">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
            <Descriptions.Item label="Date">{new Date(order.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {order.paymentDetails?.paymentMethod || 'PayPal'}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Payment ID">
              {order.paymentDetails?.id || 'N/A'}
            </Descriptions.Item> */}
            <Descriptions.Item label="Total Amount">
              ${order.totalPrice?.toFixed(2)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Shipping Information" className="h-full">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">
              {order.shippingAddress?.name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {order.shippingAddress?.address || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {order.paymentDetails?.payerEmail || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Order Items */}
      <Card title="Order Items" className="mb-6">
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

      {/* Actions */}
      <div className="flex justify-between">
        <Button onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>

        <Button type="primary" onClick={() => window.print()}>
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
