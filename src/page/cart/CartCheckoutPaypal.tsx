// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Spin, Divider } from "antd";
import { PayPalButtons } from "@paypal/react-paypal-js";
// Không cần import paypalAPI vì chúng ta xử lý logic trực tiếp trong component
import { refreshCartCount } from "../../components/NavBar";
import { orderAPI } from "../../services/api";

const CartCheckoutPaypal = ({ visible, onClose, userProfile, cartItems, selectedItems, totalPrice }) => {
  const navigate = useNavigate();
  const [processingPayment, setProcessingPayment] = useState(false);
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item._id));

  // Xử lý khi thanh toán PayPal thành công
  const onPayPalSuccess = async (details) => {
    try {
      setProcessingPayment(true);
      if (!userProfile?.name || !userProfile?.phone || !userProfile?.address) {
        toast.error('Vui lòng cập nhật đầy đủ thông tin người dùng trước khi thanh toán');
        setProcessingPayment(false);
        onClose();
        return;
      }

      const response = await orderAPI.createOrder({});

      if (response.data?.success) {
        // Lấy ID đơn hàng từ response
        const orderId = response.data.data?._id ||
          (response.data.data?.order?._id) ||
          (typeof response.data.data === 'string' ? response.data.data : null);

        if (!orderId) {
          console.error('Order ID not found in response:', response.data);
          toast.warning('Đơn hàng đã được tạo nhưng không tìm thấy ID. Vui lòng kiểm tra trang đơn hàng.');
        }

        onClose();
        toast.success('Đơn hàng của bạn đã được tạo thành công!');
        refreshCartCount();
        navigate('/orders');
      } else {
        toast.error(response.data?.message || 'Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Không thể xử lý thanh toán. Vui lòng thử lại.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Tạo đơn hàng PayPal
  const createPayPalOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: totalPrice
        }
      }],
      application_context: { shipping_preference: "NO_SHIPPING" }
    });
  };

  // Xử lý khi PayPal xác nhận thanh toán
  const onPayPalApprove = (data, actions) => {
    return actions.order.capture().then(details => {
      toast.success(`Payment completed! Transaction ID: ${details.id}`);
      onPayPalSuccess(details);
    });
  };

  // Xử lý khi có lỗi
  const onPayPalError = () => toast.error("Payment failed. Please try again.");

  // Xử lý khi hủy thanh toán
  const onPayPalCancel = () => toast.info("Payment cancelled");

  if (processingPayment) {
    return (
      <Modal title="Processing Payment" open={visible} onCancel={onClose} footer={null} width={500}>
        <div className="flex justify-center items-center py-8">
          <Spin size="large" tip="Processing your order..." />
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Complete Your Payment" open={visible} onCancel={onClose} footer={null} width={600}>
      {/* Shipping Information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div><div className="text-gray-500 text-sm">Name:</div><div className="font-medium">{userProfile?.name}</div></div>
            <div><div className="text-gray-500 text-sm">Phone:</div><div className="font-medium">{userProfile?.phone}</div></div>
            <div className="col-span-2"><div className="text-gray-500 text-sm">Address:</div><div className="font-medium">{userProfile?.address}</div></div>
          </div>
        </div>

        {/* Order Summary */}
        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {selectedCartItems.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <div className="flex items-center">
                <span className="font-medium">{item.productDetails.name}</span>
                <span className="text-gray-500 ml-2">x{item.quantity}</span>
              </div>
              <span>${(item.productDetails.price * item.quantity)}</span>
            </div>
          ))}
          <Divider className="my-3" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
        <PayPalButtons
          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
          disabled={totalPrice <= 0}
          forceReRender={[totalPrice, "USD"]}
          createOrder={createPayPalOrder}
          onApprove={onPayPalApprove}
          onError={onPayPalError}
          onCancel={onPayPalCancel}
        />
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <p>By completing this payment, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </Modal>
  );
};

export default CartCheckoutPaypal;
