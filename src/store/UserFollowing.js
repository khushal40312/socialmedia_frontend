import { createSlice } from "@reduxjs/toolkit";

const userFollowinglistSlice = createSlice({
    name: 'userfollowing',
    initialState: [],
    reducers: {
        addUserFollowing: (state, action) => {
      
            return action.payload; // Replaces the entire state with new posts
            
        },
        setUserFollowing: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
    }

});


export const UserFollowingAction = userFollowinglistSlice.actions;

export default userFollowinglistSlice.reducer;
