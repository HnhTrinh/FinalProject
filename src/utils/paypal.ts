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
 * @returns A Promise that resolves to the order response
 */
export const handlePayPalSuccess = async (details: any) => {
  try {
    // According to the updated API, we don't need to send any data
    // The backend will create the order from the user's cart
    console.log('Creating order from cart with PayPal payment details:', details);

    // Call API to create order
    // The API doesn't require any data as it uses the cart
    const response = await orderAPI.createOrder({});
    console.log('Order response:', response.data);

    if (response.data?.success) {
      toast.success('Order placed successfully!');

      // Get order ID from response
      const orderId = response.data.data?._id ||
                     (response.data.data?.order?._id) ||
                     (typeof response.data.data === 'string' ? response.data.data : null);

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
  } catch (error: any) {
    console.error('Error creating order:', error);
    const errorMessage = error.response?.data?.message || 'Failed to create order. Please try again.';
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
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
