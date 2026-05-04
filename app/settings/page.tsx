import { AppShell } from "@/components/layout/app-shell";
import { Card, PageShell } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";

export default async function SettingsPage() {
  const { profile } = await getCurrentProfile();

  return (
    <AppShell profile={profile}>
      <PageShell
        title="Nustatymai"
        description="Pagrindinė paskyros informacija gaunama iš jūsų Supabase profilio. Administratoriaus rolės pakeitimai valdomi duomenų bazėje."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-sm text-slate-500">Vardas ir pavardė</p>
            <p className="mt-2 text-lg font-semibold text-ink">{profile.full_name || "Nenustatyta"}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-lg font-semibold text-ink">{profile.email || "Nenustatyta"}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Rolė</p>
            <p className="mt-2 text-lg font-semibold text-pine">{profile.role === "admin" ? "Administratorius" : "Darbuotojas"}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Profilio šaltinis</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Naudotojų profiliai sinchronizuojami iš Supabase Auth per šiame projekte esantį SQL trigerį.
            </p>
          </Card>
        </div>
      </PageShell>
    </AppShell>
  );
}
