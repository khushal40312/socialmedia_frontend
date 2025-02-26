import React from 'react'
import { Modal } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import MoreSpinner from '../MoreSpinner'
import { IoIosArrowDropright } from 'react-icons/io';
import { PiSmileyWinkFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
export default function VisitedModalFollowings({ myId,theme, followinglist, fetchMoreDebounced2, hasMore2, formatUrl }) {
    const navigate = useNavigate();
    const findProfile = (payload) => {
        const { username } = payload
       
        navigate(`/${username}`);
        setModal2(false)
      }
    return (
        <Modal.Body className={`modal-body-follow ${theme}`}>
            <div id="scrollable-content-following">
                <InfiniteScroll
                    dataLength={followinglist.length} // Length of the current list
                    next={fetchMoreDebounced2} // Function to fetch more data
                    hasMore={hasMore2} // Boolean to indicate if more data is available
                    loader={<MoreSpinner />} // Component to show while loading more
                    scrollableTarget="scrollable-content-following" // ID of the scrollable target container
                    endMessage={
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <b className="text-white">No more Following...</b>
                        </div>
                    }
                >
                    {followinglist.map((following, index) => {
                        // Check if the logged-in user is following this specific user
                        const isCurrentUserFollowing = following.id === myId;

                        return (
                            <div key={index} className="modal-content-item my-2">
                                <div className="following-follower-list d-flex align-items-center">
                                    <img
                                        className="post-Profile-img"
                                        src={`${formatUrl(following.picture)}` || "default.jpg"}
                                        alt={`${following.firstName}'s profile`}
                                    />
                                    <div className="mx-2">
                                        <strong>{following.firstName} {following.lastName}</strong>
                                        <small className="text-secondary d-block">{following.email}</small>
                                    </div>
                                </div>
                                <div className="following-follower-list2 d-flex justify-content-between align-items-center mt-2">
                                    <strong className="mx-3">Followers: {following.followers}</strong>
                                    {!isCurrentUserFollowing ?  // Show button only if the user is not following
                                        <button
                                        onClick={() => findProfile({
                                            // username: `${post.author.firstName}${post.author.lastName}`.replace(/\s+/g, '_'),
                                            username: `${following.id}@${following.firstName}${following.lastName}` || 'unknown'
                                          })}
                                            style={{

                                                position: "relative",
                                                bottom: "22px"
                                            }}
                                            className="Follow-btn-modal follow-btn-list"
                                        >
                                           <IoIosArrowDropright />

                                        </button>:<div style={{
                                                position: "relative",
                                                bottom: "22px"
                                            }}  className='mx-4 '> <PiSmileyWinkFill size={40} /> </div>}
                                    
                                </div>
                                <hr />
                            </div>
                        );
                    })}
                </InfiniteScroll>
            </div>
        </Modal.Body>
    );
}
