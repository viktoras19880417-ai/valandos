import { AppShell } from "@/components/layout/app-shell";
import { EntriesTable } from "@/components/entries/entries-table";
import { AdminFilterForm } from "@/components/admin/filter-form";
import { InviteEmployeeForm } from "@/components/admin/invite-employee-form";
import { PageShell, SecondaryLink } from "@/components/ui";
import { deleteEntryAction } from "@/app/server-actions";
import { getCurrentProfile, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Profile, WorkEntry } from "@/lib/types";

type SearchParams = {
  employee?: string;
  invite?: string;
  week?: string;
  year?: string;
  object?: string;
};

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  await requireRole("admin");
  const { profile } = await getCurrentProfile();
  const supabase = createClient();

  const employeesResponse = await supabase.rpc("list_profiles_for_admin");
  let query = supabase.from("work_entries").select("*").order("date", { ascending: false });

  if (searchParams.employee) {
    query = query.eq("user_id", searchParams.employee);
  }
  if (searchParams.week) {
    query = query.eq("week_number", Number(searchParams.week));
  }
  if (searchParams.year) {
    query = query.eq("year", Number(searchParams.year));
  }
  if (searchParams.object) {
    query = query.ilike("object_number", `%${searchParams.object}%`);
  }

  const { data } = await query;

  return (
    <AppShell profile={profile}>
      <PageShell
        title="Administratoriaus peržiūra"
        description="Filtruokite visų darbuotojų įrašus pagal darbuotoją, savaitę, metus arba objekto numerį."
        actions={<SecondaryLink href="/admin/generate">Generuoti PDF</SecondaryLink>}
      >
        <InviteEmployeeForm inviteSent={searchParams.invite === "sent"} />
        <div className="mt-6">
          <AdminFilterForm employees={(employeesResponse.data ?? []) as Profile[]} current={searchParams} actionPath="/admin" />
        </div>
        <div className="mt-6">
          <EntriesTable entries={(data ?? []) as WorkEntry[]} canManageAll deleteAction={deleteEntryAction} />
        </div>
      </PageShell>
    </AppShell>
  );
}
