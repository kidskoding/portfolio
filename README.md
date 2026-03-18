# Anirudh Konidala — Portfolio

Personal portfolio site built with Astro, Tailwind CSS v4, GSAP, and MDX.

## Stack

- **[Astro](https://astro.build)** — static site framework with view transitions
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling
- **[GSAP](https://gsap.com)** — page-entry animations
- **[MDX](https://mdxjs.com)** — blog posts

## Getting Started

```sh
npm install
npm run dev       # localhost:4321
npm run build     # production build → ./dist/
npm run preview   # preview production build
```

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/about` | About |
| `/experience` | Resume — work experience & education |
| `/skills` | Skills |
| `/blog` | Blog |
| `/contact` | Contact |

## Adding Content

**Work experience** — edit `src/data/experience.ts`

**Education** — edit `src/data/education.ts`

**Blog post** — add an `.mdx` file to `src/content/blog/`
