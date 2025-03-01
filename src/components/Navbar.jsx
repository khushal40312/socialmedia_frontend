import React, { useState, useEffect } from 'react';
import { BiSolidSearch } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { AiFillHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { FaPlus, FaRegHeart, FaMoon } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoPersonSharp, IoChevronBack } from "react-icons/io5";
import { TbMathGreater } from "react-icons/tb";
import { GoSun } from "react-icons/go";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { openAddPostModal } from '../store/modalSlice';
import { useTheme } from '../../ThemeContext';
import { TbMessageCircleFilled } from "react-icons/tb";
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import { FaHeart } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import { TbMessageCircle } from "react-icons/tb";
import { gql, useApolloClient, useQuery, useSubscription } from "@apollo/client";
import toast from 'react-hot-toast';
import Notification from './Notification';
const GET_USER_CHATS = gql`
  query GetUserChats {
    getUserChats {
      id
      unreadCount
      read
   
    }
  }
`;
const MESSAGE_RECEIVED_SUBSCRIPTION = gql`
  subscription MessageReceived {
    messageReceived {
      id
      receiverId
      content
      createdAt
      sender {
        id
        username
        firstName
        lastName
        picture
      }
      unreadCount
      eventType
      chatWith
      read
    }
  }
`;
const NEW_NOTIFICATION = gql`
subscription LikedNotification {
  likedNotification {
    id
    postId
    senderId
    firstName
    lastName
    postTitle
    status
    read
    picture
    createdAt
    type
  }
}
`;
const NEW_NOTIFICATION_FOLLOW = gql`
subscription FollowNotification($userId: String!) {
  followNotification(userId: $userId) {
    id
    postId
    senderId
    firstName
    lastName
    postTitle
    status
    read
    message
    picture
    createdAt
    type
  }
}`;
const READ_NOTIFICATION = gql`
subscription NotificationMarkedRead {
  notificationMarkedRead {
    userId
    read
  }
}`;
const USER_ALL_NOTIFICATION = gql`
query GetNotifications {
  getNotifications {
    id
    type
    userId
    postId
    senderId
    postTitle
    read
    createdAt
    firstName
    lastName
    picture
  }
}
`;
export default function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  const [activeRoute, setActiveRoute] = useState(""); // To track the active route
  const client = useApolloClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { username } = useParams(); // Get username from route
  const [message, setMessage] = useState([])
  const currentUserId = localStorage.getItem("userId"); // Replace with your actual method for getting logged-in user ID
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationIMG, setNotificationIMG] = useState("");
  const [notificationLink, setNotificationLink] = useState("");
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const [AllNotification, setNotification] = useState([]);
  if (isLoggedIn) {
  
  useSubscription(NEW_NOTIFICATION_FOLLOW, {
    variables: { userId: currentUserId }, // Send the userId as a variable
    onData: ({ data }) => {
      const newMessage = data?.data?.followNotification[0];
      console.log(newMessage)
  
      if (!newMessage) return;
  
      setNotification((prevNotifications) => {
        if (newMessage.status === "FOLLOW") {
          // Check if the sender's FOLLOW notification already exists
          const exists = prevNotifications.some(
            (noti) =>
              noti.senderId === newMessage.senderId && 
              noti.type === "FOLLOW"
          );
          if (exists) return prevNotifications; // Prevent duplicates
          return [...prevNotifications, newMessage]; // Append the new follow notification
        } else if (newMessage.status === "UNFOLLOW") {
          // Remove any FOLLOW notification from the same sender
          return prevNotifications.filter(
            (noti) =>
              !(
                noti.senderId === newMessage.senderId && 
                noti.type === "FOLLOW"
              )
          );
        }
        return prevNotifications; // Default case (no changes)
      });
    },
    onError: (error) => {
      console.error("Subscription error:", error);
      toast.error("Failed to fetch new notifications. Please try again.");
    },
  });
}
  if (isLoggedIn) {
    
  useSubscription(NEW_NOTIFICATION, {
    onData: ({ data }) => {
      const newMessage = data?.data?.likedNotification[0];

      if (!newMessage || newMessage.senderId === currentUserId) return; // Skip if sender is the current user

      setNotification((prevNotifications) => {
        if (newMessage.status === "LIKED") {
          const exists = prevNotifications.some((noti) => noti.id === newMessage.id);
          if (exists) return prevNotifications;
          return [...prevNotifications, newMessage];
        } else if (newMessage.status === "UNLIKED") {
          return prevNotifications.filter(
            (noti) =>
              !(noti.postId === newMessage.postId && noti.senderId === newMessage.senderId)
          );
        }
        return prevNotifications;
      });
    },
    onError: (error) => {
      console.error("Subscription error:", error);
      toast.error("Failed to fetch new notifications. Please try again.");
    },
  });
}
if (isLoggedIn) {

  useSubscription(MESSAGE_RECEIVED_SUBSCRIPTION, {

    onData: ({ data }) => {
      const newMessage = data.data.messageReceived;
      console.log(newMessage)
      // console.log("event ttype", newMessage)
      if (newMessage.eventType === "NEW_MESSAGE") {
        if (newMessage.sender.id !== currentUserId) {
          //use it here 
          setNotificationMessage(`New message from ${newMessage.sender.firstName}..`);
          setNotificationIMG(newMessage.sender.picture)
          setNotificationLink(`/inbox/${newMessage.sender.id}@${newMessage.sender.firstName}${newMessage.sender.lastName}`)
          setNotificationVisible(true);
          setMessage((prevChats) => {
            const chatIndex = prevChats.findIndex(chat => chat.id === newMessage.sender.id);
            if (chatIndex !== -1) {
              // return prevChats
              const updatedChats = [...prevChats];
              const chat = updatedChats[chatIndex];
              updatedChats[chatIndex] = {
                ...chat,
                read: newMessage.read,
                unreadCount: newMessage.unreadCount,
              };
              return updatedChats;
            } else {
              // If the chat is not found, add a new chat
              return [
                ...prevChats,
                {
                  id: newMessage.sender.id,
                  unreadCount: newMessage.unreadCount,
                  read: newMessage.read,
                },
              ];
            }

          })
        }
      } else if (newMessage.eventType === "READ_NOTIFICATION") {
        setMessage((prevChats) => {
          const chatIndex2 = prevChats.findIndex(
            chat => chat.id === newMessage.chatWith && newMessage.receiverId === currentUserId  //when im the reader and receiver
          );
          const updatedChats = [...prevChats];
          if (chatIndex2 !== -1) {
            const chat = updatedChats[chatIndex2];
            updatedChats[chatIndex2] = {
              ...chat,
              unreadCount: 0,
              read: true,
            };
            // console.log(updatedChats)
          }
          return updatedChats;
        }

        )
      }
    }
  })
}
if (isLoggedIn) {

  useSubscription(READ_NOTIFICATION, {
    onData: ({ data }) => {
      const newMessage = data?.data?.notificationMarkedRead;
  
      if (newMessage) {
        console.log(newMessage);
  
        setNotification((prevNotifications) =>
          prevNotifications.map((notification) =>
            // Update only if the notification's ID matches or if read is false
            notification.read ? notification : { ...notification, read: true }
          )
        );
      
      }
    },
    
  });}
