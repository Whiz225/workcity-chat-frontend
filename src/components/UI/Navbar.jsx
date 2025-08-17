"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import Button from "./Button";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!document.cookie) return;
    const getCookie = (name = "string") =>
      document.cookie
        ?.split("; ")
        ?.find((el) => el?.startsWith(name))
        ?.split("=")[1] || "";

    const userData = {
      name: getCookie("name"),
      role: getCookie("role"),
      id: getCookie("userId"),
    };
    console.log("user1",userData)
    setUser(userData);
  }, [pathname]);

  console.log("user3", user);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Workcity Chat
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            {user?.name || user?.role ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium hidden sm:block"
                >
                  Profile
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium hidden sm:block"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="sm:hidden flex items-center">
                  <Link
                    href="/profile"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 ml-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
                <Button logout={true}>Logout</Button>
              </div>
            ) : (
              <div className="flex space-x-2 sm:space-x-4">
                <Link
                  href="/auth/login"
                  className={`${
                    pathname === "/auth/login"
                      ? "bg-blue-600"
                      : "text-white bg-blue-500 hover:bg-blue-700"
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={`${
                    pathname === "/auth/register"
                      ? "bg-gray-700"
                      : "text-gray-500 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
