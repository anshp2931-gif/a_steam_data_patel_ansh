import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gameReducer,
    users: userReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
