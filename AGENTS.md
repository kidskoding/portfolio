# Agent instructions – Portfolio

This repo is a **personal portfolio site** built with **Astro 5**, **Tailwind CSS 4**, and **TypeScript**. Use it as the main reference for how to work in this codebase.

## Stack

- **Astro** – Pages and components (`.astro`), minimal client JS where needed.
- **Tailwind** – Styling via utilities; theme is in `src/styles/global.css` (`@theme` and CSS variables).
- **Data** – Content lives in `src/data/*.ts` (e.g. `experience.ts`). Export interfaces and arrays; use optional fields where a value can be missing.
- **Assets** – Images under `src/assets/`; import in data or components and use `.src` for URLs.

## Conventions

- **Styling**: Use only the existing design tokens (e.g. `bg-bg-primary`, `text-accent`, `border-border-default`). No new hex colors or arbitrary values.
- **Components**: Astro components with a TypeScript `Props` interface and `const { ... } = Astro.props`.
- **Accessibility**: Meaningful `alt` on images; semantic HTML; omit optional UI (e.g. location block) when the data is missing.

## Rules

Detailed rules are in **`.cursor/rules/`**:

- **auto-commit-push.mdc** – After you change any file, you must commit (with `Co-authored-by: Cursor <cursoragent@cursor.com>`) and push before finishing. Skip only if the user says "don't commit" or "no commit".
- **astro-tailwind.mdc** – Astro and Tailwind usage (when editing `.astro`).
- **data-layer.mdc** – Data and content structure (when editing `src/data/`).
- **accessibility.mdc** – A11y and optional content (when editing `.astro`).

## Commands

- `npm run dev` – Local dev server.
- `npm run build` – Production build.
- `npm run preview` – Preview the production build.
