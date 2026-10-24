---
name: update-claude-md
description: >-
  Audit and update the project's CLAUDE.md so it stays accurate as the codebase
  evolves. Use when CLAUDE.md may be stale — after adding files, changing
  structure, adding commands, discovering new conventions, or at the end of a
  session that touched the codebase.
allowed-tools: Read Edit Bash Glob
---

# Update CLAUDE.md

Systematically audit and update the project's `CLAUDE.md` so it stays accurate as the codebase evolves. This skill runs a diff between what CLAUDE.md says and what the project actually is, then makes targeted edits.

## Arguments

$ARGUMENTS

If a specific section is passed (e.g. "commands" or "structure"), only review that section. Otherwise, do a full audit.

---

## Guiding Principle

CLAUDE.md is a **working contract between the developer and Claude**. It must be:
- **Accurate** — nothing outdated, nothing wrong
- **Actionable** — every line helps Claude make better decisions
- **Minimal** — no noise, no obvious facts, no narratives

If removing a line wouldn't confuse a future Claude instance reading the file cold, don't add it.

---

## Step 1: Gather Ground Truth

Run all of these before reading CLAUDE.md:

```bash
# What commands actually exist
cat package.json | python3 -c "import sys,json; s=json.load(sys.stdin); [print(k,':',v) for k,v in s.get('scripts',{}).items()]"

# Current directory tree (top 3 levels)
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' -not -path '*/.astro/*' -maxdepth 3 -type f | sort

# All components
ls src/components/ 2>/dev/null

# All pages
ls src/pages/ 2>/dev/null && ls src/pages/blog/ 2>/dev/null

# All data files
ls src/data/ 2>/dev/null

# All layouts
ls src/layouts/ 2>/dev/null

# All skills
ls .claude/skills/ 2>/dev/null && ls ~/.claude/skills/ 2>/dev/null

# Key config files
ls *.config.* *.json *.ts 2>/dev/null | head -20

# Recent file changes (what's been touched)
git log --oneline -15
git diff HEAD~3 --name-only 2>/dev/null | sort | uniq
```

---

## Step 2: Read CLAUDE.md

Read the full `CLAUDE.md`. Mentally parse each section:
- Commands
- Project Structure
- Key Conventions
- Any other sections

---

## Step 3: Section-by-Section Audit

Work through every section. For each one, ask: **"Is this still true and complete?"**

### Commands Section

Compare `package.json` `scripts` to what's listed.

| Check | Action |
|-------|--------|
| Script in package.json but not in CLAUDE.md | Add it with its purpose |
| Script in CLAUDE.md but removed from package.json | Remove from CLAUDE.md |
| Command listed with wrong flag or path | Correct it |
| Port numbers, env vars, output paths changed | Update |

### Project Structure Section

Compare the documented tree to the actual file system.

| Check | Action |
|-------|--------|
| New directory created | Add with one-line description |
| Directory renamed | Update name |
| Directory deleted | Remove entry |
| New key file (not every file, just notable ones) | Add with purpose |
| New page route | Add to pages listing |
| New component | Add if it has a non-obvious purpose |
| New data file | Add with description of what it holds |
| New layout | Add with description of when it's used |

**Do NOT list every file** — only the ones another developer (or Claude) would need to find by name.

### Key Conventions Section

For each convention, verify it's still enforced in the actual code:

**Animation conventions**: Check `Layout.astro` — are `[data-animate]` elements still the pattern? Any new animation hooks?

**Styling conventions**: Check `global.css` — are the CSS variable names documented still the right ones? Any new tokens added?

**Data conventions**: Check `src/data/*.ts` — is the documented structure accurate? Any new fields added to interfaces?

**Blog conventions**: Check `src/content/blog/*.mdx` frontmatter — are the documented fields still the correct ones? Any new required fields?

**Component conventions**: Are there new patterns for how components are built (props, slots, etc.)?

**Routing conventions**: Are there new page routes or changed slugs?

### Skills Section (if documented)

Check `.claude/skills/` against what's listed. Add new skills, remove deleted ones. Verify trigger phrases are still accurate.

### Dependencies / Tech Stack (if documented)

