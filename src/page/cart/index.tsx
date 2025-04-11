// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cartAPI, authAPI } from "../../services/api";
import { Button, Table, InputNumber, Empty, Spin } from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";

const Cart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Kiểm tra xác thực và lấy dữ liệu giỏ hàng
  useEffect(() => {
    const checkAuthAndFetchCart = async () => {
      const { isAuthenticated } = authAPI.checkToken();

      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await cartAPI.getCart();
        if (response.data?.success) {
          console.log('Cart data:', response.data.data);
          // Lấy items từ data.items
          const items = response.data.data?.items || [];
          setCartItems(items);
        } else {
          toast.error(response.data?.message || "Không thể tải giỏ hàng");
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
        toast.error("Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchCart();
  }, [navigate]);

  // Tính tổng tiền khi cartItems hoặc selectedRowKeys thay đổi
  useEffect(() => {
    const total = cartItems
      .filter(item => selectedRowKeys.includes(item._id))
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
      } else {
        toast.error(response.data?.message || "Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  // Xử lý chọn hàng
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.productExists === false,
    }),
  };

  // Định nghĩa cột
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productDetails',
      key: 'productDetails',
      render: (productDetails, record) => {
        const productExists = record.productExists !== false;

        return (
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
            </div>
          </div>
        );
      },
    },
    {
      title: 'Giá',
      dataIndex: ['productDetails', 'price'],
      key: 'price',
      render: (price) => <span>${(price || 0).toFixed(2)}</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => {
        const productExists = record.productExists !== false;

        return (
          <InputNumber
            min={1}
            value={quantity}
            onChange={(value) => handleQuantityChange(record, value)}
            disabled={!productExists}
            className="w-16"
          />
        );
      },
    },
    {
      title: 'Tổng',
      key: 'total',
      render: (_, record) => {
        const price = record.productDetails?.price || 0;
        return <span className="font-medium">${(price * record.quantity).toFixed(2)}</span>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (selectedRowKeys.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    navigate("/checkout", { state: { selectedItems: selectedRowKeys } });
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey={record => record._id}
        />
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
    </div>
  );
};

export default Cart;
