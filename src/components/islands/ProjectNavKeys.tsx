import { navigate } from 'astro:transitions/client';
import { onCleanup, onMount } from 'solid-js';
import { isTyping } from '../../lib/nvim-actions';
import { telescopeOpen } from '../../lib/nvim-store';

const BRACKET_TIMEOUT = 600;

// Project case study: [[ / ]] step to the previous / next project, - goes up to the gallery
export default function ProjectNavKeys() {
  onMount(() => {
    const nav = document.querySelector<HTMLElement>('.project-nav');
    if (!nav) return;
    let pendingBracket: '[' | ']' | null = null;
    let pendingTimer: number | undefined;
    const go = (key: 'prev' | 'next' | 'up') => {
      const link = nav.querySelector<HTMLAnchorElement>(`a[data-nav="${key}"]`);
      if (link) navigate(link.href);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event.target) || telescopeOpen() || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === '-') {
        event.preventDefault();
        go('up');
      } else if (event.key === '[' || event.key === ']') {
        if (pendingBracket === event.key) {
          window.clearTimeout(pendingTimer);
          pendingBracket = null;
          go(event.key === '[' ? 'prev' : 'next');
        } else {
          pendingBracket = event.key;
          pendingTimer = window.setTimeout(() => {
            pendingBracket = null;
          }, BRACKET_TIMEOUT);
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    onCleanup(() => {
      window.clearTimeout(pendingTimer);
      document.removeEventListener('keydown', onKeyDown);
    });
  });
  return null;
}
