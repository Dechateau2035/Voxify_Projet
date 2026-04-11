import { AppShell } from "@/components/app-shell";
import { ChantForm } from "@/components/chant-form";

export default function NewChantPage() {
  return (
    <AppShell title="Nouveau chant" subtitle="Ajoutez un chant avec vos fichiers audio/image.">
      <ChantForm mode="create" />
    </AppShell>
  );
}
