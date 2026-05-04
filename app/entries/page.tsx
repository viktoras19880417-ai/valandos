import { AppShell } from "@/components/layout/app-shell";
import { EntriesTable } from "@/components/entries/entries-table";
import { PageShell, SecondaryLink } from "@/components/ui";
import { deleteEntryAction } from "@/app/server-actions";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { WorkEntry } from "@/lib/types";

export default async function EntriesPage() {
  const { user, profile } = await getCurrentProfile();
  const supabase = createClient();
  let query = supabase.from("work_entries").select("*").order("date", { ascending: false });

  if (profile.role !== "admin") {
    query = query.eq("user_id", user.id);
  }

  const { data } = await query;

  return (
    <AppShell profile={profile}>
      <PageShell
        title="Darbo valandos"
        description={
          profile.role === "admin"
            ? "Administratoriai gali peržiūrėti visus darbo įrašus, juos redaguoti arba ištrinti."
            : "Peržiūrėkite, redaguokite ir šalinkite savo kasdienius darbo valandų įrašus."
        }
        actions={<SecondaryLink href="/entries/new">Pridėti valandas</SecondaryLink>}
      >
        <EntriesTable entries={(data ?? []) as WorkEntry[]} canManageAll={profile.role === "admin"} deleteAction={deleteEntryAction} />
      </PageShell>
    </AppShell>
  );
}
