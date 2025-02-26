import { createSlice, createSelector } from "@reduxjs/toolkit";

const SearchSlice = createSlice({
    name: 'searchedusers',
    initialState: [],
    reducers: {
        addUsers: (state, action) => {
            return [...state, ...action.payload];
            // return action.payload
        },
        setUsers: (state, action) => {
            return action.payload; // Replaces the entire state
        },
        clearUsers: () => {
            return []; // Clears the state
        },
    },
});




export const UsersActions = SearchSlice.actions;

// Memoized selector
export default SearchSlice.reducer;
