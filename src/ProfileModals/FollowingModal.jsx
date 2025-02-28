import React from 'react'
import { Modal } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import MoreSpinner from '../components/MoreSpinner'
import { IoIosArrowDropright } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'


export default function FollowingModal({setModal2, theme, followinglist, fetchMoreDebounced2, hasMore2 }) {
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
                    {followinglist.map((following, index) => (
                        <div key={index} className="modal-content-item my-2">
                            <div className="following-follower-list d-flex align-items-center">
                                <img
                                    className="post-Profile-img"
                                    src={following.picture || "default.jpg"}
                                    alt={`${following.firstName}'s profile`}
                                />
                                <div className="mx-2">
                                    <strong>{following.firstName} {following.lastName}</strong>
                                    <small className="text-secondary d-block">{following.email}</small>
                                </div>
                            </div>
                            <div className="following-follower-list2 d-flex justify-content-between align-items-center mt-2">
                                <strong className='mx-3' >Followers: {following.followers}</strong>
                                <button 
                                onClick={() => findProfile({
                                    // username: `${post.author.firstName}${post.author.lastName}`.replace(/\s+/g, '_'),
                                    username: `${following.id}@${following.firstName}${following.lastName}` || 'unknown'
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
