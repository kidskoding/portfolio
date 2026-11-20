# Anirudh Konidala's Portfolio

**[anirudh-konidala.vercel.app](https://anirudh-konidala.vercel.app)**

A personal portfolio that looks and works like Neovim under catppuccin macchiato. Pages open as buffers in a bufferline, the sidebar is a snacks.nvim-style Explorer, a fuzzy finder searches every page, post and project, and the home page opens on Neovim's `:intro` splash. Vim keys drive the site, and every key has a mouse equivalent, so it also works for people who have never opened Vim.

## Try it

| Key                         | Does                                                     |
| --------------------------- | -------------------------------------------------------- |
| `j` / `k`, `ctrl+d` / `ctrl+u` | Scroll the page                                        |
| `gg` / `G`                  | Jump to top / bottom                                     |
| `]b` / `[b`                 | Next / previous buffer (tab)                             |
| `space e`                   | Toggle the Explorer                                      |
| `space space`, `space ff` or `ctrl+k` | Open Telescope to find any page, post or project |
| `space bd`                  | Close the buffer                                         |
| `:`                         | Command line with completion: `:e <file>`, `:bn`, `:bp`, `:q`, `:help`, `:checkhealth`, `:intro` |
| `h` `j` `k` `l`, `Enter`    | Move between project cards and open one (on `/projects`) |
| `?`                         | Show every key                                           |

## Stack

- [Astro 7](https://astro.build) with MDX
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP](https://gsap.com) for page-entry animation
- [Shiki](https://shiki.style) with the catppuccin macchiato theme for code blocks
- [beautiful-mermaid](https://www.npmjs.com/package/beautiful-mermaid) for diagrams and [Chart.js](https://www.chartjs.org) for charts
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/), self-hosted, ligatures off

> Built with [Bun](https://bun.sh) and deployed on [Vercel](https://vercel.com).

## Run it locally

```sh
bun install
bun run dev        # http://localhost:4321
bun run build      # production build to ./dist/
bun run preview    # serve the production build
bun run check      # type check
bun run format     # prettier
```

With Nix, `nix develop` opens a shell with Bun, and `nix run` installs dependencies and starts the dev server.

## Adding content

| What           | Where                                                    |
| -------------- | -------------------------------------------------------- |
| Blog post      | `src/content/blog/<slug>/index.mdx`                      |
| Project        | `src/content/projects/<slug>.mdx` (or `<slug>/index.mdx` with a `cover.png`) |
| Work experience | `src/data/experience.ts`                                |
| Education      | `src/data/education.ts`                                  |
| Certificate    | `src/data/certificates.ts`                               |
| Career milestone | `src/data/milestones.ts`                               |

New posts and projects show up as buffers, in the Explorer and in Telescope on their own. A post with `draft: true` in its frontmatter shows on the dev server but stays out of the production build. Published posts also go into the RSS feed at `/rss.xml`. A new page route also needs an entry in `src/components/NvimChrome.astro` and `src/components/Telescope.astro`. [`CLAUDE.md`](CLAUDE.md) has the full conventions: frontmatter fields, the color roles, and the keyboard layer.

## License

[MIT](LICENSE)
