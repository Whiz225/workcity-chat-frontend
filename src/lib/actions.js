"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import api from "@/lib/api";

export async function login(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      throw new Error("email and password are required");
    }

    const res = await api.post(`/auth/login`, { email, password });

    if (res.data.status !== "success") {
      throw new Error(res.data.response?.message || "Invalid credentials");
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: "token",
      value: res.data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: process.env.JWT_COOKIES_EXPIRES_IN || 60 * 60 * 24 * 1, // 1 day
      path: "/",
      sameSite: "strict",
    });

    return res.data.data;
  } catch (error) {
    // Development logging
    if (process.env.NODE_ENV !== "production") {
      console.error("Login Error:", {
        message: error.message,
        // stack: error.stack,
      });
    }

    return {
      error:
        error.message === "email and password are required" ||
        error.message === "Incorrect email or password" ||
        error.message ===
          "No response from server. Please check your connection."
          ? error.message
          : "Log in failed: Please Try again",
      ...(process.env.NODE_ENV !== "production" && {
        details: error.message,
      }),
    };
  }
}

export async function register(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const role = formData.get("role");

    if (!email || !password || !name) {
      throw new Error("email, name and password are required");
    }

    // Make API request
    const res = await api.post("/auth/register", {
      email,
      role,
      name,
      password,
    });

    // Handle API response
    if (res.data?.status !== "success") {
      throw new Error(
        res.data?.message ||
          res.data?.response?.message ||
          "Registration failed"
      );
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: "token",
      value: res.data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: process.env.JWT_COOKIES_EXPIRES_IN || 60 * 60 * 24 * 1, // 1 day
      path: "/",
      sameSite: "strict",
    });

    return res.data.data;
  } catch (error) {
    // Development logging
    if (process.env.NODE_ENV !== "production") {
      console.error("Registration Error:", {
        message: error.message,
        // stack: error.stack,
      });
    }

    return {
      error:
        error.message === "email, name and password are required" ||
        error.message === "User already exists" ||
        error.message ===
          "No response from server. Please check your connection."
          ? error.message
          : "Registeration failed: Please Try again",
      ...(process.env.NODE_ENV !== "production" && {
        details: error.message,
      }),
    };
  }
}

export async function updateProfile(formDataToSend) {
  try {
    console.log("CCCCCC");
    const cookieStore = await cookies();
    const jwt = cookieStore.get("token");

    // Make API request
    const res = await api.put("/users/profile", formDataToSend, {
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt?.value}`,
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle API response
    if (res.data?.status !== "success") {
      throw new Error(
        res.data?.message ||
          res.data?.response?.message ||
          "Registration failed"
      );
    }

    return res.data.data;
  } catch (error) {
    // Development logging
    if (process.env.NODE_ENV !== "production") {
      console.error("Update Error:", {
        message: error.message,
        // stack: error.stack,
      });
    }

    throw new Error(error.message);
  }
}

export async function useLogout() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token");

  const res = await api.get("/auth/logout", {
    credentials: "include",
    headers: {
      Cookie: `jwt=${jwt?.value}`,
      "Content-Type": "application/json",
    },
  });

  if (res.data.status !== "success") {
    const error = res.data.response?.message;

    if (process.env.NODE_ENV === "development") {
      console.error("Logging out failed", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
    }

    throw new Error(
      process.env.NODE_ENV !== "production" ||
      error.message === "No response from server. Please check your connection."
        ? error.message
        : "Logging out failed. Please try again."
    );
  }

  cookieStore.set({
    name: "token",
    value: res.data.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "strict",
  });

  cookieStore.set("name", "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
  });

  cookieStore.set("userId", "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
  });

  cookieStore.set("role", "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
  });

  cookieStore.set("email", "", {
    httpOnly: false,
    maxAge: 0,
    path: "/",
  });

  return { status: "success" };
}
