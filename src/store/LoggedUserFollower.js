import { createSlice } from "@reduxjs/toolkit";

const LoggedUserFollowerSlice = createSlice({
    name: 'loggedUserFollower',
    initialState: [],
    reducers: {
        addUserFollowings(state, action) {
            // Append new followers to the existing list
           
           
            return [...state ,...action.payload]
        },
        setUserFollower: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
     
    }

});


export const LoggedUserFollowerAction = LoggedUserFollowerSlice.actions;

export default LoggedUserFollowerSlice.reducer;