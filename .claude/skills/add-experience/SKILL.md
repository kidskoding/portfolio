---
name: add-experience
description: Use when the user says "add experience", "add a job", "add a role", "add an internship", or wants to add a new entry to the Experience section of the portfolio. Appends a new entry to src/data/experience.ts.
allowed-tools: Read, Edit, Write, Glob
---

# Add Experience

Add a new entry to `src/data/experience.ts` in the Astro portfolio.

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
- The next available `id` number (increment from the highest existing id)
- The exact formatting style used (indentation, quote style, trailing commas)

## Step 2: Determine the logo

Check `src/assets/` for a logo file matching the company name (case-insensitive, any extension).

- If found, note the filename.
- If not found, tell the user the logo is missing and ask them to drop the file into `src/assets/` before continuing, or to confirm they want to proceed without a logo (in which case use an empty string `""` for `companyLogo`).

## Step 3: Insert the import

If a logo file exists and is not already imported, add an import at the top of the file alongside the other logo imports:

```ts
import <camelCaseName>LogoIcon from "../assets/<filename>";
```

Use the same naming convention as existing imports (e.g. `sapienceLogoIcon`, `uiucLogoIcon`).

## Step 4: Build the new entry

Use this shape, matching the existing code style exactly:

```ts
{
    id: "<next id>",
    title: "<title>",
    company: "<company>",
    companyLogo: <logoVar>.src,   // or "" if no logo
    employmentType: "<type>",     // omit field if not provided
    startDate: "<Mon YYYY>",
    endDate: "<Mon YYYY or Present>",
    duration: calculateDuration("<startDate>", "<endDate>"),
    location: "<City, State>",    // omit field if not provided
    locationType: "<type>",       // omit field if not provided
    description: [
        "<bullet 1>",
        "<bullet 2>",
    ],
    skills: ["<skill1>", "<skill2>"],
},
```

Rules:
- `startDate` and `endDate` must use the format `"Mon YYYY"` (e.g. `"Jun 2025"`) to match `calculateDuration`
- Omit optional fields (`employmentType`, `location`, `locationType`) entirely if not provided — don't leave them as empty strings
- Mirror the indentation and trailing-comma style of existing entries exactly

## Step 5: Insert into the array

Insert the new entry at the **top** of the `experiences` array (after the opening `[`), so the most recent role appears first in the UI.

## Step 6: Confirm with the user

After editing the file, report:
- The entry that was added (title + company)
- The id assigned
- Whether a logo import was added
- Remind the user to drop a logo into `src/assets/` if one is still missing
