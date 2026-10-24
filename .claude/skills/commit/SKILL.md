---
name: commit
description: >-
  Create well-structured git commits following Conventional Commits.
  Use when the user says "commit", "create a commit", "make a commit",
  "save these changes", or "git commit". Prefer modular-commits when the
  tree holds several unrelated changes; prefer creating-pull-requests when
  opening a PR.
compatibility: Requires git
---

# Commit

## When to use

- User asks to commit, save changes, or write a commit message
- Working tree has **one** logical change (use `modular-commits` for several)

## When not to use

- Opening a PR → `creating-pull-requests`
- Fixing a GitHub issue end-to-end → `issue-fix`

## Conventional Commits Format

```
<type>(<scope>): <description>
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructuring, no behavior change |
| `test` | Adding or fixing tests |
| `chore` | Maintenance, dependencies, CI/CD |

---

## Process

### Step 1: Understand What Changed

Run in parallel:
```bash
git status
git diff --staged
git log --oneline -5
```

Use `git log` to confirm existing scope naming conventions in this repo before choosing a scope.

### Step 2: Draft the Commit Message

- Use **imperative mood**: "add feature" not "added feature"
- Keep the subject line under 72 characters
- If the commit resolves an open GitHub issue, append `(fixes #N)` or `(closes #N)`
- If a `CLAUDE.md` or `.github/` directory exists, check for any commit conventions defined there

### Step 3: Stage Specific Files

Prefer staging named files over `git add -A` to avoid accidentally including secrets or unrelated changes:

```bash
git add path/to/file1 path/to/file2
```

### Step 4: Create the Commit

Always pass the message via HEREDOC to preserve formatting:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description> (fixes #N if applicable)

Co-Authored-By: <your agent's trailer — see Attribution>
EOF
)"
```

Drop the `Co-Authored-By` line when the user has opted out of AI attribution
(see [Attribution](#attribution)).

### Step 5: Verify

```bash
git status
git log --oneline -3
```

---

## Attribution

Credit the **agent harness you are running in** — the tool the user is driving
(Claude Code, Cursor, Codex, …) — not a fixed tool and not the underlying model.
Cursor running a Claude model is still Cursor.

Pick the trailer in this order:

1. **The harness supplies one.** Some harnesses hand you the exact line (Claude
   Code does, in a system reminder). Use it verbatim.
2. **Known harness.** Otherwise use its usual trailer:

   | Harness | Trailer |
   |---------|---------|
   | Claude Code | `Co-Authored-By: Claude <noreply@anthropic.com>` |
   | Cursor | `Co-Authored-By: Cursor <cursoragent@cursor.com>` |

3. **Anything else** (Codex, other agents) with no documented trailer: ask the
   user once which line to use, then record the answer in the repo. Do not
   invent an email address.

The human remains the commit `author`; the co-author line credits the agent.

Exactly one AI co-author line per commit. If a harness git hook already appends
the trailer, do **not** add a second copy, and never credit a harness you are
not running in.

### Toggle: AI co-author on or off

The AI co-author trailer is a **per-git-repo toggle**. It is **on** by default,
and only the user can flip it.

**Off.** The opt-out applies
when the user explicitly says not to credit an AI in this repo ("no co-author",
"no AI attribution", "don't credit the agent"), or when this repo's own memory,
`CLAUDE.md`, or `AGENTS.md` records that they said so. Then add **no** AI
`Co-Authored-By` trailer at all, whichever harness you are. The
opt-out beats this skill's default and any harness or system-prompt attribution
line.

**Back on.** The user can opt back in the same way ("add the co-author again",
"turn AI attribution back on"). Then add the trailer again, and update the
repo's recorded opt-out (memory, `CLAUDE.md`, or `AGENTS.md`) so a later session
does not read the stale "off".

The user's latest explicit statement for this repo wins. Without one, the
toggle is on: add the trailer as usual. Never infer the toggle from another
repo, a global preference, or this repo's existing history.

After committing under an opt-out, check that a hook did not append one anyway:

```bash
git log -1 --format=%B | grep -i 'co-authored-by'
```

If it did, strip it from that unpushed commit before moving on:

```bash
git log -1 --format=%B | sed '/^[Cc]o-[Aa]uthored-[Bb]y:/d' | git commit --amend -F -
```

---

## Examples

```
feat(auth): add OAuth2 login with GitHub (closes #14)
fix(api): handle null response from payment gateway (fixes #31)
refactor(jobs): extract retry logic into base job class
chore(ci): add matrix testing for Ruby 3.2 and 3.3
docs(readme): update local setup instructions
```

---

## Quality Rules

**ALWAYS:**
- Read `git diff --staged` before writing the message
- Stage specific files, not everything
- Confirm scope naming matches the repo's existing convention

**NEVER:**
- Use `--no-verify` to skip hooks
- Amend a previously pushed commit without explicit user approval
- Commit files that may contain secrets (`.env`, credentials)
