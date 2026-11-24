import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { devicons } from '../../data/devicons';
import { toggleHelp } from '../../lib/nvim-actions';
import { mode, pending } from '../../lib/nvim-store';

interface Props {
  // file name shown in section c (health:// keeps its scheme)
  file: string;
  icon: 'astro' | 'mdx' | 'json' | 'checkhealth';
  // the index buffer doubles as [No Name] while the intro shows
  isIndex: boolean;
}

export default function Statusline(props: Props) {
  const [pct, setPct] = createSignal('Top');
  const [pos, setPos] = createSignal('1:1');

  onMount(() => {
    const editor = document.querySelector<HTMLElement>('.nvim-editor');
    if (!editor) return;
    const update = () => {
      const scrollTop = editor.scrollTop;
      const scrollHeight = editor.scrollHeight - editor.clientHeight;
      setPos(`${Math.max(1, Math.round(scrollTop / 20) + 1)}:1`);
      if (scrollHeight <= 0 || scrollTop === 0) setPct('Top');
      else if (scrollTop >= scrollHeight - 1) setPct('Bot');
      else setPct(`${Math.round((scrollTop / scrollHeight) * 100)}%`);
    };
    editor.addEventListener('scroll', update, { passive: true });
    onCleanup(() => editor.removeEventListener('scroll', update));
    update();
  });

  return (
    <div class="nvim-statusline" data-mode={mode()}>
      <div class="sl-a">{mode()}</div>
      <div class="sl-b">
        <span class="branch-icon" aria-hidden="true">
          {''}
        </span>
        master
      </div>
      <div class="sl-c">
        <span classList={{ 'file-label': props.isIndex }}>{props.file}</span>
        <Show when={props.isIndex}>
          <span class="noname-label">[No Name]</span>
        </Show>
      </div>
      <div class="sl-spacer" />
      <div class="sl-x sl-showcmd" id="sl-showcmd" aria-hidden="true">
        {pending().replace(/ /g, '␣')}
      </div>
      <button
        class="sl-x sl-help"
        type="button"
        data-vim-help
        aria-label="Show key bindings"
        title="keys (?)"
        onClick={() => toggleHelp()}
      >
        ?
      </button>
      <span class="sl-x-div sl-file-info" aria-hidden="true">
        |
      </span>
      <div class="sl-x sl-enc sl-file-info">utf-8</div>
      <span class="sl-x-div sl-file-info" aria-hidden="true">
        |
      </span>
      <div class={`sl-x sl-filetype sl-file-info ft-${props.icon}`}>
        <span class={`sl-ft-icon icon-${props.icon}`}>{devicons[props.icon]}</span>
        <span>{props.icon}</span>
      </div>
      <div class="sl-y sl-file-info" id="sl-pct">
        {pct()}
      </div>
      <div class="sl-z" id="sl-pos">
        {pos()}
      </div>
    </div>
  );
}
