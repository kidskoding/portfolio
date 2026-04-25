# Neovim Portfolio Redesign

**Date:** 2026-04-24  
**Status:** Approved for implementation

---

## Overview

Wrap the entire portfolio in an Alacritty-style Linux Neovim (Gruvbox Dark) interface. The Neovim chrome is the identity layer — bufferline, NvimTree, lualine statusline, Telescope palette. The existing portfolio UI (experience cards, skill tags, blog posts, timeline) renders unchanged inside the editor pane.

---

## Visual Design

### Theme: Gruvbox Dark
| Token | Value | Usage |
|---|---|---|
| `bg` | `#282828` | editor pane, bufferline |
| `bg-hard` | `#1d2021` | outer shell, borders |
| `bg1` | `#32302f` | NvimTree, winbar, cards |
| `bg2` | `#3c3836` | active tree row, card hover |
| `bg3` | `#504945` | statusline section B, borders |
| `fg` | `#ebdbb2` | primary text |
| `fg2` | `#a89984` | secondary text |
| `fg3` | `#7c6f64` | muted text, comments |
| `yellow` | `#fabd2f` | statusline section A, active buffer top border, HEAD commit dot |
| `orange` | `#fe8019` | `feat(career):` commit type, easter egg commands |
| `blue` | `#458588` | TypeScript icon color |
| `green` | `#b8bb26` | `feat(startup):` commit type, git untracked badge |
| `aqua` | `#83a598` | folder color, winbar path, `feat(research):` |
| `purple` | `#d3869b` | MDX icon color |
| `red` | `#fb4934` | git modified badge |

### Chrome Components

**Terminal title bar** (Alacritty Linux style — no traffic light dots):
- Background: `#1d2021`
- Single centered line: `nvim — ani-koni-portfolio/src/<filename>`
- No window controls

**Bufferline** (bufferline.nvim style):
- Background: `#282828`
- Each buffer: `<num> <icon> <filename>`
- Active buffer: `bg:#32302f`, `color:#ebdbb2`, top border `#fabd2f` (2px)
- Inactive: `color:#7c6f64`
- TypeScript icon: `TS` in `#458588`; MDX icon: `MDX` in `#d3869b`
- Modified dot: `●` in `#fb4934`

**NvimTree** (left sidebar, 210px):
- Background: `#282828`, right border `2px solid #1d2021`
- Header: ` NvimTree`
- Folders: `#83a598` (aqua), files: `#a89984`
- Active file: `bg:#3c3836`, `color:#ebdbb2`
- Git badges: modified `M` in `#fe8019`, untracked `U` in `#b8bb26`
- Sharp edges — no border-radius
- File icons: `TS` / `MDX` colored labels

**Winbar** (breadcrumb above editor):
- `ani-koni-portfolio > src >  <filename>`
- Filename highlighted in `#fabd2f`
- Separator ` > ` in `#504945`

**Lualine statusline** (bottom, powerline arrows ``, ``, 22px):
- Section A: `bg:#fabd2f`, `color:#282828`, bold — shows vim mode (` NORMAL`)
- Arrow A→B: `` in `#fabd2f` on `#504945`
- Section B: `bg:#504945`, `color:#ebdbb2` — shows ` main` (git branch)
- Arrow B→C: `` in `#504945` on `#32302f`
- Section C: `bg:#32302f`, `color:#a89984` — shows full file path `~/ani-koni-portfolio/src/<file>`
- Right side mirrors: X = `bg:#504945` (filetype), Y = `bg:#fabd2f` (line:col)

---

## Pages as Files

| Page | File displayed | Tab icon |
|---|---|---|
| `/` | `index.ts` | `TS` blue |
| `/experience` | `experience.ts` | `TS` blue |
| `/skills` | `skills.ts` | `TS` blue |
| `/about` | `about.ts` | `TS` blue |
| `/contact` | `contact.ts` | `TS` blue |
| `/blog` | `blog/index.ts` | `TS` blue |
| `/blog/<slug>` | `blog/<slug>.mdx` | `MDX` purple |

NvimTree shows same file structure. Clicking a file in the tree navigates to that page (Astro `<a>` tag).

---

## Homepage: git log (index.ts)

Replaces the current two-card layout. Keeps profile row at top, adds git log section below.

### Profile row
- Avatar (existing photo), name, role subtitle
- `⌘K / Ctrl+K to navigate` badge in Gruvbox style

### git log section
Header: `-- git log --oneline --all` (comment color `#7c6f64`)

