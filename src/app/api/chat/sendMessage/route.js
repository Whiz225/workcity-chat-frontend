import { postMessage } from "@/lib/data-service";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const formData = await request.formData();
    
    const conversation = formData.get("conversation");
    const content = formData.get("content");
    const attachment = formData.get("attachment");

    if (!conversation) {
      return Response.json(
        { error: "Conversation is required" },
        { status: 400 }
      );
    }

    const messageData = {
      conversation,
      ...(content && { content }),
      ...(attachment && { attachment })
    };

    const { data } = await postMessage(messageData);

    return Response.json({ data, status: "success" });
  } catch (error) {
    console.error("Failed to send message:", error);
    return Response.json(
      { 
        error: error.message || "Error sending message",
        ...(process.env.NODE_ENV !== "production" && {
          details: error.stack
        })
      },
      { status: 500 }
    );
  }
}


// import { postMessage } from "@/lib/data-service";
// import { cookies } from "next/headers";

// export async function POST({ request }) {
//   console.log("MMMMM");
//   try {
//     const { conversation, content } = await request.json();
//     console.log("MMM222", conversation, content);

//     if (!conversation || !content) {
//       return Response.json(
//         { error: "Conversation and Content are required" },
//         { status: 400 }
//       );
//     }

//     const { data } = await postMessage({ conversation, content });

//     console.log("data", data);

//     return Response.json({ data, status: "success" });
//   } catch (error) {
//     // Development logging
//     if (process.env.NODE_ENV !== "production") {
//       console.error("Failed to send:", {
//         message: error.message,
//         // stack: error.stack,
//       });
//     }

//     throw new Error({
//       error:
//         error.message ===
//         "No response from server. Please check your connection."
//           ? error.message
//           : "Error sending message: Please Try again",
//       ...(process.env.NODE_ENV !== "development" && {
//         details: error.message,
//       }),
//     });
//   }
// }
