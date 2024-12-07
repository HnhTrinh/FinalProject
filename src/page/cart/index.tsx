
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../../redux/cart";
import { RootState } from "../../store";
import { CartItem } from "../../types";

const Cart: React.FC = () => {
  const { cart } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-xl">Your cart is currently empty.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Quantity</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item: CartItem, key: number) => (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 flex items-center">
                        <img src={item.pictureURL} alt={item.name} className="w-16 h-16 rounded-md mr-4" />
                        <span className="text-sm text-gray-800">{item.name}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{item.price}</td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="w-20 p-2 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Summary */}
            <div className="mt-8 flex justify-between items-center">
              <div>
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-800">
                  <span className="mr-2">Total Price: </span>
                  <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
