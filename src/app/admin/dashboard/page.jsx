import DashboardPage from "@/components/dashboard/DashboardPage";
import { cookies } from "next/headers";

export default async function AdminDashboard({ searchParams }) {
  const mode = searchParams.theme;

  const cookieStore = await cookies();
  const user = {
    name: cookieStore.get("name")?.value || "",
    email: cookieStore.get("email")?.value || "",
    role: cookieStore.get("role")?.value || "",
  };

  return (
    <div className={`${mode === "light" ? "" : "bg-white/30"} p-8`}>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <DashboardPage user={user} />
    </div>
  );
}
