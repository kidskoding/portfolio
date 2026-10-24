# Portfolio Target

The user's portfolio: Astro + MDX + Tailwind v4, usually at `~/uiuc/go-mama-27/portfolio`. Its `CLAUDE.md` is the source of truth if anything here disagrees.

## Material for Stage 1

- `src/data/experience.ts`: companies, roles, dates, skills
- `src/data/education.ts`, `src/data/milestones.ts`: education and career milestones
- `src/content/projects/<slug>.mdx` or `<slug>/index.mdx`: project case studies with `repo`, `stack`, `event`, `placement`. Link related posts to `/projects/<slug>`.

## File

Path: `src/content/blog/<kebab-case-slug>.mdx`. Frontmatter must match `src/content.config.ts`:

```mdx
---
title: "<idea-driven title>"
description: "<subtitle; renders under the h1 and on the blog index>"
pubDate: <YYYY-MM-DD, today>
draft: true
coverImage: "/blog/<slug>-cover.<ext>"
---

import TweetEmbed from '../../components/TweetEmbed.astro';

[post body]
```

- `draft: true` while iterating. Drafts are excluded from the build and do not appear on `/blog`, even in the dev server. When a draft is ready to read, tell the user it is hidden and offer to flip it to `false`; warn that committing it as `false` publishes it on the next deploy.
- Optional `titleLink: { text, href }` links one phrase of the post-page h1. Never put Markdown links in `title`: it is plain text in tabs, cards, and previews.
- Optional `coverCaption` renders as a muted gray line under the cover (say where or what the photo is).
- `coverImage` (served from `public/blog/`) and the `TweetEmbed` import only when used. Tweets embed as `<TweetEmbed url="..." />`.
- News analysis posts end with a `## References` section and cite inline with `<sup>[N](#references)</sup>`.
- Add `*Originally published on [DEV](<url>).*` only for posts actually on DEV.

After writing or revising, run `bun run build` in the portfolio root and fix any MDX error before reporting back.

## Rendering

- `##` and `###` render yellow (bold is green, so headings and highlights stay distinct). Blockquotes, tables, and `---` rules are styled.
- `description` is the subtitle. Put the employer or job context there, not in the title.

## Cover Image

`coverImage` renders as a wide banner (about 2.4:1, `object-cover`), so anything near the top or bottom edge gets cropped. Good covers show the post's idea: a monospace diagram or snippet from the post on the gruvbox background, or a real photo the user took. Avoid company or tool logos (reads as an ad, and trademarks), stock "developer at laptop" photos, AI-glow imagery, and screenshots of work code or internal tools.

## Gotchas

- **Frontmatter is `pubDate`, not `date`, and there is no `tags` or `subtitle` field.** Zod strips unknown keys silently.
- **MDX treats `<` and `{` in prose as JSX.** `Effect<A, E, R>` or `{id}` outside backticks breaks the build.
- **Numbered lists render with numbers** (`[&_ol]:list-decimal` in `src/pages/blog/[...id].astro`), so a numbered `## References` list lines up with `<sup>[N](#references)</sup>` citations. Put `<a name="references"></a>` under that heading so the citation links land.
- **Mermaid renders** at build time: a ```` ```mermaid ```` fence becomes a gruvbox SVG (flowchart, state, sequence, class, ER, xychart; via `beautiful-mermaid` in `src/lib/mermaid.mjs`). Use it for flows and boundaries; keep ASCII ```` ```text ```` fences for annotated code, trees, and side-by-side before/after columns, which Mermaid draws worse.
- **No `og:image` or Twitter card tags** in the blog layout, so LinkedIn link previews show no cover. Mention it when the user plans to share on LinkedIn.
- **Bold renders green** (`[&_strong]:text-nvim-green` in `src/pages/blog/[...id].astro`), so every bold phrase is a bright highlight. Bold the key and standout lines per `style-guide.md` (1–3 per section); keep each bold to a clause or sentence rather than whole paragraphs, so the green reads as highlights. Language names (**Lua**, **JSON**, …) are bold by design; do not put them in backticks.
- **Inline code renders orange** on a dark chip (paths, keys, commands, identifiers). Follow Inline code (backticks) in `style-guide.md`: backtick code refs only, never language names or UI labels.
- **Vim mode names in prose** use `<VimMode mode="normal|insert|visual|command|terminal" />` (`src/components/VimMode.astro`): gruvbox statusline colors (yellow / blue / orange / green / purple). Import it at the top of the MDX. Do not backtick mode names when the chip is used.
- **Code blocks use Shiki's `gruvbox-dark-medium` theme** (with bright-red deleted lines; see `astro.config.mjs`). Hand-built code-like blocks (HTML in MDX) should use `bg-nvim-bg-hard` to match. Without the inline-code style, chips would be invisible, because the whole site font is monospace.
- **Code blocks already have `margin: 1rem 0`** (`.blog-content pre` in `global.css`). Never add `<br />` after a code block: it stacks a visible gap on top of the margin.
- **No em dashes** in portfolio posts (use commas, periods, or parentheses). The vscode-to-neovim post and similar conversion guides enforce this.
