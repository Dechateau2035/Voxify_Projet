import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-4">
      <div className="w-full max-w-md min-w-0 space-y-4">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ? <Link className="text-primary hover:underline" href="/register">Inscription</Link>
        </p>
      </div>
    </main>
  );
}
