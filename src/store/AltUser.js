import { createSlice } from "@reduxjs/toolkit";

const ALTUserInfo = createSlice({
    name: 'ALTUser',
    initialState: [],
    reducers: {
        addUserInfo: (state, action) => {
            // console.log(action.payload)
            return action.payload
        },
        setUserInfo: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
    }
});

export const ALTUserAction = ALTUserInfo.actions;



export default ALTUserInfo.reducer;
