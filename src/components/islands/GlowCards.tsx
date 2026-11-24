import { onCleanup, onMount } from 'solid-js';

// .glow-card's radial highlight (global.css) follows the pointer through --mouse-x/--mouse-y.
// One delegated listener covers every card on every page, whichever card component rendered it.
export default function GlowCards() {
  onMount(() => {
    const onMove = (event: MouseEvent) => {
      const card = (event.target as Element | null)?.closest?.<HTMLElement>('.glow-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    onCleanup(() => document.removeEventListener('mousemove', onMove));
  });
  return null;
}
