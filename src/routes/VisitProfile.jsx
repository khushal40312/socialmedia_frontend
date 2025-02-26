import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import MoreSpinner from '../components/MoreSpinner';
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { ALTUserPostAction } from '../store/ALTuserposts';
import { ALTUserAction } from '../store/AltUser';
import { UserActionALT } from '../store/UserInfoALT';
import { UserFollowerActionz } from '../store/UserFollowers';
import { USER_FOLLOWERS, USER_FOLLOWING } from '../graphql/queries/followerQueries';
import { VisitedUserfollowersAction } from '../store/VisitedUserFollower';
import { VisitedUserfollowingAction } from '../store/VisitedUserFollowing';
import useFetchMoreFollowers from '../Functions/VisitedProfileFunctions./FetchMoreFollower';
import useFetchMoreFollowings from '../Functions/VisitedProfileFunctions./FetchMoreFollowings';
import VisitedProfileHeader from '../components/VisitedProfileHeader';
import VisitedProfModalHeader from '../components/VisitedProfileModals/VisitedProfModalHeader';
import VisitedModalFollower from '../components/VisitedProfileModals/VisitedModalFollower';
import VisitedModalFollowings from '../components/VisitedProfileModals/VisitedModalFollowings';
import { Modal } from 'react-bootstrap';
import { useUserQuery } from '../graphql/queries/userQueries';


