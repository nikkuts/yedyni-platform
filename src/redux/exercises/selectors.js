export const selectExercise = state => state.exercises.exercise;

export const selectMessages = state => state.exercises.messages;

export const selectCountMessages = state => state.exercises.countMessages;

export const selectIsLoading = state => state.exercises.isLoading;

export const selectError = state => state.exercises.error;

export const selectCurrentLesson = state => state.lesson.currentLesson;

export const selectContent = state => state.lesson.content;

export const selectIsLoadingLesson = state => state.lesson.isLoading;

export const selectErrorLesson = state => state.lesson.error;