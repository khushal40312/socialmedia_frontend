
// Home.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openAddPostModal, closeAddPostModal } from '../store/modalSlice';
import HomePosts from './HomePosts';
import { Modal } from 'react-bootstrap';
import { gql, useMutation, useQuery } from '@apollo/client';
import MoreSpinner from './MoreSpinner';
import toast from 'react-hot-toast';
import { useTheme } from '../../ThemeContext';

export default function Home() {
    const dispatch = useDispatch();
    const showModal = useSelector((state) => state.modal.isAddPostModalOpen);
    const USER_QUERY = gql`
        query GetCurrentLoggedInUser {
            getCurrentLoggedInUser {
                firstName
                lastName
                email
             picture
                id
            }
        }
    `;
    const ADD_POST = gql`
    mutation CreatePost($title: String!, $content: String!) {
        createPost(title: $title, content: $content) {
            title
          content
        }
      }
`;
    const { theme } = useTheme();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [createPost, { loading2 }] = useMutation(ADD_POST);

    const addPost = async () => {
        try {
            await createPost({ variables: { title, content } });
            dispatch(closeAddPostModal());
            toast.success("Posted");
        } catch (err) {
            console.error("Posting error:", err);
            toast.error(err.message);
        }
    };

    const { loading, data, error } = useQuery(USER_QUERY);

    useEffect(() => {
        if (error) {
            toast.error(error.messiage);
        }
    }, [error]);

 
    return (
        <>
            <div className={`${theme} d-flex justify-content-center home-responsive`} style={{ height: "90vh", width: "95vw" }}>
                <div className={`${theme} post-slide`} style={{ width: "43vw", borderRadius: "20px", border: '1px solid rgb(47 46 46)' }}>
                    {loading ? (
                        <MoreSpinner />
                    ) : (
                        <div className="post-box">
                            <img
                                className="Profile-img"
                                src={data?.getCurrentLoggedInUser?.picture || "default.jpg"}
                                alt="profile pic"
                            />
                            <p onClick={() => dispatch(openAddPostModal())}>What's new?</p>
                            <button style={{ backgroundColor: "#1d1c1c" }} className={`post-btn ${theme} `}>
                                Post
                            </button>
                        </div>
                    )}
                    <hr />
                    <HomePosts />
                </div>
            </div>

            <Modal className='border-rounded' show={showModal} onHide={() => dispatch(closeAddPostModal())} centered scrollable>
                <Modal.Header className={`b-black ${theme} `}>
                    <button onClick={() => dispatch(closeAddPostModal())} className={`post-btn ${theme} `}>
                        Close
                    </button>
                    <Modal.Title className={`posting-title ${theme}`}>New Thread</Modal.Title>
                </Modal.Header>
                {loading2 ? (
                    <MoreSpinner />
                ) : (
                    <Modal.Body className={`b-black ${theme}`}>
                        <div className="user-info">
                            <img
                                className="Profile-img"
                                src={data?.getCurrentLoggedInUser?.picture || "default.jpg"}
                                alt="profile pic"
                            />
                            <strong className={`mx-1 ${theme}`}>{data?.getCurrentLoggedInUser?.firstName || "Username"}</strong>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" className={`bw-input ${theme}-input `} />
                        </div>
                        <div className={`container ${theme}`}>
                            <strong>Content</strong>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's New" className={`bw-textarea ${theme}-textarea`}></textarea>
                        </div>
                        <button onClick={addPost} style={{ marginLeft: "390px" }} className={`post-btn ${theme}`}>
                            Post
                        </button>
                    </Modal.Body>
                )}
            </Modal>
        </>
    );
}
