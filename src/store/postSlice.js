import { createSlice, createSelector } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'posts',
    initialState: [],
    reducers: {
        addPosts: (state, action) => {
            return action.payload; // Appends new posts to the existing state
        },
        setPosts: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
    }
});

export const postActions = postSlice.actions;

// Memoized selector to prevent unnecessary rerenders
export const selectPosts = createSelector(
    (state) => state.posts, // Input selector
    (posts) => posts // Output selector
);

export default postSlice.reducer;
