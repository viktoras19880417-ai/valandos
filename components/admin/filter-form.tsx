import { InputGroup, PrimaryButton, SecondaryLink } from "@/components/ui";
import type { Profile } from "@/lib/types";

export function AdminFilterForm({
  employees,
  current,
  actionPath,
}: {
  employees: Profile[];
  current: Record<string, string | undefined>;
  actionPath: string;
}) {
  return (
    <form action={actionPath} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InputGroup label="Darbuotojas">
          <select name="employee" defaultValue={current.employee ?? ""}>
            <option value="">Visi darbuotojai</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name || employee.email}
              </option>
            ))}
          </select>
        </InputGroup>

        <InputGroup label="Savaitė">
          <input type="number" name="week" min="1" max="53" defaultValue={current.week ?? ""} placeholder="18" />
        </InputGroup>

        <InputGroup label="Metai">
          <input type="number" name="year" min="2020" max="2100" defaultValue={current.year ?? ""} placeholder="2026" />
        </InputGroup>

        <InputGroup label="Objekto numeris">
          <input type="text" name="object" defaultValue={current.object ?? ""} placeholder="OBJ-1001" />
        </InputGroup>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <PrimaryButton type="submit" className="sm:min-w-40">
          Taikyti filtrus
        </PrimaryButton>
        <SecondaryLink href={actionPath} className="sm:min-w-40">
          Išvalyti
        </SecondaryLink>
      </div>
    </form>
  );
}
