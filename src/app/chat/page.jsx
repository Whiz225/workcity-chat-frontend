import ChatList from "../../components/Chat/ChatList";
// import { cookies } from "next/headers";

export default async function ChatPage({ searchParams }) {
  // const cookieStore = await cookies();
  // const user = cookieStore.get("name")?.value || "";
  const mode = searchParams.theme;

  return (
    <div
      className={`flex h-[calc(100vh-64px)] ${
        mode === "light" ? "" : "bg-white/80"
      }`}
    >
      <div className="w-1/3 border-r border-gray-200">
        {/* <ChatList user={user} /> */}
      </div>
      <div className="w-2/3 flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium text-gray-900">
            Select a conversation
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose an existing conversation or start a new one
          </p>
        </div>
      </div>
    </div>
  );
}
