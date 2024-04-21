import { createSlice } from "@reduxjs/toolkit";
import { 
    getDonats,
    getSubscriptions,
    getByIdSubscription,
    cancelSubscribe,
    getMark, 
} from "./operations";

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState: {
    donats: [],
    subscriptions: [],
    mark: [],
    totalPages: null,
    subscription: null,
    isLoading: false,
    error: null
  },
  extraReducers: builder =>
    builder
    .addCase(getDonats.pending, handlePending)
    .addCase(getDonats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.donats = action.payload.donats;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(getDonats.rejected, handleRejected)
    .addCase(getSubscriptions.pending, handlePending)
    .addCase(getSubscriptions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.subscriptions = action.payload.subscriptions;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(getSubscriptions.rejected, handleRejected)
    .addCase(getByIdSubscription.pending, handlePending)
    .addCase(getByIdSubscription.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.subscription = action.payload;
    })
    .addCase(getByIdSubscription.rejected, handleRejected)
    .addCase(cancelSubscribe.pending, handlePending)
    .addCase(cancelSubscribe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      const {orderId} = action.payload;
      const index = state.subscriptions.findIndex(
        ({data}) => data.order_id === orderId
      );
      if (index !== -1) {
        state.subscriptions[index].objSub.isUnsubscribe = true;
      }
    })
    .addCase(cancelSubscribe.rejected, handleRejected)
    .addCase(getMark.pending, handlePending)
    .addCase(getMark.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.mark = action.payload.mark;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(getMark.rejected, handleRejected)
});

export const paymentsReducer = paymentsSlice.reducer;