import { createSlice } from "@reduxjs/toolkit";

const userFollowerlistSlice = createSlice({
    name: 'userfollowers',
    initialState: [],
    reducers: {
        addUserFollower(state, action) {
            // Append new followers to the existing list
            return action.payload;
        },
        setUserFollower: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
     
    }

});


export const UserFollowerAction = userFollowerlistSlice.actions;

export default userFollowerlistSlice.reducer;
