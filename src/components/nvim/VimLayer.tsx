import { onCleanup, onMount } from 'solid-js';
import {
  closeBuffer,
  hideCmdline,
  isTyping,
  openCmdline,
  openTelescope,
  refreshMode,
  runCommand,
  setPending,
  switchBuffer,
  toggleHelp,
} from '../../lib/nvim-actions';
import { cmd, helpOpen, pending, telescopeOpen, toggleTree } from '../../lib/nvim-store';

const LINE_STEP = 60;
// Keys the projects gallery handles itself when its <main> sets data-vim-layer="grid"
const GRID_KEYS = ['h', 'j', 'k', 'l', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].concat([
  'Enter',
  'g',
  'G',
  '/',
  'Escape',
  '1',
  '2',
  '3',
]);

// Site-wide vim keys: scrolling, buffers, leader mappings, the command line, and a card cursor over the page's
// [data-vim-item] elements. Renders nothing; the page content it moves through is server-rendered.
export default function VimLayer() {
  onMount(() => {
    const editor = () => document.querySelector<HTMLElement>('.nvim-editor');
    const scrollBy = (top: number) => editor()?.scrollBy({ top, behavior: 'auto' });
    const scrollTo = (top: number) => editor()?.scrollTo({ top, behavior: 'auto' });

    // Item cursor: hjkl step between marked cards instead of scrolling by line
    const items = () =>
      [...document.querySelectorAll<HTMLElement>('[data-vim-item]')].filter(
        (el) => !el.hidden && el.offsetParent !== null,
      );
    let cursor = 0;

    function paint() {
      const list = items();
      document.querySelectorAll('.vim-cursor').forEach((el) => el.classList.remove('vim-cursor'));
      if (!list.length) return;
      cursor = Math.max(0, Math.min(cursor, list.length - 1));
      list[cursor].classList.add('vim-cursor');
    }
    function reveal() {
      items()[cursor]?.scrollIntoView({ block: 'nearest' });
    }
    function moveItem(delta: number) {
      const list = items();
      if (!list.length) return;
      cursor = Math.max(0, Math.min(list.length - 1, cursor + delta));
      paint();
      reveal();
    }
    // Rows are detected from layout so a 2-column grid and a 1-column list both
    // feel right: j/k go to the nearest card in the row below/above.
    function moveRow(dir: 1 | -1) {
      const list = items();
      if (!list.length) return;
      const cur = list[cursor].getBoundingClientRect();
      const cx = cur.left + cur.width / 2;
      const candidates = list
        .map((el, i) => ({ i, r: el.getBoundingClientRect() }))
        .filter(({ r }) => (dir === 1 ? r.top > cur.top + 1 : r.top < cur.top - 1));
      if (!candidates.length) return;
      const edge =
        dir === 1 ? Math.min(...candidates.map((c) => c.r.top)) : Math.max(...candidates.map((c) => c.r.top));
      const row = candidates.filter((c) => Math.abs(c.r.top - edge) < 1);
      row.sort((a, b) => Math.abs(a.r.left + a.r.width / 2 - cx) - Math.abs(b.r.left + b.r.width / 2 - cx));
      cursor = row[0].i;
      paint();
      reveal();
    }
    function jumpItem(index: number) {
      cursor = index;
      paint();
      reveal();
    }
    function activateItem() {
      const el = items()[cursor];
      if (!el) return;
      const target = el.matches('a[href], button, summary')
        ? el
        : el.querySelector<HTMLElement>('a[href], button, summary');
      target?.click();
    }
    function syncCursor(event: Event) {
      const el = (event.target as HTMLElement).closest?.<HTMLElement>('[data-vim-item]');
      const index = el ? items().indexOf(el) : -1;
      if (index >= 0 && index !== cursor) {
        cursor = index;
        paint();
      }
    }

    function runSequence(seq: string): boolean {
      switch (seq) {
        case 'gg':
          if (items().length) jumpItem(0);
          else scrollTo(0);
          return true;
        case ']b':
          switchBuffer(1);
          return true;
        case '[b':
          switchBuffer(-1);
          return true;
        case ' e':
          toggleTree();
          return true;
        case ' q':
        case ' bd':
          closeBuffer();
          return true;
        case ' ?':
          toggleHelp(true);
          return true;
        case ' f':
        case ' b':
          setPending(seq);
          return true;
        case ' ff':
        case '  ':
          if (!telescopeOpen()) openTelescope();
          return true;
        case ' bn':
          switchBuffer(1);
          return true;
        case ' bp':
          switchBuffer(-1);
          return true;
      }
      return false;
    }

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      // The command line handles its own keys (Cmdline.tsx)
      if (target.id === 'nvim-cmdline-input') return;
      if (cmd().kind === 'message') {
        hideCmdline();
        if (event.key === 'Escape') {
          event.preventDefault();
          return;
        }
      }
      if (telescopeOpen()) return;
      if (isTyping(target)) {
        if (event.key === 'Escape') target.blur();
        return;
      }
      if (helpOpen()) {
        if (event.key === 'Escape' || event.key === '?') {
          event.preventDefault();
          toggleHelp(false);
        }
        return;
      }
      if (event.altKey || event.metaKey) return;

      const editorEl = editor();
      const half = editorEl ? Math.round(editorEl.clientHeight / 2) : 300;
      const pageStep = editorEl ? Math.round(editorEl.clientHeight * 0.9) : 500;

      if (event.ctrlKey) {
        if (event.key === 'd') {
          event.preventDefault();
          scrollBy(half);
        } else if (event.key === 'u') {
          event.preventDefault();
          scrollBy(-half);
        }
        return;
      }

      const layer = document.querySelector<HTMLElement>('[data-vim-layer]')?.dataset.vimLayer;
      if (layer === 'grid' && GRID_KEYS.includes(event.key)) return;

      if (pending()) {
        const seq = pending() + event.key;
        setPending('');
        if (runSequence(seq)) {
          event.preventDefault();
          return;
        }
      }

      const list = items();
      if (list.length) {
        // Enter on a focused link/button keeps its native behaviour.
        const nativeEnter = event.key === 'Enter' && Boolean(target.closest?.('a, button, summary'));
        switch (event.key) {
          case 'j':
          case 'ArrowDown':
            event.preventDefault();
            moveRow(1);
            return;
          case 'k':
          case 'ArrowUp':
            event.preventDefault();
            moveRow(-1);
            return;
          case 'h':
          case 'ArrowLeft':
            event.preventDefault();
            moveItem(-1);
            return;
          case 'l':
          case 'ArrowRight':
            event.preventDefault();
            moveItem(1);
            return;
          case 'G':
            event.preventDefault();
            jumpItem(list.length - 1);
            return;
          case 'Enter':
            if (!nativeEnter) {
              event.preventDefault();
              activateItem();
            }
            return;
        }
      }

      switch (event.key) {
        case 'j':
        case 'ArrowDown':
          event.preventDefault();
          scrollBy(LINE_STEP);
          break;
        case 'k':
        case 'ArrowUp':
          event.preventDefault();
          scrollBy(-LINE_STEP);
          break;
        case 'PageDown':
          event.preventDefault();
          scrollBy(pageStep);
          break;
        case 'PageUp':
          event.preventDefault();
          scrollBy(-pageStep);
          break;
        case 'G':
          event.preventDefault();
          scrollTo(editorEl ? editorEl.scrollHeight : 0);
          break;
        case 'g':
        case ']':
        case '[':
          event.preventDefault();
          setPending(event.key);
          break;
        case ' ':
          if (!target.closest?.('a, button')) {
            event.preventDefault();
            setPending(' ');
          }
          break;
        case ':':
          event.preventDefault();
          openCmdline();
          break;
        case '?':
          event.preventDefault();
          toggleHelp();
          break;
        case 'Escape':
          setPending('');
          break;
      }
    }

    // Any element with data-nvim-cmd runs that command on click, the same as typing it after :
    function onClick(event: MouseEvent) {
      const command = (event.target as HTMLElement).closest?.<HTMLElement>('[data-nvim-cmd]')?.dataset.nvimCmd;
      if (command) runCommand(command);
    }
    const refreshSoon = () => window.setTimeout(refreshMode, 0);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    document.addEventListener('mouseover', syncCursor);
    document.addEventListener('focusin', syncCursor);
    document.addEventListener('focusin', refreshMode);
    document.addEventListener('focusout', refreshSoon);
    document.addEventListener('selectionchange', refreshMode);
    onCleanup(() => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
      document.removeEventListener('mouseover', syncCursor);
      document.removeEventListener('focusin', syncCursor);
      document.removeEventListener('focusin', refreshMode);
      document.removeEventListener('focusout', refreshSoon);
      document.removeEventListener('selectionchange', refreshMode);
    });

    // Mounted once per page, so this is the page-load reset
    setPending('');
    refreshMode();
    paint();
  });

  return null;
}
