import { getConversationById } from "@/lib/data-service";

export async function GET(request, { params }) {
  try {
    const { data } = await getConversationById(params.id);
    return Response.json({ data, status: "success" });
  } catch (error) {
    // Development logging
    if (process.env.NODE_ENV !== "production") {
      console.error("Faild to load :", {
        message: error.message,
        // stack: error.stack,
      });
    }

    // Production-safe response
    throw new Error({
      error:
        error.message ===
        "No response from server. Please check your connection."
          ? error.message
          : "Error loading a conversation: Please Try again",
      ...(process.env.NODE_ENV !== "development" && {
        details: error.message,
      }),
    });
  }
}
