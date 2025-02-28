import React, { useState } from 'react';
import { FaRegHeart } from "react-icons/fa";
import { useQuery, useMutation, gql } from "@apollo/client";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '../store/postSlice';
import MoreSpinner from './MoreSpinner';
import { BsThreeDots } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
// import { UserEmailActions } from '../store/EmailSlice';
import { useNavigate } from 'react-router-dom';
import LikesModal from '../ProfileModals/LikesModal';
import { useTheme } from '../../ThemeContext';

const POSTS_QUERY = gql`
  query GetAllPost($offset: Int!, $limit: Int!) {
    getAllPost(offset: $offset, limit: $limit) {
      id
      title
      content
      createdAt
      updatedAt
      authorId
      likes
      author {
        firstName
        lastName
        id
        picture  
        email 
      }
      likedBy {
        firstName
        lastName
        id
      picture

    
      }
    }
  }
`;


const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: String!) {
    likePost(postId: $postId)
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

export default function HomePosts() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [hasMore, setHasMore] = useState(true);
  const [likes, setlikelist] = useState([]);
  const [showModal, setModal] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 4;
  const posts = useSelector(store => store.posts);

  const { data: userData, loading: userLoading } = useQuery(USER_QUERY);
  const userId = userData?.getCurrentLoggedInUser?.id;

  const dispatch = useDispatch();
  const { loading, fetchMore, error } = useQuery(POSTS_QUERY, {
    variables: { offset: 0, limit },
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetchedData) => {


      dispatch(postActions.addPosts(fetchedData.getAllPost));
      // console.log(fetchedData.getAllPost)
      if (fetchedData.getAllPost.length < limit) {
        setHasMore(false);
      }
    },
  });

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    onCompleted: (data) => {
      console.log(data.likePost); // Message from backend (liked/unliked)
    },
  });

  const handleLikeToggle = (postId) => {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) return;

    const isLikedByUser = posts[postIndex].likedBy.some(user => user.id === userId);
    const updatedPosts = [...posts];
    const updatedPost = { ...posts[postIndex] };

    // Optimistically update likes and likedBy array
    if (isLikedByUser) {
      updatedPost.likes -= 1;
      updatedPost.likedBy = updatedPost.likedBy.filter(user => user.id !== userId);
    } else {
      updatedPost.likes += 1;
      updatedPost.likedBy = [...updatedPost.likedBy, { id: userId }];
    }

    updatedPosts[postIndex] = updatedPost;
    dispatch(postActions.setPosts(updatedPosts));

    // Trigger the mutation
    likePost({ variables: { postId } });
  };

  const fetchMorePosts = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      fetchMore({
        variables: {
          offset: posts.length,
          limit,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (fetchMoreResult.getAllPost.length === 0) {
            setHasMore(false);
            setLoadingMore(false);
            return prevResult;
          }
          setTimeout(() => {
            dispatch(postActions.addPosts(fetchMoreResult.getAllPost));
            setLoadingMore(false);
          }, 1000);
          return {
            ...prevResult,
            getAllPost: [
              ...prevResult.getAllPost,
              ...fetchMoreResult.getAllPost,
            ],
          };
        },
      });
    }
  };
  function openLikes(postId) {

    const OpenLikeFor = posts.filter((post) => post.id === postId)
    setlikelist(OpenLikeFor)
    setModal(true)
  }
  if (loading && posts.length === 0) return <MoreSpinner />;
  if (error) return <p>Error: {error.message}</p>;
  if (userLoading) return <MoreSpinner />; // Loading spinner while fetching user data

  function dateConvert(milisec) {
    const givenDate = Number(milisec);
    if (isNaN(givenDate)) {
      console.error("Invalid timestamp:", milisec);
      return "Invalid date";
    }
    const currentDate = new Date();
    const differenceInMillisec = currentDate - givenDate;
    const seconds = Math.floor(differenceInMillisec / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
    if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  const findProfile = (payload) => {
    const { username } = payload

    navigate(`/${username}`);

  }
  
  return (
    <>
      <div id="scrollable-content">
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={loadingMore && <MoreSpinner />}
          scrollableTarget="scrollable-content"
          endMessage={
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {/* <MoreSpinner /> */}
              <b className='text-white'>Yay! You have seen all the posts.</b>
            </div>
          }
        >
          {posts.map((post) => {
            const isLikedByUser = post.likedBy.some(user => user.id === userId);

            return (
              <div key={post.id}>
                <div className='user-info'>
                  <img className='post-Profile-img' src={post.author.picture || "default.jpg"} alt="profile pic" />
                  <strong onClick={() => findProfile({
                    // username: `${post.author.firstName}${post.author.lastName}`.replace(/\s+/g, '_'),
                    username: `${post.author.id}@${post.author.firstName}${post.author.lastName}` || 'unknown'
                  })}

                    className='mx-1'>_{post.author.firstName + post.author.lastName}_</strong>
                  <span className='mx-1 text-secondary'>
                    {dateConvert(post.createdAt)}
                  </span>
                  {post.likes>0&&<span onClick={() => openLikes(post.id)} className=' show-activity '><BsThreeDots /></span>}
                  <span className='info mx-1'>show activity</span>
                </div>
                <h5 className='mx-3 my-1'>{post.title}</h5>
                <div className='container'>
                  <p>{post.content}</p>
                  <span className='mx-2' onClick={() => handleLikeToggle(post.id)}>
                    {isLikedByUser ? <FcLike size={22} /> : <FaRegHeart size={20} />} <span className='' >{post.likes}</span>
                  </span>
                </div>
                <hr />
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
      <LikesModal theme={theme} likes={likes} showModal={showModal} setModal={setModal} />
    </>
  );
}
