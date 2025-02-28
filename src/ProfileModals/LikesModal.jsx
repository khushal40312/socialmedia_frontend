import React from 'react'
import { Modal } from 'react-bootstrap'
import { IoIosArrowDropright } from 'react-icons/io'
import { useNavigate } from 'react-router-dom';

export default function LikesModal({ likes, theme, showModal, setModal }) {
    

   
    return (
        <Modal className={`border-rounded`}
            show={showModal}
            onHide={() => setModal(false)}
            centered scrollable>
            <Modal.Header className={`${theme} b-black d-flex justify-content-center`}><strong> Likes</strong></Modal.Header>
            <Modal.Body className={`modal-body-follow ${theme}`}>
                <div id="scrollable-content-following">
                    {likes[0]?.likedBy?.map((post, index) => (
                        <div key={index} className="modal-content-item my-2">
                            <div className="following-follower-list d-flex align-items-center justify-content-between ">

                                <div className="mx-2">
                                    <img
                                        className="post-Profile-img mx-1"
                                        src={post.picture  || "default.jpg"}
                                        alt={`${post.firstName}'s profile`}
                                    />
                                    <strong>{post.firstName} {post.lastName}</strong>
                                    <small className="text-secondary d-block">{post.email}</small>
                                </div>
                                <button
                                    onClick={() => findProfile({
                                        // username: `${post.author.firstName}${post.author.lastName}`.replace(/\s+/g, '_'),
                                        username: `${post.id}@${post.firstName}${post.lastName}` || 'unknown'
                                    })}
                                    style={
                                        {
                                            position: "relative",
                                            top: "5px"
                                        }
                                    } className="Follow-btn-modal">
                                    <IoIosArrowDropright />
                                </button>
                            </div>

                            <hr />
                        </div>
                    ))}

                </div>
            </Modal.Body>
        </Modal>
    )
}
