"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "../lib/socket";
import api from "../lib/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message) => {
      if (message.conversation === activeConversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("typing", ({ userId, userName, conversationId }) => {
      if (conversationId === activeConversation?._id) {
        setTypingUsers((prev) => {
          if (!prev.some((u) => u.userId === userId)) {
            return [...prev, { userId, userName }];
          }
          return prev;
        });
      }
    });

    socket.on("stopTyping", (userId) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("onlineUsers");
    };
  }, [socket, activeConversation]);

  const loadConversations = async () => {
    try {
      const res = await api.get("/chat/conversations");
      if (res.data.status !== "success") {
        throw new Error("Error loading conversations");
      }
      setConversations(res.data.data);
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  const selectConversation = async (conversationId) => {
    try {
      const res = await api.get(
        `/chat/conversations/${conversationId}/messages`
      );
      if (res.data.status !== "success") {
        throw new Error("Error selecting conversation");
      }
      setMessages(res.data.data.messages || []);
      setActiveConversation({
        _id: conversationId,
        otherUser: res.data.data.otherUser,
      });
    } catch (err) {
      console.error("Error selecting conversation:", err);
    }
  };

  const sendMessage = async (formData) => {
    if (!activeConversation) return;

    try {
      const res = await api.post("/chat/message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status !== "success") {
        throw new Error("Error sending message");
      }

      const newMessage = res.data.data;
      socket.emit("sendMessage", {
        ...newMessage,
        conversation: activeConversation._id,
      });
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  const sendTypingIndicator = (conversationId) => {
    if (!activeConversation?.otherUser) return;
    socket.emit("typing", {
      conversationId,
      userId: socket.id,
      userName: "Emma225", // Replace with actual username
    });
  };

  const sendStopTyping = (conversationId) => {
    socket.emit("stopTyping", {
      conversationId,
      userId: socket.id,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        typingUsers,
        onlineUsers,
        loadConversations,
        selectConversation,
        sendMessage,
        sendTypingIndicator,
        sendStopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

// "use client";
// import { createContext, useContext, useEffect, useState } from "react";
// import { useSocket } from "../lib/socket";
// import api from "../lib/api";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [typingUsers, setTypingUsers] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const socket = useSocket();

//   // Load conversations when component mounts
//   // useEffect(() => {
//   //   if (socket) {
//   //     loadConversations();
//   //   }
//   // }, [socket]);

//   // Socket event listeners
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("message", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     socket.on("typing", (userId) => {
//       setTypingUsers((prev) => [...prev, userId]);
//     });

//     socket.on("stopTyping", (userId) => {
//       setTypingUsers((prev) => prev.filter((id) => id !== userId));
//     });

//     socket.on("onlineUsers", (users) => {
//       setOnlineUsers(users);
//     });

//     return () => {
//       socket.off("message");
//       socket.off("typing");
//       socket.off("stopTyping");
//       socket.off("onlineUsers");
//     };
//   }, [socket]);

//   const loadConversations = async () => {
//     try {
//       const res = await fetch("/api/chat/conversations", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("res", res);

//       if (!res.ok) throw new Error("Error loading conversations");

//       const { data } = await res.json();

//       if (data.status !== "success")
//         throw new Error("Error loading conversations");

//       console.log("data", data.data);

//       setConversations(data.data);
//     } catch (err) {
//       console.error("Error loading conversations:", err);
//     }
//   };

//   const selectConversation = async (conversationId) => {
//     try {
//       const res = await fetch(
//         // `api/chat/conversations/${conversationId}/messages`,
//         `/api/chat/conversations/${conversationId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("res", res);

//       if (!res.ok) throw new Error("Error selecting conversation");

//       const data = await res.json();

//       if (data.status !== "success")
//         throw new Error("Error selecting conversation");

//       console.log("data", data.data);

//       setMessages(data.data.messages);
//       setActiveConversation(conversationId);
//     } catch (err) {
//       console.log("Error selecting conversation:", err);
//     }
//   };

//   const sendMessage = async (content) => {
//     if (!activeConversation) return;
//     console.log("Message...");

//     try {
//       const res = await fetch(
//         "/api/chat/sendMessage",
//         {
//           conversation: activeConversation,
//           content,
//         },
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("res", res);

//       if (!res.ok) throw new Error("Error sending message");

//       const data = await res.json();

//       if (data.status !== "success") throw new Error("Error sending message");

//       console.log("data", data.data);

//       socket.emit("sendMessage", data.data);
//       setMessages((prev) => [...prev, data]);
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   const sendTypingIndicator = (conversationId) => {
//     socket.emit("typing", { conversationId, userId: socket.id });
//   };

//   const sendStopTyping = (conversationId) => {
//     socket.emit("stopTyping", { conversationId, userId: socket.id });
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         conversations,
//         activeConversation,
//         messages,
//         typingUsers,
//         onlineUsers,
//         loadConversations,
//         selectConversation,
//         sendMessage,
//         sendTypingIndicator,
//         sendStopTyping,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => useContext(ChatContext);
