---
name: add-project
description: Use when the user says "add project", "add a project", or wants a new entry in the Projects gallery. Fetches GitHub repo metadata and scaffolds src/content/projects/<slug>.mdx.
allowed-tools: Read, Write, Bash, Glob
---

# Add Project

Scaffold a new entry in the `projects` content collection.

## Arguments

$ARGUMENTS

If no arguments are given, ask the user for:
- GitHub repo URL
- Category: `project`, `hackathon`, or `agentic`
- For hackathons: event name and placement, if any

## Step 1: Fetch metadata

```bash
gh api repos/<owner>/<repo> --jq '{name: .name, description: .description, language: .language, pushed: .pushed_at[:10]}'
gh api repos/<owner>/<repo>/readme --jq .content | base64 -d
```

The README call returns 404 when there is none. Treat a README under 120 bytes as absent.

## Step 2: Check for an existing entry

```bash
ls src/content/projects/<repo>.mdx src/content/projects/<repo>/index.mdx 2>/dev/null
```

If one exists, stop and tell the user. Do not overwrite it.

## Step 3: Write the file

Path: `src/content/projects/<repo>.mdx`

```yaml
---
title: "<repo>"
description: "<description>"
category: <category>
repo: https://github.com/<owner>/<repo>
language: "<language>"        # omit when null
stack: []
date: <pushed YYYY-MM-DD>
event: "<event>"              # hackathon only
placement: "<placement>"      # optional
---
```

Body rules, in order:
1. When a README is present, strip its top heading and HTML comments; self-close `<br>`, `<hr>`, and `<img>`; rewrite relative paths to the raw GitHub URL; and escape braces outside fenced code blocks.
2. Without a README, write one paragraph from the description followed by `Writeup coming. Source and progress live in the [repo](<repo url>).`

## Step 4: Build

```bash
bun run build
```

Fix any MDX errors, commonly unclosed HTML tags, bare `<` in prose, or braces in inline text.

## Step 5: Report

- File path written
- Category, event, and placement
- Whether the body came from the README or is a stub
- To add a thumbnail, move the file to `src/content/projects/<repo>/index.mdx`, place `cover.png` beside it, and set `cover: ./cover.png`
