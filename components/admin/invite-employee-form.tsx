import { Card, InputGroup, PrimaryButton } from "@/components/ui";
import { inviteEmployeeAction } from "@/app/server-actions";

export function InviteEmployeeForm({ inviteSent }: { inviteSent: boolean }) {
  return (
    <Card>
      <form action={inviteEmployeeAction} className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Pakviesti darbuotoją</h2>
          {inviteSent ? <p className="mt-2 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">Pakvietimas išsiųstas</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputGroup label="Darbuotojo vardas" required>
            <input type="text" name="full_name" autoComplete="name" placeholder="Vardenis Pavardenis" required />
          </InputGroup>

          <InputGroup label="Darbuotojo el. paštas" required>
            <input type="email" name="email" autoComplete="email" placeholder="darbuotojas@example.com" required />
          </InputGroup>
        </div>

        <div>
          <PrimaryButton type="submit">Siųsti pakvietimą</PrimaryButton>
        </div>
      </form>
    </Card>
  );
}
