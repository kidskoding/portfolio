# CLAUDE.md — Portfolio

Personal portfolio site for Anirudh Konidala. Built with Astro, Tailwind CSS v4, GSAP, and MDX. Font: self-hosted JetBrains Mono.

## Commands

```sh
bun run dev       # dev server at localhost:4321; restart it after editing astro.config.mjs (the auto-restart drops MDX compilation: every .mdx page 500s with "Failed to parse source for import analysis")
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
│   ├── language-colors.ts # GitHub language hex per language (fixed colors, never gruvboxed)
│   ├── devicons.ts     # nvim-web-devicons glyphs for file icons (tree, tabs, statusline, Telescope)
│   ├── project-sort.ts # Shared gallery and case-study ordering
│   ├── certificates.ts # Certificates; PDF paths come from PUBLIC_CERTIFICATE_PDFS env var
│   └── milestones.ts   # Career milestones shown by GitLog.astro
├── lib/
│   └── mermaid.mjs   # Sätteri mdast plugin: ```mermaid fences → inline SVG at build time (beautiful-mermaid)
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
│   ├── checkhealth.astro  # Colophon (font, theme, inspiration, stack) styled as nvim's :checkhealth report; opens as the health:// scratch buffer, not in NvimTree; versions read from package.json
│   └── blog/
└── styles/
    └── global.css

