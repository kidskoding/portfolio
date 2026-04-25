# Neovim Gruvbox Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wrap the entire portfolio in an Alacritty-style Linux Neovim Gruvbox interface — bufferline, NvimTree sidebar, lualine statusline, Telescope command palette, and a git log homepage.

**Architecture:** `NvimChrome.astro` is a layout wrapper injected into `Layout.astro` and `BlogLayout.astro` that renders the full Neovim chrome (title bar, bufferline, NvimTree, winbar, statusline) around a `<slot />`. Each page's `<main>` renders inside the chrome's editor pane. `Telescope.astro` is a global overlay with client-side JS. Color tokens in `global.css` are fully replaced with Gruvbox Dark values. Blog post data for NvimTree + Telescope is fetched at build time inside `NvimChrome.astro`.

**Tech Stack:** Astro 5, Tailwind CSS v4, GSAP (preserved), TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/data/milestones.ts` | Create | Curated git log entries for homepage |
| `src/components/NvimChrome.astro` | Create | Full Neovim chrome wrapper (title bar, bufferline, NvimTree, winbar, statusline) |
| `src/components/GitLog.astro` | Create | git log timeline section rendered on homepage |
| `src/components/Telescope.astro` | Create | Command palette overlay + client-side search/keyboard JS |
| `src/styles/global.css` | Modify | Replace all CSS design tokens with Gruvbox Dark values; remove border-radius from cards/tags |
| `src/layouts/Layout.astro` | Modify | Import + use NvimChrome; pass `currentPath`; import Telescope |
| `src/layouts/BlogLayout.astro` | Modify | Remove Navigation import; fix main styles (NvimChrome now wraps via Layout) |
| `src/pages/index.astro` | Modify | Remove Navigation; remove old cards; add GitLog |
| `src/pages/about.astro` | Modify | Remove Navigation import + `<Navigation />`; fix main class |
| `src/pages/experience.astro` | Modify | Same |
| `src/pages/skills.astro` | Modify | Same |
| `src/pages/contact.astro` | Modify | Same |
| `src/pages/projects.astro` | Modify | Same |
| `src/pages/blog/index.astro` | Modify | Same |
| `src/pages/blog/[...id].astro` | Modify | No Navigation to remove (uses BlogLayout); no change needed |

---

## Task 1: Create branch + update Gruvbox color tokens

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b feat/neovim-theme
```

- [ ] **Step 2: Replace `@theme` block in `src/styles/global.css`**

Replace the entire `@theme { ... }` block (lines 3–34) with:

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Gruvbox Dark */
  --color-bg-primary: #282828;
  --color-bg-secondary: #1d2021;
  --color-bg-card: #32302f;
  --color-bg-card-hover: #3c3836;

  --color-border-subtle: #3c3836;
  --color-border-default: #504945;
  --color-border-accent: #665c54;

  --color-text-primary: #ebdbb2;
  --color-text-secondary: #a89984;
  --color-text-muted: #7c6f64;

  --color-accent: #fabd2f;
  --color-accent-hover: #d79921;
  --color-accent-glow: rgba(250, 189, 47, 0.15);
  --color-accent-subtle: rgba(250, 189, 47, 0.08);

  --color-accent-secondary: #fe8019;

  --color-timeline-line: #504945;
  --color-timeline-dot: #fabd2f;
  --color-timeline-dot-glow: rgba(250, 189, 47, 0.4);

  --color-tag-bg: rgba(69, 133, 136, 0.1);
  --color-tag-text: #83a598;
  --color-tag-border: rgba(69, 133, 136, 0.2);

  /* Gruvbox chrome tokens */
  --color-nvim-bg-hard: #1d2021;
  --color-nvim-bg: #282828;
  --color-nvim-bg1: #32302f;
  --color-nvim-bg2: #3c3836;
  --color-nvim-bg3: #504945;
  --color-nvim-fg: #ebdbb2;
  --color-nvim-fg2: #a89984;
  --color-nvim-fg3: #7c6f64;
  --color-nvim-yellow: #fabd2f;
  --color-nvim-orange: #fe8019;
  --color-nvim-aqua: #83a598;
  --color-nvim-blue: #458588;
  --color-nvim-green: #b8bb26;
  --color-nvim-purple: #d3869b;
  --color-nvim-red: #fb4934;
}
```

- [ ] **Step 3: Remove border-radius from glow-card and update orb colors**

In `src/styles/global.css`, find `.glow-card` and change `border-radius: 0.75rem` to `border-radius: 0`. Also update the two orb gradient colors from `rgba(107, 140, 254, ...)` to `rgba(250, 189, 47, ...)` and `rgba(232, 154, 82, ...)` to `rgba(254, 128, 25, ...)`.

After the change, `.glow-card` should start:
```css
.glow-card {
  position: relative;
  background: var(--color-bg-card);
  border-radius: 0;
  overflow: hidden;
}
```

And `.orb-1`:
```css
.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(250, 189, 47, 0.08) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  animation: float-orb 12s ease-in-out infinite;
}
```

And `.orb-2`:
```css
.orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(254, 128, 25, 0.05) 0%, transparent 70%);
  bottom: 10%;
  left: -80px;
  animation: float-orb-reverse 15s ease-in-out infinite;
}
```

- [ ] **Step 4: Update `html` background inline style in `Layout.astro`**

In `src/layouts/Layout.astro` line 13, change:
```html
<html lang="en" style="background:#0a0a0f">
```
to:
```html
<html lang="en" style="background:#282828">
```

- [ ] **Step 5: Start dev server and verify colors changed**

```bash
npm run dev
```

Open `http://localhost:4321`. Cards should be warm brown (#32302f), accent should be ochre/yellow (#fabd2f), text warm cream (#ebdbb2). No blue/purple anywhere.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro
git commit -m "feat(theme): apply Gruvbox Dark color tokens"
```

---

## Task 2: Create milestones data

**Files:**
- Create: `src/data/milestones.ts`

- [ ] **Step 1: Create `src/data/milestones.ts`**

```typescript
export interface Milestone {
  type: string;
  msg: string;
  date: string;
  tag?: string;
}

