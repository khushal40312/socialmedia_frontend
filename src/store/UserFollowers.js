import { createSlice } from "@reduxjs/toolkit";

const userFollowerSlice = createSlice({
    name: 'userFollower',
    initialState: [],
    reducers: {
        addUserFollower: (state, action) => {
          
            return action.payload; // Replaces the entire state with new posts
            
        },
        setUserFollower: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
       
    }

});


export const UserFollowerActionz = userFollowerSlice.actions;

export default userFollowerSlice.reducer;
