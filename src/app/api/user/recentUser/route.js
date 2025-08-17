import { getRecentUser } from "@/lib/data-service";

export async function GET() {
  try {
    const data = await getRecentUser();
    return Response.json({ data, status: "success" });
  } catch (error) {
    // Development logging
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to load recent user:", {
        message: error.message,
        // stack: error.stack,
      });
    }

    throw new Error({
      error:
        error.message ===
        "No response from server. Please check your connection."
          ? error.message
          : "Error loading recent user: Please Try again",
      ...(process.env.NODE_ENV !== "development" && {
        details: error.message,
      }),
    });
  }
}
