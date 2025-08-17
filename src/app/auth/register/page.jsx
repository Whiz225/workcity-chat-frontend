import RegisterForm from "../../../components/Auth/RegisterForm";

export default function RegisterPage({ searchParams }) {
  const mode = searchParams.theme;

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        mode === "light" ? "" : "bg-white/40"
      }`}
    >
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create your account</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
