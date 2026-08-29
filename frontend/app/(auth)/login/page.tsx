import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in — IntelliStock+",
  description: "Sign in to your IntelliStock+ account",
};

export default function LoginPage() {
  return <LoginForm />;
}
