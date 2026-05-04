"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputGroup, PrimaryButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function SetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Slaptažodžiai nesutampa.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputGroup label="Slaptažodis" required>
        <input
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Naujas slaptažodis"
          required
        />
      </InputGroup>

      <InputGroup label="Pakartokite slaptažodį" required>
        <input
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Pakartokite slaptažodį"
          required
        />
      </InputGroup>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <PrimaryButton type="submit" className="w-full" disabled={loading}>
        {loading ? "Išsaugoma..." : "Išsaugoti slaptažodį"}
      </PrimaryButton>
    </form>
  );
}
