import React from 'react'
// import { NavLink } from 'react-bootstrap'
import { Outlet,NavLink } from 'react-router-dom'

export default function ProfileTabs({activeTab,setActiveTab,color,theme}) {
    
    return (
        <>
            <div
                // style={{ width: "649px" }}
                className={`profile-routes d-flex justify-content-between ${theme}`}
            >
                {["Threads", "Replies", "Reposts"].map((tab) => (
                    <NavLink
                        className={`text-center nav-tab ${activeTab === tab ? "nav-tab-active" : ""}`}
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            color: activeTab === tab ? color : "grey",
                            borderBottom: activeTab === tab ? `3px solid ${color}` : "none",

                            cursor: "pointer",
                            paddingBottom: "4px",
                            textDecoration: "none",
                            width: "255px",
                            fontWeight: activeTab === tab ? "bolder" : "normal",
                        }}
                        to={tab.toLowerCase()}
                    >
                        {tab}
                    </NavLink>
                ))}
            </div>
            <hr />
            <Outlet />
        </>
    )
}
