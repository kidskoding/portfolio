# Projects Gallery Design

**Date:** 2026-09-19
**Status:** Approved

## Overview

Replace the five-tab list on `/projects` with a three-tab interactive gallery of project tiles. Every tile links to a full case-study page at `/projects/<slug>`, written in MDX. The gallery is mouse-first with an optional vim-motion layer on top. No backend. Everything is static and built by `bun run build`.

Tabs:

| Tab label | `category` | Initial contents |
|---|---|---|
| `projects` | `project` | anikonistack, minibricks, vendo, blockchain-network |
| `hackathons` | `hackathon` | woogent (HackIllinois 2026), hackillinois-2025, uiuc-datathon-2026 (3rd place) |
| `agentic ai @ uiuc work samples` | `agentic` | cf_ai_procurement_agent, cf_ai_shipment_delay_tracking, music-ai-agent, ev-battery-agent, cfo-liquidity-agent, pm-ai-agent, smart-gRPC, personal-finance-agent, f1-strategist.ai |

The old `featured`, `ai-agents`, `dsa`, and `other` tabs go away. `dsaProjects` and `otherProjects` are not migrated. A single "more on github" link at the bottom of the page covers the rest.

## Data Layer

**Collection:** `projects`, defined in `src/content.config.ts` next to `blog`.

**Files:** `src/content/projects/<slug>.mdx`, or `src/content/projects/<slug>/index.mdx` when the project has a cover image beside it. `<slug>` is the repo name and becomes the URL segment.

**Schema:**

```ts
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['project', 'hackathon', 'agentic']),
      repo: z.string().url(),
      language: z.string().optional(),
      stack: z.array(z.string()).default([]),
      date: z.coerce.date(),
      cover: image().optional(),
      event: z.string().optional(),
      placement: z.string().optional(),
      order: z.number().optional(),
      draft: z.boolean().optional().default(false),
    }),
});
```

Sort within a tab: `order` ascending when set, then `date` descending. Drafts are excluded from the gallery, the detail route, the nvim tree, and Telescope.

**Removed:** `src/data/projects.ts`. Nothing else imports it after this change.

## Pages

### `/projects` (`src/pages/projects.astro`, rewritten)

- Header block unchanged.
- Tab bar keeps the existing button + panel mechanism with three buttons. First tab active on load.
- Each panel: `grid gap-4 sm:grid-cols-2` of `ProjectCard`. Empty panel shows "Coming soon."
- A filter input sits between the tab bar and the grid, styled like the Telescope prompt. Typing narrows tiles in the active tab by title, description, and stack. Empty result shows "no matches".
- Bottom of page: a "more on github" link to `https://github.com/kidskoding`.
- Page statusline (bottom of `main`): `-- NORMAL -- projects/<slug>.mdx 2/4` reflecting the cursor tile, plus `press ? for keys`.

### `/projects/<slug>` (`src/pages/projects/[...id].astro`, new)

Mirrors `src/pages/blog/[...id].astro`.

- `getStaticPaths` from `getCollection('projects', ({ data }) => !data.draft)`.
- Uses `BlogLayout` with `title` and `description`.
- Hero: `cover` via `<Image>` when set, else `ProjectThumb` at full width.
- Header: title, description, meta row. Meta row holds language dot + name, `event` and `placement` badges when present, `date` as month + year, and a "view on github" button linking to `repo`.
- Stack tags row when `stack` is non-empty.
- MDX body inside the same prose class list the blog route uses.
- Footer nav: `← projects` link to `/projects`, plus previous/next project links within the same category.

## Components

### `ProjectCard.astro` (rewritten)

Props: `{ project: CollectionEntry<'projects'> }`.

- Root is an `<a href="/projects/<slug>">` so the whole tile is clickable and keyboard focusable.
- Top: `cover` via `<Image>` at `aspect-[16/9]`, else `ProjectThumb`.
- Bottom: title, description (2-line clamp), language dot + name, stack tags (max 4, then `+N`).
- Hackathon tiles show `event` and `placement` as a badge over the thumbnail corner.
- Data attributes for the gallery script: `data-tile`, `data-slug`, `data-search` (lowercased title + description + stack).
- Cursor state: `.tile-cursor` class, same visual as hover.

### `ProjectThumb.astro` (new)

Props: `{ title: string; language?: string; size?: 'tile' | 'hero' }`.

Generated block, no image file. Background `--color-bg-secondary`, a left stripe in the language color, the language logo from `@iconify-json/simple-icons` when a mapping exists, and the title in mono. `ProjectCard` keeps its existing `languageColors` map; move it into `ProjectThumb` since both need it.

### `NvimChrome.astro`

