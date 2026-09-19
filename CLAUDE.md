# CLAUDE.md — Portfolio

Personal portfolio site for Anirudh Konidala. Built with Astro, Tailwind CSS v4, GSAP, and MDX.

## Commands

```sh
bun run dev       # dev server at localhost:4321
bun run build     # production build to ./dist/
bun run preview   # preview production build

nix develop       # dev shell with bun (flake.nix)
nix run           # bun install --frozen-lockfile + bun run dev; also .#build, .#preview
```

## Project Structure

```
src/
├── assets/           # Images and static assets
├── components/
│   ├── NvimChrome.astro        # Neovim-style shell: bufferline tabs, NvimTree sidebar, winbar
│   ├── Telescope.astro         # Fuzzy-finder overlay for pages, blog posts, and projects
│   ├── GitLog.astro            # Career milestones rendered as `git log` (data/milestones.ts)
│   ├── ExperienceCard.astro    # Work experience timeline card
│   ├── EducationCard.astro     # Education timeline card
│   ├── ExperienceSection.astro # Resume page section (work + education timelines)
│   ├── ProjectCard.astro       # Gallery tile linking to /projects/<slug>
│   ├── CertCard.astro          # Certificate card, uses IssuerLogo.astro
│   ├── TweetEmbed.astro        # Twitter/X embed for blog posts
│   ├── Navigation.astro        # Top nav + sidebar
│   └── SkillCard.astro
├── content/
│   ├── blog/         # MDX blog posts
│   └── projects/     # MDX case study per project; frontmatter drives the gallery tile
├── data/
│   ├── experience.ts   # Work experience entries
│   ├── education.ts    # Education entries
│   ├── language-colors.ts # GitHub language hex per language (fixed colors, never gruvboxed)
│   ├── project-sort.ts # Shared gallery and case-study ordering
│   ├── certificates.ts # Certificates; PDF paths come from PUBLIC_CERTIFICATE_PDFS env var
│   └── milestones.ts   # Career milestones shown by GitLog.astro
├── layouts/
│   ├── Layout.astro  # Root HTML shell, global GSAP animation
│   └── BlogLayout.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── experience.astro   # Resume page (routed at /experience)
│   ├── projects.astro     # Gallery tabs, filter, and vim keys
│   ├── projects/[...id].astro # Project case-study page
│   ├── skills.astro
│   ├── certificates.astro
│   ├── contact.astro
│   ├── package-json.astro # Renders package.json as a JSON buffer (/package-json)
│   └── blog/
└── styles/
    └── global.css

flake.nix             # Nix dev shell + `nix run` apps wrapping bun scripts
vendor/gruvbox/       # morhetz/gruvbox git subtree, reference for palette + highlight roles (not built)
```

## Key Conventions

### Adding work experience
Edit `src/data/experience.ts`. Each entry has a `company`, `companyLogo`, date range, and one or more `roles`. Duration is auto-calculated via `calculateDuration()`.

### Adding education
Edit `src/data/education.ts`. `startDate` is optional — if omitted, the card shows only `endDate`.

### Adding blog posts
Add an `.mdx` file to `src/content/blog/`. Frontmatter fields: `title`, `date`, `description`, `tags`.

### Adding projects
Add an `.mdx` file to `src/content/projects/` or use `/add-project`. Frontmatter fields: `title`, `description`, `category` (`project` | `hackathon` | `agentic`), `repo`, `language`, `stack`, `date`, and optional `cover`, `event`, `placement`, `order`, and `draft`. Tiles sort by `order` then newest `date`. A project with a cover lives at `src/content/projects/<slug>/index.mdx` with `cover.png` beside it. Projects open as `<slug>.mdx` buffers and appear in NvimTree and Telescope automatically.

### Colors
Gruvbox palette by role, like a colorscheme (`vendor/gruvbox/colors/gruvbox.vim`): page h1 keeps the yellow-orange `gradient-text`; section titles, card titles and eyebrow labels green; dates aqua; links blue, aqua on hover; tags yellow; event badges orange; placement badges purple; prompts red; separators, icons and hints gray/fg3; cursor, active tab and timeline dot yellow. Use `text-nvim-*` utilities, never raw hex. Fixed colors (GitHub language colors, brand icons, company logos) stay unchanged.

### Keyboard layer
`NvimChrome.astro` binds site-wide vim keys once per document: `j`/`k`/arrows scroll the editor pane, `ctrl+d`/`ctrl+u`, `gg`/`G`, `]b`/`[b` switch buffers, `space e` toggles the tree, `space ff` or `ctrl+k` opens Telescope, `space bd` closes the buffer, `:` opens a command line (`:q`, `:e <file>`, `:bn`, `:bp`, `:help`), `?` opens the help sheet. A page can claim keys with `data-vim-layer="grid"` on its `<main>` (projects gallery does). Every key has a mouse equivalent. Statusline mode reflects NORMAL / INSERT / VISUAL / COMMAND.

### Adding a page
New routes need an entry in the `buffers` list in `src/components/NvimChrome.astro` so the tab and NvimTree entry show up, and in the `pages` list in `Telescope.astro` for the finder. Set `pinned: true` on a buffer to keep its tab always visible with no close button (currently `/` and `/experience`). Blog posts and `/package-json` become tabs automatically.

### Animations
All `[data-animate]` elements are animated on page load via GSAP in `Layout.astro` — staggered fade+slide-in (`opacity: 0 → 1`, `y: 40 → 0`, `scale: 0.98 → 1`). Do not add scroll-triggered animations; page-entry only.

### Styling
Tailwind CSS v4. Design tokens (colors, spacing) are defined as CSS variables in `global.css`. Use semantic token names like `text-text-primary`, `bg-bg-card`, `border-border-default`, `text-accent`.

### Skills used with Claude Code
- `/add-experience` skill — appends a new entry to `src/data/experience.ts`
- `/add-project` skill — fetches GitHub repo metadata and scaffolds `src/content/projects/<slug>.mdx`
- `/add-role` skill — adds a new role to an existing company entry in `src/data/experience.ts`
- `/blog-post` skill — scaffolds a new MDX blog post
- `/linkedin-sync` skill — parses pasted LinkedIn profile text and merges new/changed Experience + Education into `src/data/experience.ts` and `src/data/education.ts`
- `/update-claude-md` skill — audits and updates CLAUDE.md when project structure or conventions change; auto-triggered on every prompt via hook
