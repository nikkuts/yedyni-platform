import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {AXIOS_BASE_URL} from '../../constants';

axios.defaults.baseURL = AXIOS_BASE_URL;

  export const getDiary = createAsyncThunk(
    "diary/getDiary",
    async (params, thunkAPI) => {
      const searchParams = new URLSearchParams(params);
      try {
        const response = await axios.get(
          `/api/diary?${searchParams.toString()}`
        );
        return response.data; 
      } 
      catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const addDiary = createAsyncThunk(
    "diary/addDiary",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.post("/api/diary", credentials);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const updateDiary = createAsyncThunk(
    "diary/updateDiary",
    async (credentials, thunkAPI) => {
      try {
        const response = await axios.patch("/api/diary", credentials);
        return response.data; 
      } 
      catch (error) {
        alert(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );