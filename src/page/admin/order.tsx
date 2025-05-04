// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Input, Select, DatePicker, Card, Statistic, Row, Col, Spin, message } from 'antd';
import { SearchOutlined, ReloadOutlined, DollarOutlined, ShoppingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { orderAPI, ORDER_STATUS } from '../../services/api';


const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0
  });

  // Fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();
      if (response.data?.success) {
        const allOrders = response.data.data || [];
        console.log('Admin orders data:', allOrders);
        setOrders(allOrders);
        setFilteredOrders(allOrders);
        calculateStats(allOrders);
      } else {
        message.error(response.data?.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Calculate order statistics
  const calculateStats = (orderList) => {
    const stats = {
      total: orderList.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      revenue: 0
    };

    orderList.forEach(order => {
      // Count by status
      if (order.status === ORDER_STATUS.PENDING) stats.pending++;
      if (order.status === ORDER_STATUS.PROCESSING) stats.processing++;
      if (order.status === ORDER_STATUS.SHIPPED) stats.shipped++;
      if (order.status === ORDER_STATUS.DELIVERED) {
        stats.delivered++;
        stats.revenue += order.totalPrice || 0; // Only count completed orders for revenue
      }
      if (order.status === 'cancelled') stats.cancelled++;
    });

    setStats(stats);
  };

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);

      if (response.data?.success) {
        message.success(`Order status updated to ${newStatus.toUpperCase()}`);

        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        fetchOrders();

      } else {
        message.error(response.data?.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  // Get color for status tag
  const getStatusTagColor = (status) => {
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

  // Table columns
  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: id => <a onClick={() => navigate(`/admin/orders/${id}`)}>{id.substring(0, 8)}...</a>,
    },
    {
      title: 'Customer',
      dataIndex: ['user', 'name'],
      key: 'customer',
      render: (name, record) => name || record.user?.name || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (email, record) => email || record.user?.email || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: date => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'total',
      render: amount => `$${(amount || 0)}`,
      sorter: (a, b) => (a.totalPrice || 0) - (b.totalPrice || 0),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusTagColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            size="small"
            icon={<ShoppingOutlined />}
            onClick={() => navigate(`/admin/orders/${record._id}`)}
            title="View Order Details"
          />
          <Select
            value={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record._id, value)}
            size="small"
          >
            <Option value={ORDER_STATUS.PENDING}>Pending</Option>
            <Option value={ORDER_STATUS.PROCESSING}>Processing</Option>
            <Option value={ORDER_STATUS.SHIPPED}>Shipped</Option>
            <Option value={ORDER_STATUS.DELIVERED}>Delivered</Option>
          </Select>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col span={4}>
            <Card>
              <Statistic
                title="Total Orders"
                value={stats.total}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Pending"
                value={stats.pending}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Processing"
                value={stats.processing}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Shipped"
                value={stats.shipped}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Delivered"
                value={stats.delivered}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Revenue"
                value={stats.revenue}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                suffix={<DollarOutlined />}
                formatter={(value) => `${value}`}
              />
            </Card>
          </Col>
        </Row>
       
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Spin size="large" tip="Loading orders..." />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredOrders}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
