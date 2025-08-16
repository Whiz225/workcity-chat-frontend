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
      const res = await fetch("/api/chat/conversations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error loading conversations");
      const { data } = await res.json();

      if (data.status !== "success")
        throw new Error("Error loading conversations");

      setConversations(data.data);
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  const selectConversation = async (conversationId) => {
    try {
      const res = await fetch(
        // `api/chat/conversations/${conversationId}/messages`,
        `/api/chat/conversations/${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Error selecting conversation");
      const data = await res.json();
      if (data.status !== "success")
        throw new Error("Error selecting conversation");

      setMessages(data.data.messages);
      setActiveConversation(conversationId);
    } catch (err) {
      console.log("Error selecting conversation:", err);
    }
  };

  const sendMessage = async (formData) => {
    if (!activeConversation) return;
    console.log("Message...");

    try {
      const res = await fetch("/api/chat/sendMessage", {
        method: "POST",
        body: formData,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });

      console.log("res", res);

      if (!res.ok) throw new Error("Error sending message");

      const data = await res.json();

      if (data.status !== "success") throw new Error("Error sending message");

      console.log("data", data.data);

      socket.emit("sendMessage", data.data);
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const sendTypingIndicator = (conversationId) => {
    if (!activeConversation?.otherUser) return;
    socket.emit("typing", {
      conversationId,
      userId: socket.id,
      userName: "Emma225",
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
