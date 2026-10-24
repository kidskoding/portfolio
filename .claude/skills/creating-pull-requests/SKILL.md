---
name: creating-pull-requests
description: >-
  Open a pull request reviewers can decide on quickly — house rules, branch
  audit, gates, facts sheet, then draft PR. Use when a branch is ready to become
  a PR, or the user says "open a PR", "make a PR", "write the PR description",
  or "is this ready to submit". Covers open-source and internal repos.
compatibility: Requires git and gh
---

# Creating Pull Requests

## Overview

A pull request is a request for a stranger's time. The reviewer decides in under a minute whether to engage. Every step here lowers the cost of saying yes.

**Core principle:** the diff is the argument, the body is the summary of why. Nothing in the body may claim something the diff or the shell history does not prove.

**REQUIRED SUB-SKILL:** Use `commit` for commit messages. Repo-specific overlays (for example `uv-pull-requests`) take precedence over this skill wherever they conflict.

## Step 1: Learn the house rules

Read, in this order, and quote the relevant line back to the user when a rule blocks the PR:

1. `CONTRIBUTING.md` (or `CONTRIBUTING`, `docs/contributing.md`)
2. `.github/PULL_REQUEST_TEMPLATE.md` (or `.github/PULL_REQUEST_TEMPLATE/*.md`)
3. Any AI policy linked from `CONTRIBUTING.md` or the org's `.github` repo
4. The last 20 merged PR titles: `gh pr list --state merged --limit 20 --json title,author --jq '.[] | "\(.author.login): \(.title)"'`

From 4, write down the title grammar: imperative vs `type(scope):` prefix, capitalized vs lowercase, backticks or not, trailing period or not.

**AI policy gate:** if the repo forbids AI-written PR text or autonomous agents, the skill's output changes shape: produce the facts sheet (Step 4) and stop. The user writes the body. Never run `gh pr create` in such a repo.

## Step 2: Audit the branch

Run and read every line of output:

```bash
git fetch origin
git log --oneline origin/main..HEAD
git diff origin/main...HEAD --stat
git diff origin/main...HEAD
```

Then answer these questions in writing:

| Question          | Pass condition                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One concern?      | Every hunk serves the stated purpose. Unrelated hunks get their own branch.                                                                                          |
| Debug leftovers?  | No `println!`, `console.log`, `eprintln!`, `dbg!`, `print(`, `TODO`, commented-out code added by this branch.                                                        |
| Formatting drift? | No hunks that only change whitespace or import order in untouched code.                                                                                              |
| Rebased?          | `git rev-list --count HEAD..origin/main` is `0`.                                                                                                                     |
| Commit messages?  | No `wip`, `fix`, `asdf`. Squash-merge repos still show them to reviewers.                                                                                            |
| Issue link?       | Issue exists and is not labeled `needs-design`, `needs-decision`, `wontfix`, or equivalent. A new feature with no issue or maintainer go-ahead does not become a PR. |

Any failure: fix the branch first. Do not write a body for a branch that fails this table.

## Step 3: Run the gates

Run the repo's own test, lint, format, and generated-file commands exactly as `CONTRIBUTING.md` lists them. Record each command with its exit code. A gate that is too slow to run is reported as **not run**, never as passed.

## Step 4: Produce the facts sheet

This is the skill's required output. Same shape every time:

```
TITLE CANDIDATES (house grammar: <grammar from Step 1>)
1. <title>
2. <title>

PROBLEM      <one sentence: what breaks, for whom, issue link>
CAUSE        <one sentence: where in code, why>
FIX          <one sentence: approach; alternatives rejected if any>
REVIEWER
SHOULD KNOW  <behavior change / edge case / perf / follow-up deliberately left out, or "none">

GATES RUN
  <command>   exit <code>
  <command>   NOT RUN (<reason>)

TESTS ADDED  <test name + file, or "none: <reason>">
```

Title rules: matches house grammar, states the change not the ticket, stands alone as a squash-merge commit subject, under 72 characters.

## Step 5: Fill the template

When the repo allows agent-written text: fill every section of the PR template from the facts sheet. Keep the template's headings verbatim. Three short paragraphs or fewer. No line-by-line restatement of the diff. No "Generated with" footers unless the repo asks for them.

Test-plan section content comes only from the `GATES RUN` and `TESTS ADDED` slots. Nothing else.

Open as draft unless the user says otherwise:

```bash
git push -u origin <branch>
gh pr create --draft --title "<title>" --body-file <path>
```

## After opening

- Reply to every review comment. Resolve or answer. Never silent.
- Push follow-up commits. No force-push during review unless a maintainer asks. Force-push breaks comment anchors.
- No pings for 48 hours. Then one polite bump.

## Gotchas

- **A test plan that describes what you would verify is a fabricated test plan.** "Verified by reading the help output after a local build" when no build ran got caught in baseline testing. Only commands with recorded exit codes go in the test plan.
- **Reading the AI policy is not following it.** Baseline agent read Astral's policy, then wrote the full body anyway and added an AI footer. When the policy forbids agent-written bodies, the facts sheet is the deliverable. Stop there.
- **Issue numbers in the user's prompt are unverified.** `gh issue view <n> --json title,state,labels` before linking. Baseline found the given number was an unrelated PR.
- **The user's stated change may be factually wrong.** Read the code the diff touches. Baseline found the new help text described a field that is always `null` for that command.
- **"Optional" gates are skipped gates.** A comment-only diff still gets `rustfmt`/`prettier`/formatter check. Mark it run or not run. Never "optional".
- **`--draft` is not weakness.** Draft signals "approach check wanted" and costs the reviewer less than a full review of the wrong approach.