export const milestones: Milestone[] = [
  {
    type: 'feat(career)',
    msg: 'joining T-Mobile as SWE',
    date: 'May 2025',
    tag: 'HEAD',
  },
  {
    type: 'feat(research)',
    msg: 'member of technical staff — agentic AI @ UIUC',
    date: 'Jan 2025',
  },
  {
    type: 'feat(startup)',
    msg: 'founded KidsKoding — 1,000+ students taught',
    date: '2022',
  },
  {
    type: 'chore(edu)',
    msg: 'started CS + Education @ UIUC',
    date: 'Aug 2023',
  },
];

export const commitTypeColor: Record<string, string> = {
  'feat(career)':   '#fe8019',
  'feat(research)': '#83a598',
  'feat(startup)':  '#b8bb26',
  'chore(edu)':     '#7c6f64',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/milestones.ts
git commit -m "feat(data): add milestones for git log homepage"
```

---

## Task 3: Create NvimChrome.astro

**Files:**
- Create: `src/components/NvimChrome.astro`

This component renders the full Neovim chrome (title bar, bufferline, NvimTree, winbar, statusline) and puts `<slot />` inside the editor pane. It receives `currentPath` to highlight the active buffer and file.

- [ ] **Step 1: Create `src/components/NvimChrome.astro`**

```astro
---
import { getCollection } from 'astro:content';

interface Props {
  currentPath: string;
}

const { currentPath: rawPath } = Astro.props;
// Normalize trailing slash (Astro may emit /experience/ vs /experience)
const currentPath = rawPath === '/' ? '/' : rawPath.replace(/\/$/, '');

// All pages shown as buffers and in NvimTree
const buffers = [
  { path: '/',           file: 'index.ts',       icon: 'ts'  },
  { path: '/experience', file: 'experience.ts',  icon: 'ts'  },
  { path: '/skills',     file: 'skills.ts',       icon: 'ts'  },
  { path: '/about',      file: 'about.ts',        icon: 'ts'  },
  { path: '/contact',    file: 'contact.ts',      icon: 'ts'  },
  { path: '/projects',   file: 'projects.ts',     icon: 'ts'  },
  { path: '/blog',       file: 'blog/index.ts',   icon: 'ts'  },
];

// Determine active file — handle /blog/<slug> specially
let activeFile = 'index.ts';
let activeIcon: 'ts' | 'mdx' = 'ts';
const blogSlug = currentPath.match(/^\/blog\/(.+)$/);
if (blogSlug) {
  activeFile = `blog/${blogSlug[1]}.mdx`;
  activeIcon = 'mdx';
} else {
  const match = buffers.find((b) => b.path === currentPath);
  if (match) {
    activeFile = match.file;
    activeIcon = match.icon as 'ts' | 'mdx';
  }
}

// Blog posts for NvimTree
const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<div class="nvim-shell">
  <!-- Terminal title bar (Alacritty Linux style — no traffic light dots) -->
  <div class="nvim-titlebar">
    <span>nvim — ani-koni-portfolio/src/{activeFile}</span>
  </div>

  <!-- Bufferline -->
  <div class="nvim-bufferline">
    {buffers.map((buf, i) => (
      <a
        href={buf.path}
        class:list={['nvim-buffer', { active: currentPath === buf.path }]}
      >
        <span class="buf-num">{i + 1}</span>
        <span class:list={['buf-icon', buf.icon === 'mdx' ? 'icon-mdx' : 'icon-ts']}>
          {buf.icon === 'ts' ? 'TS' : 'MDX'}
        </span>
        <span>{buf.file.replace('blog/', '')}</span>
      </a>
    ))}
    {blogSlug && (
      <a href={currentPath} class="nvim-buffer active">
        <span class="buf-num">{buffers.length + 1}</span>
        <span class="buf-icon icon-mdx">MDX</span>
        <span>{blogSlug[1]}.mdx</span>
      </a>
    )}
  </div>

  <div class="nvim-main">
    <!-- NvimTree -->
    <nav class="nvimtree" id="nvimtree" aria-label="File explorer">
      <div class="nvimtree-header"> NvimTree</div>
      <div class="nvimtree-body">
        <div class="tree-folder">▾ <span> ani-koni-portfolio</span></div>
        <div class="tree-folder tree-indent-1">▾ <span> src</span></div>
        {buffers.map((buf) => (
          <a
            href={buf.path}
            class:list={['tree-file tree-indent-2', { 'tree-active': currentPath === buf.path }]}
          >
            <span class:list={['tree-icon', buf.icon === 'mdx' ? 'icon-mdx' : 'icon-ts']}>
              {buf.icon === 'ts' ? 'TS' : 'MDX'}
            </span>
            <span>{buf.file}</span>
          </a>
        ))}
        <div class="tree-folder tree-indent-2">▾ <span> blog</span></div>
        {posts.map((post) => (
          <a
            href={`/blog/${post.id}`}
            class:list={['tree-file tree-indent-3', { 'tree-active': currentPath === `/blog/${post.id}` }]}
          >
            <span class="tree-icon icon-mdx">MDX</span>
            <span>{post.id}.mdx</span>
          </a>
        ))}
        <div class="tree-folder tree-indent-2">▸ <span> data</span></div>
        <div class="tree-folder tree-indent-2">▸ <span> components</span></div>
        <div class="tree-folder tree-indent-2">▸ <span> layouts</span></div>
      </div>
    </nav>

    <!-- Editor area -->
    <div class="nvim-editor-wrap">
      <!-- Winbar -->
      <div class="nvim-winbar">
        <span class="winbar-root">ani-koni-portfolio</span>
        <span class="winbar-sep"> &gt; </span>
        <span>src</span>
        <span class="winbar-sep"> &gt; </span>
        <span class="winbar-file"> {activeFile}</span>
      </div>

      <!-- Editor pane — page content goes here. NO id here; each page's <main id="main-content"> keeps the ID for GSAP targeting -->
      <div class="nvim-editor">
        <slot />
      </div>
    </div>
  </div>

  <!-- Lualine statusline -->
  <div class="nvim-statusline">
    <div class="sl-a"> NORMAL</div>
    <div class="sl-arrow sl-arrow-ab"></div>
    <div class="sl-b"> main</div>
    <div class="sl-arrow sl-arrow-bc"></div>
    <div class="sl-c">~/ani-koni-portfolio/src/{activeFile}</div>
    <div class="sl-spacer"></div>
    <div class="sl-arrow sl-arrow-xb"></div>
    <div class="sl-x"> TypeScript</div>
    <div class="sl-arrow sl-arrow-ya"></div>
    <div class="sl-y">1:1</div>
  </div>
</div>

<style>
  .nvim-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: var(--color-nvim-bg-hard);
    font-family: var(--font-mono);
  }

  /* Title bar */
  .nvim-titlebar {
    background: var(--color-nvim-bg-hard);
    padding: 4px 14px;
    text-align: center;
    font-size: 11px;
    color: var(--color-nvim-fg3);
    border-bottom: 1px solid var(--color-nvim-bg);
    flex-shrink: 0;
  }

  /* Bufferline */
  .nvim-bufferline {
    display: flex;
    background: var(--color-nvim-bg);
    border-bottom: 1px solid var(--color-nvim-bg-hard);
    flex-shrink: 0;
    overflow-x: auto;
  }
  .nvim-bufferline::-webkit-scrollbar { display: none; }

  .nvim-buffer {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    font-size: 12px;
    color: var(--color-nvim-fg3);
    border-right: 1px solid var(--color-nvim-bg-hard);
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.15s;
  }
  .nvim-buffer:hover { color: var(--color-nvim-fg2); }
  .nvim-buffer.active {
    background: var(--color-nvim-bg1);
    color: var(--color-nvim-fg);
    border-top: 2px solid var(--color-nvim-yellow);
    padding-top: 3px;
  }

  .buf-num { font-size: 9px; color: var(--color-nvim-bg3); }
  .nvim-buffer.active .buf-num { color: var(--color-nvim-fg3); }

  /* Main flex area */
  .nvim-main {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* NvimTree */
  .nvimtree {
    width: 210px;
    background: var(--color-nvim-bg);
    border-right: 2px solid var(--color-nvim-bg-hard);
    flex-shrink: 0;
    overflow-y: auto;
    font-size: 12px;
  }
  .nvimtree::-webkit-scrollbar { width: 3px; }
  .nvimtree::-webkit-scrollbar-thumb { background: var(--color-nvim-bg3); }

  .nvimtree-header {
    padding: 5px 10px;
    font-size: 11px;
    color: var(--color-nvim-fg3);
    border-bottom: 1px solid var(--color-nvim-bg1);
    letter-spacing: 0.05em;
  }

  .tree-folder {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 10px;
    color: var(--color-nvim-aqua);
    font-size: 12px;
    line-height: 1.8;
    cursor: default;
  }
  .tree-file {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 10px;
    color: var(--color-nvim-fg2);
    font-size: 12px;
    line-height: 1.8;
    text-decoration: none;
    transition: background 0.1s;
  }
  .tree-file:hover { background: var(--color-nvim-bg1); }
  .tree-file.tree-active {
    background: var(--color-nvim-bg2);
    color: var(--color-nvim-fg);
  }

  .tree-indent-1 { padding-left: 20px; }
  .tree-indent-2 { padding-left: 32px; }
  .tree-indent-3 { padding-left: 44px; }

  /* File icons */
  .buf-icon, .tree-icon {
    font-size: 9px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .icon-ts  { color: var(--color-nvim-blue); }
  .icon-mdx { color: var(--color-nvim-purple); }

  /* Editor area */
  .nvim-editor-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .nvim-winbar {
    background: var(--color-nvim-bg1);
    padding: 3px 14px;
    font-size: 12px;
    color: var(--color-nvim-fg3);
    border-bottom: 1px solid var(--color-nvim-bg-hard);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0;
  }
  .winbar-root { color: var(--color-nvim-aqua); }
  .winbar-sep  { color: var(--color-nvim-bg3); margin: 0 2px; }
  .winbar-file { color: var(--color-nvim-yellow); }

  .nvim-editor {
    flex: 1;
    overflow-y: auto;
    background: var(--color-nvim-bg);
    padding: 24px 28px;
    font-family: var(--font-sans);
  }
  .nvim-editor::-webkit-scrollbar { width: 4px; }
  .nvim-editor::-webkit-scrollbar-thumb { background: var(--color-nvim-bg3); }

  /* Statusline */
  .nvim-statusline {
    display: flex;
    align-items: stretch;
    font-size: 12px;
    height: 22px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .sl-a {
    background: var(--color-nvim-yellow);
    color: var(--color-nvim-bg);
    padding: 0 12px;
    display: flex;
    align-items: center;
    font-weight: 700;
    flex-shrink: 0;
  }
  .sl-b {
    background: var(--color-nvim-bg3);
    color: var(--color-nvim-fg);
    padding: 0 10px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .sl-c {
    background: var(--color-nvim-bg1);
    color: var(--color-nvim-fg2);
    padding: 0 10px;
    display: flex;
    align-items: center;
    font-size: 11px;
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sl-spacer { flex: 1; background: var(--color-nvim-bg1); }
  .sl-x {
    background: var(--color-nvim-bg3);
    color: var(--color-nvim-fg);
    padding: 0 10px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .sl-y {
    background: var(--color-nvim-yellow);
    color: var(--color-nvim-bg);
    padding: 0 10px;
    display: flex;
    align-items: center;
    font-weight: 700;
    flex-shrink: 0;
  }

  /* Powerline arrows via clip-path */
  .sl-arrow {
    width: 14px;
    flex-shrink: 0;
    position: relative;
  }
  /* A→B: yellow triangle on bg3 */
  .sl-arrow-ab {
    background: var(--color-nvim-bg3);
  }
  .sl-arrow-ab::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-nvim-yellow);
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }
  /* B→C: bg3 triangle on bg1 */
  .sl-arrow-bc {
    background: var(--color-nvim-bg1);
  }
  .sl-arrow-bc::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-nvim-bg3);
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }
  /* Right side: X arrow (reversed, bg1 → bg3) */
  .sl-arrow-xb {
    background: var(--color-nvim-bg3);
  }
  .sl-arrow-xb::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-nvim-bg1);
    clip-path: polygon(100% 0, 0 50%, 100% 100%);
  }
  /* Y arrow (bg3 → yellow) */
  .sl-arrow-ya {
    background: var(--color-nvim-yellow);
  }
  .sl-arrow-ya::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-nvim-bg3);
    clip-path: polygon(100% 0, 0 50%, 100% 100%);
  }
