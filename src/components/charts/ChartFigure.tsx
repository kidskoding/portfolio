import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';

interface Props {
  title: string;
  subtitle?: string;
  kind: 'hbar' | 'dumbbell' | 'scatter' | 'simulator';
  data: Record<string, unknown>;
  options: Record<string, unknown>;
  height: number;
}

const SAFE_DEFAULT = 1;
const SAFE_MAX = 10;

// The figure, its view tabs and the simulator slider are Solid; Chart.js draws the canvas (lib/charts.ts)
export default function ChartFigure(props: Props) {
  let fig: HTMLElement | undefined;
  let canvas: HTMLCanvasElement | undefined;
  const views = (props.data.views as { key: string; label: string }[] | undefined) ?? [];
  const [view, setView] = createSignal(views[0]?.key);
  const [safeCount, setSafeCount] = createSignal(SAFE_DEFAULT);
  const [stats, setStats] = createSignal('');

  // Set once Chart.js has drawn; the view tabs and slider call it to redraw in place
  let redrawView: (key: string) => void = () => {};
  let redrawSafe: (count: number) => void = () => {};

  onMount(() => {
    let chart: { destroy(): void } | undefined;
    let disposed = false;
    onCleanup(() => {
      disposed = true;
      chart?.destroy();
    });
    // charts.ts reads theme colors at import, so it loads in the browser only
    void import('../../lib/charts').then(({ Chart, chartConfig, dumbbellView, simulatorView }) => {
      if (disposed || !fig || !canvas) return;
      const options = { ...props.options, narrow: fig.clientWidth < 560 };
      let first = chartConfig(props.kind, props.data, options);
      if (props.kind === 'simulator') {
        const sim = simulatorView(props.data, safeCount(), options);
        first = sim.config;
        setStats(sim.stats);
      }
      const instance = new Chart(canvas, first);
      chart = instance;
      const redraw = (next: typeof first) => {
        instance.data = next.data;
        instance.options = next.options!;
        instance.update('none');
      };
      redrawView = (key) => redraw(dumbbellView(props.data, key, options));
      redrawSafe = (count) => {
        const sim = simulatorView(props.data, count, options);
        redraw(sim.config);
        setStats(sim.stats);
      };
    });
  });

  return (
    <figure class="cjs-chart" ref={fig}>
      <div class="chart-title">{props.title}</div>
      <Show when={props.subtitle}>
        <div class="chart-sub">{props.subtitle}</div>
      </Show>
      <Show when={views.length > 1}>
        <div class="chart-views" role="tablist">
          <For each={views}>
            {(v) => (
              <button
                type="button"
                role="tab"
                data-view={v.key}
                aria-selected={view() === v.key ? 'true' : 'false'}
                onClick={() => {
                  setView(v.key);
                  redrawView(v.key);
                }}
              >
                {v.label}
              </button>
            )}
          </For>
        </div>
      </Show>
      <Show when={props.kind === 'simulator'}>
        <div class="chart-sliders">
          <label>
            <span>Allergy-safe candies</span>
            <input
              type="range"
              min="0"
              max={SAFE_MAX}
              step="1"
              value={safeCount()}
              data-safe-count
              onInput={(e) => {
                const count = Number(e.currentTarget.value);
                setSafeCount(count);
                redrawSafe(count);
              }}
            />
            <output>
              {safeCount()} of {SAFE_MAX}
            </output>
          </label>
          <div class="chart-stats" aria-live="polite">
            {stats()}
          </div>
        </div>
      </Show>
      <div class="chart-canvas" style={{ height: `${props.height}px` }}>
        <canvas ref={canvas} role="img" aria-label={props.title} />
      </div>
    </figure>
  );
}
