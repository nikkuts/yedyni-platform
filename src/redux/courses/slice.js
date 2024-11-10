import { createSlice } from "@reduxjs/toolkit";
import { 
  getCourseById,
  updateNextWaveCourse,
  updateScheduledDateLesson,
} from "./operations";

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const initialState = {
  course: {},
  isLoading: false,
  error: null,
}

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  extraReducers: builder =>
    builder
    .addCase(getCourseById.pending, handlePending)
    .addCase(getCourseById.fulfilled, (state, action) => {
      state.course = action.payload || initialState.course;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(getCourseById.rejected, handleRejected)
    .addCase(updateNextWaveCourse.pending, handlePending)
    .addCase(updateNextWaveCourse.fulfilled, (state, action) => {
      state.course = {
        ...state.course,
        ...action.payload
      };
      state.isLoading = false;
      state.error = null;
    })
    .addCase(updateNextWaveCourse.rejected, handleRejected)
    .addCase(updateScheduledDateLesson.pending, handlePending)
    .addCase(updateScheduledDateLesson.fulfilled, (state, action) => {
      const lessonIndex = state.course.lessons.findIndex(
        lesson => lesson.day === action.payload.lessonId
      );
      
      if (lessonIndex !== -1) {
        state.course.lessons[lessonIndex] = {
          ...state.course.lessons[lessonIndex],
          scheduledDate: action.payload.scheduledDate
        };
      }
      state.isLoading = false;
      state.error = null;
    })
    .addCase(updateScheduledDateLesson.rejected, handleRejected)
});

export const coursesReducer = coursesSlice.reducer;