</style>
```

- [ ] **Step 2: Verify the file has no syntax errors by checking TypeScript types compile**

```bash
npm run build 2>&1 | head -30
```

Expected: build may fail because Layout.astro hasn't been wired yet — that's fine. Look only for TypeScript errors in `NvimChrome.astro`. If any, fix them.

- [ ] **Step 3: Commit**

```bash
git add src/components/NvimChrome.astro
git commit -m "feat(chrome): add NvimChrome wrapper component"
```

---

## Task 4: Wire NvimChrome into Layout.astro + BlogLayout.astro

**Files:**
- Modify: `src/layouts/Layout.astro`
- Modify: `src/layouts/BlogLayout.astro`

- [ ] **Step 1: Update `src/layouts/Layout.astro`**

Replace the entire file with:

```astro
---
import '../styles/global.css';
import { ClientRouter } from 'astro:transitions';
import NvimChrome from '../components/NvimChrome.astro';
import Telescope from '../components/Telescope.astro';
import { getCollection } from 'astro:content';

interface Props {
  title?: string;
}

const { title = "Portfolio" } = Astro.props;
const currentPath = Astro.url.pathname;

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
).map((p) => ({ id: p.id, title: p.data.title, description: p.data.description ?? '' }));
---

<!doctype html>
<html lang="en" style="background:#282828">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap" rel="stylesheet" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <ClientRouter />
  </head>
  <body class="bg-bg-primary text-text-primary font-sans min-h-screen antialiased overflow-x-hidden">
    <div class="orb orb-1" aria-hidden="true"></div>
    <div class="orb orb-2" aria-hidden="true"></div>
    <div class="orb orb-3" aria-hidden="true"></div>

    <NvimChrome currentPath={currentPath}>
      <slot />
    </NvimChrome>

    <Telescope posts={posts} />

    <script>
      import { gsap } from 'gsap';

      function initAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          document.querySelectorAll('[data-animate]').forEach((el) => {
            (el as HTMLElement).style.opacity = '1';
            (el as HTMLElement).style.transform = 'none';
          });
          return;
        }

        const main = document.getElementById('main-content');
        const elements = main
          ? main.querySelectorAll('[data-animate]')
          : document.querySelectorAll('[data-animate]');

        gsap.killTweensOf(Array.from(elements));

        elements.forEach((el, index) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.12,
              ease: 'power3.out',
            }
          );
        });
      }

      document.addEventListener('astro:page-load', initAnimations);
    </script>
  </body>
