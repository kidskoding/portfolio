---
name: add-role
description: Use when the user wants to add a new role to an existing company in the Experience section — e.g. "add a role at Microsoft", "I got a new title at X", "add student ambassador to Microsoft".
allowed-tools: Read, Edit, Glob
---

# Add Role

Add a new role to an **existing** company entry in `src/data/experience.ts`.

## Arguments

$ARGUMENTS

If no arguments are given, ask the user for:
- Company name (must already exist in `experiences`)
- Role title
- Start date (e.g. "Apr 2026")
- End date (e.g. "Aug 2026" or "Present")
- Employment type (Full-time / Internship / etc.) — optional
- Description bullet points — use lowercase style matching existing entries
- Skills (comma-separated list)

## Style convention

All titles and description bullets use **lowercase** (e.g. `"student ambassador"`, `"leading and sharing knowledge about..."`). Match this exactly.

## Step 1: Read the file

Read `src/data/experience.ts` in full. Identify the target company entry by name.

If the company does **not** exist, stop and tell the user to use `/add-experience` instead.

## Step 2: Build the role object

```ts
{
    title: "<lowercase title>",
    employmentType: "<type>",     // omit if not provided
    startDate: "<Mon YYYY>",
    endDate: "<Mon YYYY or Present>",
    duration: calculateDuration("<startDate>", "<endDate>"),
    description: [
        "<lowercase bullet>",
    ],
    skills: ["<Skill1>", "<Skill2>"],
},
```

- Dates must be `"Mon YYYY"` format
- Omit `employmentType` entirely if not provided
- Mirror indentation and trailing-comma style of existing entries

## Step 3: Insert the role

Insert the new role at the **top** of the company's `roles` array (most recent first).

Then update the company's top-level fields:
- `startDate`: earliest `startDate` across all roles
- `endDate`: latest `endDate` across all roles (`"Present"` if any role is Present)
- `duration`: `calculateDuration(startDate, endDate)`

## Step 4: Confirm

Report:
- Role title + company
- Whether the company is now grouped (2+ roles) — if so, the card will switch to grouped layout (company name prominent, roles as sub-items, no calendar icon at top)
