import api from "./api";

export async function verifyToken(token) {
  try {
    const data = await api.get(`/auth/middleware/${token}`);

    return data.data.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "You are not logged in! Please log in to get access.";
    throw new Error(message);
  }
}
