"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/UI/Spinner";

export default function DashboardPage({ user }) {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const mode = searchParams.get("theme");

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const res = await fetch("/api/user/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error loading user stats");
      const { data } = await res.json();

      if (data.status !== "success")
        throw new Error("Error loading user stats");

      return data;
    } catch (err) {
      console.error("Error loading user stats:", err);
    }
  };

  const loadRecentUser = async () => {
    try {
      const res = await fetch("/api/user/recentUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error loading recent user");
      const { data } = await res.json();

      if (data.status !== "success")
        throw new Error("Error loading recent user");

      return data;
    } catch (err) {
      console.error("Error loading recent user:", err);
    }
  };

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        loadUserStats(),
        loadRecentUser(),
      ]);
      setStats(statsRes.data);
      setRecentUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="p-4">Unauthorized</div>;
  }

  if (loading) {
    return <Spinner />;
  }
  console.log("dataArray", stats, recentUsers);

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`${
            mode === "light" ? "bg-white" : "bg-white/5"
          } p-6 rounded-lg shadow`}
        >
          <h3 className={mode === "light" ? "text-gray-500" : "text-white"}>
            Total Users
          </h3>
          <p className="text-3xl font-bold">{stats?.totalUsers}</p>
        </div>
        <div
          className={`${
            mode === "light" ? "bg-white" : "bg-white/5"
          } p-6 rounded-lg shadow`}
        >
          <h3 className={mode === "light" ? "text-gray-500" : "text-white"}>
            Active Conversations
          </h3>
          <p className="text-3xl font-bold">{stats?.activeConversations}</p>
        </div>
        <div
          className={`${
            mode === "light" ? "bg-white" : "bg-white/5"
          } p-6 rounded-lg shadow`}
        >
          <h3 className={mode === "light" ? "text-gray-500" : "text-white"}>
            Messages Today
          </h3>
          <p className="text-3xl font-bold">{stats?.messagesToday}</p>
        </div>
      </div>

      {/* Recent Users */}
      <div
        className={`${
          mode === "light" ? "bg-white" : "bg-white/5"
        } p-6 rounded-lg shadow`}
      >
        <h2 className="text-xl font-bold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length >= 1 &&
                recentUsers.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="py-3">{user.name}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3 capitalize">{user.role}</td>
                    <td className="py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
