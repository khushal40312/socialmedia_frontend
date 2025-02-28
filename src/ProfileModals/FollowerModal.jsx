import React from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'
import { Modal } from 'react-bootstrap'
import MoreSpinner from '../components/MoreSpinner'
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDropright } from 'react-icons/io';

export default function FollowerModal({ theme, followerlist, fetchMoreDebounced, hasMore ,setModal2 }) {
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
                    {followerlist.map((follower, index) => (
                        <div key={index} className="modal-content-item my-2">
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
                                <button 
                                onClick={() => findProfile({
                                    // username: `${post.author.firstName}${post.author.lastName}`.replace(/\s+/g, '_'),
                                    username: `${follower.id}@${follower.firstName}${follower.lastName}` || 'unknown'
                                  })}
                                  style={
                                    {
                                        position: "relative",
                                        bottom: "22px"
                                    }
                                } className="Follow-btn-modal">
                                   <IoIosArrowDropright />
                                </button>
                            </div>
                            <hr />
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </Modal.Body>
    )
}
