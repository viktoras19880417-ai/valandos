import { InputGroup, PrimaryButton, SecondaryLink } from "@/components/ui";
import type { WorkEntry } from "@/lib/types";

export function EntryForm({
  action,
  submitLabel,
  entry,
}: {
  action: (formData: FormData) => void;
  submitLabel: string;
  entry?: WorkEntry;
}) {
  return (
    <form action={action} className="grid gap-4">
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <InputGroup label="Data" required>
          <input type="date" name="date" defaultValue={entry?.date ?? ""} required />
        </InputGroup>

        <InputGroup label="Valandos" required hint="Jei reikia, naudokite dešimtaines reikšmes, pvz. 7.5">
          <input type="number" name="hours" min="0" max="24" step="0.25" defaultValue={entry?.hours ?? "8"} required />
        </InputGroup>
      </div>

      <InputGroup label="Objekto numeris" required>
        <input type="text" name="object_number" defaultValue={entry?.object_number ?? ""} placeholder="OBJ-1001" required />
      </InputGroup>

      <InputGroup label="Objekto pavadinimas" required>
        <input type="text" name="object_name" defaultValue={entry?.object_name ?? ""} placeholder="Šiaurinio pastato renovacija" required />
      </InputGroup>

      <InputGroup label="Užsakovas" required>
        <input type="text" name="customer_name" defaultValue={entry?.customer_name ?? ""} placeholder="Acme Property Group" required />
      </InputGroup>

      <InputGroup label="Darbo aprašymas" required>
        <textarea
          name="work_description"
          rows={5}
          defaultValue={entry?.work_description ?? ""}
          placeholder="Aprašykite, kas atlikta objekte."
          required
        />
      </InputGroup>

      <div className="grid gap-4 sm:grid-cols-3">
        <InputGroup label="Parkingo kaina">
          <input type="number" name="parking_cost" min="0" step="0.01" defaultValue={entry?.parking_cost ?? "0"} />
        </InputGroup>

        <InputGroup label="Kelionė">
          <input type="number" name="travel_cost" min="0" step="0.01" defaultValue={entry?.travel_cost ?? "0"} />
        </InputGroup>

        <InputGroup label="Mokestis už įvažiavimą">
          <input type="number" name="city_entry_fee" min="0" step="0.01" defaultValue={entry?.city_entry_fee ?? "0"} />
        </InputGroup>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <PrimaryButton type="submit" className="sm:min-w-44">
          {submitLabel}
        </PrimaryButton>
        <SecondaryLink href="/entries" className="sm:min-w-44">
          Atšaukti
        </SecondaryLink>
      </div>
    </form>
  );
}
