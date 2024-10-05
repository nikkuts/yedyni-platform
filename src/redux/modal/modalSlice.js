import { createSlice } from "@reduxjs/toolkit";

const modalInitialState = {
  isOpenModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState: modalInitialState,
  reducers: {
    toggleModal(state) {
      state.isOpenModal = !state.isOpenModal;
    },
  },
});

export const { toggleModal} = modalSlice.actions;
export const modalReducer = modalSlice.reducer;