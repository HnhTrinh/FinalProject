import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Spin, Empty } from 'antd';
import { orderAPI, ORDER_STATUS } from '../../services/api';
import { toast } from 'react-toastify';

const OrderList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  // Lấy danh sách đơn hàng của người dùng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getUserOrders();
        if (response.data?.success) {
          setOrders(response.data.data.orders || []);
        } else {
          toast.error(response.data?.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  // Định nghĩa cột cho bảng đơn hàng
  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id: string) => <span className="font-medium">{id.substring(0, 8)}...</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalAmount',
      render: (amount: number) => `$${amount?.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusTagColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button
          type="primary"
          onClick={() => navigate(`/orders/${record._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading orders..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <Empty
          description="You haven't placed any orders yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/products')}>
            Start Shopping
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
};

export default OrderList;
