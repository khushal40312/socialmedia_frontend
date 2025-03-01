import React, { useState } from 'react';
import { FaInstagram } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { Link, NavLink, Outlet } from 'react-router-dom';

export default function VisitedProfileHeader({ followers, theme, userInfo,  isFollowByUser, handleFollowToggle, activeTab, setModal2, color }) {
    const [isZoomed, setIsZoomed] = useState(false); // State to control the zoom modal
const data= useSelector((store)=>store.ALTUser)
const followerslist= useSelector((store)=>store.userFollower)
const isfollower= followerslist.some(f=>f.id===localStorage.getItem("userId"))
    const handleImageClick = () => {
        setIsZoomed(true); // Open the zoom modal
    };

    const closeZoomModal = () => {
        setIsZoomed(false); // Close the zoom modal
    };

    return (
        <div className={`d-flex flex-column ${theme}`}>
            <div className={`${theme} d-flex justify-content-center top-nav`} style={{ width: '95vw', height: "10vh" }}>
                <h4 className={` ${theme} my-3`}>Profile</h4>
            </div>
            <div className={` ${theme} d-flex justify-content-center`} style={{ height: "90vh", width: "95vw" }}>
                               <div className={`hrmargin ${theme} profile-mob`} style={{ width: "43vw", borderRadius: "20px", border: '1px solid rgb(47 46 46)' }}>

                    <div className='my-3 d-flex justify-content-between'>
                        <h2 className='my-4 mx-3'>{userInfo.firstName || "Username"}</h2>
                        {/* Profile Picture */}
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
                        <p onClick={() => setModal2(true)} className='my-4 mx-3 text-secondary'> {followers.length} followers </p>
                        <span className='mx-4 my-3'><FaInstagram size={32} /></span>
                    </div>
                    <div className="container d-flex justify-content-between align-items-center">
                        {!isFollowByUser ? (
                            <button
                                className="Follow-btn-profile"
                                onClick={() => handleFollowToggle(userInfo.id)}
                            >
                                Follow
                            </button>
                        ) : (
                            <button
                                className="Unfollow-btn-profile"
                                onClick={() => handleFollowToggle(userInfo.id)}
                            >
                                Unfollow
                            </button>
                        )}
                       {  isfollower? <Link to={`/inbox/${data.id}@${data.firstName+data.lastName}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <button className="Follow-btn-mention">Message</button>
                        </Link>:
                        // <button className="Follow-btn-mention">Mention</button>
                        <span></span>
                    }
                    </div>

                    <div
                        // style={{
                        //     maxWidth: "648px"
                        // }}
                        className={`profile-routes d-flex justify-content-between ${theme}`}
                    >
                        {["Threads", "Replies", "Reposts"].map((tab, index) => (
                            <NavLink
                                key={index}
                                to={tab.toLowerCase()}
                                className={`text-center nav-tab ${activeTab === tab ? "nav-tab-active" : ""}`}
                                style={({ isActive }) => ({
                                    color: isActive ? color : "grey",
                                    borderBottom: isActive ? `3px solid ${color}` : "none",
                                    cursor: "pointer",
                                    paddingBottom: "4px",
                                    textDecoration: "none",
                                    width: "255px",
                                    fontWeight: isActive ? "bolder" : "normal",
                                })}
                            >
                                {tab}
                            </NavLink>
                        ))}
                    </div>
                    <hr />
                    <Outlet />
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
                        src={userInfo?.picture || "default.jpg"}
                        alt="Zoomed Profile"
                        style={{
                            maxHeight: '80%',
                            maxWidth: '80%',
                            objectFit: 'contain',
                            borderRadius: '10px'
                        }}
                    />
                </div>
            )}
        </div>
    );
}
