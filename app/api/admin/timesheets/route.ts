import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildTimesheetHtml } from "@/lib/pdf";
import { createClient } from "@/lib/supabase/server";
import type { Profile, WorkEntry } from "@/lib/types";

function sanitizeFilePart(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const profile = profileData as Profile | null;

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const employee = searchParams.get("employee");
  const week = searchParams.get("week");
  const year = searchParams.get("year");
  const object = searchParams.get("object");

  if (!employee || !week || !year || !object) {
    return NextResponse.json(
      { error: "employee, week, year, and object query parameters are required." },
      { status: 400 },
    );
  }

  const { data: entries, error } = await supabase
    .from("work_entries")
    .select("*")
    .eq("user_id", employee)
    .eq("week_number", Number(week))
    .eq("year", Number(year))
    .eq("object_number", object)
    .order("date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const timesheetEntries = (entries ?? []) as WorkEntry[];

  if (timesheetEntries.length === 0) {
    return NextResponse.json({ error: "No entries found for the selected PDF group." }, { status: 404 });
  }

  const html = buildTimesheetHtml(timesheetEntries);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "16mm",
        right: "12mm",
        bottom: "16mm",
        left: "12mm",
      },
    });

    const first = timesheetEntries[0];
    const filename = [
      sanitizeFilePart(first.employee_name),
      `week-${first.week_number}`,
      sanitizeFilePart(first.object_number),
    ].join("_");

    return new NextResponse(new Blob([pdf as BlobPart], { type: "application/pdf" }), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}
