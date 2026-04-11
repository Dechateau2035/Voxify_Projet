import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-4">
      <div className="w-full max-w-md min-w-0 space-y-4">
        <AuthForm mode="register" />
        <p className="text-center text-sm text-muted-foreground">
          Deja inscrit ? <Link className="text-primary hover:underline" href="/login">Connexion</Link>
        </p>
      </div>
    </main>
  );
}
