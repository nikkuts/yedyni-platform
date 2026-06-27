import { createSlice } from "@reduxjs/toolkit";
import { 
  getTips, 
  getTipById,
} from "./operations";

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const tipsSlice = createSlice({
  name: "tips",
  initialState: {
    tips: [],
    tip: null,
    isLoading: false,
    error: null
  },
  extraReducers: builder =>
    builder
    .addCase(getTips.pending, handlePending)
    .addCase(getTips.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.tips = action.payload;
    })
    .addCase(getTips.rejected, handleRejected)
    .addCase(getTipById.pending, handlePending)
    .addCase(getTipById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.tip = action.payload;
    })
    .addCase(getTipById.rejected, handleRejected)
});

export const tipsReducer = tipsSlice.reducer;
