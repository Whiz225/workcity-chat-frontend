"use client";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useChat } from "../../context/ChatContext";
import { useTheme } from "../../context/ThemeContext";
import { PaperClipIcon, ArrowUpIcon } from "@heroicons/react/outline";
import SpinnerMini from "../UI/SpinnerMini";

export default function ChatWindow({ userId }) {
  const {
    messages,
    activeConversation,
    sendMessage,
    typingUsers,
    onlineUsers,
    sendTypingIndicator,
    sendStopTyping,
  } = useChat();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const { theme } = useTheme();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !attachment) return;

    const formData = new FormData();

    // formData.append("conversation", activeConversation?._id);
    formData.append("conversation", activeConversation);
    if (message) formData.append("content", message);
    if (attachment) formData.append("attachment", attachment);

    setIsLoading(true);
    await sendMessage(formData);
    setIsLoading(false);
    setMessage("");
    setAttachment(null);
  };

  return (
    <div
      className={`flex flex-col h-full ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`p-4 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h2 className="text-xl font-semibold">
          {activeConversation}
          {/* {activeConversation?.otherUser?.name} */}
          {/* {onlineUsers.includes(activeConversation?.otherUser?._id) && ( */}
          {onlineUsers.includes(activeConversation) && (
            <span className="ml-2 text-xs text-green-500">Online</span>
          )}
        </h2>
        {typingUsers.some(
          // (u) => u.userId === activeConversation?.otherUser?._id
          (u) => u.userId === activeConversation
        ) && (
          <p className="text-sm text-gray-500">
            {
              typingUsers.find(
                // (u) => u.userId === activeConversation?.otherUser?._id
                (u) => u.userId === activeConversation
              )?.userName
            }{" "}
            is typing...
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length >= 1 &&
          messages.map((msg) => (
            <Message key={msg._id} message={msg} userId={userId} />
          ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className={`p-4 border-t ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {attachment && (
          <div className="flex items-center mb-2 p-2 bg-blue-50 rounded dark:bg-blue-900/20">
            <PaperClipIcon className="h-5 w-5 text-blue-500" />
            <span className="ml-2 text-sm truncate">{attachment.name}</span>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="ml-auto text-red-500"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex space-x-2">
          <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <PaperClipIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (!isTyping) {
                setIsTyping(true);
                // sendTypingIndicator(activeConversation?._id);
                sendTypingIndicator(activeConversation);
              }
              clearTimeout(window.typingTimeout);
              window.typingTimeout = setTimeout(() => {
                setIsTyping(false);
                sendStopTyping(activeConversation);
                // sendStopTyping(activeConversation?._id);
              }, 2000);
            }}
            className={`flex-1 rounded-full px-4 py-2 focus:outline-none ${
              theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            {!isLoading ? <ArrowUpIcon className="h-5 w-5" /> : <SpinnerMini />}
          </button>
        </div>
      </form>
    </div>
  );
}
