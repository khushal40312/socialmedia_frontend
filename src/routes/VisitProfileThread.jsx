import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { formatDistanceToNow } from 'date-fns';
import { ALTUserPostAction } from '../store/ALTuserposts';



const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: String!) {
    likePost(postId: $postId)
  }
`;
export default function VisitProfileThread() {
    const posts = useSelector((store) => store.altuserposts);
    const userInfoALT = useSelector((store) => store.ALTUser);
    const userInfo = useSelector((store) => store.userALT);
    const dispatch = useDispatch()

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        onCompleted: (data) => {
            console.log(data.likePost); // Message from backend (liked/unliked)
        },
    });
    function dateConvert(milisec) {
        const givenDate = new Date(Number(milisec));
        if (isNaN(givenDate)) return "Invalid date";
        return formatDistanceToNow(givenDate, { addSuffix: true });
    }
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
        dispatch(ALTUserPostAction.setUserPosts(updatedPosts));

        // Trigger the mutation
        likePost({ variables: { postId } });
    };

    const userId = userInfo?.id;
  
    return (
        <div id="scrollable-content2">
            {posts.length === 0 ? (
                <div className="container my-3">
                    <h5 className="text-center text-secondary">This user hasn't posted anything yet.</h5>
                </div>
            ) : (
                
                
                    posts.map((item) => {
                        const isLikedByUser = item.likedBy.some(user => user.id === userId);

                        return (<div key={item.id} className="container my-1">
                            <div >
                                <div className='user-info'>
                                    <img className='post-Profile-img' src={userInfoALT?.picture || "default.jpg"} alt="profile pic" />
                                    <strong style={{ cursor: "pointer" }} className='mx-1'>_{userInfoALT.firstName + userInfoALT.lastName}_</strong>
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
                    })
                
            )}
        </div>
    )

}
