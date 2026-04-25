---
name: add-project
description: Use when the user says "add project", "add a project", or wants to add a new entry to the Projects section of the portfolio. Fetches GitHub repo metadata and appends to src/data/projects.ts.
allowed-tools: Read, Edit, Bash
---

# Add Project

Add a new project to `src/data/projects.ts` in the Astro portfolio.

## Arguments

$ARGUMENTS

If no arguments are given, ask the user for:
- GitHub repo URL
- Which category: `featured`, `hackathons`, `ai-agents`, `dsa`, or `other`

## Step 1: Fetch repo metadata

Use the GitHub CLI to fetch metadata from the repo URL:

```bash
gh api repos/<owner>/<repo> --jq '{name: .name, description: .description, language: .language}'
```

Extract `owner` and `repo` from the provided GitHub URL.

## Step 2: Read the current file

Read `src/data/projects.ts` in full to understand:
- Existing entries in each category array
- The exact formatting style (indentation, quote style, trailing commas)

## Step 3: Build the project object

```ts
{
    name: "<repo name>",
    description: "<repo description>",
    githubUrl: "<full GitHub URL>",
    language: "<primary language>",   // omit if null
}
```

Rules:
- Use the description from GitHub as-is, unless it is blank or unhelpful — in that case ask the user for a better one
- Omit `language` entirely if the API returns null
- Mirror the indentation and trailing-comma style of existing entries exactly
- Add to the **top** of the target category array (most recent first)

## Step 4: Insert into the correct array

Append the project object to the appropriate array in `src/data/projects.ts`:
- `featuredProjects` → for `featured`
- `hackathons` → for `hackathons`
- `aiAgents` → for `ai-agents`
- `dsaProjects` → for `dsa`
- `otherProjects` → for `other`

## Step 5: Confirm with the user

After editing the file, report:
- Project name and category it was added to
- Description used
- Language detected
