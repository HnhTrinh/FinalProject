// @ts-nocheck
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, IProductData } from "../types";


interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      // Chuyển đổi dữ liệu từ API thành dạng CartItem
      const cartItems = action.payload.map(item => {
        const product = item.product || item;
        return {
          id: product._id || product.id,
          _id: product._id || product.id,
          name: product.name,
          price: product.price || 0,
          pictureURL: product.pictureURL,
          quantity: item.quantity || 1,
          productExists: item.productExists !== false // Mặc định là true nếu không có giá trị
        };
      });
      state.items = cartItems;
    },
    addToCart: (state, action) => {
      const productId = action.payload._id || action.payload.id;
      const existingItem = state.items.find(item =>
        item.id === productId || item._id === productId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: productId,
          _id: productId,
          name: action.payload.name,
          price: action.payload.price || 0,
          pictureURL: action.payload.pictureURL,
          quantity: 1,
          productExists: true
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item =>
        item.id !== action.payload && item._id !== action.payload
      );
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item =>
        item.id === action.payload.id || item._id === action.payload.id
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
});

export const { setCart, addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