</html>
```

Note: `Telescope` component is created in Task 7 — the build will fail until then. That's fine; complete all tasks before doing a full build check.

- [ ] **Step 2: Update `src/layouts/BlogLayout.astro`**

Replace entire file with:

```astro
---
import Layout from './Layout.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<Layout title={title}>
  <main class="max-w-3xl w-full mx-auto px-6 py-8" id="main-content">
    <a href="/blog" class="text-sm text-accent hover:text-accent-hover transition-colors mb-6 inline-block">&larr; Back to blog</a>
    <slot />
  </main>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  <script is:inline>
    function loadTwitterWidgets() {
      if (window.twttr?.widgets?.load) window.twttr.widgets.load();
    }
    window.addEventListener('load', function () {
      loadTwitterWidgets();
      var check = setInterval(function () {
        if (window.twttr?.widgets?.load) {
          window.twttr.widgets.load();
          clearInterval(check);
        }
      }, 100);
      setTimeout(clearInterval, 5000, check);
    });
    document.addEventListener('astro:after-swap', function () {
      setTimeout(loadTwitterWidgets, 150);
    });
  </script>
</Layout>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro src/layouts/BlogLayout.astro
git commit -m "feat(layout): wire NvimChrome into Layout + BlogLayout"
```

---

## Task 5: Remove Navigation from all pages + fix main styles

Every page currently has `import Navigation from '../components/Navigation.astro'` and `<Navigation />` plus a `<main>` with sidebar-offset classes (`lg:ml-72 lg:mr-auto`). Remove the Navigation import/usage and update the `<main>` class on all pages.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/experience.astro`
- Modify: `src/pages/skills.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/projects.astro`
- Modify: `src/pages/blog/index.astro`

