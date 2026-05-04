import { EntryForm } from "@/components/entries/entry-form";
import { AppShell } from "@/components/layout/app-shell";
import { PageShell } from "@/components/ui";
import { createEntryAction } from "@/app/server-actions";
import { getCurrentProfile } from "@/lib/auth";

export default async function NewEntryPage() {
  const { profile } = await getCurrentProfile();

  return (
    <AppShell profile={profile}>
      <PageShell
        title="Naujas darbo įrašas"
        description="Įveskite dieną, objekto informaciją, darbo aprašymą ir papildomas išlaidas."
      >
        <EntryForm action={createEntryAction} submitLabel="Išsaugoti" />
      </PageShell>
    </AppShell>
  );
}
