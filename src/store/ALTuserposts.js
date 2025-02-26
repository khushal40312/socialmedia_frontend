import { createSlice } from "@reduxjs/toolkit";

const userPostSliceALT = createSlice({
    name: 'altuserposts',
    initialState: [],
    reducers: {
        ALTUserPosts: (state, action) => {
            // console.log(action)
            return action.payload; // Replaces the entire state with new posts
            
        },
        setUserPosts: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
    }

});


export const ALTUserPostAction = userPostSliceALT.actions;

export default userPostSliceALT.reducer;
