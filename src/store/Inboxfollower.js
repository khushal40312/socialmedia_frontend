import { createSlice } from "@reduxjs/toolkit";

const InboxFollowersSlice = createSlice({
    name: 'Inboxfollower',
    initialState: [],
    reducers: {
        addFollowerInbox(state, action) {
            // Append new followers to the existing list
          
            return action.payload;
        },
        setFollowerInbox: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
     
    }

});


export const InboxFollowersAction = InboxFollowersSlice.actions;

export default InboxFollowersSlice.reducer;
