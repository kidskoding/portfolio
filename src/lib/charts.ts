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
import { streetBowl, type Candy } from './streetBowl';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement,
  ScatterController, Tooltip, Legend);

type Json = Record<string, any>;

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
  tip.callbacks.label = (item) => String((item.raw as Json)?.tip ?? '').split('\n').slice(1);
  const legend = Chart.defaults.plugins.legend;
  legend.position = 'top';
  legend.align = 'start';
  legend.labels.usePointStyle = true;
  legend.labels.color = token('fg');
}

const axisTitle = (text: string) => ({ display: true, text, color: token('green'), font: { weight: 'bold' as const } });

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
  const width = Math.max(...rows.map((r) => r.bars.length));
  const stacked = o.mode !== 'group';
  const datasets = Array.from({ length: width }, (_, j) => ({
    label: o.legend?.[j]?.label ?? '',
    data: rows.map((r) => (r.bars[j] ? { x: r.bars[j].value, y: r.label, tip: r.bars[j].tip } : null)),
    backgroundColor: rows.map((r) => color(r.bars[j]?.color ?? 'gray')),
    borderRadius: 3,
    barPercentage: stacked ? 0.65 : 0.8,
    categoryPercentage: stacked ? 0.9 : 0.75,
  }));
  return {
    type: 'bar',
    data: { labels: rows.map((r) => r.label), datasets: datasets as any },
    options: {
      indexAxis: 'y',
      layout: { padding: { right: o.rightPad ?? 150 } },
      scales: {
        x: { stacked, min: 0, max: o.max, ticks: { stepSize: o.step, callback: (v) => `${v}${o.suffix ?? ''}` },
             title: axisTitle(o.xTitle) },
        y: { stacked, grid: { display: false }, ticks: { color: token('fg') }, title: axisTitle(o.yTitle) },
      },
      plugins: {
        legend: { display: Boolean(o.legend) },
        rowText: {
          items: rows.map((r) => ({
            y: r.label,
            after: r.valueText || r.note
              ? { at: stacked ? r.bars.reduce((s: number, b: Json) => s + b.value, 0) : Math.max(...r.bars.map((b: Json) => b.value)),
                  value: r.valueText, note: r.note }
              : undefined,
          })),
        },
      } as any,
    },
    plugins: [textPlugin],
  };
}