The new `<main>` class for all pages (replacing `max-w-3xl w-full min-w-0 mx-auto px-6 py-12 lg:mx-0 lg:ml-72 lg:mr-auto`):
```
max-w-3xl w-full mx-auto px-6 py-8
```

- [ ] **Step 1: Update `src/pages/about.astro`**

Remove line: `import Navigation from '../components/Navigation.astro';`
Remove element: `<Navigation />`
Change main class to: `class="max-w-3xl w-full mx-auto px-6 py-8"`

- [ ] **Step 2: Update `src/pages/experience.astro`**

Same changes as above (relative path `'../components/Navigation.astro'`).

- [ ] **Step 3: Update `src/pages/skills.astro`**

Same changes. Note: `skills.astro` has a long frontmatter — only remove the Navigation import line and `<Navigation />` element. Change main class.

- [ ] **Step 4: Update `src/pages/contact.astro`**

Same changes.

- [ ] **Step 5: Update `src/pages/projects.astro`**

Same changes.

- [ ] **Step 6: Update `src/pages/blog/index.astro`**

Remove: `import Navigation from '../../components/Navigation.astro';`
Remove: `<Navigation />`
Change main class to: `class="max-w-3xl w-full mx-auto px-6 py-8"`

- [ ] **Step 7: Update `src/pages/index.astro` — remove Navigation only (full rewrite in Task 6)**

Remove: `import Navigation from '../components/Navigation.astro';`
Remove: `<Navigation />`
Leave the rest for Task 6.

- [ ] **Step 8: Commit**

```bash
git add src/pages/
git commit -m "refactor(pages): remove Navigation from all pages (NvimChrome handles nav)"
```

---

## Task 6: Create GitLog.astro + update index.astro

**Files:**
- Create: `src/components/GitLog.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/GitLog.astro`**

```astro
---
import { milestones, commitTypeColor } from '../data/milestones';
---

<section class="mt-8">
  <p class="text-xs font-mono mb-4" style="color: var(--color-nvim-fg3)">
    -- git log --oneline --all
  </p>
  <div class="commit-list">
    {milestones.map((m, i) => (
      <div class="commit-row">
        <div class="commit-spine">
          <div class:list={['commit-dot', i === 0 ? 'dot-head' : 'dot-past']}></div>
          {i < milestones.length - 1 && <div class="commit-line"></div>}
        </div>
        <div class="commit-body">
          <div class="commit-msg-row">
            <span class="commit-type" style={`color: ${commitTypeColor[m.type] ?? '#7c6f64'}`}>
              {m.type}:
            </span>
            <span class="commit-msg">{m.msg}</span>
            {m.tag && (
              <span class="commit-tag">{m.tag}</span>
            )}
          </div>
          <div class="commit-date">{m.date}</div>
        </div>
      </div>
    ))}
  </div>
  <p class="commit-more">
    ··· <a href="/experience">:e experience.ts →</a>
  </p>
</section>

<style>
  .commit-list { display: flex; flex-direction: column; }

  .commit-row { display: flex; gap: 12px; }

  .commit-spine {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .commit-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }
  .dot-head {
    background: var(--color-nvim-yellow);
    box-shadow: 0 0 8px rgba(250, 189, 47, 0.5);
  }
  .dot-past {
    background: var(--color-nvim-bg3);
    border: 1px solid var(--color-nvim-bg2);
  }

  .commit-line {
    width: 1px;
    flex: 1;
    background: var(--color-nvim-bg3);
    margin: 3px 0;
    min-height: 16px;
  }

  .commit-body { padding-bottom: 16px; flex: 1; min-width: 0; }

  .commit-msg-row {
    display: flex;
    align-items: baseline;
    gap: 5px;
    flex-wrap: wrap;
  }

  .commit-type {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .commit-msg {
    font-size: 13px;
    color: var(--color-nvim-fg);
  }

  .commit-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    background: var(--color-nvim-bg2);
    color: var(--color-nvim-fg2);
    border: 1px solid var(--color-nvim-bg3);
    padding: 0 5px;
    border-radius: 2px;
  }

  .commit-date {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-nvim-bg3);
    margin-top: 2px;
  }

  .commit-more {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-nvim-bg3);
    padding-left: 23px;
    margin-top: 4px;
  }
  .commit-more a {
    color: var(--color-nvim-blue);
    text-decoration: none;
  }
  .commit-more a:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: Rewrite `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import GitLog from '../components/GitLog.astro';
import anirudhProfileImg from '../assets/anirudh.jpeg';
---

