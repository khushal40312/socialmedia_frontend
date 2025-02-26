import { gql, useQuery, useSubscription, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Card, ListGroup, Image } from "react-bootstrap";
import toast from "react-hot-toast";
import { useTheme } from "../../ThemeContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MoreSpinner from "../components/MoreSpinner";

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
const READ_NOTIFICATION = gql`
subscription NotificationMarkedRead {
  notificationMarkedRead {
    userId
    read
  }
}`;
const READING_NOTIFICATIONS = gql`
mutation Mutation {
  markNotificationAsRead
}`;
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
const LikedByNotifications = () => {
  const [AllNotification, setNotification] = useState([]);
  const currentUserId = localStorage.getItem("userId"); // Get the current user ID
  const { theme } = useTheme();
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const navigate = useNavigate();

  const dateConvert = (milisec) => {
    const givenDate = new Date(Number(milisec));
    if (isNaN(givenDate)) return "Invalid date";
    return formatDistanceToNow(givenDate, { addSuffix: true });
  };

  // Fetch initial notifications
  const { loading }=useQuery(USER_ALL_NOTIFICATION, {
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
  const [markNotificationAsRead] = useMutation(READING_NOTIFICATIONS);

  useEffect(() => {
    const markUnreadNotificationsAsRead = async () => {
      // Check if there are any unread notifications
      const hasUnreadNotifications = AllNotification.some((notification) => !notification.read);

      if (hasUnreadNotifications) {
        try {
          // Trigger the mutation to mark notifications as read
          await markNotificationAsRead();
        } catch (err) {
          console.error("Error marking notifications as read:", err);
        }
      }
    };

    // Call the function when AllNotification changes
    markUnreadNotificationsAsRead();
  }, [AllNotification, markNotificationAsRead]);

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

  useSubscription(READ_NOTIFICATION, {
    onData: ({ data }) => {
      const newMessage = data?.data?.notificationMarkedRead;

      if (newMessage) {
        // console.log(newMessage);

        setNotification((prevNotifications) =>
          prevNotifications.map((notification) =>
            // Update only if the notification's ID matches or if read is false
            notification.read ? notification : { ...notification, read: true }
          )
        );

      }
    },
  });
}
  // Subscription for real-time updates
 if (isLoggedIn) { useSubscription(NEW_NOTIFICATION, {
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
  });}
  const findProfile = (payload) => {
    const { username } = payload

    navigate(`/${username}`);

  }
  if (loading) {
    return <div style={{marginBottom:"40px"}} className='d-flex justify-content-center mx-5 align-items-center'><MoreSpinner /></div>
  }
  return (
    <div className={`d-flex flex-column ${theme}`} style={{ height: "100vh", width: "100%" }}>
      <div
        className={`d-flex justify-content-center align-items-center ${theme} top-nav`}
        style={{ height: "10vh", borderBottom: "1px solid rgb(47 46 46)" }}
      >
        <h4>Notifications</h4>
      </div>

      <div className={`d-flex justify-content-center ${theme} notification-mobile`} style={{ height: "90vh", overflowY: "auto" }}>
        <Card className={`${theme} notification-inner-mobile`} style={{ width: "50%", borderRadius: "10px" }}>
          <Card.Header className={`text-center ${theme}`} style={{ fontSize: "18px", fontWeight: "bold" }}>
            Your Notifications
          </Card.Header>
          <ListGroup className="flex-column-reverse" variant="flush">
            {AllNotification.map((notification) => (
              <ListGroup.Item
                key={notification.id}
                className={`d-flex align-items-center ${theme}`}
                style={{ padding: "15px", borderBottom: "1px solid rgb(230, 230, 230)" }}
              >
                <Image
                  src={notification.picture || "https://via.placeholder.com/50"}
                  roundedCircle
                  style={{ width: "50px", height: "50px", marginRight: "15px" }}
                />
                <div>
                  <div>
                    <strong onClick={() => findProfile({
                    // username: `${post.author.firstName}${post.author.lastName}`.replace(/\s+/g, '_'),
                    username: `${notification.senderId}@${notification.firstName}${notification.lastName}` || 'unknown'
                  })}>{`${notification.firstName} ${notification.lastName}`}</strong> {notification.type === "LIKE" ? "liked your post" : "Started following you"}
                  </div>
                  <div>
                    {notification.type === "LIKE" && <em style={{color:"yellow"}}>{`"${notification.postTitle}"`}</em>}
                  </div>
                  <small className="text-secondary">{dateConvert(notification.createdAt)}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </div>
    </div>
  );
};

export default LikedByNotifications;
