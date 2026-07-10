---
name: linkedin-sync
description: Use when the user says "linkedin sync", "sync my linkedin", "update from linkedin", or pastes LinkedIn profile text/URL and wants their portfolio updated. Parses pasted LinkedIn profile text and merges new/changed Experience and Education entries into src/data/experience.ts and src/data/education.ts.
allowed-tools: Read, Edit, Write, Glob, Bash
---

# LinkedIn Sync

Merge a pasted LinkedIn profile into the portfolio's data files. LinkedIn has no
open API and blocks scraping, so **the user supplies the profile text** — you
parse it and diff it against the existing data, never invent entries.

## Step 0: Get the profile text

`$ARGUMENTS` may already contain pasted profile text or a path to a saved copy.

If a URL is given, attempt a firecrawl scrape first:

```bash
firecrawl scrape "<url>" --only-main-content -o .firecrawl/linkedin-profile.md
```

**Note:** firecrawl (and every other scraper) blocks `linkedin.com` on purpose —
it returns `Error: ... we do not support this site`. So this only succeeds for a
non-LinkedIn URL (a personal site, hosted resume, about page). If the scrape
fails or returns a login wall, fall back to paste.

If no usable text, tell the user to paste it — open the profile, copy the
**Experience** and **Education** sections as text, or drop a LinkedIn data-export
`Positions.csv` / `Education.csv` and give you the path.

Do not proceed without real source text. Never fabricate roles, dates, or bullets.

## Step 1: Read the current data

Read both in full so you know existing entries, the exact formatting, the next
free `id`, and the logo imports already present:
- `src/data/experience.ts`
- `src/data/education.ts`

## Step 2: Parse the pasted text into entries

Split into **experience** items and **education** items.

Per experience item, extract: company, title, employment type, start date, end
date (`Present` if current), location, and any description bullets. Normalize
every date to `"Mon YYYY"` (e.g. `"Jun 2025"`) — this is required by
`calculateDuration`. LinkedIn shows "Jun 2025 - Present · 3 mos"; keep the dates,
drop the duration (it's recomputed).

Per education item, extract: institution, degree, field, start date (optional),
end date, and any bullets.

If a field is missing from the paste, leave it out — don't guess.

## Step 3: Diff against existing data

For each parsed item, classify it:

- **New company** → not in `experiences` at all.
- **New role at existing company** → company matches, but this title/date range
  is not in its `roles` array.
- **Changed** → same company + role but end date moved (e.g. was `Present`, paste
  shows an end date) or bullets/skills differ.
- **Unchanged** → already present and identical → skip.

Same for education against `educations` (match on institution + degree).

Show the user the classified diff (new / changed / skipped) **before editing**
and let them confirm or trim it.

## Step 4: Apply the changes

Follow the exact structures and rules in the `add-experience` and `add-role`
skills — do not restate them here, reuse them:

- **New company** → build a new `Experience` entry (one role), prepend to the
  array. Handle the logo per Step 3/4 of `add-experience`: look in `src/assets/`
  for a matching logo; if missing, tell the user to drop one in and use `""` for
  `companyLogo` until then.
- **New role at existing company** → add the role to the **top** of that
  company's `roles`, then recompute the top-level `startDate` (earliest),
  `endDate` (latest, `Present` if any role is present), and
  `duration: calculateDuration(...)`.
- **Changed** → edit the specific role's fields in place; update the top-level
  company `endDate`/`duration` if the change moved them.
- **Education** → add/update entries in `educations` matching the `Education`
  interface (`startDate` optional). Assign the next free `id`.

Match indentation, quote style, and trailing commas of the surrounding code
exactly. Omit optional fields entirely rather than writing empty strings.

## Step 5: Report

Summarize what changed: companies/roles/education added or updated, ids assigned,
and any logos the user still needs to drop into `src/assets/`. Remind them to run
`npm run dev` to eyeball the result.
