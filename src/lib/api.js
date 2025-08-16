import axios from "axios";

const api = axios.create({
  // ✅ Make sure it's localhost not 127.0.0.1
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:9000/api",
  timeout: 12000, // 12 seconds timeout
  // ✅ Needed for sending cookies
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enhanced error handling

// api.interceptors.request.use((config) => {
//   // You can add auth headers here if needed
//   return config;
// });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Backend server is not responding. Please try again later."
      );
    }
    if (error.response) {
      // Server responded with non-2xx status
      throw new Error(error.response.data.message || "Request failed");
    } else if (error.request) {
      // Request was made but no response
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something else happened
      throw new Error("Request failed to send");
    }
  }
);

export default api;