- `/projects/<slug>` sets `activeFile` to `projects/<slug>.mdx` and `activeIcon` to `mdx`, same branch shape as blog.
- `tabs` gains one entry per project: `{ path: '/projects/<slug>', file: '<slug>.mdx', icon: 'mdx' }`.
- NvimTree gets a `projects` folder after `blog-posts`, one file per project, same toggle group markup.

### `Telescope.astro`

Accepts a `projects` prop shaped like `posts` (`id`, `title`, `description`). Entries appear in the file list as `projects/<slug>.mdx` and open `/projects/<slug>`. `Layout.astro` fetches the collection and passes it, same as `posts`.

## Color Roles

New components use the full gruvbox palette from `global.css`, not only the yellow accent. Roles, applied like a colorscheme:

| Element | Token |
|---|---|
| Tile title, page title | `--color-nvim-fg` |
| Description | `--color-nvim-fg2` |
| Cursor / hover border, active tab | `--color-nvim-yellow` |
| Stack tags | `--color-nvim-green` text on `rgba(184,187,38,0.1)` |
| Event badge | `--color-nvim-orange` |
| Placement badge | `--color-nvim-purple` |
| Date, statusline mode | `--color-nvim-aqua` |
| Links, "view on github" | `--color-nvim-blue` text, `--color-nvim-aqua` on hover |
| Filter prompt `>` | `--color-nvim-red` |
| Language stripe / dot | language → gruvbox map below |

Language map replaces GitHub's hex colors so tiles sit inside the palette:

| Language | Token |
|---|---|
| Rust | orange |
| Python | blue |
| TypeScript, JavaScript | yellow |
| Go | aqua |
| Nix | purple |
| HTML, CSS | red |
| Jupyter Notebook | orange |
| anything else | fg3 |

A site-wide gruvbox pass for the rest of the pages is a separate follow-up spec.

## Gallery Interaction

One client script in `projects.astro`, initialized on `astro:page-load` like the existing tab script. Mouse and touch need none of it.

| Input | Action |
|---|---|
| Click tile | Navigate (native link) |
| Click tab | Switch tab (existing) |
| Click filter input, type | Narrow tiles |
| `Tab` / `Shift+Tab` | Native focus walk across tiles |
| `h` `j` `k` `l` or arrow keys | Move cursor tile. `j`/`k` move by one grid row |
| `Enter` on cursor tile | Navigate |
| `gg` / `G` | First / last visible tile |
| `1` `2` `3` | Switch tab |
| `/` | Focus filter input |
| `Esc` | Clear filter, blur input, return to grid |
| `?` | Toggle a small key cheat sheet |

Rules:

- Keys are ignored while focus is in an input other than the filter, and while Telescope is open.
- Cursor follows mouse hover so hover and key state never disagree.
- Cursor resets to the first visible tile on tab switch and on filter change.
- Statusline updates on every cursor move.
- No key is the only way to reach anything.

### Detail page keys

Same script pattern in `[...id].astro`: `[[` previous project, `]]` next project, `-` back to `/projects`. Links for all three are visible in the footer nav.

## Seeding

Sixteen MDX files created once, locally, with `gh api`:

- `title`, `description`, `language`, `repo` from the repo metadata; `date` from `pushed_at` month.
- Body from the README when one exists. Relative image links rewritten to `https://raw.githubusercontent.com/<owner>/<repo>/HEAD/<path>`. The top-level `# title` heading is stripped since the page renders its own.
- `minibricks` and `hackillinois-2025` have no README. Body is one paragraph built from the description.
- Hackathon entries get `event` and, for `uiuc-datathon-2026`, `placement: 3rd place`.

Build never calls GitHub.

## Skill

`/add-project` is rewritten. Given a repo URL and category, it fetches metadata with `gh api`, seeds the body from the README with the same rewrite rules, and writes `src/content/projects/<slug>.mdx`. It reminds the user to drop `cover.png` beside an `index.mdx` if they want a real thumbnail.

## Out of Scope

- Live stars, commit counts, or any GitHub data at build or run time.
- Migrating `dsaProjects` and `otherProjects`.
- Remembering the active tab across navigations.
- Modal or overlay previews.

## Verification

- `bun run build` passes.
- Playwright pass at 375 and 1440 wide on `/projects` and one detail page per category: tab switch, tile click, filter, `hjkl` + `Enter`, `1`/`2`/`3`, `?` sheet, statusline text.
- Nvim chrome: opening `/projects/minibricks` shows a `minibricks.mdx` tab and highlights it in the tree.
- Telescope: typing `mini` lists `projects/minibricks.mdx`.
- CLAUDE.md updated for the collection, components, route, and skill.
