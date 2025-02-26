import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import gql from "graphql-tag";

import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "../../ThemeContext";
const ACTIVE_STATUS_UPDATED_SUBSCRIPTION = gql`
  subscription ActiveStatusUpdated {
    activeStatusUpdated {
      userId
      isActive
      lastActive
    }
  }
`;
const GET_MESSAGES_QUERY = gql`
  query GetMessages($chatWith: ID!) {
    getMessages(chatWith: $chatWith) {
      id
      senderId
      receiverId
      content
      createdAt
      read
    }
  }`
  ;
const CURRENT_CHATTING_USER = gql`query FindUserById($userId: String!) {
  findUserById(userId: $userId) {
    
    isActive
    lastActive
    id
    firstName
    lastName
    picture
    email
    followers
    following
  }
}`
const MARK_MESSAGES_AS_READ = gql`mutation MarkMessagesAsRead($chatWith: ID!) {
  markMessagesAsRead(chatWith: $chatWith)
}`
  ;
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
}`
  ;


const SEND_MESSAGE_MUTATION = gql`
  mutation Mutation($receiverId: ID!, $content: String!) {
    sendMessage(receiverId: $receiverId, content: $content) {
      id
      senderId
      receiverId
      content
      createdAt
      read
    }
  }`
  ;

const Chat = () => {
    const { theme } = useTheme();
  
  const { username } = useParams(); // Get the username from the route
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const currentUserId = localStorage.getItem("userId"); // Replace with your actual method for getting logged-in user ID
  // console.log(mess)
  const [zoomImage, setZoomImage] = useState(null); // State to manage the zoomed image

  const dispatch = useDispatch();

  // Replace this with a function to get the corresponding user ID for the username
  const chatWithId = getUserIdFromUsername(username);
  // const activeChat = useSelector((state) => state.chat.activeChat);
  const { data, loading, error } = useQuery(GET_MESSAGES_QUERY, {
    fetchPolicy: 'network-only',
    variables: { chatWith: chatWithId },
    onCompleted: (data) => {
      // console.log(data.getMessages);
      setMessages(data.getMessages);
    },
  });
  const [markMessagesAsRead] = useMutation(MARK_MESSAGES_AS_READ);

  useQuery(CURRENT_CHATTING_USER, {
    fetchPolicy: 'network-only',
    variables: { userId: chatWithId },
    onCompleted: (data) => {
      setUser(data.findUserById)
    }
  })

  useEffect(() => {
    const markUnreadMessagesAsRead = async () => {
      const unreadMessageIds = messages
        .some((unread) => !unread.read && unread.senderId === chatWithId)

      if (unreadMessageIds) {
        try {
          await markMessagesAsRead({
            variables: { chatWith: chatWithId },
          });
        } catch (err) {
          console.error("Error marking messages as read:", err);
        }
      }
    };

    markUnreadMessagesAsRead();
  }, [messages, markMessagesAsRead, chatWithId]);
  useSubscription(ACTIVE_STATUS_UPDATED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const updatedStatus = data?.data?.activeStatusUpdated;

      if (!updatedStatus) {
        console.warn("ACTIVE_STATUS_UPDATED_SUBSCRIPTION: No data received");
        return;
      }

      // Update the user state only if it matches the current chat user
      setUser((prevUser) => {
        if (prevUser.id === updatedStatus.userId) {
          return {
            ...prevUser,
            isActive: updatedStatus.isActive,
            lastActive: updatedStatus.lastActive,
          };
        }
        return prevUser;
      });
    },
  });

  useSubscription(MESSAGE_RECEIVED_SUBSCRIPTION, {
    onData: ({ data }) => {
      // console.log(data);
      const newMessage = data?.data?.messageReceived;
      // setChats((prevChats) => {
      if (newMessage.eventType === "NEW_MESSAGE") {
        // console.log(newMessage)

        if (
          newMessage && (newMessage.sender.id === chatWithId || newMessage.sender.id === currentUserId)
        ) {
          setMessages((prev) => {

            // Ensure immutability and maintain the order
            return [...prev, {
              id: newMessage.id,
              senderId: newMessage.sender.id,
              receiverId: newMessage.receiverId,
              content: newMessage.content,
              createdAt: newMessage.createdAt,
              unreadCount: newMessage.unreadCount,
              read: newMessage.read

            }];
          })
        }

      } else if (newMessage?.eventType === "READ_NOTIFICATION") {
        // console.log(newMessage)
        setMessages((prev) => {
          return prev.map((chat) => {
            if (
              chat.senderId === newMessage.chatWith
            ) {
              // Update unreadCount and read fields
              return {
                ...chat,
                unreadCount: 0,
                read: true,
              };
            }
            return chat;
          });
        });
      }
    },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION)

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({
        variables: { receiverId: chatWithId, content: message },
      });
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  function getUserIdFromUsername(input) {
    if (typeof input !== "string") {
      throw new Error("Input must be a string");
    }
    return input.split("@")[0];
  }

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer?.scrollTo(0, chatContainer.scrollHeight);
  };
  const dateConvert = (milisec) => {
    const givenDate = new Date(Number(milisec));
    if (isNaN(givenDate)) return "Invalid date";
    return formatDistanceToNow(givenDate, { addSuffix: true });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  function removeBeforeAt(input) {
    const atIndex = input.indexOf('@');
    if (atIndex !== -1) {
      return input.slice(atIndex + 1); // Remove everything before and including '@'
    }
    // console.log(input)
    return input; // Return the original string if '@' is not found
  }

  const messageStyle = (isCurrentUser, read) => ({
    background: isCurrentUser ? (read ? "#4CAF50" : "#81C784") : "#FFFFFF",
    color: isCurrentUser ? "#FFFFFF" : "#000000",
    borderRadius: "15px",
    padding: "10px 15px",
    margin: isCurrentUser ? "5px auto 5px 80%" : "5px 70% 5px auto",
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    marginTop: "7px"
  });
  const formatUrl = (input) => {
    // console.log(input)
    if (!input || typeof input !== 'string') {
      return "/default.jpg"; // Fallback to a default image
    }
    if (input.startsWith('/uploads')) {
      return `${import.meta.env.VITE_BACKEND_URL}${input}`; // Return as is if it starts with "https"
  }
  else if (input.startsWith("blob:")) {
      return input;

  } else {

      return `/${input}`
  }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setZoomImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`${theme}`} style={{ display: "flex", height: "100vh" }}>
      <div className={`${theme} mobile-width`} style={{ width: "66vw", backgroundColor: "#1e1e1e", color: "#fff", padding: "20px" }}>
        <div className="d-flex">
          <img
            src={formatUrl(user.picture) || "/default.jpg"}
            alt="profile"
            style={{ width: "45px", height: "45px", marginBottom: "7px", borderRadius: "50%", cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              setZoomImage(formatUrl(user.picture) || "/default.jpg");
            }}
          />

          <h3 className="mx-2"> {user.firstName}{user.lastName}</h3>
          {user.isActive && <img style={{
            width: "10px", height: "10px", left: "135px",
            top: "69px", marginTop: "12px"
          }} src="/button.png" alt="online" />}
          {user.isActive === false && user.lastActive !== null && <span style={{ marginTop: "9px" }} className='chat-timestamp '>Active {dateConvert(user.lastActive)}</span>}</div>
        <div
          id="chatContainer"
          style={{
            height: "80%",
            border: "1px solid #333",
            borderRadius: "10px",
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {loading && <p>Loading messages...</p>}
          {error && <p>Error loading messages!</p>}
          {messages.map((msg) => (
            <div
              style={messageStyle(currentUserId === msg.senderId, msg.read) }
              className={`${currentUserId === msg.senderId?"mobile-text-sender":"mobile-text-receiver"}`}
              key={msg.id}
            >
              <span style={{ margin: 0, width: "40px" }}>{msg.content}</span>
              <small style={{ fontSize: "11px", color: "#666", marginLeft: "10px", width: "30px" }}>
                {dateConvert(msg.createdAt)}
              </small>
              {msg.senderId === currentUserId ? <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                {msg.read ?
                  <img style={{ width: "12px" }} src="/double-check_10336035.png" alt="double tick" /> :
                  <img style={{ width: "14px" }} src="/check_5176312.png" alt="single tick" />
                }
              </div> : ""}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "20px",
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: "10px 20px",
              background: "#3f51b5",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
            }}
          >
            Send
          </button>
        </div>
      </div>
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
          aria-label="Zoomed Image"
          aria-hidden={!zoomImage}
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} alt="Zoomed profile" style={{ maxWidth: "80%", maxHeight: "80%", borderRadius: "10px" }} />
        </div>
      )}
    </div>
  );
}

export default Chat;