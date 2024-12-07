import { configureStore } from "@reduxjs/toolkit";
import cartReducer from '../redux/cart'
import userReducer from '../redux/user'


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer
  },
});

// Infer types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;