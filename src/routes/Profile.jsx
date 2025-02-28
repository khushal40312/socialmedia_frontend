import { useQuery, gql, useMutation } from '@apollo/client';
import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../../ThemeContext';
import { Modal } from 'react-bootstrap';
import MoreSpinner from '../components/MoreSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { UserAction } from '../store/UserInfo';
import { UserPostAction } from '../store/UserPosts';
import { useLocation } from "react-router-dom";
import { UserFollowerAction } from '../store/UserFollower';
import { UserFollowingAction } from '../store/UserFollowing';
import ProfileHeader from '../components/ProfileHeader';
import FollowingModal from '../ProfileModals/FollowingModal';
import FollowerModal from '../ProfileModals/FollowerModal';
import ProfilemodalHeader from '../ProfileModals/ProfilemodalHeader';
import useFetchMoreFollowers from '../Functions/profileFunctions/FetchMoreFollowers';
import useFetchMoreFollowings from '../Functions/profileFunctions/FetchMoreFollowings';
import { USER_POSTS, useUserQuery } from '../graphql/queries/userQueries';
import UpdateProfileModal from '../ProfileModals/UpdateProfileModal';
import { USER_FOLLOWERS, USER_FOLLOWING } from '../graphql/queries/followerQueries';
import { UPDATE_PROFILE } from '../graphql/mutation/profileMutation';
import { useApolloClient } from "@apollo/client";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("");
    const [activeTab2, setActiveTab2] = useState("Followers");
    const [color, setColor] = useState("white");
    const [color2, setColor2] = useState("white");
    const [showModal, setModal] = useState(false);
    const [showModal2, setModal2] = useState(false);
    const limit = 4;
    const [user, setUser] = useState({});
    // const posts = useSelector(store => store.userPost);
    const followerlist = useSelector(store => store.userfollowers);
    const followinglist = useSelector((store) => store.userfollowing)
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const userInfo = useSelector(store => store.user);
    const location = useLocation();
    const client = useApolloClient();

    const [updateProfile, { loading: loading2, error: error2 }] = useMutation(UPDATE_PROFILE);
    const { data, loading, error } = useUserQuery();
    const { loading: loading3, data: data3, error: error3 } = useQuery(USER_POSTS, {
        notifyOnNetworkStatusChange: true,
        onCompleted: (fetchedData) => {
            dispatch(UserPostAction.addUserPosts(fetchedData.getAllUserPost));
        }
    })
    const { loading4, fetchMore, error4 } = useQuery(USER_FOLLOWERS, {
        skip: !userInfo.id,
        variables: { userId: userInfo?.id, offset: 0, limit },
        notifyOnNetworkStatusChange: true,
        onCompleted: (fetchedData) => {
            dispatch(UserFollowerAction.addUserFollower(fetchedData.getUserFollowers));
            if (fetchedData.getUserFollowers.length < limit) {
                setHasMore(false);
            }
        },
    });
    const { loading5, fetchMore: fetchMore2, error5 } = useQuery(USER_FOLLOWING, {
        skip: !userInfo.id,
        variables: { userId: userInfo?.id, offset: 0, limit },
        notifyOnNetworkStatusChange: true,
        onCompleted: (fetchedData) => {
            dispatch(UserFollowingAction.addUserFollowing(fetchedData.getUserFollowing));
            if (fetchedData.getUserFollowing.length < limit) {
                setHasMore2(false);
            }
        },
    });
    const { fetchMoreFollowers, hasMore, loadingMore, setHasMore } = useFetchMoreFollowers(fetchMore, limit);
    const { fetchMoreFollowings, hasMore2, loadingMore2, setHasMore2 } = useFetchMoreFollowings(fetchMore2, limit);
    useEffect(() => {
        if (userInfo) {
            setUser({
                firstName: userInfo.firstName || "",
                lastName: userInfo.lastName || "",
                picture: userInfo.picture || ""
            });
        }
    }, [userInfo]);

    useEffect(() => {
        if (data?.getCurrentLoggedInUser) {
            dispatch(UserAction.addUserInfo(data.getCurrentLoggedInUser));
        }
    }, [data, dispatch]);

    const handleUpdate = async () => {
        const previousUser = { ...userInfo }; // Save current state for rollback
        dispatch(UserAction.addUserInfo(user)); // Optimistic update
        try {
            const { data } = await updateProfile({
                variables: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                   
                },
            });
            dispatch(UserAction.addUserInfo(data.updateProfile)); // Sync Redux with the updated data
            toast.success("Profile updated successfully!");
            setModal(false)
            client.clearStore();
        } catch (err) {
            dispatch(UserAction.addUserInfo(previousUser)); // Revert state on failure
            toast.error("Failed to update profile.");
        }
    };


    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const debounce2 = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };
    const fetchMoreDebounced = useCallback(debounce(fetchMoreFollowers, 300), [fetchMoreFollowers]);
    const fetchMoreDebounced2 = useCallback(debounce2(fetchMoreFollowings, 300), [fetchMoreFollowings]);
    // Set theme color based on mode
    useEffect(() => {
        setColor(theme === "dark" ? "white" : "black");
        setColor2(theme === "dark" ? "white" : "black");
    }, [theme]);

    // Error handling for main query
    if (error) {
        return (
            <div className="text-center">
                <p>Error: {error.message}</p>
                <button onClick={() => refetch()}>Retry</button>
            </div>
        );
    }
    useEffect(() => {
        if (error) toast.error(error.message);
        return () => toast.dismiss(); // Clean up toasts on component unmount
    }, [error]);

    // Error handling for update mutation
    useEffect(() => {
        if (error2) toast.error(error2.message);
    }, [error2]);
    useEffect(() => {
        if (location.pathname === "/profile/threads") {
            setActiveTab("Threads")
        } else if (location.pathname === "/profile/replies") {
            setActiveTab("Replies")

        } else if (location.pathname === "/profile/reposts") {
            setActiveTab("Reposts")

        }
    }, [location.pathname]);
    if (loading4 && followerlist.length === 0) return <MoreSpinner />;
    if (loading) {
        return <div className="text-center text-white">Loading...</div>;
    }
    if (loading3) return <p>loading</p>;
    if (error3) console.error("Failed to load posts. Please try again.");



    return (
        <>
            <ProfileHeader
                theme={theme}
                userInfo={userInfo}
                data={data}
                setModal={setModal}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                color={color}
                setModal2={setModal2}
            />
            <UpdateProfileModal
            currentUser={userInfo}
                setModal={setModal}
                setUser={setUser}
                theme={theme}
                loading2={loading2}
                handleUpdate={handleUpdate}
                showModal={showModal}
                user={user} />
            <Modal className={`border-rounded`}
                show={showModal2}
                onHide={() => setModal2(false)}
                centered scrollable>
                <ProfilemodalHeader
                    data={data}
                    theme={theme}
                    activeTab2={activeTab2}
                    setActiveTab2={setActiveTab2}
                    color2={color2}
                />
                {activeTab2 === "Followers" ?
                    <FollowerModal
                        setModal2={setModal2}
                        theme={theme}
                        followerlist={followerlist}
                        fetchMoreDebounced={fetchMoreDebounced}
                        hasMore={hasMore}
                         /> :
                    <FollowingModal
                        setModal2={setModal2}
                        theme={theme}
                        followinglist={followinglist}
                        fetchMoreDebounced2={fetchMoreDebounced2}
                        hasMore2={hasMore2}
                        />}
            </Modal>
        </>
    );
}
