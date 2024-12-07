import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserData } from "../types/authen.type";

// Define the User State Interface
interface UserState {
  isAuthenticated: boolean,
  user: Partial<IUserData> | null; // Null when logged out
}

// Initial State
const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Login Action
    login: (state, action: PayloadAction<Partial<IUserData>>) => {
      state.isAuthenticated = true
      state.user = action.payload; // Set user data
    },
    // Logout Action
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null; // Clear user data
    },
    // Update User Info Action (Optional)
    updateUser: (state, action: PayloadAction<Partial<IUserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; // Merge updates into user data
      }
    },
  },
});

// Export Actions
export const { login, logout, updateUser } = userSlice.actions;

// Export Reducer
export default userSlice.reducer;
