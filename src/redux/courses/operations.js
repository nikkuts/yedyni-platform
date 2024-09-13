import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {AXIOS_BASE_URL} from '../../constants';

axios.defaults.baseURL = AXIOS_BASE_URL;

export const getCourseById = createAsyncThunk(
  "courses/getCourseById",
  async (courseId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/courses/${courseId}`);
      return response.data; 
    } 
    catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateScheduledDateLesson = createAsyncThunk(
  "courses/updateScheduledDateLesson",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.patch("/api/courses/lesson/date", credentials);
      return response.data; 
    } 
    catch (error) {
      alert(error.response.data.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

  