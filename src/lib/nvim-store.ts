// State the NvimChrome islands share. Module-level signals live once per document (every island imports this
// chunk), so they survive soft navigation; islands themselves remount with each page.
import { createSignal } from 'solid-js';

export type Mode = 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND';
export type CmdState = { kind: 'hidden' } | { kind: 'input' } | { kind: 'message'; text: string; error: boolean };

export const OPENED_KEY = 'nvim:opened-buffers';
export const LAUNCHED_KEY = 'nvim:launched';
export const RELAUNCH_KEY = 'nvim:relaunch';
export const TREE_HIDDEN_KEY = 'nvim:tree-hidden';
export const DRAWER_QUERY = '(max-width: 760px)';
export const PENDING_TIMEOUT = 900;

export const [mode, setMode] = createSignal<Mode>('NORMAL');
export const [pending, setPendingKeys] = createSignal('');
export const [helpOpen, setHelpOpen] = createSignal(false);
export const [cmd, setCmd] = createSignal<CmdState>({ kind: 'hidden' });
export const [telescopeOpen, setTelescopeOpen] = createSignal(false);
export const [treeHidden, setTreeHiddenSignal] = createSignal(false);
export const [drawerOpen, setDrawerOpen] = createSignal(false);
// Buffer paths in bufferline order; the page's own buffer is added on load (Bufferline.tsx)
export const [opened, setOpenedSignal] = createSignal<string[]>([]);

const isClient = typeof window !== 'undefined';

export const introOn = () => isClient && document.documentElement.dataset.intro === 'on';
export const isDrawer = () => isClient && window.matchMedia(DRAWER_QUERY).matches;

export function readOpened(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(OPENED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setOpened(paths: string[]) {
  sessionStorage.setItem(OPENED_KEY, JSON.stringify(paths));
  setOpenedSignal(paths);
}

export function setTreeHidden(hidden: boolean) {
  sessionStorage.setItem(TREE_HIDDEN_KEY, String(hidden));
  setTreeHiddenSignal(hidden);
  applyShell();
}

// .nvim-shell is server-rendered per page, so its tree classes are applied directly rather than rendered
function applyShell() {
  const shell = document.querySelector('.nvim-shell');
  shell?.classList.toggle('tree-hidden', treeHidden());
  shell?.classList.toggle('tree-drawer-open', drawerOpen());
}

export function openDrawer(open: boolean) {
  setDrawerOpen(open);
  applyShell();
}

// :NvimTreeToggle and the titlebar button: a drawer at narrow widths, the sidebar column above
export function toggleTree() {
  if (isDrawer()) openDrawer(!drawerOpen());
  else setTreeHidden(!treeHidden());
}

if (isClient) {
  // A hard reload starts with a clean bufferline; this runs once per real document load
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === 'reload') sessionStorage.removeItem(OPENED_KEY);
  setTreeHiddenSignal(sessionStorage.getItem(TREE_HIDDEN_KEY) === 'true');
  applyShell();
  // Before the new page paints, so a hidden tree never flashes open on soft navigation
  document.addEventListener('astro:after-swap', () => {
    // the swapped-in page starts with the drawer, help and command line closed, as its server markup has them
    setDrawerOpen(false);
    setHelpOpen(false);
    setCmd({ kind: 'hidden' });
    setTreeHiddenSignal(sessionStorage.getItem(TREE_HIDDEN_KEY) === 'true');
    applyShell();
  });
  // Any page load marks the session launched; the intro returns only on a fresh load, :qa or closing the last buffer
  sessionStorage.setItem(LAUNCHED_KEY, 'true');
  document.addEventListener('astro:page-load', () => sessionStorage.setItem(LAUNCHED_KEY, 'true'));
}
