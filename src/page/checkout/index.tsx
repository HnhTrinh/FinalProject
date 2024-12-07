import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { CartItem } from "../../types";

const Checkout: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items); // Fetch cart items from Redux store
  const navigate = useNavigate();

  // Calculate total price
  const calculateTotalPrice = () =>
    cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  // Simulate placing an order
  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add products to proceed!");
      return;
    }
    // Add order logic here
    alert("Order placed successfully!");
    navigate("/order-success"); // Redirect to an order confirmation page
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-xl">Your cart is empty. Add items to proceed with checkout.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            {/* Order Summary */}
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              {cart.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <img
                      src={item.pictureURL}
                      alt={item.name}
                      className="w-16 h-16 rounded-md mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Total</h2>
              <p className="text-2xl font-bold text-green-600">${calculateTotalPrice().toFixed(2)}</p>
            </div>

            {/* Payment Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
