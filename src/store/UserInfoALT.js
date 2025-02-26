import { createSlice } from "@reduxjs/toolkit";

const UserInfoALT = createSlice({
    name: 'userALT',
    initialState: [],
    reducers: {
        addUserInfo: (state, action) => {

            return action.payload
        }
    }
});

export const UserActionALT = UserInfoALT.actions;



export default UserInfoALT.reducer;
