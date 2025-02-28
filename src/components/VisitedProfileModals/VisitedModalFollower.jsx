import React from 'react'
import { IoIosArrowDropright } from "react-icons/io";
import InfiniteScroll from 'react-infinite-scroll-component'
import { Modal } from 'react-bootstrap'

import MoreSpinner from '../MoreSpinner'
import { PiSmileyWinkFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

export default function VisitedModalFollower({setModal2,myId, theme, followerlist, fetchMoreDebounced, hasMore, data2 }) {
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
                    dataLength={followerlist.length} // Length of the current list
                    next={fetchMoreDebounced} // Function to fetch more data
                    hasMore={hasMore} // Boolean to indicate if more data is available
                    loader={<MoreSpinner />} // Component to show while loading more
                    scrollableTarget="scrollable-content-following" // ID of the scrollable target container
                    endMessage={
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <b className="text-white">No more Followers...</b>

                        </div>
                    }
                >
                    {followerlist.map((follower, index) => {
                        const isCurrentUserFollowers = follower.id === myId;
                        return (<div key={index} className="modal-content-item my-2">
                            <div className="following-follower-list d-flex align-items-center">
                                <img
                                    className="post-Profile-img"
                                    src={follower.picture || "default.jpg"}
                                    alt={`${follower.firstName}'s profile`}
                                />
                                <div className="mx-2">
                                    <strong>{follower.firstName} {follower.lastName}</strong>
                                    <small className="text-secondary d-block">{follower.email}</small>
                                </div>
                            </div>
                            <div className="following-follower-list2 d-flex justify-content-between align-items-center mt-2">
                                <strong className='mx-3'>Followers: {follower.followers}</strong>
                                {!isCurrentUserFollowers ?  // Show button only if the user is not following
                                        <button
                                        onClick={() => findProfile({
                                            // username: `${post.author.firstName}${post.author.lastName}`.replace(/\s+/g, '_'),
                                            username: `${follower.id}@${follower.firstName}${follower.lastName}` || 'unknown'
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
                        </div>)
                    })}
                </InfiniteScroll>
            </div>
        </Modal.Body>
    )
}
