import { redirect } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="grid w-full max-w-5xl gap-6 overflow-hidden rounded-[32px] border border-white/80 bg-white/90 shadow-card backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-ink p-8 text-white sm:p-10">
          <div className="inline-flex rounded-3xl bg-white/10 p-4">
            <ClipboardCheck className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Pildykite statybų darbo valandas be popierinių lapų.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
            Darbuotojai gali registruoti dienos laiką objekte telefono naršyklėje, o administratoriai peržiūri įrašus ir generuoja savaitines PDF ataskaitas.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-white/80">
            <p>Patogus pildymas telefone</p>
            <p>Darbuotojo ir administratoriaus rolės su Supabase RLS</p>
            <p>Savaitės PDF pagal darbuotoją, savaitę ir objekto numerį</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Prisijungti</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Sveiki sugrįžę</h2>
          <p className="mt-2 text-sm text-slate-600">Naudokite Supabase el. paštą ir slaptažodį, kad pasiektumėte darbo valandų programą.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
