import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { EntryForm } from "@/components/entries/entry-form";
import { PageShell } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateEntryAction } from "@/app/server-actions";
import type { WorkEntry } from "@/lib/types";

export default async function EditEntryPage({ params }: { params: { id: string } }) {
  const { user, profile } = await getCurrentProfile();
  const supabase = createClient();

  let query = supabase.from("work_entries").select("*").eq("id", params.id);
  if (profile.role !== "admin") {
    query = query.eq("user_id", user.id);
  }

  const { data } = await query.single();
  const entry = data as WorkEntry | null;

  if (!entry) {
    notFound();
  }

  return (
    <AppShell profile={profile}>
      <PageShell title="Redaguoti įrašą" description="Atnaujinkite išsaugotą dienos darbo įrašą.">
        <EntryForm action={updateEntryAction} submitLabel="Išsaugoti" entry={entry} />
      </PageShell>
    </AppShell>
  );
}