<Layout title="Anirudh Konidala">
  <main class="max-w-3xl w-full mx-auto px-6 py-8" id="main-content">

    <!-- Profile card -->
    <div class="rounded-none border border-border-subtle bg-bg-card p-6 flex flex-col sm:flex-row items-center gap-6" data-animate>
      <img
        src={anirudhProfileImg.src}
        alt="Anirudh Konidala"
        class="w-28 h-28 rounded-none object-cover ring-2 ring-accent/20 shrink-0"
      />
      <div class="text-center sm:text-left">
        <h1 class="text-2xl font-bold text-text-primary tracking-tight font-mono">Anirudh Konidala</h1>
        <p class="text-text-secondary mt-2 font-mono text-sm">I enjoy ai, data, and vibe coding!</p>
        <p class="text-text-secondary mt-1 font-mono text-xs">cs + education @ uiuc</p>
        <div class="mt-3 inline-flex items-center gap-2 bg-bg-card-hover border border-border-default text-accent font-mono text-xs px-3 py-1">
          <span>⌘K / Ctrl+K to navigate</span>
        </div>
      </div>
    </div>

    <!-- git log -->
    <div class="mt-6 border border-border-subtle bg-bg-card p-6" data-animate>
      <GitLog />
    </div>

  </main>
</Layout>
```

- [ ] **Step 3: Start dev server and verify homepage looks correct**

```bash
npm run dev
```

Visit `http://localhost:4321`. Should see: profile card + git log panel inside Neovim chrome. NvimTree on left, bufferline at top, statusline at bottom.

- [ ] **Step 4: Commit**

```bash
git add src/components/GitLog.astro src/pages/index.astro
git commit -m "feat(homepage): add GitLog component and rewrite index.astro"
```

---

## Task 7: Create Telescope.astro (structure + styles)

**Files:**
- Create: `src/components/Telescope.astro`

The Telescope component renders a hidden overlay. Client-side JS (Task 8) powers the search. Blog post data is passed from `Layout.astro` via props.

- [ ] **Step 1: Create `src/components/Telescope.astro`**

```astro
---
interface Post {
  id: string;
  title: string;
  description: string;
}

interface Props {
  posts: Post[];
}

const { posts } = Astro.props;

const pages = [
  { label: 'index.ts',      path: '/',           desc: 'home' },
  { label: 'experience.ts', path: '/experience', desc: 'work history + research' },
  { label: 'skills.ts',     path: '/skills',     desc: 'languages, tools, platforms' },
  { label: 'about.ts',      path: '/about',      desc: 'bio, interests, contact' },
  { label: 'projects.ts',   path: '/projects',   desc: 'things built' },
  { label: 'contact.ts',    path: '/contact',    desc: 'email, linkedin, github' },
  { label: 'blog/index.ts', path: '/blog',       desc: 'blog posts' },
];

const easterEggs = [
  { cmd: 'sudo hire-me',  response: 'elevated privileges granted — anirudhkonidala@gmail.com' },
  { cmd: 'rm -rf /',      response: 'Permission denied: this portfolio is read-only' },
  { cmd: 'git blame',     response: 'all commits by Anirudh Konidala, no exceptions' },
];
---

<!-- Telescope overlay — hidden by default -->
<div id="telescope" class="telescope-overlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Command palette">
  <div class="telescope-backdrop" id="telescope-backdrop"></div>
  <div class="telescope-modal">
    <div class="telescope-header">
      <span class="telescope-icon">🔭</span>
      <input
        id="telescope-input"
        class="telescope-input"
        type="text"
        placeholder="Find files, run commands..."
        autocomplete="off"
        spellcheck="false"
      />
      <span class="telescope-hint">esc to close</span>
    </div>
    <div class="telescope-body">
      <div class="telescope-results" id="telescope-results"></div>
      <div class="telescope-preview" id="telescope-preview">
        <div class="preview-label">Preview</div>
        <div id="telescope-preview-content" class="preview-content"></div>
      </div>
    </div>
  </div>
</div>

<!-- Serialize data for client script -->
<script type="application/json" id="telescope-pages">{JSON.stringify(pages)}</script>
<script type="application/json" id="telescope-posts">{JSON.stringify(posts)}</script>
<script type="application/json" id="telescope-eggs">{JSON.stringify(easterEggs)}</script>

<style>
  .telescope-overlay {
    position: fixed;
    inset: 0;
    z-index: 9000;
    display: flex;
    justify-content: center;
    padding-top: 80px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  .telescope-overlay.open {
    pointer-events: all;
    opacity: 1;
  }

  .telescope-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 8, 5, 0.8);
  }

  .telescope-modal {
    position: relative;
    background: var(--color-nvim-bg1);
    border: 1px solid var(--color-nvim-bg3);
    width: 580px;
    max-width: calc(100vw - 32px);
    max-height: 420px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
    z-index: 1;
    overflow: hidden;
  }

  .telescope-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--color-nvim-bg2);
    border-bottom: 1px solid var(--color-nvim-bg3);
    flex-shrink: 0;
  }

  .telescope-icon { font-size: 14px; }

  .telescope-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 13px;
    color: var(--color-nvim-fg);
    font-family: var(--font-mono);
    caret-color: var(--color-nvim-yellow);
  }
  .telescope-input::placeholder { color: var(--color-nvim-fg3); }

  .telescope-hint {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-nvim-fg3);
  }

  .telescope-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .telescope-results {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
  }
  .telescope-results::-webkit-scrollbar { width: 3px; }
  .telescope-results::-webkit-scrollbar-thumb { background: var(--color-nvim-bg3); }

  .telescope-section {
    padding: 5px 14px 2px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-nvim-fg3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-bottom: 1px solid var(--color-nvim-bg);
  }

  .telescope-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 14px;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.1s;
  }
  .telescope-item:hover,
  .telescope-item.selected {
    background: var(--color-nvim-bg2);
  }
  .telescope-item.selected {
    border-left: 2px solid var(--color-nvim-yellow);
    padding-left: 12px;
  }

  .item-icon {
    font-size: 9px;
    font-weight: 700;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
  }
  .item-label { color: var(--color-nvim-fg); flex: 1; }
  .item-sub { color: var(--color-nvim-fg3); font-size: 11px; font-family: var(--font-mono); }
  .item-easter { color: var(--color-nvim-orange) !important; }
  .item-enter {
    font-size: 10px;
    color: var(--color-nvim-fg3);
    font-family: var(--font-mono);
    background: var(--color-nvim-bg);
    padding: 1px 5px;
  }

  .telescope-preview {
    width: 200px;
    border-left: 1px solid var(--color-nvim-bg3);
    background: var(--color-nvim-bg);
    padding: 10px 12px;
    overflow: hidden;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-nvim-fg3);
    flex-shrink: 0;
  }

  .preview-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
    color: var(--color-nvim-fg3);
  }

  .preview-content {
    line-height: 1.8;
    color: var(--color-nvim-fg2);
    font-size: 11px;
    word-break: break-word;
  }

  /* Easter egg result display */
  .egg-result {
    padding: 12px 14px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-nvim-green);
    border-top: 1px solid var(--color-nvim-bg3);
  }
  .egg-result.error { color: var(--color-nvim-red); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Telescope.astro
git commit -m "feat(telescope): add command palette component structure"
```

