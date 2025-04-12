import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Input, Select, DatePicker, Card, Statistic, Row, Col, Spin, message } from 'antd';
import { SearchOutlined, ReloadOutlined, DollarOutlined, ShoppingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { orderAPI, ORDER_STATUS } from '../../../services/api';
import AdminNavbar from '../../../components/AdminNavbar';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
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
      // Sử dụng API hiện có để lấy tất cả đơn hàng
      // Trong thực tế, bạn cần tạo một API riêng cho admin để lấy tất cả đơn hàng
      const response = await orderAPI.getUserOrders();
      
      if (response.data?.success) {
        const allOrders = response.data.data || [];
        setOrders(allOrders);
        setFilteredOrders(allOrders);
        calculateStats(allOrders);
      } else {
        message.error('Failed to fetch orders');
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
        stats.revenue += order.totalAmount; // Only count completed orders for revenue
      }
      if (order.status === ORDER_STATUS.CANCELLED) stats.cancelled++;
    });

    setStats(stats);
  };

  // Apply filters
  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchText) {
      result = result.filter(order => 
        order._id.toLowerCase().includes(searchText.toLowerCase()) ||
        (order.shippingAddress?.name && order.shippingAddress.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (order.paymentDetails?.payerEmail && order.paymentDetails.payerEmail.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [startDate, endDate] = dateRange;
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    
    setFilteredOrders(result);
  }, [searchText, statusFilter, dateRange, orders]);

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
      case ORDER_STATUS.CANCELLED: return 'red';
      case ORDER_STATUS.PAYMENT_FAILED: return 'red';
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
      dataIndex: 'shippingAddress',
      key: 'customer',
      render: address => address?.name || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: ['paymentDetails', 'payerEmail'],
      key: 'email',
      render: email => email || 'N/A',
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
      dataIndex: 'totalAmount',
      key: 'total',
      render: amount => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
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
            onClick={() => navigate(`/admin/orders/${record._id}`)}
          >
            View
          </Button>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record._id, value)}
            size="small"
          >
            <Option value={ORDER_STATUS.PENDING}>Pending</Option>
            <Option value={ORDER_STATUS.PROCESSING}>Processing</Option>
            <Option value={ORDER_STATUS.SHIPPED}>Shipped</Option>
            <Option value={ORDER_STATUS.DELIVERED}>Delivered</Option>
            <Option value={ORDER_STATUS.CANCELLED}>Cancelled</Option>
          </Select>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
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
                prefix="$"
                valueStyle={{ color: '#3f8600' }}
                suffix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search by ID, name or email"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              value={statusFilter}
              onChange={value => setStatusFilter(value)}
            >
              <Option value="all">All Statuses</Option>
              <Option value={ORDER_STATUS.PENDING}>Pending</Option>
              <Option value={ORDER_STATUS.PROCESSING}>Processing</Option>
              <Option value={ORDER_STATUS.SHIPPED}>Shipped</Option>
              <Option value={ORDER_STATUS.DELIVERED}>Delivered</Option>
              <Option value={ORDER_STATUS.CANCELLED}>Cancelled</Option>
            </Select>
            
            <RangePicker 
              onChange={dates => setDateRange(dates)}
            />
            
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                setSearchText('');
                setStatusFilter('all');
                setDateRange(null);
                fetchOrders();
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        
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
