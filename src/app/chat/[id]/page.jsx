import { cookies } from "next/headers";
import ChatWindow from "@/components/Chat/ChatWindow";

export default async function ChatPage({ params, searchParams }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value || "";
  const mode = searchParams.theme;

  return (
    <div
      className={`"h-[calc(100vh-64px)] flex" ${
        mode === "light" ? "" : "bg-white/30"
      }`}
    >
      <div className="w-1/3 border-r border-gray-200">
        {/* ChatList will be rendered in the layout */}
      </div>
      <div className="w-2/3">
        <ChatWindow conversationId={params.id} userId={userId} />
      </div>
    </div>
  );
}
