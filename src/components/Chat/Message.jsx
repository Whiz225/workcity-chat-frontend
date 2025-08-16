"use client";
import { format } from "date-fns";

export default function Message({ message, userId }) {
  const isSender = message?.sender?._id === userId;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <div className="text-sm">{message.content}</div>
        <div
          className={`text-xs mt-1 ${
            isSender ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {format(new Date(message.createdAt), "h:mm a")}
        </div>
      </div>
    </div>
  );
}
