import { AppShell } from "@/components/app-shell";
import { ChantForm } from "@/components/chant-form";

export default function CreateChantPage() {
  return (
    <AppShell
      title="Creer un chant"
      subtitle="Ajoute un nouveau chant avec sa cover, son audio principal, ses voix et sa partition."
    >
      <ChantForm mode="create" />
    </AppShell>
  );
}
