import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';  // ✅ Import the reducer from your slice file

const store = configureStore({
  reducer: {
    auth: authReducer,  // ✅ Use the reducer, not the whole slice
  },
});

export default store;
