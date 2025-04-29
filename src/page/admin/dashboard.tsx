import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, Typography, Divider, Progress } from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  AppstoreOutlined, 
  ShoppingCartOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import axiosInstance from '../../services/api';

const { Title } = Typography;

interface DashboardStats {
  counts: {
    users: number;
    products: number;
    categories: number;
    orders: number;
    carts: number;
  };
  orderStats: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/dashboard');
        
        if (response.data && response.data.success) {
          setStats(response.data.data);
        } else {
          setError(response.data?.message || 'Failed to fetch dashboard statistics');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to fetch dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading dashboard statistics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  if (!stats) {
    return (
      <Alert
        message="No Data"
        description="No dashboard statistics available."
        type="info"
        showIcon
        className="m-4"
      />
    );
  }

  // Calculate total orders for percentage calculations
  const totalOrders = 
    stats.orderStats.pending + 
    stats.orderStats.processing + 
    stats.orderStats.completed + 
    stats.orderStats.cancelled || 1; // Avoid division by zero

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">Admin Dashboard</Title>
      
      {/* Main Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Users"
              value={stats.counts.users}
              prefix={<UserOutlined className="text-blue-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Products"
              value={stats.counts.products}
              prefix={<ShoppingOutlined className="text-green-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Categories"
              value={stats.counts.categories}
              prefix={<AppstoreOutlined className="text-purple-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Active Carts"
              value={stats.counts.carts}
              prefix={<ShoppingCartOutlined className="text-orange-500 mr-2" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Orders and Revenue Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div className="flex items-center">
                <FileTextOutlined className="text-indigo-500 mr-2" />
                <span>Order Statistics</span>
              </div>
            } 
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow h-full"
          >
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <Statistic
                  title="Total Orders"
                  value={stats.counts.orders}
                  className="mb-4"
                />
                <Divider />
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center">
                        <ClockCircleOutlined className="text-amber-500 mr-2" />
                        Pending
                      </span>
                      <span>{stats.orderStats.pending} ({Math.round((stats.orderStats.pending / totalOrders) * 100)}%)</span>
                    </div>
                    <Progress 
                      percent={Math.round((stats.orderStats.pending / totalOrders) * 100)} 
                      showInfo={false}
                      strokeColor="#F59E0B"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center">
                        <SyncOutlined className="text-blue-500 mr-2" />
                        Processing
                      </span>
                      <span>{stats.orderStats.processing} ({Math.round((stats.orderStats.processing / totalOrders) * 100)}%)</span>
                    </div>
                    <Progress 
                      percent={Math.round((stats.orderStats.processing / totalOrders) * 100)} 
                      showInfo={false}
                      strokeColor="#3B82F6"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        Completed
                      </span>
                      <span>{stats.orderStats.completed} ({Math.round((stats.orderStats.completed / totalOrders) * 100)}%)</span>
                    </div>
                    <Progress 
                      percent={Math.round((stats.orderStats.completed / totalOrders) * 100)} 
                      showInfo={false}
                      strokeColor="#10B981"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center">
                        <CloseCircleOutlined className="text-red-500 mr-2" />
                        Cancelled
                      </span>
                      <span>{stats.orderStats.cancelled} ({Math.round((stats.orderStats.cancelled / totalOrders) * 100)}%)</span>
                    </div>
                    <Progress 
                      percent={Math.round((stats.orderStats.cancelled / totalOrders) * 100)} 
                      showInfo={false}
                      strokeColor="#EF4444"
                    />
                  </div>
                </div>
              </Col>
              
              <Col span={24} md={12} className="flex flex-col justify-center">
                <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                  <div className="text-center">
                    <DollarOutlined className="text-4xl mb-2" />
                    <div className="text-lg font-medium mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  </div>
                </Card>
                
                <div className="mt-4 text-center text-gray-500">
                  <p>Revenue from completed orders</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div className="flex items-center">
                <AppstoreOutlined className="text-green-500 mr-2" />
                <span>Inventory Summary</span>
              </div>
            } 
            bordered={false}
            className="shadow-sm hover:shadow-md transition-shadow h-full"
          >
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Products</span>
                  <span className="font-medium">{stats.counts.products}</span>
                </div>
                <Progress 
                  percent={100} 
                  showInfo={false}
                  strokeColor="#10B981"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span>Categories</span>
                  <span className="font-medium">{stats.counts.categories}</span>
                </div>
                <Progress 
                  percent={100} 
                  showInfo={false}
                  strokeColor="#8B5CF6"
                />
              </div>
              
              <Divider />
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">Products per Category</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {stats.counts.categories > 0 
                      ? (stats.counts.products / stats.counts.categories).toFixed(1) 
                      : '0'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Average</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
