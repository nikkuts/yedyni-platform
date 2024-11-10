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
  isChatVisible: false,
  courseTitle: null,
  courseWave: null,
  messages: [],
  firstMessageDate: '',
  editingMessage: null,
  isLoading: false,
  error: null,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat(state, action) {
      state.courseTitle = action.payload.title;
      state.courseWave = action.payload.wave;
      state.isChatVisible = true;
    },
    closeChat(state) {
      state.isChatVisible = false;
    },
    addMessage(state, action) {
      if (state.firstMessageDate === '') {
        state.firstMessageDate = action.payload.date;
      } else {
        state.messages = [action.payload, ...state.messages];
      }
    },
    updateMessage(state, action) {
      const index = state.messages.findIndex(message => message._id === action.payload._id);
      state.messages[index] = index !== -1 && {...state.messages[index], ...action.payload};
    },
    deleteMessage(state, action) {
      const index = state.messages.findIndex(message => message._id === action.payload._id);
      state.messages.splice(index,1);
    },
    setEditingMessage(state, action) {
      state.editingMessage = action.payload;
    },
    clearEditingMessage(state) {
      state.editingMessage = null;
    },
    clearMessages: (state) => {
      return { ...initialState };
    },        
  },
  extraReducers: builder =>
    builder
    .addCase(getMessages.pending, handlePending)
    .addCase(getMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      if (action.payload.firstMessageDate) {
        state.firstMessageDate = action.payload.firstMessageDate;
      } else {
        state.messages = [...state.messages, ...action.payload.messages];
      }
      // state.messages = !action.payload.firstMessageDate && [...state.messages, ...action.payload.messages];
      // state.firstMessageDate = action.payload.firstMessageDate ?? state.firstMessageDate;
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

export const { 
  openChat,
  closeChat,
  addMessage, 
  updateMessage, 
  deleteMessage,
  setEditingMessage,
  clearEditingMessage, 
  clearMessages 
} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;