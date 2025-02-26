import React from 'react';
import { Modal } from 'react-bootstrap';




export default function VisitedProfModalHeader({ theme, activeTab2, setActiveTab2, color2, data }) {
    const followersCount = data?.findUserProfile?.followers ||0;
    const followingCount = data?.findUserProfile?.following || 0;

    return (
        <Modal.Header className={`${theme} b-black d-flex justify-content-center`}>
            {["Followers", "Following"].map((tab) => (
                <div
                    className={`text-center nav-tab ${activeTab2 === tab ? "nav-tab-active" : ""}`}
                    key={tab}
                    onClick={() => setActiveTab2(tab)}
                    style={{
                        color: activeTab2 === tab ? color2 : "grey",
                        borderBottom: activeTab2 === tab ? `3px solid ${color2}` : "none",
                        cursor: "pointer",
                        paddingBottom: "4px",
                        textDecoration: "none",
                        width: "255px",
                        fontWeight: activeTab2 === tab ? "bolder" : "normal",
                    }}
                >
                    {tab} {tab === "Followers" ? followersCount : followingCount}
                </div>
            ))}
        </Modal.Header>
    );
}
