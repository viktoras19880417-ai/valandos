import Link from "next/link";
import { Building2, ClipboardList, FileSpreadsheet, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import type { Profile } from "@/lib/types";
import { signOutAction } from "@/app/server-actions";

const adminItems = [
  { href: "/admin", label: "Administratorius", icon: Building2 },
  { href: "/admin/generate", label: "PDF", icon: FileSpreadsheet },
];

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const items = [
    { href: NAV_ITEMS[0].href, label: NAV_ITEMS[0].label, icon: LayoutDashboard },
    { href: NAV_ITEMS[1].href, label: NAV_ITEMS[1].label, icon: ClipboardList },
    { href: NAV_ITEMS[2].href, label: NAV_ITEMS[2].label, icon: FileSpreadsheet },
    { href: NAV_ITEMS[3].href, label: NAV_ITEMS[3].label, icon: Settings },
  ];

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-white/80 bg-mist/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Darbo valandos</p>
            <h1 className="text-lg font-semibold text-ink">Valandos</h1>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-ink">{profile.full_name || profile.email}</p>
            <p className="text-xs text-slate-500">{profile.role === "admin" ? "Administratorius" : "Darbuotojas"}</p>
          </div>
        </div>
      </header>

      <div
        className={
          profile.role === "admin"
            ? "pb-[calc(16rem+env(safe-area-inset-bottom))]"
            : "pb-[calc(10rem+env(safe-area-inset-bottom))]"
        }
      >
        {children}
      </div>

      <nav className="fixed bottom-0 left-0 z-30 w-full border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-4 gap-1 px-2 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center text-xs font-medium text-slate-600 hover:bg-mist hover:text-pine"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        {profile.role === "admin" ? (
          <div className="border-t border-slate-100 px-3 pb-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="px-3 pb-4">
          <form action={signOutAction}>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600">
              <LogOut className="h-4 w-4" />
              Atsijungti
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
