import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import MoreSpinner from '../components/MoreSpinner';
import { useDispatch } from 'react-redux';
import { UserAction } from '../store/UserInfo';

export default function UpdateProfileModal({ setModal, setUser, theme, loading2, handleUpdate, showModal, user,currentUser }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(user.picture || ""); // Preview image
    const dispatch = useDispatch();

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Create preview URL
        }
    };

    // Upload file function
    const handleUpload = async () => {
        if (!file) return alert("Please select a file first.");

        const formData = new FormData();
        formData.append("picture", file);
        formData.append("context", JSON.stringify({ User: { id: localStorage.getItem("userId") } }));
        // console.log(formData)
        try {
            const response = await fetch("https://socialmedia-realtime-backend.onrender.com/upload", {
                method: "POST",
                body: formData,
            });

            // const data = await response.json();
            // console.log(data)
            const data = await response.json();
            // console.log(data);

            if (data?.user?.picture) {
                // console.log("Updated picture:", data.user.picture);
                const updatedUserInfo = {
                    ...currentUser, // Keep existing user details
                    picture: data.user.picture // Update the picture
                };
                dispatch(UserAction.addUserInfo(updatedUserInfo)); // Dispatch updated user info

                setUser((prevUser) => ({ ...prevUser, picture: data.user.picture })); // Update user state
                setPreview(data.user.picture); // Update preview
                setModal(false);
            }

        } catch (error) {
            console.error("Upload Error:", error);
        }
    };
    function formatUrl(input) {
        // console.log(input)
        if (input.startsWith('/uploads')) {
            return `${import.meta.env.VITE_BACKEND_URL}${input}`; // Return as is if it starts with "https"
        }
        else if (input.startsWith("blob:")) {
            return input;

        } else {

            return `/${input}`
        }

    }
    return (
        <>
            <Modal className="border-rounded" show={showModal} onHide={() => setModal(false)} centered scrollable>
                <Modal.Header className={`${theme} b-black d-flex justify-content-center`}>
                    <Modal.Title className={`login-title ${theme}`}>Update Profile</Modal.Title>
                </Modal.Header>
                {loading2 ? <MoreSpinner /> : (
                    <Modal.Body className={`${theme} b-black`}>
                        <div className={`${theme} user-info`}>
                            <strong className={`${theme}-input mx-2`}>First Name</strong>
                            <input
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                type="text"
                                value={user.firstName}
                                placeholder="Firstname"
                                className={`${theme}-input bw-input`}
                            />
                        </div>
                        <div className="user-info">
                            <strong className={`${theme} mx-2`}>Last Name</strong>
                            <input
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                type="text"
                                value={user.lastName}
                                placeholder="Lastname"
                                className={`${theme}-input bw-input`}
                            />
                        </div>
                        <div className="user-info">
                            <strong className={`${theme} mx-2`}>Profile Image</strong>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                            {preview && <img src={formatUrl(preview)} alt="Preview" className="img-thumbnail mt-2" width="100" />}
                        </div>
                        <div className={`${theme} container d-flex justify-content-between`}>
                            <button disabled={loading2} onClick={handleUpload} className={`post-btn ${theme}`}>
                                Upload Image
                            </button>
                            <button disabled={loading2} onClick={handleUpdate} className={`post-btn ${theme}`}>
                                {loading2 ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </Modal.Body>
                )}
            </Modal>
        </>
    );
}