```bash
cat package.json | python3 -c "import sys,json; d=json.load(sys.stdin); [print(k,v) for k,v in {**d.get('dependencies',{}),**d.get('devDependencies',{})}.items()]" | grep -E "astro|tailwind|gsap|mdx|vite|typescript"
```

If major version bumps happened (e.g., Astro 5 → 6), update version references.

---

## Step 4: Find Gaps

Look for things in the codebase that aren't documented at all:

```bash
# New components added since last documented
git log --oneline --diff-filter=A -- 'src/components/*.astro' 2>/dev/null | head -10

# New pages added
git log --oneline --diff-filter=A -- 'src/pages/**' 2>/dev/null | head -10

# New data files
git log --oneline --diff-filter=A -- 'src/data/*' 2>/dev/null | head -10

# Config files that might encode conventions
cat astro.config.mjs 2>/dev/null | head -40
cat tailwind.config.* 2>/dev/null | head -30
```

For each gap found: decide if it belongs in CLAUDE.md (recurring pattern, non-obvious, Claude would need to know it). If yes, add a focused entry.

---

## Step 5: Prune Stale Content

Remove or correct anything that is no longer true. Common staleness patterns:

- "Coming soon" sections for features that shipped or were cancelled
- File paths that no longer exist
- Conventions that were abandoned
- Version numbers that are out of date
- Skills that were deleted
- Commands that were renamed

---

## Step 6: Content Quality Check

Before editing, verify each new/changed entry meets these standards:

**Good CLAUDE.md entry:**
- Tells Claude something it couldn't derive from reading the code
- Is specific: naming actual tokens, paths, conventions
- Has no narrative ("we decided to..." "in order to...")

**Bad CLAUDE.md entry:**
- States the obvious ("the project uses TypeScript")
- Is a reminder ("don't forget to...")
- Contains task context ("added for issue #123")
- Belongs in memory files (user preferences, project timeline)
- Is too long (> 3 lines per entry; link to a file instead)

---

## Step 7: Make Edits

Use `Edit` for targeted changes. **Do not rewrite the whole file** — make surgical additions, removals, and corrections. Preserve the formatting style (code blocks, headers, indentation) already in the file.

After each edit, verify the section reads correctly in isolation — another Claude instance should be able to parse it cold with no extra context.

---

## Step 8: Report

After all edits, output a brief summary:

```
CLAUDE.md updated:
+ Added: [what and why]
~ Changed: [what and why]
- Removed: [what and why]
(no changes needed) — if nothing was stale
```

---

## What Belongs Here vs. Other Places

| Info type | Where it goes |
|-----------|--------------|
| How to run the project | CLAUDE.md Commands |
| File structure and key files | CLAUDE.md Structure |
| Code conventions and patterns | CLAUDE.md Conventions |
| Data shape (interfaces) | CLAUDE.md (abbreviated) |
| Who the user is, their preferences | `~/.claude/projects/.../memory/` |
| Ongoing project goals, deadlines | `~/.claude/projects/.../memory/` |
| Debugging solutions | Git commit message |
| One-off task context | Conversation only, never file |

---

## Hook Setup (Automatic Triggering)

This skill is automatically triggered via the `UserPromptSubmit` hook in `.claude/settings.json`. The hook injects a reminder into every prompt so Claude checks CLAUDE.md currency after completing each task.

To install the hook, add this to `.claude/settings.json` in the project root:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo '[CLAUDE.md Auto-Review: After completing this task, run the update-claude-md skill if you: added/removed/renamed any file or directory, added/changed any npm script, changed any code convention, added a new skill, or discovered anything about the project that CLAUDE.md does not yet reflect. Skip if the task was read-only or only changed content (not structure).]'"
          }
        ]
      }
    ]
  }
}
```

**When the hook fires:**
- It injects the reminder into every user prompt as trailing context
- Claude reads it and decides: did this task change anything structural? If yes, run the update
- If the task was read-only (answering a question, writing a blog post, etc.), Claude skips the update

**Manual invocation:**
```
/update-claude-md
/update-claude-md commands    ← only review the Commands section
/update-claude-md structure   ← only review the Structure section
```
