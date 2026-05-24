# CLAUDE.md — Portfolio

Personal portfolio site for Anirudh Konidala. Built with Astro, Tailwind CSS v4, GSAP, and MDX.

## Commands

```sh
npm run dev       # dev server at localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview production build
```

## Project Structure

```
src/
├── assets/           # Images and static assets
├── components/
│   ├── ExperienceCard.astro   # Work experience timeline card
│   ├── EducationCard.astro    # Education timeline card
│   ├── ExperienceSection.astro # Resume page section (work + education timelines)
│   ├── Navigation.astro        # Top nav + sidebar
│   └── SkillCard.astro
├── content/
│   └── blog/         # MDX blog posts
├── data/
│   ├── experience.ts # Work experience entries
│   └── education.ts  # Education entries
├── layouts/
│   ├── Layout.astro  # Root HTML shell, global GSAP animation
│   └── BlogLayout.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── experience.astro  # Resume page (routed at /experience)
│   ├── skills.astro
│   ├── contact.astro
│   └── blog/
└── styles/
    └── global.css
```

## Key Conventions

### Adding work experience
Edit `src/data/experience.ts`. Each entry has a `company`, `companyLogo`, date range, and one or more `roles`. Duration is auto-calculated via `calculateDuration()`.

### Adding education
Edit `src/data/education.ts`. `startDate` is optional — if omitted, the card shows only `endDate`.

### Adding blog posts
Add an `.mdx` file to `src/content/blog/`. Frontmatter fields: `title`, `date`, `description`, `tags`.

### Animations
All `[data-animate]` elements are animated on page load via GSAP in `Layout.astro` — staggered fade+slide-in (`opacity: 0 → 1`, `y: 40 → 0`, `scale: 0.98 → 1`). Do not add scroll-triggered animations; page-entry only.

### Styling
Tailwind CSS v4. Design tokens (colors, spacing) are defined as CSS variables in `global.css`. Use semantic token names like `text-text-primary`, `bg-bg-card`, `border-border-default`, `text-accent`.

### Skills used with Claude Code
- `/add-experience` skill — appends a new entry to `src/data/experience.ts`
- `/add-role` skill — adds a new role to an existing company entry in `src/data/experience.ts`
- `/blog-post` skill — scaffolds a new MDX blog post
- `/update-claude-md` skill — audits and updates CLAUDE.md when project structure or conventions change; auto-triggered on every prompt via hook