---

## Task 8: Add Telescope client-side JS

**Files:**
- Modify: `src/components/Telescope.astro` (append `<script>` block)

- [ ] **Step 1: Append the `<script>` block to `src/components/Telescope.astro`**

Add this after the closing `</style>` tag:

```html
<script>
  interface PageItem { label: string; path: string; desc: string; }
  interface PostItem { id: string; title: string; description: string; }
  interface EggItem  { cmd: string; response: string; }

  const pages  = JSON.parse(document.getElementById('telescope-pages')!.textContent!) as PageItem[];
  const posts  = JSON.parse(document.getElementById('telescope-posts')!.textContent!) as PostItem[];
  const eggs   = JSON.parse(document.getElementById('telescope-eggs')!.textContent!)  as EggItem[];

  const overlay   = document.getElementById('telescope')!;
  const backdrop  = document.getElementById('telescope-backdrop')!;
  const input     = document.getElementById('telescope-input') as HTMLInputElement;
  const results   = document.getElementById('telescope-results')!;
  const preview   = document.getElementById('telescope-preview-content')!;

  let selectedIndex = 0;
  let currentItems: { type: 'page'|'post'|'egg'; label: string; sub: string; path?: string; response?: string }[] = [];

  function open() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    input.focus();
    render('');
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    input.value = '';
  }

  function render(query: string) {
    const q = query.toLowerCase().trim();

    // Check easter eggs first (exact match)
    const egg = eggs.find((e) => e.cmd === q);
    if (egg) {
      results.innerHTML = `<div class="egg-result${egg.cmd === 'rm -rf /' ? ' error' : ''}">${egg.response}</div>`;
      preview.textContent = '';
      currentItems = [];
      return;
    }

    currentItems = [];

    // Pages
    const filteredPages = q
      ? pages.filter((p) => p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
      : pages;

    // Posts
    const filteredPosts = q
      ? posts.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      : posts;

    // Easter eggs — always show if query matches prefix
    const filteredEggs = q
      ? eggs.filter((e) => e.cmd.startsWith(q))
      : eggs;

    filteredPages.forEach((p)  => currentItems.push({ type: 'page', label: p.label,  sub: p.desc,           path: p.path }));
    filteredPosts.forEach((p)  => currentItems.push({ type: 'post', label: p.title,  sub: `blog/${p.id}`,   path: `/blog/${p.id}` }));
    filteredEggs.forEach((e)   => currentItems.push({ type: 'egg',  label: e.cmd,    sub: 'easter egg',     response: e.response }));

    if (selectedIndex >= currentItems.length) selectedIndex = 0;

    let html = '';

    if (filteredPages.length > 0) {
      html += `<div class="telescope-section">Pages</div>`;
      filteredPages.forEach((p, i) => {
        const idx = i;
        const sel = idx === selectedIndex;
        html += `<div class="telescope-item${sel ? ' selected' : ''}" data-index="${idx}" data-path="${p.path}">
          <span class="item-icon icon-ts">TS</span>
          <span class="item-label">${p.label}</span>
          <span class="item-sub">${p.desc}</span>
          ${sel ? '<span class="item-enter">↵</span>' : ''}
        </div>`;
      });
    }

    const postOffset = filteredPages.length;
    if (filteredPosts.length > 0) {
      html += `<div class="telescope-section">Blog</div>`;
      filteredPosts.forEach((p, i) => {
        const idx = postOffset + i;
        const sel = idx === selectedIndex;
        html += `<div class="telescope-item${sel ? ' selected' : ''}" data-index="${idx}" data-path="/blog/${p.id}">
          <span class="item-icon icon-mdx">MDX</span>
          <span class="item-label">${p.title}</span>
          <span class="item-sub">blog/</span>
          ${sel ? '<span class="item-enter">↵</span>' : ''}
        </div>`;
      });
    }

    const eggOffset = postOffset + filteredPosts.length;
    if (filteredEggs.length > 0) {
      html += `<div class="telescope-section">Commands</div>`;
      filteredEggs.forEach((e, i) => {
        const idx = eggOffset + i;
        const sel = idx === selectedIndex;
        html += `<div class="telescope-item${sel ? ' selected' : ''}" data-index="${idx}" data-egg="${e.response}">
          <span class="item-icon">⚡</span>
          <span class="item-label item-easter">${e.cmd}</span>
          ${sel ? '<span class="item-enter">↵</span>' : ''}
        </div>`;
      });
    }

    if (html === '') {
      html = `<div style="padding:16px 14px;font-size:12px;color:var(--color-nvim-fg3);font-family:var(--font-mono)">no results for "${q}"</div>`;
    }

    results.innerHTML = html;
    updatePreview();

    // Attach click handlers
    results.querySelectorAll<HTMLElement>('.telescope-item').forEach((el) => {
      el.addEventListener('click', () => activate(parseInt(el.dataset.index!)));
    });
  }

  function updatePreview() {
    const item = currentItems[selectedIndex];
    if (!item) { preview.textContent = ''; return; }
    if (item.type === 'egg') {
      preview.textContent = item.response ?? '';
    } else if (item.type === 'page') {
      const page = pages.find((p) => p.path === item.path);
      preview.textContent = page ? `${page.label}\n\n${page.desc}` : '';
    } else {
      const post = posts.find((p) => `/blog/${p.id}` === item.path);
      preview.textContent = post ? `${post.title}\n\n${post.description}` : '';
    }
  }

  function activate(index: number) {
    const item = currentItems[index];
    if (!item) return;
    if (item.type === 'egg') {
      results.innerHTML = `<div class="egg-result${item.label === 'rm -rf /' ? ' error' : ''}">${item.response}</div>`;
      preview.textContent = '';
      return;
    }
    if (item.path) {
      close();
      window.location.href = item.path;
    }
  }

  function moveSelection(dir: 1 | -1) {
    if (currentItems.length === 0) return;
    selectedIndex = (selectedIndex + dir + currentItems.length) % currentItems.length;
    render(input.value);
    // Scroll selected item into view
    const sel = results.querySelector<HTMLElement>('.selected');
    sel?.scrollIntoView({ block: 'nearest' });
  }

  // Open on ⌘K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      e.preventDefault();
      close();
    }
  });

  // Keyboard navigation inside palette
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveSelection(-1); }
    if (e.key === 'Enter')     { e.preventDefault(); activate(selectedIndex); }
  });

  input.addEventListener('input', () => {
    selectedIndex = 0;
    render(input.value);
  });

  backdrop.addEventListener('click', close);

  // Re-init after Astro view transitions
  document.addEventListener('astro:page-load', () => {
    // Re-serialize updated posts if any (layout re-renders on navigation)
    const newPosts = JSON.parse(document.getElementById('telescope-posts')?.textContent ?? '[]') as PostItem[];
    newPosts.forEach((p) => {
      if (!posts.find((x) => x.id === p.id)) posts.push(p);
    });
  });
</script>
```

