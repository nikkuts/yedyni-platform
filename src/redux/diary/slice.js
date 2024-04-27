import { createSlice } from "@reduxjs/toolkit";
import { 
    getDiary,
    addDiary,
    updateDiary,
} from "./operations";

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const initialState = {
    diary: {
      date: new Date(),
      entry: '',
      plan: '',
  },
  isLoading: false,
  error: null,
}

const diarySlice = createSlice({
  name: "diary",
  initialState,
  extraReducers: builder =>
    builder
    .addCase(getDiary.pending, handlePending)
    .addCase(getDiary.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.diary = action.payload || initialState.diary;
    })
    .addCase(getDiary.rejected, handleRejected)
    .addCase(addDiary.pending, handlePending)
    .addCase(addDiary.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.diary = action.payload;
    })
    .addCase(addDiary.rejected, handleRejected)
    .addCase(updateDiary.pending, handlePending)
    .addCase(updateDiary.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.diary = action.payload;
    })
    .addCase(updateDiary.rejected, handleRejected)
});

export const diaryReducer = diarySlice.reducer;