// store/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isAddPostModalOpen: false,
    },
    reducers: {
        openAddPostModal: (state) => {
            state.isAddPostModalOpen = true;
        },
        closeAddPostModal: (state) => {
            state.isAddPostModalOpen = false;
        },
    },
});

export const { openAddPostModal, closeAddPostModal } = modalSlice.actions;

export default modalSlice.reducer;
