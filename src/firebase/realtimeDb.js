import { realtimeDb } from './firebase';
import { ref, push, set, onValue, update, remove, serverTimestamp } from 'firebase/database';
import { createNotification } from './firestore';

export const getChatId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

export const sendMessage = async (chatId, message, listingId) => {
  const messagesRef = ref(realtimeDb, `messages/${chatId}/messages`);
  const newMessageRef = push(messagesRef);
  
  await set(newMessageRef, {
    ...message,
    created_at: serverTimestamp(),
    is_read: false
  });
  
  // Update last message in chat preview
  const chatRef = ref(realtimeDb, `chats/${chatId}`);
  await update(chatRef, {
    participants: chatId.split('_'),
    listing_id: listingId || null,
    last_message: message.text || "Image",
    last_message_time: serverTimestamp()
  });

  // Create real-time notification for UI outside chat
  const recipientId = chatId.split('_').find(id => id !== message.sender_id);
  if(recipientId) {
      createNotification({
          recipient_id: recipientId,
          type: 'message',
          title: 'New Message',
          subtext: message.text || 'image',
          chat_id: chatId
      });
  }
};

export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = ref(realtimeDb, `messages/${chatId}/messages`);
  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = data ? Object.entries(data).map(([key, msg]) => ({ msg_id: key, ...msg })) : [];
    // Sorting by time
    messages.sort((a, b) => (a.created_at || 0) - (b.created_at || 0));
    callback(messages);
  });
};

export const unsendMessage = async (chatId, messageId) => {
  const messageRef = ref(realtimeDb, `messages/${chatId}/messages/${messageId}`);
  await remove(messageRef);
};

export const clearChat = async (chatId) => {
  const messagesRef = ref(realtimeDb, `messages/${chatId}`);
  const chatRef = ref(realtimeDb, `chats/${chatId}`);
  await remove(messagesRef);
  await remove(chatRef);
};

export const subscribeToChats = (userId, callback) => {
  const chatsRef = ref(realtimeDb, 'chats');
  return onValue(chatsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return callback([]);
    
    // Filter chats where user is participant
    const userChats = Object.entries(data)
      .filter(([chatId]) => chatId.includes(userId))
      .map(([id, chatData]) => ({ id, ...chatData }));
      
    userChats.sort((a, b) => (b.last_message_time || 0) - (a.last_message_time || 0));
    callback(userChats);
  });
};

export const markMessagesRead = async (chatId, userId) => {
    // Only mark messages where sender is NOT the current user
    const messagesRef = ref(realtimeDb, `messages/${chatId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if(!data) return;
      
      const updates = {};
      Object.entries(data).forEach(([key, msg]) => {
          if(msg.sender_id !== userId && !msg.is_read) {
              updates[`${key}/is_read`] = true;
          }
      });
      if(Object.keys(updates).length > 0) {
          update(messagesRef, updates);
      }
    }, { onlyOnce: true });
};
export const subscribeToUnreadCount = (userId, callback) => {
    const chatsRef = ref(realtimeDb, 'chats');
    return onValue(chatsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return callback(0);

        // Find all chat IDs the user is a part of
        const userChatIds = Object.keys(data).filter(id => id.includes(userId));
        
        let totalUnread = 0;
        let checksPending = userChatIds.length;

        if (checksPending === 0) return callback(0);

        userChatIds.forEach(chatId => {
            const messagesRef = ref(realtimeDb, `messages/${chatId}/messages`);
            onValue(messagesRef, (msgSnapshot) => {
                const msgData = msgSnapshot.val();
                if (msgData) {
                    const unreadInChat = Object.values(msgData).filter(
                        msg => msg.sender_id !== userId && !msg.is_read
                    ).length;
                    totalUnread += unreadInChat;
                }
                checksPending--;
                if (checksPending === 0) {
                    callback(totalUnread);
                }
            }, { onlyOnce: true });
        });
    });
};
