import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { useQuery, useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../../ThemeContext';
import MoreSpinner from '../components/MoreSpinner';

const GET_USER_CHATS = gql`
  query GetUserChats {
    getUserChats {
      id
      username
      firstName
      lastName
      picture
      lastMessage
      lastMessageTime
      unreadCount
      read
      isActive
    lastActive
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
const ACTIVE_STATUS_UPDATED_SUBSCRIPTION = gql`
  subscription ActiveStatusUpdated {
    activeStatusUpdated {
      userId
      isActive
      lastActive
    }
  }
`;

export default function Inbox() {
  const { username } = useParams(); // Get username from route
  const [activeTab, setActiveTab] = useState(false);
  const location = useLocation();
  const currentUserId = localStorage.getItem("userId"); // Replace with your actual method for getting logged-in user ID
  const { theme } = useTheme();
  // Track if screen is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  // Resize event listener to update state
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [chats, setChats] = useState([]);
  const [zoomImage, setZoomImage] = useState(null); // State to manage the zoomed image

  // const followerofLogger = useSelector((store) => store.Inboxfollower);
 const { loading }=useQuery(GET_USER_CHATS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      // console.log(data.getUserChats)
      setChats(data.getUserChats.map(chat => ({
        ...chat,
        unreadCount: chat.read ? 0 : chat.unreadCount, // Ensure read chats have 0 unread count
      })));
    },
  });
  useSubscription(ACTIVE_STATUS_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const updatedStatus = data.data.activeStatusUpdated;

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id === updatedStatus.userId) {
            return {
              ...chat,
              isActive: updatedStatus.isActive,
              lastActive: updatedStatus.lastActive,
            };
          }
          return chat;
        });
        return updatedChats;
      });
    },
  });

  useSubscription(MESSAGE_RECEIVED_SUBSCRIPTION, {

    onData: ({ data }) => {
      const newMessage = data.data.messageReceived;
      // console.log("event ttype", newMessage)
      if (newMessage.eventType === "NEW_MESSAGE") {
        // console.log(newMessage);

        if (newMessage.sender.id !== currentUserId) {
          setChats((prevChats) => {
            const chatIndex = prevChats.findIndex(chat => chat.id === newMessage.sender.id);

            if (chatIndex !== -1) {
              const updatedChats = [...prevChats];
              const chat = updatedChats[chatIndex];
              updatedChats[chatIndex] = {
                ...chat,
                lastMessage: newMessage.content,
                lastMessageTime: newMessage.createdAt,
                unreadCount: newMessage.unreadCount,
              };
              return updatedChats;
            } else {
              // If the chat is not found, add a new chat
              return [
                ...prevChats,
                {
                  id: newMessage.id,
                  username: newMessage.sender.username,
                  firstName: newMessage.sender.firstName,
                  lastName: newMessage.sender.lastName,
                  picture: newMessage.sender.picture,
                  lastMessage: newMessage.content,
                  lastMessageTime: newMessage.createdAt,
                  unreadCount: newMessage.unreadCount,
                  read: newMessage.read,
                },
              ];
            }
          });
        } else if (newMessage.sender.id === currentUserId) {
          setChats((prevChats) => {

            const chatIndex = prevChats.findIndex(chat => chat.id === newMessage.receiverId);

            if (chatIndex !== -1) {
              const updatedChats = [...prevChats];
              const chat = updatedChats[chatIndex];
              updatedChats[chatIndex] = {
                ...chat,
                unreadCount: 0,
                read: false,
                lastMessageTime: newMessage.createdAt,
                lastMessage: newMessage.content,


              };
              return updatedChats;
            }
            return prevChats; // If the chat doesn't exist, return the previous state unchanged
          });
        }
      } else if (newMessage.eventType === "READ_NOTIFICATION") {
        setChats((prevChats) => {
          const chatIndex = prevChats.findIndex(
            chat => chat.id === newMessage.receiverId && newMessage.chatWith === currentUserId
          );
          const chatIndex2 = prevChats.findIndex(
            chat => chat.id === newMessage.chatWith && newMessage.receiverId === currentUserId  //when im the reader and receiver
          );

          const updatedChats = [...prevChats];

          if (chatIndex !== -1) {
            const chat = updatedChats[chatIndex];
            updatedChats[chatIndex] = {
              ...chat,
              unreadCount: 0,
              read: true,
            };
          } else if (chatIndex2 !== -1) {
            const chat = updatedChats[chatIndex2];
            updatedChats[chatIndex2] = {
              ...chat,
              unreadCount: 0,
              read: true,
              receiverId: newMessage.receiverId
            };
            // console.log(updatedChats)
          }

          return updatedChats; // Return updated state, or the unchanged state if no updates were made
        });
      }

    },
  });

  const dateConvert = (milisec) => {
    const givenDate = new Date(Number(milisec));
    if (isNaN(givenDate)) return "Invalid date";
    return formatDistanceToNow(givenDate, { addSuffix: true });
  };


  const chatss = chats.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  // console.log(chatss)
  useEffect(() => {
    setActiveTab(location.pathname === `/inbox/${username}`);
  }, [location.pathname]);
if (loading) {
  return <div style={{marginBottom:"40px"}} className='d-flex justify-content-center mx-5 align-items-center'><MoreSpinner /></div>
}
  return (
    <div className={`${theme}`} style={{ display: "flex", height: "100vh", width: '95vw' }}>
      {(!isMobile || !username) && (<div className={`${theme} remove-padding `} style={{ width: isMobile ? "100%" : "30%", backgroundColor: "#121212", color: "#fff", overflowY: "auto", padding: "10px" }}>
        <h2 className='heading-center'>Messages</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {chatss.map((chat) => (
            <li className='inbox-list' key={chat.id} style={{ margin: "10px 0", cursor: "pointer" }}>
              <Link
                to={`/inbox/${chat.id}@${chat.firstName}${chat.lastName}`}
                style={{ textDecoration: "none", color: "inherit" }}
                className={`${theme}`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "5px",
                    padding: "0 7px",
                    background: location.pathname.includes(chat.id) ? "rgb(71 70 70)" : "transparent",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={chat?.picture || "/default.jpg"}
                      alt="profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        border: "2px solid black"
                      }}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation
                        setZoomImage(chat?.picture)
                      }}
                    />
                    {chat.isActive && (
                      <img
                        style={{
                          width: "16px",
                          height: "16px",
                          position: "absolute",
                          // border: " 2px solid black",
                          left: "35px",
                          borderRadius: "50%",
                          bottom: "1px"
                        }}
                        src="/button.png"
                        alt="online"
                      />
                    )}
                  </div>

                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {chat.firstName} {chat.lastName}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: chat.unreadCount > 0 ? "white" : 'grey', fontWeight: chat.unreadCount > 0 ? "bold" : "normal" }}>
                      {chat.unreadCount == 0 && chat.read === false || chat.lastMessage}
                      {chat.unreadCount == 0 && chat.read === false && <span style={{ fontWeight: "bold", color: "grey", fontSize: "13px" }} className=" mx-2">Sent</span>}

                    </p>
                    {chat.unreadCount == 0 && chat.read === false && <span className="chat-timestamp">{dateConvert(chat.lastMessageTime)}</span>}
                    {chat.unreadCount === 0 && chat.read === true && <span className="chat-timestamp ">no Unread Message</span>}


                    {chat.unreadCount > 0 && (
                      <span
                        style={{
                          // marginLeft: "54px",
                          backgroundColor: "#428d27",
                          color: "white",
                          padding: "2px 5px",
                          borderRadius: "56%",
                          fontSize: "10px"
                        }}
                      >
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  {chat.isActive === false && chat.lastActive !== null && <span style={{ position: "relative", left: "10px" }} className='chat-timestamp '>Active {dateConvert(chat.lastActive)}</span>}

                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>)}
      {(!isMobile || username) ? (
        <Outlet />
      ) : (
        <div style={{
          width: "70%",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          display: !isMobile?"flex":"none",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <p>Select a chat to start messaging</p>
        </div>
      )}
      {zoomImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} alt="Zoomed profile" style={{ maxWidth: "80%", maxHeight: "80%", borderRadius: "10px" }} />
        </div>
      )}
    </div>
  );
}
