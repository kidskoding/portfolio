// GitHub's linguist colors. Fixed colors stay fixed; do not map these to gruvbox.
export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  'C#': '#178600',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Astro: '#ff5a03',
  Shell: '#89e051',
  Ruby: '#701516',
  'Jupyter Notebook': '#DA5B0B',
  Lua: '#000080',
  Nix: '#7e7eff',
};

const FALLBACK = 'var(--color-nvim-gray)';

export function languageColor(language?: string): string {
  return (language && languageColors[language]) || FALLBACK;
}

const iconSlugs: Record<string, string> = {
  TypeScript: 'typescript',
  JavaScript: 'javascript',
  Python: 'python',
  Go: 'go',
  Rust: 'rust',
  'C++': 'cplusplus',
  'C#': 'csharp',
  Java: 'openjdk',
  HTML: 'html5',
  CSS: 'css',
  Astro: 'astro',
  Shell: 'gnubash',
  Ruby: 'ruby',
  'Jupyter Notebook': 'jupyter',
  Lua: 'lua',
  Nix: 'nixos',
};

export function languageIconSlug(language?: string): string | undefined {
  return language ? iconSlugs[language] : undefined;
}
