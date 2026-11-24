import { createSignal, For, onCleanup, onMount, type JSX } from 'solid-js';
import { isTyping } from '../../lib/nvim-actions';
import { telescopeOpen } from '../../lib/nvim-store';

interface Group {
  key: string;
  label: string;
}

// Each group's tiles arrive as a named slot (panel-<key>), server-rendered by ProjectCard.astro for its images
type Props = { groups: Group[] } & Record<string, JSX.Element | Group[]>;

const G_TIMEOUT = 600;
const slotProp = (key: string) => `panel${key[0].toUpperCase()}${key.slice(1)}`;

// Gallery tabs, the tile filter and the tile cursor; NvimChrome's vim layer yields these keys via data-vim-layer="grid"
export default function ProjectsGallery(props: Props) {
  const [active, setActive] = createSignal(props.groups[0].key);
  const [query, setQuery] = createSignal('');
  const [noMatches, setNoMatches] = createSignal(false);
  const panels = new Map<string, HTMLDivElement>();
  let filter: HTMLInputElement | undefined;
  let cursor = 0;

  const visibleTiles = () =>
    [...(panels.get(active())?.querySelectorAll<HTMLElement>('[data-tile]') ?? [])].filter((tile) => !tile.hidden);

  const paint = () => {
    const tiles = visibleTiles();
    panels.forEach((panel) => panel.querySelectorAll('.tile-cursor').forEach((t) => t.classList.remove('tile-cursor')));
    if (!tiles.length) return;
    cursor = Math.max(0, Math.min(cursor, tiles.length - 1));
    tiles[cursor].classList.add('tile-cursor');
  };

  // Tiles are slot markup, so their visibility is set on the elements rather than rendered
  const applyFilter = () => {
    const q = query().trim().toLowerCase();
    let shown = 0;
    panels
      .get(active())
      ?.querySelectorAll<HTMLElement>('[data-tile]')
      .forEach((tile) => {
        const matches = !q || (tile.dataset.search ?? '').includes(q);
        tile.hidden = !matches;
        if (matches) shown += 1;
      });
    setNoMatches(shown === 0 && !!q);
    cursor = 0;
    paint();
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    if (filter) filter.value = value;
    applyFilter();
  };

  const activateTab = (key: string) => {
    setActive(key);
    updateQuery('');
  };

  // Mouse users leave focus on a tab; vim motions reclaim it so Enter opens the cursor tile
  function releaseButtonFocus() {
    const focused = document.activeElement as HTMLElement | null;
    if (focused && focused !== document.body && focused.closest('.tab-btn')) focused.blur();
  }

  function move(delta: number) {
    releaseButtonFocus();
    const tiles = visibleTiles();
    if (!tiles.length) return;
    cursor = Math.max(0, Math.min(tiles.length - 1, cursor + delta));
    paint();
    visibleTiles()[cursor]?.scrollIntoView({ block: 'nearest' });
  }

  function columns() {
    const tiles = visibleTiles();
    if (tiles.length < 2) return 1;
    const firstTop = tiles[0].offsetTop;
    const nextRow = tiles.findIndex((tile, index) => index > 0 && tile.offsetTop > firstTop);
    return nextRow < 0 ? tiles.length : nextRow;
  }

  function syncCursor(event: Event) {
    const tile = (event.target as Element | null)?.closest?.<HTMLElement>('[data-tile]');
    const index = tile ? visibleTiles().indexOf(tile) : -1;
    if (index >= 0 && index !== cursor) {
      cursor = index;
      paint();
    }
  }

  onMount(() => {
    let pendingG = false;
    let pendingGTimer: number | undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const nativeEnter = event.key === 'Enter' && Boolean(target.closest?.('a, button'));
      if (isTyping(target) || nativeEnter || telescopeOpen() || event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.key) {
        case 'h':
        case 'ArrowLeft':
          event.preventDefault();
          move(-1);
          break;
        case 'l':
        case 'ArrowRight':
          event.preventDefault();
          move(1);
          break;
        case 'j':
        case 'ArrowDown':
          event.preventDefault();
          move(columns());
          break;
        case 'k':
        case 'ArrowUp':
          event.preventDefault();
          move(-columns());
          break;
        case 'Enter':
          event.preventDefault();
          visibleTiles()[cursor]?.click();
          break;
        case 'G':
          event.preventDefault();
          releaseButtonFocus();
          cursor = visibleTiles().length - 1;
          paint();
          break;
        case 'g':
          if (pendingG) {
            releaseButtonFocus();
            cursor = 0;
            paint();
            pendingG = false;
            window.clearTimeout(pendingGTimer);
          } else {
            pendingG = true;
            pendingGTimer = window.setTimeout(() => {
              pendingG = false;
            }, G_TIMEOUT);
          }
          break;
        case '1':
        case '2':
        case '3': {
          const group = props.groups[Number(event.key) - 1];
          if (group) activateTab(group.key);
          break;
        }
        case '/':
          event.preventDefault();
          filter?.focus();
          break;
        case 'Escape':
          updateQuery('');
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mouseover', syncCursor);
    document.addEventListener('focusin', syncCursor);
    onCleanup(() => {
      window.clearTimeout(pendingGTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mouseover', syncCursor);
      document.removeEventListener('focusin', syncCursor);
    });
    applyFilter();
  });

  return (
    <>
      <div
        class="mt-10 flex gap-2 overflow-x-auto border-b border-border-subtle"
        role="tablist"
        aria-label="Project categories"
        data-animate
      >
        <For each={props.groups}>
          {(group, index) => (
            <button
              class="tab-btn -mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200"
              type="button"
              role="tab"
              data-tab={group.key}
              aria-controls={`tab-${group.key}`}
              aria-selected={active() === group.key ? 'true' : 'false'}
              tabIndex={active() === group.key ? 0 : -1}
              title={`Switch to tab ${index() + 1}`}
              onClick={() => activateTab(group.key)}
            >
              {group.label}
            </button>
          )}
        </For>
      </div>

      <label
        class="mt-4 flex min-w-0 items-center gap-2 border border-border-subtle bg-bg-secondary px-3 py-2 font-mono"
        data-animate
      >
        <span class="font-bold text-nvim-red" aria-hidden="true">
          &gt;
        </span>
        <input
          ref={filter}
          class="min-w-0 flex-1 border-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-nvim-gray"
          id="project-filter"
          type="search"
          placeholder="filter tiles..."
          autocomplete="off"
          spellcheck={false}
          aria-label="Filter projects"
          onInput={(e) => updateQuery(e.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              updateQuery('');
              event.currentTarget.blur();
            } else if (event.key === 'Enter') {
              visibleTiles()[cursor]?.click();
            }
          }}
        />
      </label>

      <For each={props.groups}>
        {(group) => (
          <div
            id={`tab-${group.key}`}
            class="tab-panel mt-6"
            classList={{ hidden: active() !== group.key }}
            role="tabpanel"
            ref={(el) => panels.set(group.key, el)}
          >
            <div class="grid gap-4 sm:grid-cols-2">{props[slotProp(group.key)] as JSX.Element}</div>
            <p
              class="no-matches mt-4 text-sm text-text-muted"
              classList={{ hidden: active() !== group.key || !noMatches() }}
            >
              no matches
            </p>
          </div>
        )}
      </For>
    </>
  );
}
