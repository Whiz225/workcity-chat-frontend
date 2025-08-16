import { Inter } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "../context/ChatContext";
import Navbar from "../components/UI/Navbar";
import { ThemeProvider } from "../context/ThemeContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Workcity Chat",
  description: "Real-time chat application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ChatProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="container mx-auto p-4">{children}</main>
            </div>
            <Toaster
              position="top-center"
              gutter={12}
              containerStyle={{ margin: "8px" }}
              toastOptions={{
                success: {
                  duration: 3000,
                },
                error: {
                  duration: 5000,
                },
                style: {
                  fontSize: "16px",
                  maxWidth: "500px",
                  padding: "16px 24px",
                  backgroundColor: "var(--color-grey-0)",
                  color: "var(--color-grey-700)",
                },
              }}
            />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}