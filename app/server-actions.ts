"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { entrySchema, enrichEntryDate } from "@/lib/entries";
import { getCurrentProfile, getSessionUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function inviteEmployeeAction(formData: FormData) {
  const { profile } = await getCurrentProfile();

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!fullName) {
    throw new Error("Employee name is required.");
  }

  if (!email) {
    throw new Error("Employee email is required.");
  }

  if (!siteUrl) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL.");
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName, role: "employee" },
    redirectTo: `${siteUrl}/auth/callback?next=/auth/set-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user?.id) {
    throw new Error("Invite did not return a user id.");
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: data.user.id,
    email,
    full_name: fullName,
    role: "employee",
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/generate");
  redirect("/admin?invite=sent");
}

export async function createEntryAction(formData: FormData) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { profile } = await getCurrentProfile();
  const parsed = entrySchema.parse({
    date: formData.get("date"),
    object_number: formData.get("object_number"),
    object_name: formData.get("object_name"),
    customer_name: formData.get("customer_name"),
    work_description: formData.get("work_description"),
    hours: formData.get("hours"),
    parking_cost: formData.get("parking_cost") || 0,
    travel_cost: formData.get("travel_cost") || 0,
    city_entry_fee: formData.get("city_entry_fee") || 0,
  });

  const supabase = createClient();
  const dateInfo = enrichEntryDate(parsed.date);
  const { error } = await supabase.from("work_entries").insert({
    user_id: user.id,
    employee_name: profile.full_name || user.email || "Nežinomas darbuotojas",
    employee_email: user.email || "",
    date: parsed.date,
    year: dateInfo.year,
    week_number: dateInfo.week_number,
    object_number: parsed.object_number,
    object_name: parsed.object_name,
    customer_name: parsed.customer_name,
    work_description: parsed.work_description,
    hours: parsed.hours.toFixed(2),
    parking_cost: parsed.parking_cost.toFixed(2),
    travel_cost: parsed.travel_cost.toFixed(2),
    city_entry_fee: parsed.city_entry_fee.toFixed(2),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/entries");
  revalidatePath("/admin");
  revalidatePath("/admin/generate");
  redirect("/entries");
}

export async function updateEntryAction(formData: FormData) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const entryId = String(formData.get("id"));
  const { profile } = await getCurrentProfile();
  const parsed = entrySchema.parse({
    date: formData.get("date"),
    object_number: formData.get("object_number"),
    object_name: formData.get("object_name"),
    customer_name: formData.get("customer_name"),
    work_description: formData.get("work_description"),
    hours: formData.get("hours"),
    parking_cost: formData.get("parking_cost") || 0,
    travel_cost: formData.get("travel_cost") || 0,
    city_entry_fee: formData.get("city_entry_fee") || 0,
  });

  const supabase = createClient();
  const dateInfo = enrichEntryDate(parsed.date);

  const updates = {
    date: parsed.date,
    year: dateInfo.year,
    week_number: dateInfo.week_number,
    object_number: parsed.object_number,
    object_name: parsed.object_name,
    customer_name: parsed.customer_name,
    work_description: parsed.work_description,
    hours: parsed.hours.toFixed(2),
    parking_cost: parsed.parking_cost.toFixed(2),
    travel_cost: parsed.travel_cost.toFixed(2),
    city_entry_fee: parsed.city_entry_fee.toFixed(2),
    ...(profile.role !== "admin"
      ? {
          employee_name: profile.full_name || user.email || "Nežinomas darbuotojas",
          employee_email: user.email || "",
        }
      : {}),
  };

  let query = supabase
    .from("work_entries")
    .update(updates)
    .eq("id", entryId);

  if (profile.role !== "admin") {
    query = query.eq("user_id", user.id);
  }

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/entries");
  revalidatePath("/admin");
  revalidatePath("/admin/generate");
  redirect("/entries");
}

export async function deleteEntryAction(formData: FormData) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const entryId = String(formData.get("id"));
  const { profile } = await getCurrentProfile();
  const supabase = createClient();
  let query = supabase.from("work_entries").delete().eq("id", entryId);

  if (profile.role !== "admin") {
    query = query.eq("user_id", user.id);
  }

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/entries");
  revalidatePath("/admin");
  revalidatePath("/admin/generate");
}
