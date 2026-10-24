# Anirudh Konidala's Portfolio

**[anirudh-konidala.vercel.app](https://anirudh-konidala.vercel.app)**

A personal portfolio that looks and works like Neovim under gruvbox. Pages open as buffers in a bufferline, the sidebar is NvimTree, a fuzzy finder searches every page, post and project, and the home page opens on Neovim's `:intro` splash. Vim keys drive the site, and every key has a mouse equivalent, so it also works for people who have never opened Vim.

## Try it

| Key                         | Does                                                     |
| --------------------------- | -------------------------------------------------------- |
| `j` / `k`, `ctrl+d` / `ctrl+u` | Scroll the page                                        |
| `gg` / `G`                  | Jump to top / bottom                                     |
| `]b` / `[b`                 | Next / previous buffer (tab)                             |
| `space e`                   | Toggle NvimTree                                          |
| `space space` or `ctrl+k`   | Open Telescope to find any page, post or project         |
| `space bd`                  | Close the buffer                                         |
| `:`                         | Command line: `:e <file>`, `:bn`, `:bp`, `:q`, `:help`   |
| `h` `j` `k` `l`, `Enter`    | Move between project cards and open one (on `/projects`) |
| `?`                         | Show every key                                           |

## Stack

- [Astro 7](https://astro.build) with MDX
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP](https://gsap.com) for page-entry animation
- [beautiful-mermaid](https://www.npmjs.com/package/beautiful-mermaid) for diagrams

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

New posts and projects show up as buffers, in NvimTree and in Telescope on their own. A new page route also needs an entry in `src/components/NvimChrome.astro` and `src/components/Telescope.astro`. [`CLAUDE.md`](CLAUDE.md) has the full conventions: frontmatter fields, the color roles, and the keyboard layer.

## License

[MIT](LICENSE)
