import DashboardPage from "@/components/dashboard/DashboardPage";
import { cookies } from "next/headers";

export default async function AdminDashboard({ searchParams }) {
  const mode = searchParams.theme;

  const cookieStore = await cookies();
  const user = cookieStore.get("name")?.value || "";

  return (
    <div className={`"p-6" ${mode === "light" ? "" : "bg-white/30"}`}>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <DashboardPage user={user} />
    </div>
  );
}
