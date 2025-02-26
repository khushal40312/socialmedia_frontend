import { createSlice } from "@reduxjs/toolkit";

const VistedUserFollowers = createSlice({
    name: 'VisitedUserfollowers',
    initialState: [],
    reducers: {
        addVisitedUserFollower: (state, action) => {
      
            return action.payload; // Replaces the entire state with new posts
            
        },
        setVisitedUserFollower: (state, action) => {
            return action.payload; // Replaces the entire state with new posts
        }
    }

});


export const VisitedUserfollowersAction = VistedUserFollowers.actions;

export default VistedUserFollowers.reducer;
