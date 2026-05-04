import { buildWeekRows } from "@/lib/entries";
import type { WorkEntry } from "@/lib/types";

export function buildTimesheetHtml(entries: WorkEntry[]) {
  if (entries.length === 0) {
    throw new Error("No entries found for the selected group.");
  }

  const first = entries[0];
  const rows = buildWeekRows(entries, first.year, first.week_number);
  const totalHours = rows.reduce((sum, row) => sum + row.hours, 0);
  const totalExtraCosts = rows.reduce(
    (sum, row) => sum + row.parking_cost + row.travel_cost + row.city_entry_fee,
    0,
  );

  const rowMarkup = rows
    .map(
      (row) => `
        <tr>
          <td>${row.dayLabel}</td>
          <td>${row.dateLabel}</td>
          <td>${escapeHtml(row.work_description) || "&nbsp;"}</td>
          <td class="numeric">${row.hours.toFixed(2)}</td>
          <td class="numeric">${row.parking_cost.toFixed(2)}</td>
          <td class="numeric">${row.travel_cost.toFixed(2)}</td>
          <td class="numeric">${row.city_entry_fee.toFixed(2)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="lt">
      <head>
        <meta charset="UTF-8" />
        <title>Ataskaita ${first.week_number} savaitė</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #10212b;
            margin: 36px;
            font-size: 12px;
          }
          h1 {
            font-size: 22px;
            margin: 0 0 18px;
          }
          .meta {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 18px;
            margin-bottom: 20px;
          }
          .meta-item {
            padding: 10px 12px;
            border: 1px solid #d3ddd8;
            border-radius: 8px;
            background: #f7fbf9;
          }
          .label {
            display: block;
            color: #51616a;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #cbd7d2;
            padding: 8px;
            vertical-align: top;
          }
          th {
            background: #e7f1ec;
            text-align: left;
          }
          .numeric {
            text-align: right;
            white-space: nowrap;
          }
          .totals {
            margin-top: 18px;
            width: 300px;
            margin-left: auto;
          }
          .signature {
            margin-top: 42px;
          }
          .signature-line {
            margin-top: 42px;
            border-top: 1px solid #10212b;
            width: 260px;
            padding-top: 8px;
          }
        </style>
      </head>
      <body>
        <h1>Savaitės darbo ataskaita</h1>
        <div class="meta">
          <div class="meta-item"><span class="label">Savaitė</span>${first.week_number}</div>
          <div class="meta-item"><span class="label">Metai</span>${first.year}</div>
          <div class="meta-item"><span class="label">Darbuotojas</span>${escapeHtml(first.employee_name)}</div>
          <div class="meta-item"><span class="label">El. paštas</span>${escapeHtml(first.employee_email)}</div>
          <div class="meta-item"><span class="label">Objekto numeris</span>${escapeHtml(first.object_number)}</div>
          <div class="meta-item"><span class="label">Objekto pavadinimas</span>${escapeHtml(first.object_name)}</div>
          <div class="meta-item"><span class="label">Užsakovas</span>${escapeHtml(first.customer_name)}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Diena</th>
              <th>Data</th>
              <th>Darbo aprašymas</th>
              <th>Valandos</th>
              <th>Parkingo kaina</th>
              <th>Kelionė</th>
              <th>Mokestis už įvažiavimą</th>
            </tr>
          </thead>
          <tbody>${rowMarkup}</tbody>
        </table>

        <table class="totals">
          <tbody>
            <tr>
              <th>Iš viso valandų</th>
              <td class="numeric">${totalHours.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Papildomos išlaidos</th>
              <td class="numeric">${totalExtraCosts.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="signature">
          <div class="signature-line">Parašas</div>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
