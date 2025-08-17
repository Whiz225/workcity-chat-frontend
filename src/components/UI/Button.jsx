"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLogout } from "@/lib/actions";

const sizeClasses = {
  // large: "text-[1.2rem] p-[0.4rem_0.8rem] uppercase font-semibold text-center",
  medium: "text-sm px-4 py-3 font-medium",
  // small: "text-[1.2rem] px-6 py-3 font-medium",
};

const variantClasses = {
  // primary: "text-brand-50 bg-brand-600 hover:bg-brand-700",
  primary: "bg-blue-500 hover:bg-blue-700",
  // secondary:
  // "text-gray-600 bg-brand-200 border border-gray-200 hover:bg-gray-300",
  // danger: "text-red-100 bg-red-700 hover:bg-red-800",
};

export default function Button({
  children,
  logout,
  isLoading,
  size = "medium",
  variation = "primary",
  onClick,
}) {
  const router = useRouter();

  const handleLogout = async (e) => {
    try {
      e.preventDefault();
      const res = await useLogout();

      if (res.status === "success") {
        router.push("/auth/login");
        router.refresh();
      } // Refresh the page to update auth state
    } catch (err) {
      console.log("Logout failed:", err.error);
      toast.error("Logout failed:", err.error);
    }
  };

  const baseClasses =
    "border-none rounded-sm shadow-sm disabled:opacity-75 disabled:cursor-not-allowed transition-colors";

  if (logout)
    return (
      <button
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variation]}`}
        onClick={(e) => handleLogout(e)}
      >
        {children}
      </button>
    );

  if (onClick)
    return (
      <button
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variation]}`}
        onClick={() =>onClick()
        }
      >
        {children}
      </button>
    );

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variation]}`}
      disabled={isLoading}
    >
      {children}
    </button>
  );
}
