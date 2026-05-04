import Link from "next/link";
import { Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AdminFilterForm } from "@/components/admin/filter-form";
import { Card, EmptyState, PageShell } from "@/components/ui";
import { getCurrentProfile, requireRole } from "@/lib/auth";
import { groupEntriesByWeekObject } from "@/lib/entries";
import { createClient } from "@/lib/supabase/server";
import type { Profile, WorkEntry } from "@/lib/types";

type SearchParams = {
  employee?: string;
  week?: string;
  year?: string;
  object?: string;
};

export default async function AdminGeneratePage({ searchParams }: { searchParams: SearchParams }) {
  await requireRole("admin");
  const { profile } = await getCurrentProfile();
  const supabase = createClient();

  const employeesResponse = await supabase.rpc("list_profiles_for_admin");
  let query = supabase.from("work_entries").select("*").order("date", { ascending: true });

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
  const groups = groupEntriesByWeekObject((data ?? []) as WorkEntry[]);

  return (
    <AppShell profile={profile}>
      <PageShell
        title="Generuoti savaitės PDF"
        description="Kiekvienas atsisiuntimas grupuojamas taip: vienas PDF vienam darbuotojui, savaitei ir objekto numeriui."
      >
        <AdminFilterForm employees={(employeesResponse.data ?? []) as Profile[]} current={searchParams} actionPath="/admin/generate" />

        <div className="mt-6">
          {groups.length === 0 ? (
            <EmptyState
              title="Atitinkančių grupių nėra"
              description="Pakeiskite filtrus, kad rastumėte PDF eksportui paruoštas darbuotojo, savaitės ir objekto kombinacijas."
            />
          ) : (
            <div className="grid gap-4">
              {groups.map((group) => {
                const params = new URLSearchParams({
                  employee: group.meta.user_id,
                  week: String(group.meta.week_number),
                  year: String(group.meta.year),
                  object: group.meta.object_number,
                });

                return (
                  <Card key={group.key}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          Savaitė {group.meta.week_number}, {group.meta.year}
                        </p>
                        <h2 className="text-lg font-semibold text-ink">{group.meta.employee_name}</h2>
                        <p className="text-sm text-slate-600">
                          {group.meta.object_number} • {group.meta.object_name}
                        </p>
                        <p className="text-sm text-slate-500">{group.meta.customer_name}</p>
                      </div>

                      <Link
                        href={`/api/admin/timesheets?${params.toString()}`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pine px-4 py-3 text-sm font-medium text-white"
                      >
                        <Download className="h-4 w-4" />
                        Atsisiųsti PDF
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </PageShell>
    </AppShell>
  );
}
