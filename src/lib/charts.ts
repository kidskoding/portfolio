import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  Tooltip,
  type ChartConfiguration,
  type Plugin,
} from 'chart.js';

// Where the popup points: the hovered dot, or the spot where the mouse entered a bar. It stays there until the mouse
// moves to another mark, so the popup does not chase the cursor. top/bottom are the mark's edges for placing it.
let anchor: { key: string; x: number; top: number; bottom: number } | null = null;
(Tooltip.positioners as any).anchored = function (this: any, elements: any[], position: { x: number; y: number }) {
  if (!elements.length) {
    anchor = null;
    return false;
  }
  const { element, datasetIndex, index } = elements[0];
  const key = `${this.chart.id}:${datasetIndex}:${index}`;
  if (anchor?.key !== key) {
    const half = element instanceof BarElement ? ((element as any).height as number) / 2 : 8;
    anchor = {
      key,
      x: element instanceof BarElement ? position.x : element.x,
      top: element.y - half,
      bottom: element.y + half,
    };
  }
  return { x: anchor.x, y: anchor.top };
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// The popup is a page element, not canvas paint: it can sit above the chart's edge, wraps with CSS, and fades in.
function htmlTooltip({ chart, tooltip }: { chart: Chart; tooltip: any }) {
  const box = chart.canvas.parentElement as HTMLElement;
  let el = box.querySelector<HTMLDivElement>('.cjs-tip');
  if (!el) {
    el = document.createElement('div');
    el.className = 'cjs-tip';
    el.setAttribute('role', 'tooltip');
    box.appendChild(el);
  }
  if (tooltip.opacity === 0 || !anchor) {
    el.classList.remove('show');
    return;
  }
  const [title, ...lines] = String(tooltip.dataPoints?.[0]?.raw?.tip ?? '').split('\n');
  el.innerHTML =
    `<div class="cjs-tip-title">${escapeHtml(title)}</div>` +
    lines.map((l) => (l ? `<div>${escapeHtml(l)}</div>` : '<div class="cjs-tip-gap"></div>')).join('');
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const left = Math.min(Math.max(anchor.x - w / 2, 0), box.clientWidth - w);
  const roomAbove = chart.canvas.getBoundingClientRect().top + anchor.top - h - 12;
  const above = roomAbove > 0;
  el.style.left = `${left}px`;
  el.style.top = `${above ? anchor.top - h - 10 : anchor.bottom + 10}px`;
  el.style.setProperty('--arrow-x', `${anchor.x - left}px`);
  el.classList.toggle('below', !above);
  el.classList.add('show');
}

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  Tooltip,
  Legend,
);

