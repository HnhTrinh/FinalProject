import { useState, useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Spin } from 'antd';
import { toast } from 'react-toastify';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  showSpinner?: boolean;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
}

const PayPalButton = ({
  amount,
  currency = 'USD',
  showSpinner = true,
  onSuccess,
  onError
}: PayPalButtonProps) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [orderID, setOrderID] = useState<string | null>(null);

  // Reset orderID when amount changes
  useEffect(() => {
    setOrderID(null);
  }, [amount]);

  // Format amount to 2 decimal places
  const formattedAmount = Number(amount).toFixed(2);

  return (
    <div className="paypal-button-container">
      {(showSpinner && isPending) && (
        <div className="flex justify-center items-center py-4">
          <Spin tip="Loading PayPal..." />
        </div>
      )}

      <PayPalButtons
        style={{ 
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay"
        }}
        disabled={isPending || amount <= 0}
        forceReRender={[formattedAmount, currency]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
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
            })
            .then((orderId) => {
              setOrderID(orderId);
              return orderId;
            });
        }}
        onApprove={(data, actions) => {
          return actions.order!.capture().then((details) => {
            console.log("Payment successful:", details);
            toast.success(`Payment completed! Transaction ID: ${details.id}`);
            onSuccess(details);
          });
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          toast.error("Payment failed. Please try again.");
          if (onError) onError(err);
        }}
        onCancel={() => {
          toast.info("Payment cancelled");
        }}
      />
    </div>
  );
};

export default PayPalButton;
