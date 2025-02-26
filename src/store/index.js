import { configureStore, combineReducers } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import authSlice from "./authSlice";
import UserInfo from "./UserInfo";
import modalReducer from './modalSlice';
import userPostSlice from "./UserPosts";
import userEmailReducer from "./EmailSlice";
import SearchedUser from "./SearchedUser";
import userPostSliceALT from "./ALTuserposts";
import UserInfoALT from "./UserInfoALT";
import ALTUserInfo from "./AltUser";
import UserFollowerSlice from "./UserFollowers";
import UserFollowerlistSlice from "./UserFollower";
import userFollowinglistSlice from "./UserFollowing";
// import userFollowinglistSlice from "./VisitedUserFollower";
// import userFollowinglistSlice from "./VisitedUserFollower";
import VistedUserFollowers from "./VisitedUserFollower";
import VistedUserFollowings from "./VisitedUserFollowing";
import inboxReducer from "./Inboxfollower"
import chatSlice from "./Chat"
// Combine all your reducers
const appReducer = combineReducers({
    posts: postReducer,
    auth: authSlice,
    user: UserInfo,
    modal: modalReducer,
    userPost: userPostSlice,
    useremail: userEmailReducer,
    searchedusers: SearchedUser,
    altuserposts: userPostSliceALT,
    userALT: UserInfoALT,
    ALTUser: ALTUserInfo,
    userFollower: UserFollowerSlice,
    userfollowers: UserFollowerlistSlice,
    userfollowing: userFollowinglistSlice,
    VisitedUserfollowers:VistedUserFollowers,
    VisitedUserfollowing:VistedUserFollowings,
    Inboxfollower:inboxReducer,
    chat:chatSlice
    
});

// Root reducer to handle global logout
const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
        state = undefined; // Reset all state to initial
    }
    return appReducer(state, action);
};

// Configure the Redux store
const threadStore = configureStore({
    reducer: rootReducer,
});

export default threadStore;
