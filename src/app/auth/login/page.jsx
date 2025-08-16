import LoginForm from "@/components/Auth/LoginForm";

export default async function LoginPage({ searchParams }) {
  const mode = await searchParams.theme;

  return (
    <div
      className={`"flex items-center justify-center min-h-screen" ${
        mode === "light" ? "" : "bg-white/50"
      }`}
    >
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          Sign in to your account
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
