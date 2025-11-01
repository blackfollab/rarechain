"use client";

import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  return (
    <button
      className="text-white cursor-pointer bg-black border h-12 px-6 font-medium rounded-full transition-all duration-300 transform hover:translate-y-1"
      onClick={login}
    >
      Connect Wallet
    </button>
  );
}