Milestones data lives in new `src/data/milestones.ts`:

```ts
export const milestones = [
  { type: 'feat(career)',    msg: 'joining T-Mobile as SWE',                    date: '2025-05', tag: 'HEAD' },
  { type: 'feat(research)',  msg: 'member of technical staff — agentic AI @ UIUC', date: '2025-01' },
  { type: 'feat(startup)',   msg: 'founded KidsKoding — 1,000+ students taught', date: '2022'    },
  { type: 'chore(edu)',      msg: 'started CS + Education @ UIUC',               date: '2023-08' },
]
```

Commit type color mapping:
- `feat(career):` → `#fe8019` (orange)
- `feat(research):` → `#83a598` (aqua)
- `feat(startup):` → `#b8bb26` (green)
- `chore(edu):` → `#7c6f64` (muted)

HEAD dot: `#fabd2f` with glow. Past dots: `#504945` with `#3c3836` border.
Footer link: `··· :e experience.ts →` in muted color.

---

## Telescope Command Palette (⌘K / Ctrl+K)

Global — accessible on every page via keyboard shortcut.

### Layout
- Overlay: `rgba(10,8,5,0.8)` backdrop
- Container: `bg:#32302f`, `border:1px solid #504945`, no border-radius
- Header: `bg:#3c3836` — `🔭` prompt icon + text input
- Body: results list (left) + preview pane (right, 200px)

### Search scope
1. **Pages** — 6 entries (index, experience, skills, about, contact, blog)
2. **Blog posts** — dynamically loaded from `src/content/blog/` at build time, fuzzy matched on title
3. **Easter egg commands** — hardcoded strings, matched exactly

### Easter eggs
| Input | Response |
|---|---|
| `sudo hire-me` | Show contact info (`anirudhkonidala@gmail.com`) + "elevated privileges granted" |
| `rm -rf /` | Show error: "Permission denied: this portfolio is read-only" |
| `git blame` | Show: "all commits by Anirudh Konidala, no exceptions" |

### Keyboard behavior
- `↑` / `↓` — move selection
- `Enter` — navigate to selected page / trigger easter egg
- `Escape` — close
- Click outside — close
- Triggered by: `⌘K` (Mac), `Ctrl+K` (Linux/Windows)

### Preview pane
Shows a short text preview of the selected item (page description or blog post description).

---

## Content Area

The editor pane renders existing portfolio UI unchanged, with Gruvbox color adaptations:

- `bg-bg-card` → `#32302f`
- `bg-bg-card-hover` → `#3c3836`
- `border-border-subtle` → `#3c3836`
- `border-border-default` → `#504945`
- `text-text-primary` → `#ebdbb2`
- `text-text-secondary` → `#a89984`
- `text-text-muted` → `#7c6f64`
- `text-accent` → `#fabd2f`
- `text-tag-text` → `#83a598`
- `bg-tag-bg` → `rgba(69,133,136,0.1)`
- `border-tag-border` → `rgba(69,133,136,0.2)`
- Experience card border-radius → `0` (sharp, Linux-native)
- Skill tag border-radius → `0`

GSAP page-load animations and glow-card hover effects are preserved.

---

## Navigation: Sidebar → NvimTree

The existing `Navigation.astro` sidebar is replaced by the NvimTree component. On mobile, NvimTree collapses to an off-canvas drawer (same behavior as current sidebar). Hamburger trigger remains.

---

## Implementation Scope

### New files
- `src/data/milestones.ts` — curated git log entries
- `src/components/NvimChrome.astro` — full Neovim chrome wrapper (title bar, bufferline, NvimTree, winbar, statusline)
- `src/components/Telescope.astro` — command palette component + client script
- `src/components/GitLog.astro` — git log section for homepage

### Modified files
- `src/layouts/Layout.astro` — wrap slot in `NvimChrome`, remove old sidebar import, update color tokens
- `src/styles/global.css` — update all design tokens to Gruvbox palette, remove rounded corners from cards/tags
- `src/pages/index.astro` — use `GitLog` component, remove old cards
- All page files — remove `<Navigation />` import (now inside `NvimChrome`)

### Branch
Work on new branch: `feat/neovim-theme`

---

## Out of Scope
- Actual vim keybinding navigation (j/k to scroll, etc.)
- Mobile responsiveness — desktop-first implementation only; mobile adaptation is a follow-up
- Animated mode switching (NORMAL → INSERT on focus)
