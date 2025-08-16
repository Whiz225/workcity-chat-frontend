import ChatList from "@/components/Chat/ChatList";
import { cookies } from "next/headers";

export default async function ChatLayout({ children }) {
  const cookieStore = await cookies();
  const user = cookieStore.get("name")?.value || "";

  return (
    <div className="h-[calc(100vh-64px)] flex">
      <div className="w-1/3 border-r border-gray-200">
        <ChatList user={user || ""} />
      </div>
      <div className="w-2/3">{children}</div>
    </div>
  );
}
