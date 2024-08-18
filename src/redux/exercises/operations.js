import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {AXIOS_BASE_URL} from '../../constants';

axios.defaults.baseURL = AXIOS_BASE_URL;

  export const getExercise = createAsyncThunk(
    "exercises/getExercise",
    async (params, thunkAPI) => {
      const searchParams = new URLSearchParams(params);
      try {
        const response = await axios.get(
          `/api/exercises?${searchParams.toString()}`
        );
        return response.data; 
      } 
      catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const addExercise = createAsyncThunk(
    "exercises/addExercise",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.post("/api/exercises", credentials);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const updateExercise = createAsyncThunk(
    "exercises/updateExercise",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.patch("/api/exercises", credentials);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const deleteHomework = createAsyncThunk(
    "exercises/deleteHomework",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.patch("/api/exercises/homework", credentials);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const deleteFile = createAsyncThunk(
    "exercises/deleteFile",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.patch("/api/exercises/file", credentials);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const addComment = createAsyncThunk(
    "exercises/addComment",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.post("/api/exercises/comment", credentials);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const updateComment = createAsyncThunk(
    "exercises/updateComment",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.patch("/api/exercises/comment", credentials);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const updateCommentStatus = createAsyncThunk(
    "exercises/updateCommentStatus",
    async (params, thunkAPI) => {
      const searchParams = new URLSearchParams(params);
      try {
        const response = await axios.patch(
          `/api/exercises/status?${searchParams.toString()}`);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const deleteComment = createAsyncThunk(
    "exercises/deleteComment",
    async (params, thunkAPI) => {
      const searchParams = new URLSearchParams(params);
      try {
        const response = await axios.delete(
          `/api/exercises/comment?${searchParams.toString()}`);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const getNotifications = createAsyncThunk(
    "exercises/getNotifications",
    async (params, thunkAPI) => {
      const searchParams = new URLSearchParams(params);
      try {
        const response = await axios.get(
          `/api/exercises/notifications?${searchParams.toString()}`
        );
        return response.data; 
      } 
      catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const getExerciseById = createAsyncThunk(
    "exercises/getExerciseById",
    async (exerciseId, thunkAPI) => {
      try {
        const response = await axios.get(`/api/exercises/${exerciseId}`);
        return response.data; 
      } 
      catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );