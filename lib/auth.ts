import { redirect } from "next/navigation";
import type { Profile, Role } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Profile not found. Make sure the SQL schema has been applied.");
  }

  return { user, profile: data as Profile };
}

export async function requireRole(role: Role) {
  const { profile } = await getCurrentProfile();

  if (profile.role !== role) {
    redirect("/dashboard");
  }

  return profile;
}
