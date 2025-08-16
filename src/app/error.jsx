"use client";
import Button from "@/components/UI/Button";
import { useSearchParams } from "next/navigation";

export default function Error({ error, reset }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("theme");

  return (
    <main
      className={`"flex justify-center items-center flex-col gap-6" ${
        mode === "light" ? "" : "bg-white/20"
      }`}
    >
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">ERROR!: {error.message}</p>

      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
