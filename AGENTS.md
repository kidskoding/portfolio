# Agent instructions – Portfolio

This repo is a **personal portfolio site** built with **Astro 7**, **Tailwind CSS 4**, **MDX**, and **TypeScript**, themed with **Catppuccin Macchiato**. `CLAUDE.md` is the full reference for structure and conventions; this file is the short version.

## Stack

- **Astro** – Pages and components (`.astro`), minimal client JS where needed.
- **Tailwind** – Styling via utilities; theme is in `src/styles/global.css`: the palette comes from `@catppuccin/tailwindcss` and maps onto role tokens (`--color-nvim-*`, `text-nvim-*` utilities).
- **Data** – Content lives in `src/data/*.ts` (e.g. `experience.ts`). Export interfaces and arrays; use optional fields where a value can be missing.
- **Assets** – Images under `src/assets/`; import in data or components and use `.src` for URLs.

## Conventions

- **Styling**: Use only the existing design tokens (e.g. `text-nvim-green`, `bg-bg-primary`, `border-border-default`). No new hex colors or arbitrary values.
- **Components**: Astro components with a TypeScript `Props` interface and `const { ... } = Astro.props`.
- **Accessibility**: Meaningful `alt` on images; semantic HTML; omit optional UI (e.g. location block) when the data is missing.

## Rules

Detailed rules are in **`.cursor/rules/`**:

- **auto-commit-push.mdc** – After you change any file, you must commit and push before finishing (no `Co-authored-by` line). Skip only if the user says "don't commit" or "no commit".
- **astro-tailwind.mdc** – Astro and Tailwind usage (when editing `.astro`).
- **data-layer.mdc** – Data and content structure (when editing `src/data/`).
- **accessibility.mdc** – A11y and optional content (when editing `.astro`).

## Commands

- `bun run dev` – Local dev server.
- `bun run build` – Production build.
- `bun run preview` – Preview the production build.
