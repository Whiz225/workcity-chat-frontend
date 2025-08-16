import { cookies } from "next/headers";
import api from "@/lib/api";

export async function getAllConversations() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token");

  const res = await api.get("/chat/conversations", {
    credentials: "include",
    headers: {
      Cookie: `jwt=${jwt?.value}`,
      "Content-Type": "application/json",
    },
  });

  if (res.data.status !== "success") {
    const error = res.data.response?.message;

    if (process.env.NODE_ENV !== "production") {
      console.error("Unable to load conversations", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
    }

    throw new Error(
      process.env.NODE_ENV !== "production" ||
      error.message === "No response from server. Please check your connection."
        ? error.message
        : "Unable to load conversations. Please try again."
    );
  }

  return res.data;
}

export async function getConversationById(conversationId) {
  console.log("id...", conversationId);
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("token");

    const res = await api.get(
      `/chat/conversations/${conversationId}/messages`,
      {
        credentials: "include",
        headers: {
          Cookie: `jwt=${jwt?.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res?.data?.status !== "success") {
      const error = res.data.response?.message;

      if (process.env.NODE_ENV !== "production") {
        console.error("Unable to load conversation", {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
        });
      }

      throw new Error(
        process.env.NODE_ENV !== "production" ||
        error.message ===
          "No response from server. Please check your connection."
          ? error.message
          : "Unable to load conversation. Please try again."
      );
    }

    return res.data;
  } catch (error) {
    console.log(error.message);
  }
}

// export async function postMessage(messageData) {
//   const cookieStore = cookies();
//   const jwt = cookieStore.get("token");

//   const formData = new FormData();
//   if (messageData.conversation)
//     formData.append("conversation", messageData.conversation);
//   if (messageData.content) formData.append("content", messageData.content);
//   if (messageData.attachment)
//     formData.append("attachment", messageData.attachment);

//   const res = await api.post("/chat/messages", formData, {
//     credentials: "include",
//     headers: {
//       Cookie: `token=${jwt?.value}`,
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   if (res.data.status !== "success") {
//     throw new Error(res.data.message || "Failed to send message");
//   }

//   return res.data;
// }

export async function postMessage(messageData) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("token");

  const formData = new FormData();
  if (messageData.conversation)
    formData.append("conversation", messageData.conversation);
  if (messageData.content) formData.append("content", messageData.content);
  if (messageData.attachment)
    formData.append("attachment", messageData.attachment);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages`, {
    method: "POST",
    body: formData,
    headers: {
      Cookie: `token=${jwt?.value}`,
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("res", res);

  if (!res.ok) throw new Error("Error sending message");
  const data = await res.json();
  if (data.status !== "success") throw new Error("Error sending message");

  console.log("data", data.data);

  return data.data;
}
