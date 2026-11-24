import { createEffect, createMemo, createSignal, For, on, onCleanup, onMount, Show } from 'solid-js';
import { devicons } from '../data/devicons';
import { telescopeOpen as open, setTelescopeOpen as setOpen } from '../lib/nvim-store';

export interface PageItem {
  label: string;
  path: string;
  desc: string;
  icon?: 'astro' | 'mdx' | 'checkhealth';
}
export interface EntryItem {
  id: string;
  title: string;
  description: string;
}
export interface EggItem {
  cmd: string;
  response: string;
}

interface Props {
  pages: PageItem[];
  posts: EntryItem[];
  projects: EntryItem[];
  eggs: EggItem[];
}

interface PaletteItem {
  index: number;
  icon: 'astro' | 'mdx' | 'checkhealth' | 'cmd';
  label: string;
  // hint is the dim text on the row; sub is what the preview pane shows under the label
  hint?: string;
  sub: string;
  path?: string;
  response?: string;
}

interface Section {
  title: string;
  items: PaletteItem[];
}

interface EggResult {
  text: string;
  error: boolean;
}

function fuzzyScore(query: string, value: string) {
  if (!query) return 0;

  const q = query.toLowerCase();
  const text = value.toLowerCase();
  let qIndex = 0;
  let score = 0;
  let streak = 0;

  for (let i = 0; i < text.length && qIndex < q.length; i += 1) {
    if (text[i] !== q[qIndex]) {
      streak = 0;
      continue;
    }

    score += 8 + streak * 4;
    if (i === 0 || ['/', '-', '_', '.', ' '].includes(text[i - 1])) score += 5;
    streak += 1;
    qIndex += 1;
  }

  if (qIndex !== q.length) return -1;
  if (text.includes(q)) score += 30;
  if (text.startsWith(q)) score += 20;

  return score - Math.max(0, text.length - q.length) * 0.05;
}

