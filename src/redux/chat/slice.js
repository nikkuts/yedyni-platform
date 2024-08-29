import { createSlice } from "@reduxjs/toolkit";
import { 
    getMessages,
    // addMessage,
    // updateMessage,
    uploadFile,
    // deleteFile,
    // deleteMessage,
} from "./operations";

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action) {
        state.messages.push(action.payload);
    },
    updateMessage(state, action) {
      const index = state.messages.findIndex(message => message._id === action.payload._id);
      state.messages[index] = index !== -1 && {...state.messages[index], ...action.payload};
    },
    deleteMessage(state, action) {
      const index = state.messages.findIndex(message => message._id === action.payload._id);
      state.messages.splice(index,1);
    },
  },
  extraReducers: builder =>
    builder
    .addCase(getMessages.pending, handlePending)
    .addCase(getMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.messages = action.payload || initialState.messages;
    })
    .addCase(getMessages.rejected, handleRejected)
    // .addCase(addMessage.pending, handlePending)
    // .addCase(addMessage.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.error = null;
    //   state.messages.push(action.payload);
    // })
    // .addCase(addMessage.rejected, handleRejected)
    .addCase(uploadFile.pending, handlePending)
    .addCase(uploadFile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      // state.fileURL = action.payload || initialState.fileURL;
    })
    .addCase(uploadFile.rejected, handleRejected)
    // .addCase(deleteFile.pending, handlePending)
    // .addCase(deleteFile.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.error = null;
    //   const index = state.messages.findIndex(message => message._id === action.payload._id);
    //   state.messages[index] = action.payload;
    // })
    // .addCase(deleteFile.rejected, handleRejected)
    // .addCase(updateMessage.pending, handlePending)
    // .addCase(updateMessage.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.error = null;
    //   const index = state.messages.findIndex(message => message._id === action.payload._id);
    //   state.messages[index] = action.payload;
    // })
    // .addCase(updateMessage.rejected, handleRejected)
    // .addCase(deleteMessage.pending, handlePending)
    // .addCase(deleteMessage.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.error = null;
    //   const index = state.messages.findIndex(message => message._id === action.payload._id);
    //   state.messages.splice(index,1);
    // })
    // .addCase(deleteMessage.rejected, handleRejected)
});

export const { addMessage, updateMessage, deleteMessage } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;