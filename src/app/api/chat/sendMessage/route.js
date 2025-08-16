import { postMessage } from "@/lib/data-service";

export async function POST(request) {
  try {
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
      ...(attachment && { attachment }),
    };

    const { data } = await postMessage(messageData);

    return Response.json({ data, status: "success" });
  } catch (error) {
    console.error("Failed to send message:", error);
    return Response.json(
      {
        error: error.message || "Error sending message",
        ...(process.env.NODE_ENV !== "production" && {
          details: error.stack,
        }),
      },
      { status: 500 }
    );
  }
}