- [ ] **Step 2: Build the project to verify no TypeScript errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: successful build (zero errors). If TypeScript errors appear in Telescope.astro, fix them.

- [ ] **Step 3: Start dev server and test the palette**

```bash
npm run dev
```

1. Press `⌘K` (Mac) or `Ctrl+K` (Linux/Windows) — palette should open
2. Type `exp` — should show `experience.ts` in results
3. Press `↓` to move selection, `↵` to navigate
4. Press `Escape` — should close
5. Type `sudo hire-me` — should show easter egg response
6. Type `rm -rf /` — should show red error message
7. Type `git blame` — should show blame easter egg
8. Click backdrop — should close

- [ ] **Step 4: Commit**

```bash
git add src/components/Telescope.astro
git commit -m "feat(telescope): add search logic, keyboard nav, and easter eggs"
```

---

## Task 9: Final visual QA + branch cleanup

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: zero errors, all pages build successfully.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Visit each page and verify:
- `http://localhost:4321/` — profile card + git log, NvimTree highlights `index.ts`
- `http://localhost:4321/experience` — experience timeline renders, NvimTree highlights `experience.ts`
- `http://localhost:4321/skills` — skill cards render, NvimTree highlights `skills.ts`
- `http://localhost:4321/about` — about page renders
- `http://localhost:4321/projects` — projects + tabs render
- `http://localhost:4321/blog` — blog list renders
- `http://localhost:4321/blog/<any-slug>` — blog post renders, NvimTree highlights MDX file
- `http://localhost:4321/contact` — contact links render

On all pages check:
- Bufferline shows all tabs, active one has yellow top border
- NvimTree shows correct active file highlighted in bg2
- Winbar shows correct breadcrumb with yellow filename
- Statusline shows `NORMAL`, `main` branch, correct file path
- `⌘K` / `Ctrl+K` opens Telescope

- [ ] **Step 3: Check GSAP animations still fire**

Navigate between pages. Each page's `[data-animate]` elements should fade+slide in on page load.

- [ ] **Step 4: Verify gradient-text utility still works**

The `gradient-text` class in `global.css` uses `#6B8CFE` and `#E89A52`. Update those to Gruvbox colors in `global.css`:

```css
.gradient-text {
  background: linear-gradient(135deg, #fabd2f 0%, #fe8019 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-bottom: 0.15em;
  line-height: 1.25;
}
```

- [ ] **Step 5: Commit final fixes**

```bash
git add -p
git commit -m "fix(theme): update gradient-text to Gruvbox yellow/orange"
```

- [ ] **Step 6: Add `.superpowers/` to `.gitignore`**

```bash
echo ".superpowers/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm artifacts"
```
