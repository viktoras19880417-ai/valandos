import Link from "next/link";
import { CalendarDays, FilePlus2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, PageShell, SecondaryLink } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { WorkEntry } from "@/lib/types";
import { formatHours } from "@/lib/utils";

export default async function DashboardPage() {
  const { user, profile } = await getCurrentProfile();
  const supabase = createClient();

  const ownEntriesQuery = await supabase
    .from("work_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(5);

  const ownEntries = (ownEntriesQuery.data ?? []) as WorkEntry[];
  const totalHours = ownEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);

  const adminCount =
    profile.role === "admin"
      ? (await supabase.from("work_entries").select("id", { count: "exact", head: true })).count ?? 0
      : 0;

  return (
    <AppShell profile={profile}>
      <PageShell
        title="Pagrindinis"
        description="Pildykite kasdienes darbo valandas telefone ir laikykite savaitės įrašus paruoštus PDF eksportui."
        actions={<SecondaryLink href="/entries/new">Pridėti valandas</SecondaryLink>}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="bg-ink text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Naujausi įrašai</p>
                <p className="mt-2 text-3xl font-semibold">{ownEntries.length}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-white/80" />
            </div>
          </Card>

          <Card className="bg-clay">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Valandos paskutiniuose 5 įrašuose</p>
                <p className="mt-2 text-3xl font-semibold text-accent">{formatHours(totalHours)}</p>
              </div>
              <FilePlus2 className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Rolė</p>
                <p className="mt-2 text-3xl font-semibold text-pine">{profile.role === "admin" ? "Administratorius" : "Darbuotojas"}</p>
                {profile.role === "admin" ? <p className="mt-1 text-xs text-slate-500">Matoma įrašų: {adminCount}</p> : null}
              </div>
              <ShieldCheck className="h-8 w-8 text-pine" />
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Naujausi įrašai</h2>
              <Link href="/entries" className="text-sm font-medium text-pine">
                Peržiūrėti visus
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              {ownEntries.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-600">Darbo įrašų dar nėra. Naudokite mygtuką viršuje pirmam įrašui pridėti.</p>
              ) : (
                ownEntries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                    <p className="text-sm text-slate-500">
                      {entry.date} • Savaitė {entry.week_number}
                    </p>
                    <p className="mt-1 font-medium text-ink">{entry.object_name}</p>
                    <p className="text-sm text-slate-600">{entry.work_description}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-pine to-ink text-white">
            <h2 className="text-lg font-semibold">Greiti veiksmai</h2>
            <div className="mt-4 grid gap-3">
              <Link href="/entries/new" className="rounded-2xl bg-white/10 px-4 py-4 text-sm font-medium">
                Pridėti šiandienos darbo įrašą
              </Link>
              <Link href="/entries" className="rounded-2xl bg-white/10 px-4 py-4 text-sm font-medium">
                Peržiūrėti ir redaguoti įrašus
              </Link>
              {profile.role === "admin" ? (
                <Link href="/admin/generate" className="rounded-2xl bg-white/10 px-4 py-4 text-sm font-medium">
                  Generuoti savaitės PDF
                </Link>
              ) : null}
            </div>
          </Card>
        </div>
      </PageShell>
    </AppShell>
  );
}
