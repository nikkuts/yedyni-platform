import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {AXIOS_BASE_URL} from '../../constants';

axios.defaults.baseURL = AXIOS_BASE_URL;

export const getTips = createAsyncThunk(
  "tips/getTips", 
  async (_, thunkAPI) => {
      try {
        const response = await axios.get("/api/tips"); 
        return response.data;
      } 
      catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
  }
);

export const getTipById = createAsyncThunk(
  "tips/getTipById",
  async (tipId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/tips/${tipId}`);
      return response.data; 
    } 
    catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