patches/              # bun patchedDependencies; beautiful-mermaid measures labels as monospace (0.6em/char) so JetBrains Mono text fits its boxes, and takes edgeNodeSpacing/alignment options. Edit with `bun patch beautiful-mermaid` then `bun patch --commit`, and drop the `.bun-tag-*` hunk it adds
flake.nix             # Nix dev shell + `nix run` apps wrapping bun scripts
.github/workflows/ci.yml # GitHub Actions: format, alejandra, astro check, build. Vercel Git integration deploys (master to production, PRs to previews)
vendor/gruvbox/       # ellisonleao/gruvbox.nvim git subtree, reference for palette + highlight roles (not built)
```

## Key Conventions

### Adding work experience
Edit `src/data/experience.ts`. Each entry has a `company`, `companyLogo`, date range, and one or more `roles`. Duration is auto-calculated via `calculateDuration()`.

### Adding education
Edit `src/data/education.ts`. `startDate` is optional — if omitted, the card shows only `endDate`.

### Adding blog posts
Add `src/content/blog/<slug>/index.mdx` or use `/blog-post`. Screenshots and other post assets go in `src/content/blog/<slug>/screenshots/` (or beside `index.mdx`) and are referenced with relative paths from the MDX. Frontmatter fields: `title`, `pubDate`, and optional `description`, `updatedDate`, `coverImage` (URL under `public/blog/`), `coverCaption` (gray line under the cover), `draft`, `titleLink` (`{ text, href }`: links that phrase in the post's h1 only; titles are otherwise plain text) (no `tags`; unknown keys are silently stripped). Dates are formatted with `timeZone: 'UTC'` (a bare `2026-10-16` parses as UTC midnight and would show a day early locally). Diagrams: a ```` ```mermaid ```` fence renders to a gruvbox SVG at build time, and its meta can tune the layout (```` ```mermaid edgeNodeSpacing=28 alignment=RIGHTDOWN padding=24 ````: also `nodeSpacing`, `layerSpacing`; keep the SVG under about 744px wide so it isn't scaled down); ASCII in ```` ```text ```` fences still works. Code blocks have their own margin, so never add `<br />` after them. For `vscode-to-neovim`, keep shots in sync with nvimforge UI (lualine Terminal purple `#d3869b`, Claude panel, lazygit, splash, etc.) and mirror every PNG into both `public/blog/vscode-to-neovim/` and `src/content/blog/vscode-to-neovim/screenshots/`.

Markdown and MDX run on Astro 7's default Sätteri processor, so remark/rehype plugins (`markdown.remarkPlugins`, `mdx({ remarkPlugins })`) are rejected or ignored; extend the pipeline with `satteri({ mdastPlugins, hastPlugins })` in `astro.config.mjs` (see `src/lib/mermaid.mjs`). Raw HTML a plugin emits gets smart punctuation (`--` → `–`, curly quotes), so keep CSS out of it.

Technical posts should read dense and demo-led (No Boilerplate / Vimjoyer energy): show the edit or config first, cut throat-clearing, put installs in an appendix, teach keys at the point of use. Keep flowing sentences — density is not staccato slogan headings.

### Adding projects
Add an `.mdx` file to `src/content/projects/` or use `/add-project`. Frontmatter fields: `title`, `description`, `category` (`project` | `hackathon` | `agentic`), `repo`, `language`, `stack`, `date`, and optional `cover`, `event`, `placement`, `order`, and `draft`. Tiles sort by `order` then newest `date`. A project with a cover lives at `src/content/projects/<slug>/index.mdx` with `cover.png` beside it. Projects open as `<slug>.mdx` buffers and appear in NvimTree and Telescope automatically.

### Colors
Gruvbox palette by role, like a colorscheme (`vendor/gruvbox/lua/gruvbox.lua`): page h1 keeps the yellow-orange `gradient-text`; section titles, card titles and eyebrow labels green; dates aqua on blog and projects; on experience/education cards only the icons take color (calendar aqua, location pin orange) and the date and location text stay muted; links blue, aqua on hover (the blog byline name too: underlined on post pages, plain blue in the list, where the whole card is the link); tags yellow; blog post `##`/`###` headings yellow and bold text green; inline code in blog posts orange on bg-hard (not aqua: aqua is link hover and dates); code blocks use Shiki's `gruvbox-dark-medium` theme (`astro.config.mjs`; diff deletions overridden to `#fb4934`); mermaid diagrams on bg-hard: subgraph titles green, edge labels yellow, node borders yellow-dim, arrowheads orange, lines gray, text fg (`global.css` overrides on `.mermaid-diagram`); event badges orange; placement badges purple; prompts red; separators, icons and hints gray/fg3; cursor, active tab and timeline dot yellow; the home intro copies nvim's own intro under gruvbox (logo orange and green, header green, commands blue, `:`, `<Enter>` and separators bg3). Use `text-nvim-*` utilities, never raw hex. Fixed colors (GitHub language colors, brand icons, company logos, file-type icons use their nvim-web-devicons default via `--color-devicon-*` tokens in `global.css`) stay unchanged.

### Keyboard layer
`NvimChrome.astro` binds site-wide vim keys once per document: `j`/`k`/arrows scroll the editor pane, `ctrl+d`/`ctrl+u`, `gg`/`G`, `]b`/`[b` switch buffers, `space e` toggles the tree (same as the `☰ NvimTree` titlebar button: a drawer at 760px and below, the sidebar column above), `space space`, `space ff` or `ctrl+k` opens Telescope (centered, about 70% x 65% of the window, capped at 820x600), `space bd` closes the buffer, `:` opens a command line (`:q`, `:e <file>`, `:bn`, `:bp`, `:help`, `:checkhealth` (opens `/checkhealth`), `:NvimTreeFocus`, which opens the tree if closed and focuses it, never hiding it; the intro's `☰ NvimTree` chip runs it; `:checkhealth`; `:intro`, which shows the splash again without closing buffers), `?` opens the help sheet. The command line has nvim's completion popup (`wildoptions=pum`, gruvbox `Pmenu`/`PmenuSel`): it lists the `COMMANDS` array in `NvimChrome.astro` as soon as `:` opens, filters by prefix, `Tab`/`Shift+Tab`/arrows/`ctrl+n`/`ctrl+p` cycle (past either end returns to the typed text), and clicking an item runs it (`edit` fills `edit ` and waits for a file). Add new ex commands to both `runCommand` and `COMMANDS`. The `cmdheight=1` row (`.nvim-cmdline-row`) always shows under the statusline and opens `:` on click; only the inner `#nvim-cmdline` toggles `hidden`, because Tailwind preflight's layered `[hidden] { display: none !important }` can't be overridden from component CSS. A page can claim keys with `data-vim-layer="grid"` on its `<main>` (projects gallery does). Cards marked `data-vim-item` turn `h`/`j`/`k`/`l` into a card cursor (`Enter` opens, `gg`/`G` jump); the cursor carries the `.vim-cursor` class, which the `hover` variant in `global.css` treats like a real hover. The home intro behaves like nvim's: it shows only on launch, meaning a fresh document load of `/` with no `nvim:launched` sessionStorage key (a reload clears it), or after `:qa` or closing the last buffer (they set `nvim:relaunch`). Any page load sets `nvim:launched`, so soft navigation to `/` (tree, `:e index.astro`) opens the buffer directly. A key press clears the intro; scrolling and clicking do nothing, like an empty nvim buffer. While it shows, `html[data-intro='on']` turns the index tab, titlebar and statusline into a `[No Name]` buffer (SVG file icon in `--color-devicon-default`) and hides the winbar and file info; `[No Name]` has no close button and `:q`/`:bd`/`space bd` leave it open. `[No Name]` is not recorded as an opened buffer: opening a file from it replaces it (like `:e` from an untouched nvim launch), and only a key press that clears the intro records `/` in `nvim:opened-buffers`. Closing the last buffer keeps its tab in place until the swap to `[No Name]`, so the bufferline never empties. On touch screens (`hover: none`) the intro rows read `tap :cmd` without `<Enter>`, and the `:help` row is hidden. Every tab can be closed; there are no pinned tabs. Any element with `data-nvim-cmd="<command>"` runs that command on click, the same as typing it after `:` (the home intro rows use this). Every key has a mouse equivalent. Statusline mode reflects NORMAL / INSERT / VISUAL / COMMAND.

### Adding a page
New routes need an entry in the `buffers` list in `src/components/NvimChrome.astro` so the tab and NvimTree entry show up, and in the `pages` list in `Telescope.astro` for the finder. Blog posts and `/package-json` become tabs automatically.

### Animations
All `[data-animate]` elements are animated on page load via GSAP in `Layout.astro` — staggered fade+slide-in (`opacity: 0 → 1`, `y: 40 → 0`, `scale: 0.98 → 1`). Every page uses it, including blog posts and project case studies (back link + article), so loading feels the same everywhere; mark new page content with `data-animate` and don't add other load animations. Do not add scroll-triggered animations; page-entry only. Never put `transition-all` (or a transform/opacity transition) on a `[data-animate]` element: every GSAP frame restarts the CSS transition and the entry stutters. Use `transition-colors` or move the transition to a child. On soft navigation `astro:before-swap` sets `html[data-entering]`, which holds `[data-animate]` at opacity 0 from the swap until GSAP starts at `astro:page-load`; without it the view-transition snapshot shows the new page fully visible, then it blinks to 0 and fades back in.

### Font and file icons
The whole site uses JetBrains Mono, self-hosted in `public/fonts/` as woff2 (Regular/Bold/Italic/BoldItalic; OFL beside them). File icons use the real nvim-web-devicons glyph from `src/data/devicons.ts`, rendered from `jetbrains-nerd-icons.woff2` (JetBrains Mono Nerd Font Propo subset: glyphs scaled to JetBrains Mono's metrics, full size rather than squeezed into one cell; `jetbrains-nerd-OFL.txt` beside it), and color from the `--color-devicon-*` tokens. A new icon glyph outside that subset falls back to `ui-monospace`: re-subset `JetBrainsMonoNerdFontPropo-Regular.ttf` from the Nerd Fonts `JetBrainsMono.tar.xz` release with `pyftsubset --flavor=woff2 --unicodes=...`, passing the existing subset's codepoints plus the new one (fontTools isn't installed system-wide: `nix-shell -p "python3.withPackages (ps: [ ps.fonttools ps.brotli ])"`). JetBrains Mono type scale in `global.css`: `text-base` 16px (body), `text-sm` 14px (chrome + secondary), up to `text-5xl` 42px (page heroes). Hardcoded chrome sizes use `var(--text-sm)` / `var(--text-base)` so they track the scale.

### Formatting and CI
Prettier (`.prettierrc.json`, with `prettier-plugin-astro`): 2-space indent, single quotes, 120 columns. `src/content/` and Markdown files are ignored so prose stays as written. Nix files use alejandra. CI on GitHub Actions (`.github/workflows/ci.yml`) fails on unformatted code, `astro check` errors or a broken build; run `bun run format` and `bun run check` before pushing.

### Styling
Tailwind CSS v4. Design tokens (colors, spacing) are defined as CSS variables in `global.css`. Use semantic token names like `text-text-primary`, `bg-bg-card`, `border-border-default`, `text-accent`.

### Skills used with Claude Code
- `/add-experience` skill — appends a new entry to `src/data/experience.ts`
- `/add-project` skill — fetches GitHub repo metadata and scaffolds `src/content/projects/<slug>.mdx`
- `/add-role` skill — adds a new role to an existing company entry in `src/data/experience.ts`
- `/blog-post` skill — technical editor for developer posts: extract → thesis candidates → narrative → visual plan → draft → edit, plus critique mode, DEV.to import, and news analysis. Portfolio specifics (frontmatter, build check, rendering limits) are in its `portfolio.md`
- `/update-claude-md` skill — audits and updates CLAUDE.md when project structure or conventions change; auto-triggered on every prompt via hook
- `/commit`, `/modular-commits`, `/creating-pull-requests`, `/diagnosing-bugs`, `/frontend-design` — general workflow skills

`blog-post`, `update-claude-md` and the general workflow skills are copies of global skills from `~/anikonistack/skills/` (frontend-design from the Anthropic plugin), kept in `.claude/cloud-skills/` for Claude Code cloud sessions, which clone the repo and have no `~/.claude`. A `SessionStart` hook in `.claude/settings.json` copies them into `~/.claude/skills/` only when `CLAUDE_CODE_REMOTE=true`; they stay out of `.claude/skills/` so local sessions don't list each skill twice. They are real files, not symlinks: a symlink to a home path is dangling in the clone. When the global copy changes, re-copy it with `cp -rL ~/.claude/skills/<name> .claude/cloud-skills/`.
