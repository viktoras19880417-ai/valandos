import { redirect } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { SetPasswordForm } from "@/components/auth/set-password-form";
import { getSessionUser } from "@/lib/auth";

export default async function SetPasswordPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="grid w-full max-w-5xl gap-6 overflow-hidden rounded-[32px] border border-white/80 bg-white/90 shadow-card backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-ink p-8 text-white sm:p-10">
          <div className="inline-flex rounded-3xl bg-white/10 p-4">
            <ClipboardCheck className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Užbaikite paskyros paruošimą.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
            Sukurkite slaptažodį, kad kitą kartą galėtumėte prisijungti el. paštu ir slaptažodžiu.
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pakvietimas</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Nustatykite slaptažodį</h2>
          <p className="mt-2 text-sm text-slate-600">Pasirinkite slaptažodį savo darbo valandų paskyrai.</p>
          <div className="mt-8">
            <SetPasswordForm />
          </div>
        </div>
      </section>
    </main>
  );
}
