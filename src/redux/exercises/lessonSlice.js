import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Асинхронний thunk для отримання контенту
export const getContent = createAsyncThunk(
  "lesson/getContent",
  async (url, thunkAPI) => {
    try {
      const response = await axios.get(url, {
        responseType: 'text'
      });
      return response.data; 
    } 
    catch (error) {
      alert('Помилка завантаження');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const lessonInitialState = {
  currentLesson: {},
  content: '',
  isLoading: false,
  error: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState: lessonInitialState,
  reducers: {
    changeLesson(state, action) {
      state.currentLesson = action.payload;
    },
  },
  extraReducers: builder =>
    builder
    .addCase(getContent.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getContent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.content = action.payload;
    })
    .addCase(getContent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.content = lessonInitialState.content;
    })
});

export const { changeLesson } = lessonSlice.actions;
export const lessonReducer = lessonSlice.reducer;