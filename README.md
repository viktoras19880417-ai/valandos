# Valandos Work Hours PWA

Valandos is a mobile-first Progressive Web App for construction work hour tracking. Employees log daily work by object/project, and admins review all records, filter by week/year/object/employee, and generate grouped weekly PDF timesheets.

## Features

- Next.js App Router with TypeScript and Tailwind CSS
- Supabase email/password authentication
- Supabase PostgreSQL schema with row level security
- Employee role with private daily entry CRUD
- Admin role with full entry visibility and grouped PDF generation
- PWA manifest and service worker for installable mobile use
- HTML to PDF generation on the server with Puppeteer

## Routes

- `/login`
- `/dashboard`
- `/entries`
- `/entries/new`
- `/entries/[id]/edit`
- `/admin`
- `/admin/generate`
- `/auth/callback`
- `/auth/set-password`
- `/settings`

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Puppeteer for HTML-to-PDF

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in your Supabase project values:

```powershell
Copy-Item .env.example .env.local
```

3. In Supabase, open the SQL editor and run the full SQL from [supabase/schema.sql](/c:/Users/G-PC/Desktop/valandos/supabase/schema.sql:1).

4. In Supabase Auth, create users with email and password. The trigger in the SQL file will automatically create profile rows.

5. Promote at least one account to admin:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

6. Start the app:

```powershell
npm run dev
```

7. Open `http://localhost:3000/login` on desktop or phone browser. On mobile, use the browser install prompt or "Add to Home Screen" to install it as a PWA.

## Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

For Vercel, add the same variables in Project Settings -> Environment Variables. `NEXT_PUBLIC_SITE_URL` should be your deployed site URL, for example `https://your-app.vercel.app`. `SUPABASE_SERVICE_ROLE_KEY` must be added as a server-side secret only; never prefix it with `NEXT_PUBLIC_` and never use it in client components.

## Database Design

### `profiles`

- `id`
- `full_name`
- `email`
- `role`
- `created_at`
- `updated_at`

### `work_entries`

- `id`
- `user_id`
- `employee_name`
- `employee_email`
- `date`
- `year`
- `week_number`
- `object_number`
- `object_name`
- `customer_name`
- `work_description`
- `hours`
- `parking_cost`
- `travel_cost`
- `city_entry_fee`
- `created_at`
- `updated_at`

## PDF Grouping Rule

The admin PDF page strictly groups output as:

- one employee
- one week number
- one year
- one object number

If an employee worked on three objects in the same week, the app will show three separate PDF downloads.

## PDF Generation Notes

- The PDF endpoint is `/api/admin/timesheets`
- The endpoint accepts `employee`, `week`, `year`, and `object`
- Each PDF is rendered from HTML on the server

If your environment does not automatically download a Chromium binary during `npm install`, run:

```powershell
npx puppeteer browsers install chrome
```

## PWA Notes

- Manifest file: [public/manifest.webmanifest](/c:/Users/G-PC/Desktop/valandos/public/manifest.webmanifest:1)
- Service worker: [public/sw.js](/c:/Users/G-PC/Desktop/valandos/public/sw.js:1)
- Install starts at `/dashboard`

## Project Structure

```text
app/
  admin/
  api/
  dashboard/
  entries/
  login/
  settings/
components/
lib/
public/
supabase/
```

## Usage Flow

1. Employee signs in with email and password.
2. Employee adds daily entries and can edit or delete only their own records.
3. Admin opens `/admin` to filter and inspect all records.
4. Admin opens `/admin/generate` to download one PDF per employee-week-object group.

## Deployment Notes

- The app expects Supabase Auth email/password to be enabled.
- The middleware protects authenticated pages.
- RLS policies enforce data access even if UI rules are bypassed.
