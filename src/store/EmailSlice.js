import { createSlice } from "@reduxjs/toolkit";

const UserEmail = createSlice({
    name: 'email',
    initialState: null, // Representing no email initially
    reducers: {
        addUserEmail: (state, action) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(action.payload); // Log only in development
            }
            return action.payload; // Update the state with the new email
        },
    },
});

export const UserEmailActions = UserEmail.actions;
export default UserEmail.reducer;
