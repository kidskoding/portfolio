// nvim-web-devicons defaults (nvim-tree/nvim-web-devicons, lua/nvim-web-devicons/default/*).
// Glyphs need JetBrains Mono Nerd Font Icons; colors are the --color-devicon-* tokens in global.css.
export const devicons = {
  astro: '',
  mdx: '',
  // package.json is the only JSON buffer; devicons matches it by filename (npm logo), not extension
  json: '',
  // :checkhealth opens the health:// scratch buffer; devicons matches its filetype, not a file
  checkhealth: '󰓙',
} as const;

export type Devicon = keyof typeof devicons;
