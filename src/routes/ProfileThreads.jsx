import { gql, useMutation } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import React from 'react'
import { UserPostAction } from '../store/UserPosts';

import { useDispatch, useSelector } from 'react-redux';
const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: String!) {
    likePost(postId: $postId)
  }
`;
export default function ProfileThreads() {
    const posts = useSelector(store => store.userPost);
  
    const dispatch = useDispatch();
    const userInfo = useSelector(store => store.user);
    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        onCompleted: (data) => {
            // Message from backend (liked/unliked)
        },
    });
    const handleLikeToggle = (postId) => {
        const postIndex = posts.findIndex((post) => post.id === postId);
        if (postIndex === -1) return;

        const isLikedByUser = posts[postIndex].likedBy.some((user) => user.id === userId);

        // Create a deep copy of the specific post to update
        const updatedPost = { ...posts[postIndex] };

        // Optimistic update: Toggle like/unlike
        if (isLikedByUser) {
            updatedPost.likes -= 1;
            updatedPost.likedBy = updatedPost.likedBy.filter((user) => user.id !== userId);
        } else {
            updatedPost.likes += 1;
            updatedPost.likedBy = [...updatedPost.likedBy, { id: userId }];
        }

        // Update the Redux state with the new posts array
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = updatedPost;

        // Dispatch the updated posts array
        dispatch(UserPostAction.setUserPosts(updatedPosts));

        // Trigger the mutation
        likePost({ variables: { postId } });
    };
    function dateConvert(milisec) {
        const givenDate = new Date(Number(milisec));
        if (isNaN(givenDate)) return "Invalid date";
        return formatDistanceToNow(givenDate, { addSuffix: true });
    }
    const userId = userInfo?.id;

    return (

        <div id="scrollable-content2">
            {posts.map((item) => {
                const isLikedByUser = item.likedBy.some(user => user.id === userId);

                return (<div key={item.id} className="container my-1">
                    <div >
                        <div className='user-info'>
                            <img className='post-Profile-img' src={userInfo.picture || "default.jpg"} alt="profile pic" />
                            <strong className='mx-1'>_{userInfo.firstName + userInfo.lastName}_</strong>
                            <span className='mx-1 text-secondary'>
                                {dateConvert(item.createdAt)}
                            </span>
                        </div>
                        <h5 className='mx-3 my-1'>{item.title}</h5>
                        <div className='container'>
                            <p>{item.content}</p>
                            <span style={{ cursor: "pointer" }} className='mx-2' onClick={() => handleLikeToggle(item.id)} >
                                {isLikedByUser ? <FcLike size={22} /> : <FaRegHeart size={20} />}{item.likes}
                            </span>
                        </div>
                        <hr />
                    </div>
                </div>)
            })}
        </div>)
}
