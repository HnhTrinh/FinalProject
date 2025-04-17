import { orderAPI } from "../services/api";
import { toast } from "react-toastify";

/**
 * Creates a PayPal order with the specified amount and currency
 * @param amount The amount to charge
 * @param currency The currency code (default: USD)
 * @returns A Promise that resolves to the PayPal order ID
 */
export const createPayPalOrder = async (amount: number, currency: string = 'USD') => {
  // Format amount to 2 decimal places
  const formattedAmount = Number(amount).toFixed(2);
  
  // This function would typically be called by the PayPal SDK
  // We're just defining the structure here for reference
  return {
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: formattedAmount,
        },
      },
    ],
    application_context: {
      shipping_preference: "NO_SHIPPING"
    }
  };
};

/**
 * Handles a successful PayPal payment
 * @param details The payment details from PayPal
 * @param selectedCartItems The selected items from the cart
 * @param totalAmount The total amount paid
 * @returns A Promise that resolves to the order response
 */
export const handlePayPalSuccess = async (details: any, selectedCartItems: any[], totalAmount: number) => {
  try {
    // Prepare order data
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

    // Call API to create order
    const response = await orderAPI.createOrder(orderData);
    console.log('Order response:', response.data);

    if (response.data?.success) {
      toast.success('Order placed successfully!');

      // Get order ID from response
      const orderId = response.data.data.order?._id ||
        response.data.data.invoice?.order ||
        (typeof response.data.data.order === 'string' ? response.data.data.order : null);

      if (!orderId) {
        console.error('Order ID not found in response:', response.data);
        toast.warning('Order created but ID not found. Please check your orders page.');
        return { success: true, orderId: null };
      }

      return { success: true, orderId };
    } else {
      toast.error(response.data?.message || 'Failed to create order');
      return { success: false, error: response.data?.message || 'Failed to create order' };
    }
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create order. Please try again.');
    return { success: false, error: 'Failed to create order. Please try again.' };
  }
};

/**
 * Verifies a PayPal payment with the backend
 * @param paymentDetails The payment details from PayPal
 * @returns A Promise that resolves to the verification response
 */
export const verifyPayPalPayment = async (paymentDetails: any) => {
  try {
    const response = await orderAPI.verifyPayPalPayment(paymentDetails);
    return response.data;
  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    throw error;
  }
};
