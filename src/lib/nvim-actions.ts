// The vim layer's actions, shared by the NvimChrome islands (VimLayer, Cmdline, Bufferline, Statusline, Help).
import { navigate } from 'astro:transitions/client';
import { createSignal } from 'solid-js';
import {
  cmd,
  drawerOpen,
  introOn,
  isDrawer,
  opened,
  openDrawer,
  OPENED_KEY,
  PENDING_TIMEOUT,
  readOpened,
  RELAUNCH_KEY,
  setCmd,
  setHelpOpen,
  setMode,
  setOpened,
  setPendingKeys,
  setTelescopeOpen,
  telescopeOpen,
  toggleTree,
  treeHidden,
  TREE_HIDDEN_KEY,
} from './nvim-store';

export interface Tab {
  path: string;
  file: string;
  icon: 'astro' | 'mdx' | 'json' | 'checkhealth';
  // explorer folder the file lives in (blog index); keeps :e index on index.astro
  dir?: string;
}

const MESSAGE_TIMEOUT = 4000;

// Set by Bufferline on mount: every buffer the site has, and the one this page shows
export const [tabs, setTabs] = createSignal<Tab[]>([]);
export const [currentPath, setCurrentPath] = createSignal('');

// el can be document or window when an event is dispatched there
export const isTyping = (el: EventTarget | null) =>
  el instanceof Element && (el.matches('input, textarea, select') || (el as HTMLElement).isContentEditable);

export function refreshMode() {
  if (cmd().kind === 'input') return setMode('COMMAND');
  if (isTyping(document.activeElement)) return setMode('INSERT');
  const sel = window.getSelection();
  if (sel && !sel.isCollapsed && sel.toString().trim()) return setMode('VISUAL');
  setMode('NORMAL');
}

let pendingTimer: number | undefined;
export function setPending(keys: string) {
  setPendingKeys(keys);
  window.clearTimeout(pendingTimer);
  if (keys) pendingTimer = window.setTimeout(() => setPending(''), PENDING_TIMEOUT);
}

let msgTimer: number | undefined;
export function hideCmdline() {
  window.clearTimeout(msgTimer);
  setCmd({ kind: 'hidden' });
  refreshMode();
}
export function openCmdline() {
  window.clearTimeout(msgTimer);
  setCmd({ kind: 'input' });
  setMode('COMMAND');
}
export function showMessage(text: string, error = false) {
  setCmd({ kind: 'message', text, error });
  window.clearTimeout(msgTimer);
  msgTimer = window.setTimeout(hideCmdline, MESSAGE_TIMEOUT);
  refreshMode();
}

export const toggleHelp = (force?: boolean) => setHelpOpen((open) => force ?? !open);
export const openTelescope = () => setTelescopeOpen(true);

// Bufferline order: tabs move to the end as they open, so the [No Name] intro (never recorded) stays first
export function visiblePaths() {
  const known = new Set(tabs().map((t) => t.path));
  const list = opened().filter((p) => known.has(p));
  const current = currentPath();
  return list.includes(current) || !known.has(current) ? list : [current, ...list];
}

export function switchBuffer(dir: 1 | -1) {
  const list = visiblePaths();
  if (list.length < 2) return;
  const i = list.indexOf(currentPath());
  navigate(list[(i + dir + list.length) % list.length]);
}

export function closeBuffer(path = currentPath()) {
  // The [No Name] intro buffer is what nvim falls back to, so there is nothing to close
  if (!path || (path === '/' && introOn())) return;
  const list = visiblePaths();
  const idx = list.indexOf(path);
  const neighbor = list[idx + 1] ?? list[idx - 1];
  const rest = readOpened().filter((p) => p !== path);
  if (!neighbor) {
    // Closing the last buffer relaunches: back to / with the intro. The tab stays until the swap
    // replaces it with [No Name], so the bufferline never empties and the page does not jump.
    sessionStorage.setItem(OPENED_KEY, JSON.stringify(rest));
    sessionStorage.setItem(RELAUNCH_KEY, 'true');
    navigate('/');
    return;
  }
  setOpened(rest);
  if (path === currentPath()) navigate(neighbor);
}

