import { createSlice } from "@reduxjs/toolkit";
import { 
    getExercise,
    addExercise,
    updateExercise,
    deleteHomework,
    deleteFile,
    addComment,
    updateComment,
    deleteComment,
    getMessages,
    getExerciseById,
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
  messages: [],
  countMessages: null,
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
    })
    .addCase(getExercise.rejected, handleRejected)
    .addCase(addExercise.pending, handlePending)
    .addCase(addExercise.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload;
    })
    .addCase(addExercise.rejected, handleRejected)
    .addCase(updateExercise.pending, handlePending)
    .addCase(updateExercise.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload;
    })
    .addCase(updateExercise.rejected, handleRejected)
    .addCase(deleteHomework.pending, handlePending)
    .addCase(deleteHomework.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload;
    })
    .addCase(deleteHomework.rejected, handleRejected)
    .addCase(deleteFile.pending, handlePending)
    .addCase(deleteFile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload;
    })
    .addCase(deleteFile.rejected, handleRejected)
    .addCase(addComment.pending, handlePending)
    .addCase(addComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise.comments.push(action.payload);
    })
    .addCase(addComment.rejected, handleRejected)
    .addCase(updateComment.pending, handlePending)
    .addCase(updateComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      const index = state.exercise.comments.findIndex(comment => comment._id === action.payload._id);
      state.exercise.comments[index] = action.payload;
    })
    .addCase(updateComment.rejected, handleRejected)
    .addCase(deleteComment.pending, handlePending)
    .addCase(deleteComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      const index = state.exercise.comments.findIndex(comment => comment._id === action.payload.commentId);
      state.exercise.comments.splice(index,1);
    })
    .addCase(deleteComment.rejected, handleRejected)
    .addCase(getMessages.pending, handlePending)
    .addCase(getMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.messages = action.payload.messages || initialState.messages;
      state.countMessages = action.payload.countMessages || initialState.countMessages;
    })
    .addCase(getMessages.rejected, handleRejected)
    .addCase(getExerciseById.pending, handlePending)
    .addCase(getExerciseById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.exercise = action.payload || initialState.exercise;
    })
    .addCase(getExerciseById.rejected, handleRejected)
});

export const exercisesReducer = exercisesSlice.reducer;