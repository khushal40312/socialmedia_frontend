import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unreadCounts: {}, // Store unread counts for different users (keyed by user ID)
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateUnreadCount: (state, action) => {
      const { receiverId, unreadCount } = action.payload;
      state.unreadCounts[receiverId] = unreadCount;
    },
  },
});

export const { updateUnreadCount } = chatSlice.actions;

export default chatSlice.reducer;