function dumbbell(rows: Json[], o: Json): ChartConfiguration {
  const labels = rows.map((r) => r.label);
  const segments = rows.flatMap((r, i) => [{ x: r.a.value, y: i }, { x: r.b.value, y: i }, null]);
  return {
    type: 'scatter',
    data: {
      datasets: [
        { label: o.aLabel, data: rows.map((r, i) => ({ x: r.a.value, y: i, tip: r.a.tip })), backgroundColor: color(o.aColor),
          pointRadius: 7, pointHoverRadius: 9 },
        { label: o.bLabel, data: rows.map((r, i) => ({ x: r.b.value, y: i, tip: r.b.tip })), backgroundColor: color(o.bColor),
          pointRadius: 7, pointHoverRadius: 9 },
        { type: 'line', label: 'link', data: segments as any, borderColor: token('fg3'), borderWidth: 2, pointRadius: 0,
          spanGaps: false, order: 3 },
      ] as any,
    },
    options: {
      layout: { padding: { right: 50 } },
      scales: {
        x: { min: o.min, max: o.max, ticks: { stepSize: o.step, callback: (v) => `${v}%` }, title: axisTitle(o.xTitle) },
        y: { reverse: true, min: -0.6, max: rows.length - 0.4, grid: { display: false },
             ticks: { stepSize: 1, color: token('fg'), callback: (v) => labels[Number(v)] ?? '' }, title: axisTitle(o.yTitle) },
      },
      plugins: {
        legend: { labels: { filter: (item) => item.text !== 'link' } },
        tooltip: { filter: (item) => item.dataset.label !== 'link' },
        rowText: {
          items: rows.map((r, i) => ({
            y: i,
            before: r.a.label ? { text: r.a.label, at: Math.min(r.a.value, r.b.value) } : undefined,
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
  const avg = (data.averages as Json[]).flatMap((a) => [{ x: a.x - 0.32, y: a.y }, { x: a.x + 0.32, y: a.y }, null]);
  return {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Chocolate', data: group('red'), backgroundColor: color('red'), pointRadius: 6, pointHoverRadius: 8 },
        { label: 'Not chocolate', data: group('aqua'), backgroundColor: color('aqua'), pointRadius: 6, pointHoverRadius: 8 },
        { type: 'line', label: 'Average win rate', data: avg as any, borderColor: token('fg3'), borderWidth: 3,
          pointRadius: 0, spanGaps: false, order: 3 },
      ] as any,
    },
    options: {
      scales: {
        x: { min: -0.6, max: 6.6, ticks: { stepSize: 1, callback: (v) => (Number.isInteger(v) ? `${v}` : '') },
             grid: { display: false }, title: axisTitle(o.xTitle) },
        y: { min: 20, max: 92, ticks: { stepSize: 10, callback: (v) => `${v}%` }, title: axisTitle(o.yTitle) },
      },
      plugins: {
        tooltip: { filter: (item) => item.dataset.label !== 'Average win rate' },
        callouts: { items: pts.filter((p) => p.label).map((p) => ({ x: p.x, y: p.y, ...p.label })) },
      } as any,
    },
    plugins: [calloutPlugin],
  };
}

function simulatorRows(candies: Candy[], rates: Record<string, number>, regular: Candy[]) {
  const names: Record<string, string> = { peanut: 'peanut', milk: 'milk', tree_nut: 'tree nut' };
  const bowl = streetBowl(candies, rates);
  const rows = bowl.map((c) => {
    const safe = Object.keys(rates).filter((a) => c.safe.includes(a));
    const tip = `${c.candy}\n${c.win.toFixed(1)}% win rate\n${
      safe.length ? `Safe for ${safe.map((a) => names[a]).join(', ')} allergies` : 'Not safe for any of the three'
    }${regular.includes(c) ? '' : '\nNot in the regular top 10'}`;
    return { label: c.candy, bars: [{ value: c.win, color: safe.length ? 'aqua' : 'gray', tip }], valueText: `${c.win.toFixed(1)}%` };
  });
  const avg = (b: Candy[]) => b.reduce((s, c) => s + c.win, 0) / b.length;
  const covered = Object.keys(rates).every((a) => rates[a] === 0 || bowl.some((c) => c.safe.includes(a)));
  const stats = `Average win rate ${avg(bowl).toFixed(1)}%, a ${((100 * avg(bowl)) / avg(regular)).toFixed(1)}% ` +
    `popularity score. ${bowl.filter((c) => !regular.includes(c)).length} candies differ from the regular top 10. ` +
    (covered ? 'Every allergic kid has something to eat.' : 'Some allergic kids have nothing to eat.');
  return { rows, stats };
}

export function mountChart(fig: HTMLElement) {
  if (fig.dataset.mounted) return;
  fig.dataset.mounted = 'true';
  const spec = JSON.parse(fig.querySelector('script[type="application/json"]')!.textContent!) as Json;
  const canvas = fig.querySelector('canvas')!;
  const { kind, data, options } = spec;

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
      chart.update();
    });
  }

  if (kind === 'simulator') {
    const candies = data.candies as Candy[];
    const regular = [...candies].sort((a, b) => b.win - a.win).slice(0, 10);
    const inputs = [...fig.querySelectorAll<HTMLInputElement>('input[data-allergy]')];
    const rates = () => Object.fromEntries(inputs.map((i) => [i.dataset.allergy!, Number(i.value) / 100]));
    const first = simulatorRows(candies, rates(), regular);
    const chart = new Chart(canvas, hbar({ rows: first.rows }, options));
    const stats = fig.querySelector('.chart-stats')!;
    stats.textContent = first.stats;
    for (const input of inputs) {
      input.addEventListener('input', () => {
        input.nextElementSibling!.textContent = `${Number(input.value).toFixed(1)}% of kids`;
        const next = simulatorRows(candies, rates(), regular);
        const cfg = hbar({ rows: next.rows }, options);
        chart.data = cfg.data;
        chart.options = cfg.options!;
        chart.update();
        stats.textContent = next.stats;
      });
    }
  }
}

setDefaults();
