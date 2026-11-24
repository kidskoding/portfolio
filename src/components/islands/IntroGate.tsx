import { onCleanup, onMount } from 'solid-js';
import { LAUNCHED_KEY, OPENED_KEY, PENDING_TIMEOUT } from '../../lib/nvim-store';

const KEEP_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Enter', ':', '?']);
// Leader mappings (space e, space ff) leave the intro up, within the vim layer's pending window
const LEADER_PREFIXES = new Set(['f', 'b']);

// nvim clears its intro on the first key; scrolling or clicking an empty buffer does nothing
export default function IntroGate() {
  onMount(() => {
    if (document.documentElement.dataset.intro !== 'on') return;
    let leaderAt = -Infinity;
    const dismiss = () => {
      document.removeEventListener('keydown', onKeyDown);
      delete document.documentElement.dataset.intro;
      try {
        sessionStorage.setItem(LAUNCHED_KEY, 'true');
        // Clearing the intro turns [No Name] into the index.astro buffer, so it now stays open beside later files.
        // Storage only: the tab keeps its place until the next page orders the bufferline, as nvim would.
        const opened: string[] = JSON.parse(sessionStorage.getItem(OPENED_KEY) || '[]');
        if (!opened.includes('/')) sessionStorage.setItem(OPENED_KEY, JSON.stringify([...opened, '/']));
      } catch {}
    };
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey || KEEP_KEYS.has(e.key)) return;
      if ((e.target as Element | null)?.closest?.('input, textarea')) return;
      if (e.key === ' ') {
        leaderAt = e.timeStamp;
        return;
      }
      if (e.timeStamp - leaderAt < PENDING_TIMEOUT) {
        leaderAt = LEADER_PREFIXES.has(e.key) ? e.timeStamp : -Infinity;
        return;
      }
      dismiss();
    }
    document.addEventListener('keydown', onKeyDown);
    onCleanup(() => document.removeEventListener('keydown', onKeyDown));
  });
  return null;
}
