import ProfileForm from "@/components/profile/ProfileForm";
import { cookies } from "next/headers";

export default async function ProfilePage({ searchParams }) {
  const mode = searchParams.theme;

  const cookieStore = await cookies();
  const user = cookieStore.get("name")?.value || "";

  return (
    <div
      className={`"max-w-2xl mx-auto p-6"  ${
        mode === "light" ? "" : "bg-white/10"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <ProfileForm user={user} />
    </div>
  );
}
