import { createSlice } from '@reduxjs/toolkit';
import { register, logIn, logOut, refreshUser } from './operations';

const initialState = {
  user: {},
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder =>
    builder
    .addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    })
    .addCase(logIn.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    })
    .addCase(logOut.fulfilled, (state) => {
      state.user = initialState.user;
      state.token = null;
      state.isLoggedIn = false;
    })
    .addCase(refreshUser.pending, (state) => {
      state.isRefreshing = false;
    })
    .addCase(refreshUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isRefreshing = true;
    })
    .addCase(refreshUser.rejected, (state) => {
      state.isRefreshing = true;
    })
});

export const authReducer = authSlice.reducer;