if (isLoggedIn) {
  
  useQuery(USER_ALL_NOTIFICATION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const filteredNotifications = data.getNotifications.filter(
        (notification) => notification.senderId !== currentUserId
      );
      setNotification(filteredNotifications);
    },
    onError: (error) => {
      console.error("Query error:", error);
      toast.error("Failed to fetch notifications. Please try again.");
    },
  });
}

  useQuery(GET_USER_CHATS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {

      setMessage(data.getUserChats.map(chat => ({
        ...chat,
        unreadCount: chat.read ? 0 : chat.unreadCount, // Ensure read chats have 0 unread count
      })))
    }
  })
  useEffect(() => {
    if (location.pathname === "/profile/threads" || location.pathname === "/profile/replies") {

      setActiveRoute("/profile")
    }
    else if (location.pathname === "/profile/reposts") {
      setActiveRoute("/profile")

    }
    else if (location.pathname === `/inbox/${username}`) {
      setActiveRoute("/inbox")

    } else {
      setActiveRoute(location.pathname);
    }
    // Update active route on route change
  }, [location.pathname]);

  const openModal = () => {
    navigate("/");
    dispatch(openAddPostModal());
  };

  const loggedOut = () => {
    dispatch(logout());
    localStorage.clear();
    client.clearStore();
    dispatch({ type: 'LOGOUT' });
    window.location.reload();
    navigate('/login');
    setOpen(!isOpen);
  };
  const count = message.filter(item => item.read === false && item.unreadCount > 0).length;
  const Noticount = AllNotification.filter(item => item.read === false).length;

  // console.log(count)
  
  const IconLinks = () => (
    <>
    <div  className='nav-links d-flex  nav-list '>
      <Link to='/' className={`${activeRoute === "/" ? "" : "nav-svg"} nav-logo nav-link-res`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
        <div>

          {activeRoute === "/" ? <AiFillHome size={30} /> : <GoHome size={35} />}
        </div></Link>

{/*       <Link style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }} to='/search' className={`${activeRoute === "/search" ? "" : "nav-svg"} nav-logo `}>
        <div className='search-icon-res'>
          {activeRoute === "/search" ? <BiSolidSearch size={35} /> : <FiSearch size={32} />}</div>
      </Link> */}
      <div onClick={openModal} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }} className='nav-logo nav-svg nav-link-res'>
        <div className='plus-mobile'>  <FaPlus size={32} />
        </div></div>
      <Link style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }} to='/notification' className={`${activeRoute === "/notification" ? "" : "nav-svg"} nav-logo nav-link-res`}>
        <div className='heart-back' >  {activeRoute === "/notification" ? <FaHeart size={32} /> : <FaRegHeart size={32} />}
        <Badge style={{ bottom: '10px', right: "12px" }} color="secondary" badgeContent={Noticount} ></Badge></div>
      </Link>
      <Link style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }} to='/profile' className={`${activeRoute === "/profile" ? "" : "nav-svg"} nav-logo nav-link-res`}>
        <div>    {activeRoute === "/profile" ? <IoPersonSharp size={32} /> : <IoPersonOutline size={34} />}</div>
      </Link>
      <Link style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold',marginBottom: "40px"  }} to='/inbox' className={`${activeRoute === "/inbox" ? "" : "nav-svg"} nav-logo nav-link-res`}>
        <div> {activeRoute === "/inbox" ? <TbMessageCircleFilled size={33} /> : <TbMessageCircle size={35} />}
          <Badge style={{ bottom: '10px', right: "12px" }} color="success" badgeContent={count} ></Badge>
        </div>
      </Link>
    
    </div>
      <div  className='hamburger-nav' onClick={() => { setOpen(!isOpen); setOpen2(false); }}  >
      <GiHamburgerMenu size={32} />
    </div>
    </>
  );
  const closeNotification = () => {
    setNotificationVisible(false);
  };
  return (
    <nav className={`nav-class d-flex  align-items-center   ${theme}`}>
      <Notification
        isVisible={isNotificationVisible}
        message={notificationMessage}
        onClose={closeNotification}
        picture={notificationIMG}
        link={notificationLink}
      />
      <div className={`thread-logo my-3 ${theme}`}>
        <svg aria-label="Threads" className="x1ypdohk x13dflua x11xpdln xk4oym4 xus2keu" fill="var(--barcelona-primary-icon)" height="100%" role="img" viewBox="0 0 192 192" width="100%" xmlns="http://www.w3.org/2000/svg"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path></svg>
      </div>

      <IconLinks />

      

      {isOpen && (
        <div className={`logout-section ${theme}`}>
          <strong onClick={() => { setOpen2(true); setOpen(!isOpen); }} className={`${theme} my-2 mx-2`}>
            Appearance <span className='mx-4'><TbMathGreater /></span>
          </strong>
          <strong onClick={loggedOut} className='text-danger my-1 mx-2'>Logout</strong>
        </div>
      )}

      {isOpen2 && (
        <div className={`Appearance-section ${theme} `}>
          <strong onClick={() => { setOpen2(!isOpen2); setOpen(true); }} className='my-1' >
            <IoChevronBack size={30} />
          </strong>
          {theme === 'light' ? <strong onClick={toggleTheme} className={`dark-section `}>
            <strong ><FaMoon size={28} /></strong>
          </strong> :
            <strong onClick={toggleTheme} className={`dark-section `}>
              <strong ><GoSun size={28} /></strong>
            </strong>}
        </div>
      )}
    </nav>
  );
}