const USER_PROFILE_QUERY = gql`

  query FindUserProfile($id: String!) {
    findUserProfile(id: $id) {
      id
      firstName
      lastName
      email
      picture
      followers
      following
      posts {
        createdAt
        title
        content
        likes
        likedBy {
          id
        }
        id
      }
    }
  }
`;
const USER_QUERY = gql`
    query GetCurrentLoggedInUser {
        getCurrentLoggedInUser {
            firstName
            lastName
            email
            picture
            id
            followers
        }
    }

    
`;
const FOLLOW_QUERY = gql`
mutation FollowUser($targetUserId: String!) {
  followUser(targetUserId: $targetUserId)
}
`;
const GET_USER_FOLLOWERS = gql`
query GetUserFollowers($userId: String!) {
  getUserFollowers(userId: $userId) {
    firstName
    lastName
    email
    picture
    followers
    id
  }
}
`
export default function VisitProfile() {
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate()
  const { theme } = useTheme();
  const limit = 4;
  const loggedUserID = useSelector((store) => store.userALT)
  const followers = useSelector(store => store.userFollower);
  const followerlist = useSelector(store => store.VisitedUserfollowers);
  const followinglist = useSelector((store) => store.VisitedUserfollowing)
  const [showModal2, setModal2] = useState(false);
  const myId = localStorage.getItem("userId");

  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("");
  const [activeTab2, setActiveTab2] = useState("Followers");
  const [color, setColor] = useState("white");
  const [color2, setColor2] = useState("white");
  // const { data, loading, error } = useUserQuery();
  function removeFromAt(input) {
    if (typeof input !== "string") {
      throw new Error("Input must be a string");
    }
    return input.split("@")[0];
  }
  const isFollowByUser = followers.some(user => user.id === loggedUserID.id);
  const [FollowUser] = useMutation(FOLLOW_QUERY, {
    update(cache, { data: { followUser } }) {
      // Update Apollo Cache here if necessary
    },
    optimisticResponse: {
      followUser: isFollowByUser ? "Unfollowed successfully" : "Followed successfully",
    },
  });


  const { data, loading, error } = useQuery(USER_PROFILE_QUERY, {
    variables: { id: `${removeFromAt(username)}` },
    onCompleted: (fetchedData) => {
      // Dispatch the action when data is successfully fetched
      if (fetchedData?.findUserProfile?.posts) {

        dispatch(ALTUserAction.addUserInfo(fetchedData.findUserProfile));
        dispatch(ALTUserPostAction.ALTUserPosts(fetchedData.findUserProfile.posts));

      }
    },
  });
  const { loading2, data2, error2 } = useQuery(USER_QUERY, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetched) => {
      if (fetched?.getCurrentLoggedInUser) {

        dispatch(UserActionALT.addUserInfo(fetched.getCurrentLoggedInUser));
      }
    }

  });
  const { loading3, data3, error3 } = useQuery(GET_USER_FOLLOWERS, {
    // Skip query execution if userId is not available
    variables: { userId: `${removeFromAt(username)}` },
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetched) => {
      if (fetched?.getUserFollowers) {

        dispatch(UserFollowerActionz.addUserFollower(fetched.getUserFollowers));
      }
    },
  });
  const { loading4, fetchMore, error4 } = useQuery(USER_FOLLOWERS, {
    skip: !`${removeFromAt(username)}`,
    variables: { userId: `${removeFromAt(username)}`, offset: 0, limit },
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetchedData) => {
      dispatch(VisitedUserfollowersAction.addVisitedUserFollower(fetchedData.getUserFollowers));
      if (fetchedData.getUserFollowers.length < limit) {
        setHasMore(false);
      }
    },
  });
  const { loading5, fetchMore: fetchMore2, error5 } = useQuery(USER_FOLLOWING, {
    skip: !`${removeFromAt(username)}`,
    variables: { userId: `${removeFromAt(username)}`, offset: 0, limit },
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetchedData) => {
      dispatch(VisitedUserfollowingAction.addVisitedUserFollowing(fetchedData.getUserFollowing));
      if (fetchedData.getUserFollowing.length < limit) {
        setHasMore2(false);
      }
    },
  });
  const { fetchMoreFollowers, hasMore, loadingMore, setHasMore } = useFetchMoreFollowers(fetchMore, limit);
  const { fetchMoreFollowings, hasMore2, loadingMore2, setHasMore2 } = useFetchMoreFollowings(fetchMore2, limit);
  const userInfo = data?.findUserProfile;
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
  useEffect(() => {
    if (removeFromAt(username) === localStorage.getItem("userId")) {
      navigate("/profile")

    }
  }, [])
  useEffect(() => {
    setColor(theme === "dark" ? "white" : "black");
  }, [theme]);

  useEffect(() => {
    if (location.pathname === `/${username}/threads`) {
      setActiveTab("Threads")
    } else if (location.pathname === `/${username}/replies`) {
      setActiveTab("Replies")

    } else if (location.pathname === `/${username}/reposts`) {
      setActiveTab("Reposts")

    }
  }, [location.pathname]);
  if (loading) {
    return <MoreSpinner />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (error2) toast.error(error2.message);
  if (error3) toast.error(error3.message);
  if (!data || !data.findUserProfile) {
    return <p>No user profile found.</p>;
  }
  if (loading2) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (loading3) {
    return <div className="text-center text-white">Loading...</div>;
  }
  function formatUrl(input) {
  
    if (input.startsWith('/uploads')) {
        return `${import.meta.env.VITE_BACKEND_URL}${input}`; // Return as is if it starts with "https"
    }
    else if (input.startsWith("blob:")) {
        return input;

    } else {

        return `/${input}`
    }

}




  const handleFollowToggle = (targetUserId) => {
    const isFollowByUser = followers.some(user => user.id === loggedUserID.id);
    let updatedFollowerList;

    // Update followers list without directly mutating the state or userInfo
    if (isFollowByUser) {
      // Unfollow logic: Remove current user from followers
      updatedFollowerList = followers.filter(user => user.id !== loggedUserID.id);
    } else {
      // Follow logic: Add current user to followers
      updatedFollowerList = [...followers, { id: loggedUserID.id }];
    }

    // Dispatch updated followers list
    dispatch(UserFollowerActionz.setUserFollower(updatedFollowerList));

    // Trigger the mutation
    FollowUser({ variables: { targetUserId } });
   


  }

  return (
    <>
      <VisitedProfileHeader
      color={color}
        data={data}
        setModal2={setModal2}
        theme={theme}
        activeTab={activeTab}
        userInfo={userInfo}
        formatUrl={formatUrl}
        followers={followers}
        isFollowByUser={isFollowByUser}
        handleFollowToggle={handleFollowToggle}
      />
      <Modal className={`border-rounded`}
        show={showModal2}
        onHide={() => setModal2(false)}
        centered scrollable>
        <VisitedProfModalHeader
          theme={theme}
          activeTab2={activeTab2}
          setActiveTab2={setActiveTab2}
          color2={color2}
          data={data}

        />
        {activeTab2 === "Followers" ?
          <VisitedModalFollower
            data2={data2}
            setModal2={setModal2}
            theme={theme}
            followerlist={followerlist}
            fetchMoreDebounced={fetchMoreDebounced}
            hasMore={hasMore}
            formatUrl={formatUrl}
            myId={myId} /> :
          <VisitedModalFollowings theme={theme}
          setModal2={setModal2}

            followinglist={followinglist}
            fetchMoreDebounced2={fetchMoreDebounced2}
            hasMore2={hasMore2}
            formatUrl={formatUrl}
            myId={myId} />}
      </Modal>
    </>
  );
}
