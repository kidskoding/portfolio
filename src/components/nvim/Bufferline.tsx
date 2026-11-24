import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { devicons } from '../../data/devicons';
import { closeBuffer, setCurrentPath, setTabs, visiblePaths, type Tab } from '../../lib/nvim-actions';
import { introOn, readOpened, setOpened } from '../../lib/nvim-store';

interface Props {
  tabs: Tab[];
  currentPath: string;
}

export default function Bufferline(props: Props) {
  let bar: HTMLDivElement | undefined;
  const byPath = new Map(props.tabs.map((tab) => [tab.path, tab]));
  // The server knows only this page's buffer; the opened list lives in sessionStorage, so it shows after mount
  const [ready, setReady] = createSignal(false);
  const shown = () => (ready() ? visiblePaths() : [props.currentPath]).flatMap((path) => byPath.get(path) ?? []);

  onMount(() => {
    setTabs(props.tabs);
    setCurrentPath(props.currentPath);
    // Visiting a page opens its buffer (like editing a file in vim)
    let list = readOpened();
    if (props.currentPath === '/' && introOn()) {
      // The [No Name] intro is not a buffer yet: opening a file replaces it, like :e from an untouched nvim launch.
      // index.astro is recorded once a key clears the intro (IntroGate.tsx).
      list = list.filter((path) => path !== '/');
    } else if (byPath.has(props.currentPath) && !list.includes(props.currentPath)) {
      list = [...list, props.currentPath];
    }
    setOpened(list);
    setReady(true);
    // after the batched render above inserts the other tabs, still before paint
    queueMicrotask(() =>
      bar?.querySelector('.nvim-buffer.active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }),
    );

    if (!bar) return;
    const el = bar;
    // A vertical wheel scrolls the overflowing tabs sideways
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    onCleanup(() => el.removeEventListener('wheel', onWheel));
  });

  return (
    <div class="nvim-bufferline" ref={bar}>
      <For each={shown()}>
        {(tab) => {
          const isIndex = tab.path === '/';
          return (
            <div
              class="nvim-buffer"
              classList={{ active: tab.path === props.currentPath }}
              data-path={tab.path}
              data-file={tab.dir ? `${tab.dir}/${tab.file}` : undefined}
            >
              <a href={tab.path} class="buf-link">
                <span class={`buf-icon icon-${tab.icon}`} classList={{ 'file-label': isIndex }}>
                  {devicons[tab.icon]}
                </span>
                <Show when={isIndex}>
                  <span class="noname-label">
                    <svg class="noname-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 1.5h6l3 3v10h-9z" stroke="currentColor" />
                      <path d="M9.5 1.5v3h3M5.5 8h5M5.5 10.5h5M5.5 13h3" stroke="currentColor" />
                    </svg>
                    [No Name]
                  </span>
                </Show>
                <span class="buf-name" classList={{ 'file-label': isIndex }}>
                  {tab.file}
                </span>
              </a>
              <button
                type="button"
                class="buf-close"
                data-buf-close
                aria-label={`Close ${tab.file}`}
                onClick={(e) => {
                  e.preventDefault();
                  closeBuffer(tab.path);
                }}
              >
                ×
              </button>
            </div>
          );
        }}
      </For>
    </div>
  );
}
