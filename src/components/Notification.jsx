import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Notification = ({ link,picture, message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
 
  return (
    isVisible && (
      <Link
      to={link}
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={onClose}
    >
      <div className="notification-banner">
        <div className="notification-content">
          <strong className="mx-2">{message}</strong>
          <img  style={{ width: "40px", height: "40px", marginBottom: "7px", borderRadius: "50%", cursor: "pointer" }} src={picture||"/default.jpg"} alt="profilepic" />
        </div>
        {/* <button style={{background:"#171717",marginLeft:"14px",borderRadius:"4px",border:"1px solid white",color:"white"}} className="notification-close" onClick={onClose}> */}
          {/* &times;
        </button> */}
      </div>
      </Link>

    )
  );
};

export default Notification;
