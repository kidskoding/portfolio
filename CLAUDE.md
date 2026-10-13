# CLAUDE.md — Portfolio

Personal portfolio site for Anirudh Konidala. Built with Astro, Tailwind CSS v4, GSAP, and MDX. Font: self-hosted Terminess Nerd Font Mono (the author's Ghostty/Neovim font).

## Commands

```sh
bun run dev       # dev server at localhost:4321
bun run build     # production build to ./dist/
bun run preview   # preview production build
bun run check     # astro check (type check; needs TypeScript 6.x, TS 7 lacks the API)
bun run format    # prettier --write . (format:check in CI)

nix develop       # dev shell with bun (flake.nix); .envrc (`use flake`) loads it via direnv
nix run           # bun install --frozen-lockfile + bun run dev; also .#build, .#preview
nix fmt           # alejandra on the Nix files
```

## Project Structure

```
src/
├── assets/           # Images and static assets
├── components/
│   ├── NvimChrome.astro        # Neovim-style shell: bufferline tabs, NvimTree sidebar, winbar
│   ├── Telescope.astro         # Fuzzy-finder overlay for pages, blog posts, and projects
│   ├── NvimIntro.astro         # Home hero styled as Neovim's :intro splash; rows run commands via data-nvim-cmd
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
│   ├── language-colors.ts # GitHub language hex per language (fixed colors, never themed)
│   ├── devicons.ts     # nvim-web-devicons glyphs for file icons (tree, tabs, statusline, Telescope)
│   ├── project-sort.ts # Shared gallery and case-study ordering
│   ├── certificates.ts # Certificates; PDF paths come from PUBLIC_CERTIFICATE_PDFS env var
│   └── milestones.ts   # Career milestones shown by GitLog.astro
├── layouts/
│   ├── Layout.astro  # Root HTML shell, global GSAP animation
│   └── BlogLayout.astro
├── pages/
│   ├── index.astro    # Home: NvimIntro splash on launch, cleared by the first action to reveal photo card and GitLog
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
    ├── global.css
    └── shiki-tokyonight-moon.json # Shiki code theme, converted from the vendored tokyonight tmTheme

flake.nix             # Nix dev shell + `nix run` apps wrapping bun scripts
.forgejo/workflows/ci.yml # Codeberg Forgejo Actions: format, alejandra, astro check, build; master then deploys to Vercel via the Vercel CLI
vendor/tokyonight/    # folke/tokyonight.nvim git subtree (squashed), reference for palette + highlight roles (not built)
```

## Key Conventions

### Adding work experience
Edit `src/data/experience.ts`. Each entry has a `company`, `companyLogo`, date range, and one or more `roles`. Duration is auto-calculated via `calculateDuration()`.

### Adding education
Edit `src/data/education.ts`. `startDate` is optional — if omitted, the card shows only `endDate`.

### Adding blog posts
Add an `.mdx` file to `src/content/blog/` or use `/blog-post`. Frontmatter fields: `title`, `pubDate`, and optional `description`, `updatedDate`, `coverImage`, `draft`, `titleLink` (`{ text, href }`: links that phrase in the post's h1 only; titles are otherwise plain text) (no `tags`; unknown keys are silently stripped).

### Adding projects
Add an `.mdx` file to `src/content/projects/` or use `/add-project`. Frontmatter fields: `title`, `description`, `category` (`project` | `hackathon` | `agentic`), `repo`, `language`, `stack`, `date`, and optional `cover`, `event`, `placement`, `order`, and `draft`. Tiles sort by `order` then newest `date`. A project with a cover lives at `src/content/projects/<slug>/index.mdx` with `cover.png` beside it. Projects open as `<slug>.mdx` buffers and appear in NvimTree and Telescope automatically.

### Colors
TokyoNight Moon palette by role, like a colorscheme (`vendor/tokyonight/lua/tokyonight/colors/moon.lua` and `groups/`): page h1 keeps the blue-magenta `gradient-text`; section titles, card titles and eyebrow labels blue (`Title`); dates orange (`Number`); links teal (`@markup.link`), cyan on hover; tags yellow; event badges cyan; placement badges purple; prompts magenta (Telescope prompt prefix); blog post `##` yellow and `###` green (markdown heading rainbow), bold text plain fg; inline code blue on terminal_black (`@markup.raw.markdown_inline`); code blocks use `src/styles/shiki-tokyonight-moon.json`, converted from `vendor/tokyonight/extras/sublime/tokyonight_moon.tmTheme`, on bg_dark (`astro.config.mjs`); separators, icons and hints comment/dark5; cursor and timeline dot blue; active tab indicator git.change; lualine, Telescope, NvimTree and the help sheet follow their tokyonight groups. `--color-nvim-*` tokens in `global.css` use tokyonight palette key names (`bg-dark`, `bg-highlight`, `fg-gutter`, `comment`, `fg-dark`, `teal`, `magenta`, ...). Use `text-nvim-*` utilities, never raw hex. Fixed colors (GitHub language colors, brand icons, company logos, file-type icons use their nvim-web-devicons default via `--color-devicon-*` tokens in `global.css`) stay unchanged.

### Keyboard layer
`NvimChrome.astro` binds site-wide vim keys once per document: `j`/`k`/arrows scroll the editor pane, `ctrl+d`/`ctrl+u`, `gg`/`G`, `]b`/`[b` switch buffers, `space e` toggles the tree (same as the `☰ NvimTree` titlebar button: a drawer at 760px and below, the sidebar column above), `space space`, `space ff` or `ctrl+k` opens Telescope (centered, about 70% x 65% of the window, capped at 820x600), `space bd` closes the buffer, `:` opens a command line (`:q`, `:e <file>`, `:bn`, `:bp`, `:help`), `?` opens the help sheet. A page can claim keys with `data-vim-layer="grid"` on its `<main>` (projects gallery does). Cards marked `data-vim-item` turn `h`/`j`/`k`/`l` into a card cursor (`Enter` opens, `gg`/`G` jump); the cursor carries the `.vim-cursor` class, which the `hover` variant in `global.css` treats like a real hover. The home intro behaves like nvim's: it shows only on launch, meaning a fresh document load of `/` with no `nvim:launched` sessionStorage key (a reload clears it), or after `:qa` or closing the last buffer (they set `nvim:relaunch`). Any page load sets `nvim:launched`, so soft navigation to `/` (tree, `:e index.astro`) opens the buffer directly. A key press clears the intro; scrolling and clicking do nothing, like an empty nvim buffer. While it shows, `html[data-intro='on']` turns the index tab, titlebar and statusline into a `[No Name]` buffer (SVG file icon in `--color-devicon-default`) and hides the winbar and file info; `[No Name]` has no close button and `:q`/`:bd`/`space bd` leave it open. On touch screens (`hover: none`) the intro rows read `tap :cmd` without `<Enter>`, and the `:help` row is hidden. Every tab can be closed; there are no pinned tabs. Any element with `data-nvim-cmd="<command>"` runs that command on click, the same as typing it after `:` (the home intro rows use this). Every key has a mouse equivalent. Statusline mode reflects NORMAL / INSERT / VISUAL / COMMAND.

### Adding a page
New routes need an entry in the `buffers` list in `src/components/NvimChrome.astro` so the tab and NvimTree entry show up, and in the `pages` list in `Telescope.astro` for the finder. Blog posts and `/package-json` become tabs automatically.

### Animations
All `[data-animate]` elements are animated on page load via GSAP in `Layout.astro` — staggered fade+slide-in (`opacity: 0 → 1`, `y: 40 → 0`, `scale: 0.98 → 1`). Every page uses it, including blog posts and project case studies (back link + article), so loading feels the same everywhere; mark new page content with `data-animate` and don't add other load animations. Do not add scroll-triggered animations; page-entry only.

### Font and file icons
The whole site uses Terminess Nerd Font Mono (icons fit one cell, like in a terminal), self-hosted in `public/fonts/` as woff2 files subset to the characters the site uses (about 10 KB per weight; OFL license beside them). File icons use the real nvim-web-devicons glyph from `src/data/devicons.ts`, rendered from `terminess-nerd-icons.woff2` (Propo variant glyphs: full size and correctly spaced; Mono squeezes them into one cell, non-Mono overflows into the next character), and color from the `--color-devicon-*` tokens. A character outside the subset (new symbol in a post, new devicon) falls back to `ui-monospace`: re-subset from the Terminus release in nerd-fonts with `fontTools.subset --flavor=woff2 --unicodes=...`, adding the new codepoints. Terminus is a pixel font, crisp only at 12/14/16/18/20/22/24/28/32px: the Tailwind `--text-*` scale in `global.css` is remapped to those sizes (`text-base` is 18px; chrome labels 14px), and any hand-written `font-size` must use one of them.

### Formatting and CI
Prettier (`.prettierrc.json`, with `prettier-plugin-astro`): 2-space indent, single quotes, 120 columns. `src/content/` and Markdown files are ignored so prose stays as written. Nix files use alejandra. CI on Codeberg (`.forgejo/workflows/ci.yml`) fails on unformatted code, `astro check` errors or a broken build; run `bun run format` and `bun run check` before pushing.

### Styling
Tailwind CSS v4. Design tokens (colors, spacing) are defined as CSS variables in `global.css`. Use semantic token names like `text-text-primary`, `bg-bg-card`, `border-border-default`, `text-accent`.

### Skills used with Claude Code
- `/add-experience` skill — appends a new entry to `src/data/experience.ts`
- `/add-project` skill — fetches GitHub repo metadata and scaffolds `src/content/projects/<slug>.mdx`
- `/add-role` skill — adds a new role to an existing company entry in `src/data/experience.ts`
- `/blog-post` skill (global, lives in `~/anikonistack/skills/blog-post/`) — technical editor for developer posts: extract → thesis candidates → narrative → visual plan → draft → edit, plus critique mode, DEV.to import, and news analysis. Portfolio specifics (frontmatter, build check, rendering limits) are in its `portfolio.md`
- `/update-claude-md` skill — audits and updates CLAUDE.md when project structure or conventions change; auto-triggered on every prompt via hook
