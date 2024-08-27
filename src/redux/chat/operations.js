import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {AXIOS_BASE_URL} from '../../constants';

axios.defaults.baseURL = AXIOS_BASE_URL;

  export const getMessages = createAsyncThunk(
    "chat/getMessages",
    async (chatTitle, thunkAPI) => {
    //   const searchParams = new URLSearchParams(params);
      try {
        const response = await axios.get("/api/chats", { params: { chat: chatTitle } });
        return response.data; 
      } 
      catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const uploadFile = createAsyncThunk(
    "chat/uploadFile",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.post("/api/chats/upload", credentials);
        return response.data; 
      } 
      catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

//   export const addMessage = createAsyncThunk(
//     "chat/addMessage",
//     async (credentials, thunkAPI) => {
//       try {
//         const response = await axios.post("/api/chats/message", credentials);
//         return response.data; 
//       } 
//       catch (error) {
//         return thunkAPI.rejectWithValue(error.message);
//       }
//     }
//   );

  // export const updateMessage = createAsyncThunk(
  //   "chat/updateMessage",
  //   async (credentials, thunkAPI) => {
  //     try {
  //       const response = await axios.patch("/api/chats/message", credentials);
  //       return response.data; 
  //     } 
  //     catch (error) {
  //       return thunkAPI.rejectWithValue(error.message);
  //     }
  //   }
  // );

  export const deleteFile = createAsyncThunk(
    "chat/deleteFile",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.patch("/api/chats/message/file", credentials);
        return response.data; 
      } 
      catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  // export const deleteMessage = createAsyncThunk(
  //   "chat/deleteMessage",
  //   async (messageId, thunkAPI) => {
  //     try {
  //       const response = await axios.delete(
  //         `/api/chats/message/${messageId}`);
  //       return response.data; 
  //     } 
  //     catch (error) {
  //       return thunkAPI.rejectWithValue(error.message);
  //     }
  //   }
  // );