import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";
import type { WorkEntry } from "@/lib/types";
import { Card, EmptyState } from "@/components/ui";
import { formatCurrency, formatHours } from "@/lib/utils";

export function EntriesTable({
  entries,
  canManageAll = false,
  deleteAction,
}: {
  entries: WorkEntry[];
  canManageAll?: boolean;
  deleteAction: (formData: FormData) => void;
}) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="Įrašų dar nėra"
        description="Čia matysite išsaugotas darbo valandas su redagavimo ir trynimo veiksmais."
        action={
          <Link
            href="/entries/new"
            className="inline-flex rounded-2xl bg-pine px-4 py-3 text-sm font-medium text-white"
          >
            Pridėti pirmą įrašą
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">
                  {entry.date} • Savaitė {entry.week_number}, {entry.year}
                </p>
                <h2 className="text-lg font-semibold text-ink">{entry.object_name}</h2>
                <p className="text-sm text-slate-600">
                  {entry.object_number} • {entry.customer_name}
                </p>
                {canManageAll ? <p className="mt-1 text-sm text-slate-500">{entry.employee_name}</p> : null}
              </div>
              <div className="rounded-2xl bg-mist px-3 py-2 text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500">Valandos</p>
                <p className="text-lg font-semibold text-pine">{formatHours(entry.hours)}</p>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-700">{entry.work_description}</p>

            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-sm">
              <div>
                <p className="text-slate-500">Parkingas</p>
                <p className="font-medium text-ink">{formatCurrency(entry.parking_cost)}</p>
              </div>
              <div>
                <p className="text-slate-500">Kelionė</p>
                <p className="font-medium text-ink">{formatCurrency(entry.travel_cost)}</p>
              </div>
              <div>
                <p className="text-slate-500">Įvažiavimas</p>
                <p className="font-medium text-ink">{formatCurrency(entry.city_entry_fee)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/entries/${entry.id}/edit`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-ink"
              >
                <Pencil className="h-4 w-4" />
                Redaguoti
              </Link>
              <form action={deleteAction} className="flex-1">
                <input type="hidden" name="id" value={entry.id} />
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
                  <Trash2 className="h-4 w-4" />
                  Ištrinti
                </button>
              </form>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
