import React, { useState } from 'react';
import ProfileTabs from './ProfileTabs';
import { FaInstagram } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';

function ProfileHeader({ theme, userInfo, data, setModal, activeTab, setActiveTab, color, setModal2 }) {
    const [isZoomed, setIsZoomed] = useState(false); // State to control the zoom modal



    const handleImageClick = () => {
        setIsZoomed(true); // Open the zoom modal
    };

    const closeZoomModal = () => {
        setIsZoomed(false); // Close the zoom modal
    };

    return (
        <>
            <div className={`d-flex flex-column ${theme}  main-post-res`}>
                <div className={`${theme} d-flex justify-content-center top-nav`} style={{ width: '95vw', height: "10vh" }}>
                    <h4 className={` ${theme} my-3`}>Profile</h4>
                </div>
                <div className={` ${theme} d-flex justify-content-center profile-mobile`} style={{ height: "90vh", width: "95vw" }}>
                    <div className={`hrmargin ${theme} profile-mob`} style={{ width: "43vw", borderRadius: "20px", border: '1px solid rgb(47 46 46)' }}>
                        <div className='my-3 d-flex justify-content-between'>
                            <h2 className='my-4 mx-3'>{userInfo.firstName || "Username"}</h2>
                            {/* Profile Picture with Zoom */}
                            <img
                                className='mx-4 my-2'
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "60px",
                                    objectFit: "cover",
                                    cursor: "pointer"
                                }}
                                src={userInfo?.picture || "default.jpg"}
                                alt="Profile"
                                onClick={handleImageClick} // Click to zoom
                            />
                        </div>
                        <div className='my-3 d-flex justify-content-between'>
                            <p onClick={() => setModal2(true)} className='my-4 mx-3 text-secondary'>
                                {data?.getCurrentLoggedInUser?.followers} followers
                            </p>
                            <span className='mx-4 my-3'><FaInstagram size={32} /></span>
                        </div>
                        <div
                            onClick={() => setModal(true)}
                            style={{
                                marginLeft: "20px",
                                height: "45px",
                                width: "40vw",
                                borderRadius: "10px",
                                border: '1px solid rgb(47 46 46)'
                            }}
                            className={`${theme} my-3 text-center d-flex justify-content-center align-items-center`}
                        >
                            <strong>Edit Profile</strong>
                        </div>

                        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} color={color} theme={theme} />
                    </div>
                </div>
            </div>

            {/* Zoom Modal */}
            {isZoomed && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={closeZoomModal} // Close modal on click
                >
                    <img
                        src={`${(userInfo?.picture)}` || "default.jpg"}
                        alt="Zoomed Profile"
                        style={{
                            maxHeight: '70%',
                            maxWidth: '70%',
                            objectFit: 'contain',
                            borderRadius: '10%'
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default ProfileHeader;
