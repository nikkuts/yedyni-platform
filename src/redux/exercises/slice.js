import { createSlice } from "@reduxjs/toolkit";
import { 
    getExercise,
    addExercise,
    updateExercise,
    deleteFile,
    addComment,
    updateComment,
    deleteComment,
} from "./operations";

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const initialState = {
  exercise: {
      homework: '',
      fileURL: '',
      comments: [],
  },
  // homework: '',
  // fileURL: '',
  // comments: [],
  isLoading: false,
  error: null,
}

const exercisesSlice = createSlice({
  name: "exercises",
  initialState,
  extraReducers: builder =>
    builder
    .addCase(getExercise.pending, handlePending)
    .addCase(getExercise.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload || initialState.exercise;
      // state.homework = action.payload.homework || initialState.homework;
      // state.fileURL = action.payload.fileURL || initialState.fileURL;
      // state.comments = action.payload.comments || initialState.comments;
    })
    .addCase(getExercise.rejected, handleRejected)
    .addCase(addExercise.pending, handlePending)
    .addCase(addExercise.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload;
      // state.homework = action.payload.homework;
      // state.fileURL = action.payload.fileURL;
      // state.comments = action.payload.comments;
    })
    .addCase(addExercise.rejected, handleRejected)
    .addCase(updateExercise.pending, handlePending)
    .addCase(updateExercise.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload;
      // state.homework = action.payload.homework;
      // state.fileURL = action.payload.fileURL;
      // state.comments = action.payload.comments;
    })
    .addCase(updateExercise.rejected, handleRejected)
    .addCase(deleteFile.pending, handlePending)
    .addCase(deleteFile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload;
      // state.homework = action.payload.homework;
      // state.fileURL = action.payload.fileURL;
      // state.comments = action.payload.comments;
    })
    .addCase(deleteFile.rejected, handleRejected)
    .addCase(addComment.pending, handlePending)
    .addCase(addComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise.comments.push(action.payload);
      // state.comments.push(action.payload);
    })
    .addCase(addComment.rejected, handleRejected)
    .addCase(updateComment.pending, handlePending)
    .addCase(updateComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      const index = state.exercise.comments.findIndex(comment => comment._id === action.payload._id);
      state.exercise.comments[index] = action.payload;
      // const index = state.comments.findIndex(comment => comment._id === action.payload._id);
      // state.comments[index] = action.payload;
    })
    .addCase(updateComment.rejected, handleRejected)
    .addCase(deleteComment.pending, handlePending)
    .addCase(deleteComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      const index = state.exercise.comments.findIndex(comment => comment._id === action.payload.commentId);
      state.exercise.comments.splice(index,1);
      // const index = state.comments.findIndex(comment => comment._id === action.payload.commentId);
      // state.comments.splice(index,1);
    })
    .addCase(deleteComment.rejected, handleRejected)
});

export const exercisesReducer = exercisesSlice.reducer;