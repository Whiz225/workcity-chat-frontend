"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "@/components/UI/Spinner";
import { useChat } from "@/context/ChatContext";

export default function ChatList({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const { conversations, loadConversations, selectConversation, onlineUsers } =
    useChat();

  useEffect(async () => {
    setIsLoading(true);
    await loadConversations();
    setIsLoading(false);
  }, []);

  const getOtherUser = (participants) => {
    return participants.find((p) => p._id !== user._id);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="h-full overflow-y-auto bg-white/10">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {conversations?.map((conversation) => {
          const otherUser = getOtherUser(conversation.participants);
          return (
            <Link
              key={conversation._id}
              href={`/chat/${conversation._id}`}
              className="block p-4 hover:bg-gray-50"
              onClick={() => selectConversation(conversation._id)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {otherUser?.name?.charAt(0) || "U"}
                  </div>
                  {onlineUsers.includes(otherUser?._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {otherUser?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate max-w-xs">
                    {conversation.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="ml-auto bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
