// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cartAPI, authAPI, userAPI } from "../../services/api";
import { Button, InputNumber, Empty, Spin, Card, Form, Input, Row, Col } from "antd";
import { DeleteOutlined, ShoppingOutlined, UserOutlined, PhoneOutlined, HomeOutlined, SaveOutlined } from "@ant-design/icons";
import { refreshCartCount } from "../../components/NavBar";
import CartCheckoutPaypal from "./CartCheckoutPaypal";

const Cart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userForm] = Form.useForm();
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Kiểm tra xác thực và lấy dữ liệu giỏ hàng và thông tin người dùng
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { isAuthenticated } = authAPI.checkToken();

      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);

        // Lấy dữ liệu giỏ hàng
        const cartResponse = await cartAPI.getCart();
        if (cartResponse.data?.success) {
          console.log('Cart data:', cartResponse.data.data);
          // Lấy items từ data.items
          const items = cartResponse.data.data?.items || [];
          setCartItems(items);
        } else {
          toast.error(cartResponse.data?.message || "Không thể tải giỏ hàng");
        }

        // Lấy thông tin người dùng
        const userResponse = await userAPI.getCurrentUser();
        if (userResponse.data?.success) {
          console.log('User data:', userResponse.data.data);
          const userData = userResponse.data.data;
          setUserProfile(userData);

          // Cập nhật form với dữ liệu người dùng
          userForm.setFieldsValue({
            name: userData.name || '',
            phone: userData.phone || '',
            address: userData.address || ''
          });
        } else {
          toast.error(userResponse.data?.message || "Không thể tải thông tin người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate, userForm]);

  // Xử lý toggle chọn/bỏ chọn sản phẩm
  const toggleSelectItem = (itemId) => {
    const isSelected = selectedRowKeys.includes(itemId);
    const newSelectedKeys = isSelected
      ? selectedRowKeys.filter(key => key !== itemId) // Bỏ chọn
      : [...selectedRowKeys, itemId];                // Thêm vào
    setSelectedRowKeys(newSelectedKeys);
  };

  // Tính tổng tiền khi cartItems hoặc selectedRowKeys thay đổi
  useEffect(() => {
    const total = cartItems
      .filter(item => {
        // Chỉ tính tổng tiền cho các sản phẩm được chọn, còn tồn tại và còn hàng
        const isSelected = selectedRowKeys.includes(item._id);
        const exists = item.productExists !== false;
        const inStock = item.productDetails && item.productDetails.amountInStore > 0;
        return isSelected && exists && inStock;
      })
      .reduce((sum, item) => {
        const price = item.productDetails?.price || 0;
        return sum + (price * item.quantity);
      }, 0);

    setTotalPrice(total);
  }, [cartItems, selectedRowKeys]);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = async (record, value) => {
    if (value < 1) return;

    const productId = record.productId;

    try {
      const response = await cartAPI.updateCartItem({
        productId,
        quantity: value
      });

      if (response.data?.success) {
        setCartItems(prev =>
          prev.map(item => {
            return item._id === record._id ? { ...item, quantity: value } : item;
          })
        );
        toast.success("Cập nhật giỏ hàng thành công");

        // Cập nhật số lượng sản phẩm trong giỏ hàng ở navbar
        refreshCartCount();
      } else {
        toast.error(response.data?.message || "Không thể cập nhật giỏ hàng");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      toast.error("Không thể cập nhật giỏ hàng");
    }
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = async (record) => {
    const productId = record.productId;

    try {
      const response = await cartAPI.removeCartItem(productId);

      if (response.data?.success) {
        setCartItems(prev => prev.filter(item => item._id !== record._id));
        setSelectedRowKeys(prev => prev.filter(key => key !== record._id));
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");

        // Cập nhật số lượng sản phẩm trong giỏ hàng ở navbar
        refreshCartCount();
      } else {
        toast.error(response.data?.message || "Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  // Không cần định nghĩa rowSelection và columns khi sử dụng Row và Col

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (selectedRowKeys.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    // Kiểm tra xem người dùng đã cập nhật thông tin chưa
    if (!userProfile?.name || !userProfile?.phone || !userProfile?.address) {
      toast.warning('Vui lòng cập nhật đầy đủ thông tin người dùng trước khi thanh toán');
      setEditingProfile(true);
      return;
    }

    // Mở modal thanh toán
    setPaymentModalVisible(true);
  };

  // Xử lý thanh toán được chuyển sang component CartCheckoutPaypal

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải giỏ hàng..." />
      </div>
    );
  }

  // Hiển thị giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Giỏ hàng của bạn đang trống"
        >
          <Link to="/">
            <Button type="primary" icon={<ShoppingOutlined />}>
              Tiếp tục mua sắm
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho bảng
  const dataSource = cartItems.map(item => ({
    key: item._id,
    ...item
  }));

  // Xử lý cập nhật thông tin người dùng
  const handleUpdateProfile = async () => {
    try {
      setSavingProfile(true);
      const values = await userForm.validateFields();

      const response = await userAPI.updateUser(values);

      if (response.data?.success) {
        setUserProfile({
          ...userProfile,
          ...values
        });
        setEditingProfile(false);
        toast.success("Cập nhật thông tin thành công");

        // Lưu địa chỉ vào localStorage để sử dụng khi thanh toán
        localStorage.setItem('user_address', values.address);
      } else {
        toast.error(response.data?.message || "Không thể cập nhật thông tin");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Không thể cập nhật thông tin");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Card */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Thông tin người dùng</span>
            <Button
              type="primary"
              icon={editingProfile ? <SaveOutlined /> : <UserOutlined />}
              onClick={() => {
                if (editingProfile) {
                  handleUpdateProfile();
                } else {
                  setEditingProfile(true);
                }
              }}
              loading={savingProfile}
            >
              {editingProfile ? 'Lưu thông tin' : 'Chỉnh sửa'}
            </Button>
          </div>
        }
        className="mb-6"
      >
        {editingProfile ? (
          <Form
            form={userForm}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label="Họ tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <Row gutter={16}>
            <Col span={8}>
              <div className="mb-2 font-medium">Họ tên:</div>
              <div>{userProfile?.name || 'Chưa cập nhật'}</div>
            </Col>
            <Col span={8}>
              <div className="mb-2 font-medium">Số điện thoại:</div>
              <div>{userProfile?.phone || 'Chưa cập nhật'}</div>
            </Col>
            <Col span={8}>
              <div className="mb-2 font-medium">Địa chỉ:</div>
              <div>{userProfile?.address || 'Chưa cập nhật'}</div>
            </Col>
          </Row>
        )}
      </Card>

      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 p-4">
        {/* Header Row */}
        <Row className="py-3 border-b font-medium text-gray-700">
          <Col span={1}></Col> {/* Checkbox column */}
          <Col span={10}>Sản phẩm</Col>
          <Col span={3}>Giá</Col>
          <Col span={4}>Số lượng</Col>
          <Col span={3}>Tổng</Col>
          <Col span={3}>Thao tác</Col>
        </Row>

        {/* Cart Items */}
        {dataSource.map(item => {
          const productDetails = item.productDetails || {};
          const productExists = item.productExists !== false;
          const isOutOfStock = productDetails && productDetails.amountInStore <= 0;
          const isDisabled = !productExists || isOutOfStock;
          const isSelected = selectedRowKeys.includes(item._id);

          return (
            <Row key={item._id} className={`py-4 border-b items-center ${isOutOfStock ? 'opacity-60' : ''}`}>
              {/* Checkbox */}
              <Col span={1} className="flex justify-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => toggleSelectItem(item._id)}
                  className="w-4 h-4"
                />
              </Col>

              {/* Product */}
              <Col span={10}>
                <div className="flex items-center">
                  <img
                    src={productDetails?.pictureURL || "https://via.placeholder.com/80x80"}
                    alt={productDetails?.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <div className="font-medium">{productDetails?.name}</div>
                    {!productExists && (
                      <div className="text-red-500 text-xs">Sản phẩm không còn tồn tại</div>
                    )}
                    {isOutOfStock && productExists && (
                      <div className="text-orange-500 text-xs">Sản phẩm đã hết hàng</div>
                    )}
                  </div>
                </div>
              </Col>

              {/* Price */}
              <Col span={3}>
                <span>${(productDetails?.price || 0).toFixed(2)}</span>
              </Col>

              {/* Quantity */}
              <Col span={4}>
                <InputNumber
                  min={1}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(item, value)}
                  disabled={isDisabled}
                  className="w-16"
                />
              </Col>

              {/* Total */}
              <Col span={3}>
                <span className="font-medium">${((productDetails?.price || 0) * item.quantity).toFixed(2)}</span>
              </Col>

              {/* Actions */}
              <Col span={3}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(item)}
                >
                  Xóa
                </Button>
              </Col>
            </Row>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <Link to="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>

        <div className="text-right">
          <div className="text-lg mb-2">
            <span className="font-medium">Tổng tiền: </span>
            <span className="text-xl text-red-600 font-bold">${totalPrice.toFixed(2)}</span>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={handleCheckout}
            disabled={selectedRowKeys.length === 0}
          >
            Thanh toán
          </Button>
        </div>
      </div>

      {/* Sử dụng component CartCheckoutPaypal */}
      <CartCheckoutPaypal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        userProfile={userProfile}
        cartItems={cartItems}
        selectedItems={selectedRowKeys}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default Cart;
