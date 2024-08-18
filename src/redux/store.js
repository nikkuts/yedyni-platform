import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { partnersReducer } from './partners/slice';
import { paymentsReducer } from './payments/slice';
import { rangeReducer } from './payments/rangeSlice';
import { modalReducer } from './modal/modalSlice';
import { authReducer } from './auth/slice';
import { exercisesReducer } from './exercises/slice';
import { lessonReducer } from './exercises/lessonSlice';
import { diaryReducer } from './diary/slice';
import { chatReducer } from './chat/slice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    partners: partnersReducer,
    payments: paymentsReducer,
    range: rangeReducer,
    modal: modalReducer,
    exercises: exercisesReducer,
    lesson: lessonReducer,
    diary: diaryReducer,
    chat: chatReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);