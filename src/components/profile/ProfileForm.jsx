"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import Button from "../UI/Button";
import { updateProfile } from "@/lib/actions";
import toast from "react-hot-toast";

export default function ProfileForm({ user }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null,
    notificationPreferences: {
      email: false,
      push: false,
    },
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        notificationPreferences: user.notificationPreferences || {
          email: false,
          push: false,
        },
      });
      if (user.avatar) {
        setPreview(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("notificationPreferences.")) {
      const prefKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [prefKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.avatar instanceof File) {
        formDataToSend.append("avatar", formData.avatar);
      }
      formDataToSend.append(
        "notificationPreferences",
        JSON.stringify(formData.notificationPreferences)
      );

      // Debug what's being sent
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const { data } = await updateProfile(formDataToSend);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="shrink-0">
          <img
            className="h-16 w-16 object-cover rounded-full"
            src={preview || "/default-avatar.png"}
            alt="Current profile"
          />
        </div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
          />
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                id="email-notifications"
                name="notificationPreferences.email"
                type="checkbox"
                checked={formData.notificationPreferences.email}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="email-notifications"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="push-notifications"
                name="notificationPreferences.push"
                type="checkbox"
                checked={formData.notificationPreferences.push}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="push-notifications"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Push notifications
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <Button
          //   type="button"
          logout={true}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </Button>
      </div>
    </form>
  );
}
