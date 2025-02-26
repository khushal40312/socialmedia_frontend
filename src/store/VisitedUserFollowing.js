import { createSlice } from "@reduxjs/toolkit";

const VistedUserFollowings = createSlice({
    name: 'VisitedUserfollowing',
    initialState: [],
    reducers: {
        addVisitedUserFollowing: (state, action) => {

            return action.payload; // Replaces the entire state with new posts

        },
        setVisitedUserFollowing: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
    }

});


export const VisitedUserfollowingAction = VistedUserFollowings.actions;

export default VistedUserFollowings.reducer;
