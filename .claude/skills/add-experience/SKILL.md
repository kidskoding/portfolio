---
name: add-experience
description: Use when the user says "add experience", "add a job", "add a role", "add an internship", or wants to add a new entry to the Experience section of the portfolio. Appends a new entry to src/data/experience.ts.
allowed-tools: Read, Edit, Write, Glob
---

# Add Experience

Add a new role to `src/data/experience.ts` in the Astro portfolio.

## Arguments

$ARGUMENTS

If no arguments are given, ask the user for the following before proceeding:
- Job title
- Company name
- Start date (e.g. "Jun 2025")
- End date (e.g. "Aug 2025" or "Present")
- Location (city, state) — optional
- Employment type (Full-time / Part-time / Contract / Internship) — optional
- Location type (Remote / On-site / Hybrid) — optional
- Description bullet points (what did you do, what was the impact?)
- Skills (comma-separated list)
- Logo file: is there already a logo in `src/assets/`? If not, ask the user to add one and tell you the filename.

## Step 1: Read the current file

Read `src/data/experience.ts` in full so you know:
- The existing import statements at the top
- All existing `Experience` entries and their `company` names
- The next available `id` number (increment from the highest existing id)
- The exact formatting style used (indentation, quote style, trailing commas)

## Data structure

Each `Experience` entry represents a **company**. It has a `roles` array of `ExperienceRole` objects.

```ts
export interface ExperienceRole {
    title: string;
    employmentType?: string;
    startDate: string;
    endDate: string;
    duration: string;
    description: string[];
    skills: string[];
}

export interface Experience {
    id: string;
    company: string;
    companyLogo: string;
    location?: string;
    locationType?: string;
    startDate: string;   // earliest role start (or the single role's start)
    endDate: string;     // latest role end (or the single role's end)
    duration: string;    // total company tenure
    roles: ExperienceRole[];
}
```

The card renders differently based on `roles.length`:
- **1 role** → flat layout (job title prominent, company below)
- **2+ roles** → grouped layout (company name prominent, each role as a sub-item with its own title/dates/bullets/skills)

## Step 2: Determine if this is a new company or an additional role

**Check if the company already exists** in the `experiences` array.

### Case A — New company

Create a brand new `Experience` entry with one role inside `roles: [...]`. Prepend it to the top of the array (most recent first).

### Case B — Additional role at an existing company

Find the existing `Experience` entry for that company. Add the new role to the **top** of its `roles` array (most recent role first). Then update the top-level `startDate`, `endDate`, and `duration` fields to reflect the full tenure:
- `startDate`: the earliest startDate across all roles
- `endDate`: the latest endDate across all roles (use "Present" if any role is Present)
- `duration`: `calculateDuration(startDate, endDate)`

Do NOT create a new `Experience` entry — just add a role to the existing one.

## Step 3: Determine the logo

For a **new company** only:

Check `src/assets/` for a logo file matching the company name (case-insensitive, any extension).

- If found, note the filename.
- If not found, tell the user the logo is missing and ask them to drop the file into `src/assets/` before continuing, or to confirm they want to proceed without a logo (in which case use an empty string `""` for `companyLogo`).

For an **additional role**, the logo and import already exist — skip this step.

## Step 4: Insert the import (new company only)

If a logo file exists and is not already imported, add an import at the top of the file alongside the other logo imports:

```ts
import <camelCaseName>LogoIcon from "../assets/<filename>";
```

Use the same naming convention as existing imports (e.g. `sapienceLogoIcon`, `uiucLogoIcon`).

## Step 5: Build the role object

```ts
{
    title: "<title>",
    employmentType: "<type>",     // omit if not provided
    startDate: "<Mon YYYY>",
    endDate: "<Mon YYYY or Present>",
    duration: calculateDuration("<startDate>", "<endDate>"),
    description: [
        "<bullet 1>",
        "<bullet 2>",
    ],
    skills: ["<skill1>", "<skill2>"],
},
```

Rules:
- `startDate` and `endDate` must use the format `"Mon YYYY"` (e.g. `"Jun 2025"`) to match `calculateDuration`
- Omit optional fields (`employmentType`) entirely if not provided — don't leave them as empty strings
- Mirror the indentation and trailing-comma style of existing entries exactly

## Step 6: Build or update the Experience entry

For a **new company**:

```ts
{
    id: "<next id>",
    company: "<company>",
    companyLogo: <logoVar>.src,   // or "" if no logo
    location: "<City, State>",    // omit if not provided
    locationType: "<type>",       // omit if not provided
    startDate: "<role startDate>",
    endDate: "<role endDate>",
    duration: calculateDuration("<startDate>", "<endDate>"),
    roles: [
        { /* role object from Step 5 */ },
    ],
},
```

For an **additional role**: insert the new role at the top of the existing `roles` array, and update the top-level `startDate`, `endDate`, and `duration`.

## Step 7: Confirm with the user

After editing the file, report:
- Whether a new company entry was created or a role was added to an existing one
- The role title + company
- The id assigned (new company) or existing id (additional role)
- Whether a logo import was added
- Remind the user to drop a logo into `src/assets/` if one is still missing
