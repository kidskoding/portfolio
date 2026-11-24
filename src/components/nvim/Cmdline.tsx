import { createEffect, createSignal, For, on } from 'solid-js';
import { hideCmdline, openCmdline, runCommand } from '../../lib/nvim-actions';
import { cmd } from '../../lib/nvim-store';

// Ex commands the completion popup offers: built-ins first, then plugin user commands, the order nvim lists them.
// takesArg ones fill the line and wait for an argument instead of running on click.
// Add new ones to runCommand in lib/nvim-actions.ts too.
const COMMANDS: { name: string; takesArg?: boolean }[] = [
  { name: 'bdelete' },
  { name: 'bnext' },
  { name: 'bprevious' },
  { name: 'checkhealth' },
  { name: 'edit', takesArg: true },
  { name: 'help' },
  { name: 'intro' },
  { name: 'nohlsearch' },
  { name: 'qall' },
  { name: 'quit' },
  { name: 'write' },
  { name: 'Telescope' },
];

// cmdheight=1: the row always shows under the statusline; only the inner command line toggles hidden
export default function Cmdline() {
  let input: HTMLInputElement | undefined;
  let pum: HTMLUListElement | undefined;
  // wildmenu state: what was typed before Tab, and which match is selected (-1 = the typed text itself)
  const [typed, setTyped] = createSignal('');
  const [index, setIndex] = createSignal(-1);
  const [matches, setMatches] = createSignal<typeof COMMANDS>([]);
  // index -1 before any Tab leaves aria-selected off every item, as nvim shows no selection yet
  const [cycled, setCycled] = createSignal(false);

  function hidePum() {
    setMatches([]);
    setIndex(-1);
    setCycled(false);
  }
  // Completes the command name only; once an argument starts (a space), nvim stops offering commands
  function renderPum() {
    if (!input) return;
    setTyped(input.value);
    setIndex(-1);
    setCycled(false);
    const needle = input.value.toLowerCase();
    setMatches(/\s/.test(input.value) ? [] : COMMANDS.filter(({ name }) => name.toLowerCase().startsWith(needle)));
  }
  function selectPum(next: number) {
    const list = matches();
    if (!input || !list.length) return;
    // Cycling past either end lands back on the typed text, like <Tab> in nvim's wildmenu
    const span = list.length + 1;
    const i = ((((next + 1) % span) + span) % span) - 1;
    setIndex(i);
    setCycled(true);
    input.value = i === -1 ? typed() : list[i].name;
    pum?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }
  function pickPum(i: number) {
    const match = matches()[i];
    if (!input || !match) return;
    if (!match.takesArg) return runCommand(match.name);
    input.value = `${match.name} `;
    input.focus();
    hidePum();
  }

  createEffect(
    on(
      () => cmd().kind,
      (kind) => {
        if (!input) return;
        if (kind === 'input') {
          input.value = '';
          input.focus();
          renderPum();
          return;
        }
        hidePum();
        if (document.activeElement === input) input.blur();
      },
      { defer: true },
    ),
  );

  function onKeyDown(event: KeyboardEvent) {
    const next = event.key === 'Tab' || event.key === 'ArrowDown' || (event.ctrlKey && event.key === 'n');
    const prev =
      (event.key === 'Tab' && event.shiftKey) || event.key === 'ArrowUp' || (event.ctrlKey && event.key === 'p');
    if (prev || next) {
      event.preventDefault();
      // <Tab> with the popup closed (after an edited argument, say) reopens it for the current text
      if (!matches().length) renderPum();
      selectPum(index() + (prev ? -1 : 1));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(input?.value ?? '');
    } else if (event.key === 'Escape') {
      event.preventDefault();
      hideCmdline();
    }
  }

  const state = cmd;
  const message = () => {
    const s = state();
    return s.kind === 'message' ? s : null;
  };

  return (
    // The empty row (or a message in it) opens : on click, the mouse equivalent of typing it
    <div
      class="nvim-cmdline-row"
      onClick={(event) => {
        if ((event.target as Element).closest('.cmd-pum')) return;
        if (state().kind !== 'input') openCmdline();
      }}
    >
      <div class="nvim-cmdline" id="nvim-cmdline" hidden={state().kind === 'hidden'}>
        <span class="cmd-prompt" id="nvim-cmdline-prompt" aria-hidden="true" hidden={!!message()}>
          :
        </span>
        <input
          ref={input}
          id="nvim-cmdline-input"
          class="cmd-input"
          type="text"
          autocomplete="off"
          spellcheck={false}
          aria-label="Command line"
          hidden={!!message()}
          on:keydown={onKeyDown}
          on:input={renderPum}
        />
        <span class="cmd-msg" classList={{ error: !!message()?.error }} id="nvim-cmdline-msg" hidden={!message()}>
          {message()?.text ?? ''}
        </span>
        <ul
          ref={pum}
          class="cmd-pum"
          id="nvim-cmd-pum"
          role="listbox"
          aria-label="Command completion"
          hidden={!matches().length}
          // Keep focus in the command line while clicking a completion item
          onMouseDown={(event) => event.preventDefault()}
        >
          <For each={matches()}>
            {(match, i) => (
              <li
                role="option"
                data-pum-index={i()}
                aria-selected={cycled() ? i() === index() : undefined}
                onClick={() => pickPum(i())}
              >
                {match.name}
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
}
