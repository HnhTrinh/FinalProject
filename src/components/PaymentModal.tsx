import { Modal, Divider, Spin } from 'antd';
import { useState } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PayPalButton from './PayPalButton';
import { orderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  cartItems: any[];
  totalAmount: number;
  selectedItems: string[];
}

const PaymentModal = ({
  visible,
  onClose,
  cartItems,
  totalAmount,
  selectedItems
}: PaymentModalProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Lọc các sản phẩm được chọn để thanh toán
  const selectedCartItems = cartItems.filter(item =>
    selectedItems.includes(item._id)
  );

  // Xử lý khi thanh toán thành công
  const handlePaymentSuccess = async (details: any) => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        items: selectedCartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.productDetails.price
        })),
        totalAmount,
        paymentDetails: {
          id: details.id,
          status: details.status,
          paymentMethod: 'paypal',
          payerEmail: details.payer.email_address,
          createTime: details.create_time,
          updateTime: details.update_time
        },
        shippingAddress: {
          name: details.payer.name.given_name + ' ' + details.payer.name.surname,
          address: localStorage.getItem('user_address') || ''
        }
      };

      // Gọi API tạo đơn hàng
      const response = await orderAPI.createOrder(orderData);
      console.log('Order response:', response.data);

      if (response.data?.success) {
        toast.success('Order placed successfully!');

        // Lấy ID đơn hàng từ response
        // Kiểm tra cấu trúc dữ liệu trả về để lấy ID đơn hàng chính xác
        const orderId = response.data.data.order?._id ||
          response.data.data.invoice?.order ||
          (typeof response.data.data.order === 'string' ? response.data.data.order : null);
        console.log("hand pay", orderId)

        if (!orderId) {
          console.error('Order ID not found in response:', response.data);
          toast.warning('Order created but ID not found. Please check your orders page.');
          navigate('/orders');
          onClose();
          return;
        }

        navigate(`/orders`, {
        });

        // Đóng modal
        onClose();
      } else {
        toast.error(response.data?.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Complete Your Payment"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" tip="Processing your order..." />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {selectedCartItems.map((item, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium">{item.productDetails.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span>${(item.productDetails.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <Divider className="my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <PayPalScriptProvider options={{
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
              currency: "USD",
              intent: "capture"
            }}>
              <PayPalButton
                amount={totalAmount}
                onSuccess={handlePaymentSuccess}
              />
            </PayPalScriptProvider>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            <p>By completing this payment, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PaymentModal;