function rank<T>(query: string, items: T[], fields: (item: T) => string[]) {
  if (!query) return items;
  return items
    .map((item) => ({ item, score: Math.max(...fields(item).map((value) => fuzzyScore(query, value))) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

const eggResult = (egg: EggItem): EggResult => ({ text: egg.response, error: egg.cmd === 'rm -rf /' });

export default function TelescopePalette(props: Props) {
  const [query, setQuery] = createSignal('');
  const [selected, setSelected] = createSignal(0);
  // Set when a command row is activated; cleared by the next keystroke in the input.
  const [activatedEgg, setActivatedEgg] = createSignal<EggResult | null>(null);
  let input: HTMLInputElement | undefined;
  let results: HTMLDivElement | undefined;
  // Chrome fires synthetic mouse events on the element under a still cursor
  // after a re-render, which would undo keyboard navigation. Only follow the
  // mouse when its coordinates actually changed.
  let lastMouseX = -1;
  let lastMouseY = -1;

  const trimmed = () => query().toLowerCase().trim();

  const eggShown = createMemo(() => {
    const exact = props.eggs.find((egg) => egg.cmd === trimmed());
    return exact ? eggResult(exact) : activatedEgg();
  });

  const sections = createMemo<Section[]>(() => {
    const q = trimmed();
    let index = 0;
    const next = () => index++;

    const pages = rank(q, props.pages, (p) => [p.label, p.desc]).map((p) => ({
      index: next(),
      icon: p.icon ?? 'astro',
      label: p.label,
      hint: p.desc,
      sub: p.desc,
      path: p.path,
    }));
    const posts = rank(q, props.posts, (p) => [p.title, p.description, p.id]).map((p) => ({
      index: next(),
      icon: 'mdx' as const,
      label: p.title,
      hint: 'blog-posts/',
      sub: `blog/${p.id}`,
      path: `/blog/${p.id}`,
    }));
    const projects = rank(q, props.projects, (p) => [p.title, p.description, `projects/${p.id}.mdx`]).map((p) => ({
      index: next(),
      icon: 'mdx' as const,
      label: p.title,
      hint: 'projects/',
      sub: `projects/${p.id}.mdx`,
      path: `/projects/${p.id}`,
    }));
    const eggs = rank(q, props.eggs, (e) => [e.cmd]).map((e) => ({
      index: next(),
      icon: 'cmd' as const,
      label: e.cmd,
      sub: 'easter egg',
      response: e.response,
    }));

    return [
      { title: 'Pages', items: pages },
      { title: 'Blog', items: posts },
      { title: 'Projects', items: projects },
      { title: 'Commands', items: eggs },
    ].filter((section) => section.items.length > 0);
  });

  const items = createMemo(() => sections().flatMap((section) => section.items));
  const current = () => items()[selected()] ?? items()[0];
  const isSelected = (item: PaletteItem) => item === current();
  const preview = () => {
    const item = current();
    if (eggShown() || !item) return '';
    return item.response ?? `${item.label}\n\n${item.sub}`;
  };

  // Opened from ctrl+k here, or from the vim layer (space space, :Telescope) through the shared signal
  createEffect(
    on(
      open,
      (isOpen) => {
        if (!isOpen) return;
        setQuery('');
        setSelected(0);
        setActivatedEgg(null);
        input?.focus();
      },
      { defer: true },
    ),
  );

  function closePalette() {
    setOpen(false);
    setQuery('');
    if (document.activeElement === input) input?.blur();
  }

  function activate(item: PaletteItem | undefined) {
    if (!item) return;
    if (item.response !== undefined) {
      setActivatedEgg(eggResult({ cmd: item.label, response: item.response }));
      return;
    }
    if (item.path) {
      closePalette();
      window.location.href = item.path;
    }
  }

  function moveSelection(dir: 1 | -1) {
    const count = items().length;
    if (count === 0) return;
    setSelected(((current()?.index ?? 0) + dir + count) % count);
    results?.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
  }

  function onInputKeyDown(e: KeyboardEvent) {
    const down = e.key === 'ArrowDown' || (e.ctrlKey && (e.key === 'n' || e.key === 'j'));
    const up = e.key === 'ArrowUp' || (e.ctrlKey && (e.key === 'p' || e.key === 'k'));
    if (down) {
      e.preventDefault();
      moveSelection(1);
    } else if (up) {
      e.preventDefault();
      moveSelection(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!eggShown()) activate(current());
    }
  }

  function onMouseMove(e: MouseEvent, item: PaletteItem) {
    if (e.clientX === lastMouseX && e.clientY === lastMouseY) return;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    setSelected(item.index);
  }

  onMount(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open() ? closePalette() : setOpen(true);
        return;
      }
      if (e.key === 'Escape' && open()) {
        e.preventDefault();
        closePalette();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    onCleanup(() => document.removeEventListener('keydown', onKeyDown));
  });

  return (
    <div
      id="telescope"
      class="telescope-overlay"
      classList={{ open: open() }}
      aria-hidden={open() ? 'false' : 'true'}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div class="telescope-backdrop" onClick={closePalette} />
      <div class="telescope-modal">
        <div class="telescope-header">
          <span class="telescope-icon" aria-hidden="true">
            T
          </span>
          <input
            ref={input}
            class="telescope-input"
            type="text"
            placeholder="Find files, run commands..."
            autocomplete="off"
            spellcheck={false}
            value={query()}
            onInput={(e) => {
              setQuery(e.currentTarget.value);
              setSelected(0);
              setActivatedEgg(null);
            }}
            onKeyDown={onInputKeyDown}
          />
          <span class="telescope-hint">esc to close</span>
        </div>
        <div class="telescope-body">
          <div class="telescope-results" ref={results}>
            <Show
              when={eggShown()}
              fallback={
                <Show
                  when={sections().length > 0}
                  fallback={<div class="telescope-empty">no results for "{trimmed()}"</div>}
                >
                  <For each={sections()}>
                    {(section) => (
                      <>
                        <div class="telescope-section">{section.title}</div>
                        <For each={section.items}>
                          {(item) => (
                            <div
                              class="telescope-item"
                              classList={{ selected: isSelected(item) }}
                              onClick={() => activate(item)}
                              onMouseMove={(e) => onMouseMove(e, item)}
                            >
                              <Show when={item.icon !== 'cmd'} fallback={<span class="item-icon">CMD</span>}>
                                <span class={`item-icon icon-${item.icon}`}>
                                  {devicons[item.icon as keyof typeof devicons]}
                                </span>
                              </Show>
                              <span class="item-label" classList={{ 'item-easter': item.icon === 'cmd' }}>
                                {item.label}
                              </span>
                              <Show when={item.hint}>
                                <span class="item-sub">{item.hint}</span>
                              </Show>
                              <Show when={isSelected(item)}>
                                <span class="item-enter">enter</span>
                              </Show>
                            </div>
                          )}
                        </For>
                      </>
                    )}
                  </For>
                </Show>
              }
            >
              {(egg) => <div class={`egg-result${egg().error ? ' error' : ''}`}>{egg().text}</div>}
            </Show>
          </div>
          <div class="telescope-preview">
            <div class="preview-label">Preview</div>
            <div class="preview-content">{preview()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
