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
│   ├── Telescope.astro         # Fuzzy-finder overlay for pages + blog posts
│   ├── GitLog.astro            # Career milestones rendered as `git log` (data/milestones.ts)
│   ├── ExperienceCard.astro    # Work experience timeline card
│   ├── EducationCard.astro     # Education timeline card
│   ├── ExperienceSection.astro # Resume page section (work + education timelines)
│   ├── ProjectCard.astro       # GitHub project card (data/projects.ts)
│   ├── CertCard.astro          # Certificate card, uses IssuerLogo.astro
│   ├── TweetEmbed.astro        # Twitter/X embed for blog posts
│   ├── Navigation.astro        # Top nav + sidebar
│   └── SkillCard.astro
├── content/
│   └── blog/         # MDX blog posts
├── data/
│   ├── experience.ts   # Work experience entries
│   ├── education.ts    # Education entries
│   ├── projects.ts     # Featured GitHub projects
│   ├── certificates.ts # Certificates; PDF paths come from PUBLIC_CERTIFICATE_PDFS env var
│   └── milestones.ts   # Career milestones shown by GitLog.astro
├── layouts/
│   ├── Layout.astro  # Root HTML shell, global GSAP animation
│   └── BlogLayout.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── experience.astro   # Resume page (routed at /experience)
│   ├── projects.astro
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

### Adding a page
New routes need an entry in the `buffers` list in `src/components/NvimChrome.astro` so the tab and NvimTree entry show up, and in the `pages` list in `Telescope.astro` for the finder. Set `pinned: true` on a buffer to keep its tab always visible with no close button (currently `/` and `/experience`). Blog posts and `/package-json` become tabs automatically.

### Animations
All `[data-animate]` elements are animated on page load via GSAP in `Layout.astro` — staggered fade+slide-in (`opacity: 0 → 1`, `y: 40 → 0`, `scale: 0.98 → 1`). Do not add scroll-triggered animations; page-entry only.

### Styling
Tailwind CSS v4. Design tokens (colors, spacing) are defined as CSS variables in `global.css`. Use semantic token names like `text-text-primary`, `bg-bg-card`, `border-border-default`, `text-accent`.

### Skills used with Claude Code
- `/add-experience` skill — appends a new entry to `src/data/experience.ts`
- `/add-project` skill — fetches GitHub repo metadata and appends to `src/data/projects.ts`
- `/add-role` skill — adds a new role to an existing company entry in `src/data/experience.ts`
- `/blog-post` skill — scaffolds a new MDX blog post
- `/linkedin-sync` skill — parses pasted LinkedIn profile text and merges new/changed Experience + Education into `src/data/experience.ts` and `src/data/education.ts`
- `/update-claude-md` skill — audits and updates CLAUDE.md when project structure or conventions change; auto-triggered on every prompt via hook