type Json = Record<string, any>;
interface Candy {
  candy: string;
  win: number;
  safe: string[];
}
// a point with no value, which Chart.js draws as a gap
const GAP = { x: null, y: null };

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--color-nvim-${name}`).trim();
const COLOR: Record<string, string> = { red: 'red', aqua: 'aqua', gray: 'fg3', fg2: 'fg2' };
const color = (key: string) => token(COLOR[key] ?? key);

function setDefaults() {
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.font.size = 12;
  Chart.defaults.color = token('fg2');
  Chart.defaults.borderColor = token('bg2');
  Chart.defaults.maintainAspectRatio = false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) Chart.defaults.animation = false;
  const tip = Chart.defaults.plugins.tooltip;
  tip.backgroundColor = token('bg-hard');
  tip.borderColor = token('bg3');
  tip.borderWidth = 1;
  tip.titleColor = token('yellow');
  tip.bodyColor = token('fg');
  tip.padding = 10;
  tip.displayColors = false;
  tip.callbacks.title = (items) => String((items[0]?.raw as Json)?.tip ?? '').split('\n')[0];
  tip.callbacks.label = (item) =>
    String((item.raw as Json)?.tip ?? '')
      .split('\n')
      .slice(1)
      .flatMap((l) => wrap(l));
  tip.bodyFont = { size: 12 };
  tip.titleFont = { size: 12, weight: 'bold' };
  tip.caretPadding = 8;
  tip.caretSize = 6;
  tip.position = 'anchored' as any;
  tip.enabled = false;
  tip.external = htmlTooltip as any;
  Chart.defaults.interaction = { mode: 'nearest', intersect: true, axis: 'xy' } as any;
  Chart.defaults.onHover = (e, els) => {
    const target = e.native?.target as HTMLElement | undefined;
    if (target) target.style.cursor = els.length ? 'pointer' : 'default';
  };
  const legend = Chart.defaults.plugins.legend;
  legend.position = 'top';
  legend.align = 'start';
  legend.labels.usePointStyle = true;
  legend.labels.color = token('fg');
  legend.labels.padding = 16;
  legend.labels.boxWidth = 10;
  legend.labels.boxHeight = 10;
  Chart.defaults.layout.padding = { top: 8, left: 4 };
}

// tooltips size to their longest line, so long lines (a bowl's candy list) wrap to keep the popup small
function wrap(line: string, width = 34): string[] {
  if (!line) return [''];
  const out: string[] = [];
  let cur = '';
  for (const word of line.split(' ')) {
    if (cur && (cur + ' ' + word).length > width) {
      out.push(cur);
      cur = word;
    } else cur = cur ? `${cur} ${word}` : word;
  }
  if (cur) out.push(cur);
  return out;
}

const short = (s: string, n = 16) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

const axisTitle = (text: string, show = true, narrow = false) => ({
  display: show,
  text: narrow ? wrap(text, 30) : text,
  color: token('green'),
  font: { weight: 'bold' as const },
  padding: { top: 14, bottom: 10 },
});

// Chart.js has no legend margin option; grow the legend box so the plot starts lower
const legendGap: Plugin = {
  id: 'legendGap',
  beforeInit(chart: any) {
    if (!chart.legend) return;
    const fit = chart.legend.fit;
    chart.legend.fit = function () {
      fit.call(this);
      this.height += 18;
    };
  },
};

// draws a value and note after each bar end, or a label before point a in a dumbbell
const textPlugin: Plugin = {
  id: 'rowText',
  afterDatasetsDraw(chart) {
    const items = (chart.options.plugins as Json).rowText?.items as Json[] | undefined;
    if (!items) return;
    const { ctx } = chart;
    const x = chart.scales.x;
    const y = chart.scales.y;
    ctx.save();
    ctx.textBaseline = 'middle';
    for (const it of items) {
      const py = y.getPixelForValue(it.y);
      ctx.font = `12px ${Chart.defaults.font.family}`;
      if (it.before !== undefined) {
        ctx.textAlign = 'right';
        ctx.fillStyle = token('fg');
        ctx.fillText(it.before.text, x.getPixelForValue(it.before.at) - 12, py);
      }
      if (it.after !== undefined) {
        ctx.textAlign = 'left';
        let px = x.getPixelForValue(it.after.at) + 10;
        if (it.after.value) {
          ctx.fillStyle = token('fg');
          ctx.fillText(it.after.value, px, py);
          px += ctx.measureText(it.after.value).width + 10;
        }
        if (it.after.note) {
          ctx.fillStyle = token('fg2');
          ctx.fillText(it.after.note, px, py);
        }
      }
    }
    ctx.restore();
  },
};

// a bar's own number: centered inside stacked bars, after the end of grouped bars
const barValuePlugin: Plugin = {
  id: 'barValues',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const stacked = Boolean((chart.options.scales?.x as Json)?.stacked);
    ctx.save();
    ctx.font = `bold 12px ${Chart.defaults.font.family}`;
    ctx.textBaseline = 'middle';
    chart.data.datasets.forEach((ds, i) => {
      if (!chart.isDatasetVisible(i)) return;
      chart.getDatasetMeta(i).data.forEach((el: any, j) => {
        const text = (ds.data[j] as Json)?.text;
        if (!text) return;
        if (stacked) {
          if (el.width < 22) return;
          ctx.textAlign = 'center';
          ctx.fillStyle = token('bg');
          ctx.fillText(text, el.x - el.width / 2, el.y);
        } else {
          ctx.textAlign = 'left';
          ctx.fillStyle = token('fg');
          ctx.fillText(text, el.x + 8, el.y);
        }
      });
    });
    ctx.restore();
  },
};

// text labels with a leader line to a chosen scatter dot
const calloutPlugin: Plugin = {
  id: 'callouts',
  afterDatasetsDraw(chart) {
    const items = (chart.options.plugins as Json).callouts?.items as Json[] | undefined;
    if (!items) return;
    const { ctx } = chart;
    ctx.save();
    ctx.font = `12px ${Chart.defaults.font.family}`;
    ctx.strokeStyle = token('fg3');
    ctx.fillStyle = token('fg');
    ctx.lineWidth = 1;
    for (const it of items) {
      const px = chart.scales.x.getPixelForValue(it.x);
      const py = chart.scales.y.getPixelForValue(it.y);
      const len = Math.hypot(it.dx, it.dy);
      ctx.beginPath();
      ctx.moveTo(px + (it.dx / len) * 8, py + (it.dy / len) * 8);
      ctx.lineTo(px + it.dx, py + it.dy);
      ctx.stroke();
      ctx.textAlign = it.dx < 0 ? 'right' : 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(it.text, px + it.dx + (it.dx < 0 ? -4 : 4), py + it.dy - 2);
    }
    ctx.restore();
  },
};

function hbar(data: Json, o: Json): ChartConfiguration {
  const rows = data.rows as Json[];
  const cat = (label: string) => (o.narrow ? short(label, 13) : label);
  const width = Math.max(...rows.map((r) => r.bars.length));
  const stacked = o.mode !== 'group';
  const fill = (j: number) =>
    o.legend ? color(o.legend[j].color) : rows.map((r) => color(r.bars[j]?.color ?? 'gray'));
  const datasets = Array.from({ length: width }, (_, j) => ({
    label: o.legend?.[j]?.label ?? '',
    data: rows.map((r) =>
      r.bars[j]
        ? { x: r.bars[j].value, y: cat(r.label), tip: r.bars[j].tip, text: r.bars[j].text }
        : { x: null, y: cat(r.label) },
    ),
    backgroundColor: fill(j),
    hoverBackgroundColor: fill(j),
    borderRadius: 3,
    barPercentage: stacked ? 0.65 : 0.8,
    categoryPercentage: stacked ? 0.9 : 0.75,
  }));
  return {
    type: 'bar',
    data: { labels: rows.map((r) => cat(r.label)), datasets: datasets as any },
    options: {
      indexAxis: 'y',
      layout: { padding: { right: o.narrow ? Math.min(o.rightPad ?? 150, 56) : (o.rightPad ?? 150) } },
      scales: {
        x: {
          stacked,
          min: 0,
          max: o.max,
          ticks: { stepSize: o.step, maxRotation: 0, autoSkipPadding: 8, callback: (v) => `${v}${o.suffix ?? ''}` },
          title: axisTitle(o.xTitle, true, o.narrow),
        },
        y: {
          stacked,
          grid: { display: false },
          ticks: { color: token('fg'), font: { size: o.narrow ? 10 : 12 } },
          title: axisTitle(o.yTitle, !o.narrow),
        },
      },
      plugins: {
        legend: { display: Boolean(o.legend) },
        rowText: {
          items: rows.map((r) => ({
            y: cat(r.label),
            after:
              r.valueText || r.note
                ? {
                    at: stacked
                      ? r.bars.reduce((s: number, b: Json) => s + b.value, 0)
                      : Math.max(...r.bars.map((b: Json) => b.value)),
                    value: r.valueText,
                    note: o.narrow ? undefined : r.note,
                  }
                : undefined,
          })),
        },
      } as any,
    },
    plugins: [textPlugin, barValuePlugin],
  };
}

function dumbbell(rows: Json[], o: Json): ChartConfiguration {
  const name = (s: string) => (o.narrow ? short(s, 13) : s);
  const tickLines = rows.map((r) => (r.a.label ? [name(r.label), `→ ${name(r.a.label)}`] : name(r.label)));
  // start the axis below the lowest value in this view, so no dot falls off the left edge
  const lowest = Math.floor((Math.min(...rows.flatMap((r) => [r.a.value, r.b.value])) - 5) / 10) * 10;
  const segments = rows.flatMap((r, i) => [{ x: r.a.value, y: i }, { x: r.b.value, y: i }, GAP]);
  return {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: o.aLabel,
          data: rows.map((r, i) => ({ x: r.a.value, y: i, tip: r.a.tip })),
          backgroundColor: color(o.aColor),
          pointRadius: 6,
          pointHoverRadius: 9,
        },
        {
          label: o.bLabel,
          data: rows.map((r, i) => ({ x: r.b.value, y: i, tip: r.b.tip })),
          backgroundColor: color(o.bColor),
          pointRadius: 6,
          pointHoverRadius: 9,
        },
        {
          type: 'line',
          label: 'link',
          data: segments as any,
          borderColor: token('fg3'),
          borderWidth: 2,
          pointRadius: 0,
          spanGaps: false,
          order: 3,
        },
      ] as any,
    },
    options: {
      layout: { padding: { right: 50 } },
      scales: {
        x: {
          min: Math.min(o.min, lowest),
          max: o.max,
          ticks: { stepSize: o.step, maxRotation: 0, callback: (v) => `${v}%` },
          title: axisTitle(o.xTitle, true, o.narrow),
        },
        y: {
          reverse: true,
          min: -0.6,
          max: rows.length - 0.4,
          grid: { display: false },
          ticks: {
            stepSize: 1,
            color: token('fg'),
            font: { size: o.narrow ? 10 : 12 },
            callback: (v) => tickLines[Number(v)] ?? '',
          },
          title: axisTitle(o.yTitle, !o.narrow),
        },
      },
      plugins: {
        legend: { labels: { filter: (item: any) => item.text !== 'link' } },
        tooltip: { filter: (item: any) => item.dataset.label !== 'link' },
        rowText: {
          items: rows.map((r, i) => ({
            y: i,
            after: r.note ? { at: Math.max(r.a.value, r.b.value), note: r.note } : undefined,
          })),
        },
      } as any,
    },
    plugins: [textPlugin],
  };
}

function scatter(data: Json, o: Json): ChartConfiguration {
  const pts = data.points as Json[];
  const group = (c: string) => pts.filter((p) => p.color === c).map((p) => ({ x: p.x, y: p.y, tip: p.tip }));
  const avg = (data.averages as Json[]).flatMap((a) => [{ x: a.x - 0.32, y: a.y }, { x: a.x + 0.32, y: a.y }, GAP]);
  return {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Chocolate', data: group('red'), backgroundColor: color('red'), pointRadius: 5, pointHoverRadius: 8 },
        {
          label: 'Not chocolate',
          data: group('aqua'),
          backgroundColor: color('aqua'),
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          type: 'line',
          label: 'Average win rate',
          data: avg as any,
          borderColor: token('fg3'),
          borderWidth: 3,
          pointRadius: 0,
          spanGaps: false,
          order: 3,
        },
      ] as any,
    },
    options: {
      scales: {
        x: {
          min: -0.6,
          max: 6.6,
          grid: { display: false },
          title: axisTitle(o.xTitle, true, o.narrow),
          afterBuildTicks: (axis: any) => {
            axis.ticks = [0, 1, 2, 3, 4, 5, 6].map((value) => ({ value }));
          },
        },
        y: {
          min: 20,
          max: 92,
          title: axisTitle(o.yTitle),
          afterBuildTicks: (axis: any) => {
            axis.ticks = [20, 30, 40, 50, 60, 70, 80, 90].map((value) => ({ value }));
          },
          ticks: { callback: (v) => `${v}%` },
        },
      },
      plugins: {
        tooltip: { filter: (item: any) => item.dataset.label !== 'Average win rate' },
        legend: { labels: { filter: (item: any) => item.text !== 'Average win rate' } },
        callouts: { items: o.narrow ? [] : pts.filter((p) => p.label).map((p) => ({ x: p.x, y: p.y, ...p.label })) },
      } as any,
    },
    plugins: [calloutPlugin],
  };
}

const SAFE_FOR = ['peanut', 'milk', 'tree_nut'];

// the regular top 10 with its least popular candies swapped for the most popular candies safe for all three allergies
function simulatorRows(candies: Candy[], safeCount: number, regular: Candy[]) {
  const safeAll = candies.filter((c) => SAFE_FOR.every((a) => c.safe.includes(a))).sort((a, b) => b.win - a.win);
  const picked = safeAll.slice(0, safeCount);
  const rest = candies
    .filter((c) => !picked.includes(c))
    .sort((a, b) => b.win - a.win)
    .slice(0, 10 - picked.length);
  const bowl = [...rest, ...picked].sort((a, b) => b.win - a.win);
  const rows = bowl.map((c) => {
    const safe = SAFE_FOR.every((a) => c.safe.includes(a));
    const tip = `${c.candy}\n${c.win.toFixed(1)}% win rate\n${
      safe ? 'Safe for peanut, milk and tree-nut allergies' : 'Not safe for all three allergies'
    }${regular.includes(c) ? '' : '\nNot in the regular top 10'}`;
    return {
      label: c.candy,
      bars: [{ value: c.win, color: safe ? 'aqua' : 'gray', tip }],
      valueText: `${c.win.toFixed(1)}%`,
    };
  });
  const avg = (b: Candy[]) => b.reduce((s, c) => s + c.win, 0) / b.length;
  const score = (100 * avg(bowl)) / avg(regular);
  const stats =
    `Average win rate ${avg(bowl).toFixed(1)}%, a ${score.toFixed(1)}% popularity score. ` +
    (picked.length
      ? 'Every kid with a peanut, milk or tree-nut allergy has something to eat.'
      : 'Kids with a peanut, milk or tree-nut allergy have nothing to eat.');
  return { rows, stats };
}

export function mountChart(fig: HTMLElement) {
  if (fig.dataset.mounted) return;
  fig.dataset.mounted = 'true';
  const spec = JSON.parse(fig.querySelector('script[type="application/json"]')!.textContent!) as Json;
  const canvas = fig.querySelector('canvas')!;
  const { kind, data } = spec;
  // shortcut: width is read once at mount; rotating a phone keeps the first layout until reload
  const options = { ...spec.options, narrow: fig.clientWidth < 560 };

  if (kind === 'hbar') new Chart(canvas, hbar(data, options));
  if (kind === 'scatter') new Chart(canvas, scatter(data, options));

  if (kind === 'dumbbell') {
    const views = (data.views as Json[]) ?? [{ key: 'all', rows: data.rows }];
    const chart = new Chart(canvas, dumbbell(views[0].rows, options));
    fig.querySelector('.chart-views')?.addEventListener('click', (e) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>('button[data-view]');
      if (!btn) return;
      fig.querySelectorAll('.chart-views button').forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      const next = dumbbell(views.find((v) => v.key === btn.dataset.view)!.rows, options);
      chart.data = next.data;
      chart.options = next.options!;
      chart.update('none');
    });
  }

  if (kind === 'simulator') {
    const candies = data.candies as Candy[];
    const regular = [...candies].sort((a, b) => b.win - a.win).slice(0, 10);
    const input = fig.querySelector<HTMLInputElement>('input[data-safe-count]')!;
    const stats = fig.querySelector('.chart-stats')!;
    const first = simulatorRows(candies, Number(input.value), regular);
    const chart = new Chart(canvas, hbar({ rows: first.rows }, options));
    stats.textContent = first.stats;
    input.addEventListener('input', () => {
      input.nextElementSibling!.textContent = `${input.value} of 10`;
      const next = simulatorRows(candies, Number(input.value), regular);
      const cfg = hbar({ rows: next.rows }, options);
      chart.data = cfg.data;
      chart.options = cfg.options!;
      chart.update('none');
      stats.textContent = next.stats;
    });
  }
}

Chart.register(legendGap);
setDefaults();
