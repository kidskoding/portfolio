import { createSignal, onMount } from 'solid-js';
import { drawerOpen, isDrawer, toggleTree, treeHidden } from '../../lib/nvim-store';

// Titlebar ☰ Explorer button: the same as space e and :NvimTreeToggle
export default function TreeTrigger() {
  // The server can't know the viewport or the stored tree state, so it renders the closed drawer label
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));
  const expanded = () => mounted() && (isDrawer() ? drawerOpen() : !treeHidden());
  const label = () => {
    if (!mounted()) return 'Open file explorer';
    if (isDrawer()) return drawerOpen() ? 'Close file explorer' : 'Open file explorer';
    return treeHidden() ? 'Show file explorer' : 'Hide file explorer';
  };

  return (
    <button
      class="nvim-tree-trigger"
      type="button"
      aria-controls="nvimtree"
      aria-expanded={expanded() ? 'true' : 'false'}
      aria-label={label()}
      data-tree-drawer-toggle
      onClick={toggleTree}
    >
      <span aria-hidden="true">☰</span>
      <span>Explorer</span>
    </button>
  );
}