// :NvimTreeFocus opens the tree when it is closed (never hides it) and moves focus into it
export function focusTree() {
  const open = isDrawer() ? drawerOpen() : !treeHidden();
  if (!open) toggleTree();
  (
    document.querySelector<HTMLAnchorElement>('.tree-file.tree-active') ??
    document.querySelector<HTMLAnchorElement>('.tree-file')
  )?.focus();
}

function fuzzyOpen(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    showMessage('E471: Argument required', true);
    return;
  }
  const scored = tabs()
    .map((tab) => {
      const file = (tab.dir ? `${tab.dir}/${tab.file}` : tab.file).toLowerCase();
      const path = tab.path.toLowerCase();
      const stem = file.replace(/\.[a-z]+$/, '');
      let score = 0;
      if (stem === needle) score = 5;
      else if (file.startsWith(needle)) score = 4;
      else if (path.startsWith(`/${needle}`)) score = 3;
      else if (file.includes(needle) || path.includes(needle)) score = 2;
      else {
        let i = 0;
        for (const ch of file) if (ch === needle[i]) i += 1;
        if (i === needle.length) score = 1;
      }
      return { tab, score, length: file.length };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.length - b.length);
  const best = scored[0]?.tab;
  if (!best) {
    showMessage(`E345: Can't find file "${query.trim()}" in path`, true);
    return;
  }
  hideCmdline();
  navigate(best.path);
}

export function runCommand(raw: string) {
  const line = raw.trim();
  const [command = '', ...rest] = line.split(/\s+/);
  const arg = rest.join(' ');
  switch (command) {
    case '':
      hideCmdline();
      break;
    case 'q':
    case 'quit':
    case 'q!':
    case 'wq':
    case 'x':
    case 'bd':
    case 'bdelete':
      hideCmdline();
      closeBuffer();
      break;
    case 'qa':
    case 'qa!':
    case 'qall':
    case 'wqa':
      sessionStorage.removeItem(OPENED_KEY);
      sessionStorage.setItem(RELAUNCH_KEY, 'true');
      sessionStorage.setItem(TREE_HIDDEN_KEY, 'true');
      if (drawerOpen()) openDrawer(false);
      hideCmdline();
      navigate('/');
      break;
    case 'w':
    case 'write':
      showMessage("E45: 'readonly' option is set (add ! to override)", true);
      break;
    case 'w!':
      showMessage('"portfolio" is read-only, nothing written', true);
      break;
    case 'e':
    case 'edit':
    case 'find':
      fuzzyOpen(arg);
      break;
    case 'bn':
    case 'bnext':
      hideCmdline();
      switchBuffer(1);
      break;
    case 'bp':
    case 'bprev':
    case 'bprevious':
      hideCmdline();
      switchBuffer(-1);
      break;
    case 'h':
    case 'help':
      hideCmdline();
      toggleHelp(true);
      break;
    case 'Telescope':
    case 'Tel':
      hideCmdline();
      if (!telescopeOpen()) openTelescope();
      break;
    case 'NvimTreeToggle':
    case 'Ex':
    case 'Explore':
      hideCmdline();
      toggleTree();
      break;
    case 'NvimTreeOpen':
    case 'NvimTreeFocus':
      hideCmdline();
      focusTree();
      break;
    case 'che':
    case 'checkh':
    case 'checkhealth':
      hideCmdline();
      navigate('/checkhealth');
      break;
    // :intro shows the splash again without closing buffers; the next key clears it (IntroGate.tsx)
    case 'int':
    case 'intro':
      sessionStorage.setItem(RELAUNCH_KEY, 'true');
      hideCmdline();
      navigate('/');
      break;
    case 'noh':
    case 'nohlsearch':
      hideCmdline();
      break;
    default:
      showMessage(`E492: Not an editor command: ${line}`, true);
  }
}
