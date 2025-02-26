// utils/messageUtils.js

// Filters unread messages for the current user
export const filterUnreadMessages = (messages, currentUserId) =>
    messages.filter((msg) => !msg.read && msg.receiverId === currentUserId);
  
  // Updates chat data with new unread count or message
  export const updateChatData = (chats, newMessage) => {
    const chatIndex = chats.findIndex(chat => chat.username === newMessage.sender.username);
  
    if (chatIndex !== -1) {
      const updatedChats = [...chats];
      const chat = updatedChats[chatIndex];
      updatedChats[chatIndex] = {
        ...chat,
        lastMessage: newMessage.content,
        lastMessageTime: newMessage.createdAt,
        unreadCount: (chat.unreadCount || 0) + 1, // Increment unread count
      };
      return updatedChats;
    }
  
    // If it's a new chat
    return [
      ...chats,
      {
        id: newMessage.id,
        username: newMessage.sender.username,
        firstName: newMessage.sender.firstName,
        lastName: newMessage.sender.lastName,
        picture: newMessage.sender.picture,
        lastMessage: newMessage.content,
        lastMessageTime: newMessage.createdAt,
        unreadCount: 1,
      },
    ];
  };
  
  // Marks messages as read and updates the UI
  export const markMessagesAsRead = (messages, currentUserId, chatWith) =>
    messages.map((msg) =>
      msg.receiverId === currentUserId && msg.senderId === chatWith
        ? { ...msg, read: true }
        : msg
    );
  