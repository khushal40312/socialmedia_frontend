import { createSlice } from "@reduxjs/toolkit";

const userPostSlice = createSlice({
    name: 'userPost',
    initialState: [],
    reducers: {
        addUserPosts: (state, action) => {
      
            return action.payload; // Replaces the entire state with new posts
            
        },
        setUserPosts: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
    }

});


export const UserPostAction = userPostSlice.actions;

export default userPostSlice.reducer;
