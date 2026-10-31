import { useMemo, type ReactNode } from 'react';
import { useElementWidth } from '../../lib/hooks';
import { DEFAULTS, evaluate, marginBand, type Params } from './model';

/* Shared chart frame: measures its container so text stays at true pixel size. */
function Frame({
  height,
  label,
  children,
}: {
  height: (w: number) => number;
  label: string;
  children: (w: number, h: number) => ReactNode;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>(680);
  const w = Math.max(300, width);
  const h = height(w);
  return (
    <div ref={ref} className="pfig__frame">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        {children(w, h)}
      </svg>
    </div>
  );
}

function Sub({ t }: { t: string }) {
  const parts = t.split(/_(\d+|\w)/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <tspan key={i} dy="3" fontSize="0.75em">
            {p}
          </tspan>
        ) : i > 0 ? (
          <tspan key={i} dy="-3">
            {p}
          </tspan>
        ) : (
          <tspan key={i}>{p}</tspan>
        ),
      )}
    </>
  );
}

const S_MIN = 30;
const S_MAX = 100;

/* ------------------------------------------------------------------ */
/* Figure 1. Oxygen content geometry at default inputs                 */
/* ------------------------------------------------------------------ */
export function ContentFigure() {
  const base = evaluate(DEFAULTS);
  const cvc = base.cvc;
  const need = cvc + DEFAULTS.vo2 / base.qs; // content required for M = 1
  const pts = useMemo(() => {
    const out: { s: number; c: number }[] = [];
    for (let s = S_MIN; s <= S_MAX; s += 1) out.push({ s, c: evaluate({ ...DEFAULTS, spo2: s }).cao2 });
    return out;
  }, []);
  return (
    <Frame
      height={(w) => (w < 560 ? 300 : 360)}
      label="Arterial oxygen content rises with saturation; the critical venous content is fixed at about 8.3 mL/dL; only the gap between them is counted as extractable. At a reading of 50% the gap is 2.47 mL/dL; the margin reaches 1.0 when arterial content reaches about 14.2 mL/dL, near 66% saturation."
    >
      {(w, h) => {
        const compact = w < 560;
        const m = { l: compact ? 40 : 52, r: compact ? 12 : 24, t: 34, b: 46 };
        const x = (s: number) => m.l + ((s - S_MIN) / (S_MAX - S_MIN)) * (w - m.l - m.r);
        const y = (c: number) => h - m.b - (c / 24) * (h - m.t - m.b);
        const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.s).toFixed(1)} ${y(p.c).toFixed(1)}`).join(' ');
        const area =
          pts
            .filter((p) => p.c >= cvc)
            .map((p, i) => `${i ? 'L' : 'M'}${x(p.s).toFixed(1)} ${y(p.c).toFixed(1)}`)
            .join(' ') + ` L${x(S_MAX)} ${y(cvc)} L${x(38.5)} ${y(cvc)} Z`;
        const fs = compact ? 11 : 12;
        return (
          <g fontSize={fs} className="pfig">
            {[0, 4, 8, 12, 16, 20, 24].map((c) => (
              <g key={c}>
                <line x1={m.l} x2={w - m.r} y1={y(c)} y2={y(c)} className="pfig__grid" />
                <text x={m.l - 6} y={y(c) + 4} textAnchor="end" className="pfig__tick">
                  {c}
                </text>
              </g>
            ))}
            {[30, 40, 50, 60, 70, 80, 90, 100].map((s) => (
              <text key={s} x={x(s)} y={h - m.b + 18} textAnchor="middle" className="pfig__tick">
                {s}
              </text>
            ))}
            <text x={w - m.r} y={h - 8} textAnchor="end" className="pfig__axis">
              Saturation entering the model (%)
            </text>
            <text x={4} y={12} className="pfig__axis">
              mL O<tspan dy="3" fontSize="0.75em">2</tspan>
              <tspan dy="-3">/dL</tspan>
            </text>

            <path d={area} className="pfig__extract" />
            <line x1={m.l} x2={w - m.r} y1={y(cvc)} y2={y(cvc)} className="pfig__floor" />
            <text x={w - m.r} y={y(cvc) + 15} textAnchor="end" className="pfig__muted">
              {compact ? 'Critical venous content' : 'Critical venous content (PvO₂ floor 19.5 mmHg) ≈ 8.3'}
            </text>
            <line x1={m.l} x2={w - m.r} y1={y(need)} y2={y(need)} className="pfig__need" />
            <text x={m.l + 6} y={y(need) - 6} className="pfig__ink">
              {compact ? 'Needed for M = 1' : 'Content needed for M = 1 at default flow and demand ≈ 14.2'}
            </text>
            <path d={line} className="pfig__line" />
            <text x={x(92)} y={y(evaluate({ ...DEFAULTS, spo2: 92 }).cao2) - 10} textAnchor="end" className="pfig__ink">
              <Sub t="CaO_2" />
            </text>

            {/* reading of 50% */}
            <line x1={x(50)} x2={x(50)} y1={y(cvc)} y2={y(base.cao2)} className="pfig__gap" />
            <circle cx={x(50)} cy={y(base.cao2)} r="5" className="pfig__ring" />
            <text x={x(50) + 8} y={(y(cvc) + y(base.cao2)) / 2 + 4} className="pfig__ink">
              2.47
            </text>
            <line x1={x(65.9)} x2={x(65.9)} y1={y(need)} y2={h - m.b} className="pfig__drop" />
            <text x={x(65.9) + 5} y={h - m.b - 6} className="pfig__muted">
              65.9%
            </text>
            <line x1={x(38.5)} x2={x(38.5)} y1={y(cvc)} y2={h - m.b} className="pfig__drop" />
            <text x={x(38.5) + 5} y={h - m.b - 6} className="pfig__muted">
              38.5%
            </text>
            <line x1={m.l} x2={w - m.r} y1={h - m.b} y2={h - m.b} className="pfig__axisline" />
          </g>
        );
      }}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Figure 2. Margin versus reading, with propagated uncertainty        */
/* ------------------------------------------------------------------ */
export function MarginFigure() {
  const xs = useMemo(() => Array.from({ length: 71 }, (_, i) => S_MIN + i), []);
  const band = useMemo(() => marginBand(xs), [xs]);
  const det = useMemo(() => xs.map((s) => ({ s, M: evaluate({ ...DEFAULTS, spo2: s }).M })), [xs]);
  return (
    <Frame
      height={(w) => (w < 560 ? 320 : 380)}
      label="The margin computed by the model rises steeply with saturation. Monte Carlo bands show the 5th to 95th and 25th to 75th percentiles under the input distributions in Table 2. The three reported readings, 50, 58 and 94 percent, are marked with the calculator's own oximeter standard deviation of 5.5 points."
    >
      {(w, h) => {
        const compact = w < 560;
        const m = { l: compact ? 34 : 44, r: compact ? 12 : 24, t: 16, b: 46 };
        const YMAX = 4;
        const x = (s: number) => m.l + ((s - S_MIN) / (S_MAX - S_MIN)) * (w - m.l - m.r);
        const y = (v: number) => h - m.b - (Math.min(v, YMAX) / YMAX) * (h - m.t - m.b);
        const path = (k: 'p05' | 'p25' | 'p50' | 'p75' | 'p95') =>
          band.map((b, i) => `${i ? 'L' : 'M'}${x(b.spo2).toFixed(1)} ${y(b[k]).toFixed(1)}`).join(' ');
        const area = (lo: 'p05' | 'p25', hi: 'p95' | 'p75') =>
          band.map((b, i) => `${i ? 'L' : 'M'}${x(b.spo2).toFixed(1)} ${y(b[hi]).toFixed(1)}`).join(' ') +
          ' ' +
          [...band]
            .reverse()
            .map((b) => `L${x(b.spo2).toFixed(1)} ${y(b[lo]).toFixed(1)}`)
            .join(' ') +
          ' Z';
        const detPath = det.map((d, i) => `${i ? 'L' : 'M'}${x(d.s).toFixed(1)} ${y(d.M).toFixed(1)}`).join(' ');
        const fs = compact ? 11 : 12;
        return (
          <g fontSize={fs} className="pfig">
            {[0, 1, 2, 3, 4].map((v) => (
              <g key={v}>
                <line x1={m.l} x2={w - m.r} y1={y(v)} y2={y(v)} className={v === 1 ? 'pfig__unity' : 'pfig__grid'} />
                <text x={m.l - 6} y={y(v) + 4} textAnchor="end" className="pfig__tick">
                  {v}
                </text>
              </g>
            ))}
            <text x={m.l + 4} y={y(1) - 6} className="pfig__ink">
              M = 1
            </text>
            {[30, 40, 50, 60, 70, 80, 90, 100].map((s) => (
              <text key={s} x={x(s)} y={h - m.b + 18} textAnchor="middle" className="pfig__tick">
                {s}
              </text>
            ))}
            <text x={w - m.r} y={h - 8} textAnchor="end" className="pfig__axis">
              Pulse-oximeter reading (%)
            </text>
            <text x={4} y={m.t - 2} className="pfig__axis">
              M
            </text>
            <path d={area('p05', 'p95')} className="pfig__band90" />
            <path d={area('p25', 'p75')} className="pfig__band50" />
            <path d={path('p50')} className="pfig__median" />
            <path d={detPath} className="pfig__line" />
            {[50, 58, 94].map((s) => {
              const v = evaluate({ ...DEFAULTS, spo2: s }).M;
              return (
                <g key={s}>
                  <line x1={x(Math.max(S_MIN, s - 5.5))} x2={x(Math.min(S_MAX, s + 5.5))} y1={y(v)} y2={y(v)} className="pfig__err" />
                  <circle cx={x(s)} cy={y(v)} r="5.5" className="pfig__ring" />
                  <text x={x(s)} y={y(v) - 11} textAnchor="middle" className="pfig__reading">
                    {s}%
                  </text>
                </g>
              );
            })}
            <line x1={m.l} x2={w - m.r} y1={h - m.b} y2={h - m.b} className="pfig__axisline" />
          </g>
        );
      }}
    </Frame>
  );
}

export function MarginLegend() {
  return (
    <ul className="pfig__legend">
      <li>
        <span className="sw sw--line" /> Default inputs
      </li>
      <li>
        <span className="sw sw--median" /> Monte Carlo median
      </li>
      <li>
        <span className="sw sw--b50" /> 25th-75th percentile
      </li>
      <li>
        <span className="sw sw--b90" /> 5th-95th percentile
      </li>
      <li>
        <span className="sw sw--ring" /> Reported reading, &plusmn;5.5 points
      </li>
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Figure 3. One-at-a-time ranges at a reading of 50%                  */
/* ------------------------------------------------------------------ */
export const OAT_RANGES: { key: keyof Params; label: string; lo: number; hi: number; fmt: (v: number) => string }[] = [
  { key: 'pvc', label: 'Critical venous PO_2 (mmHg)', lo: 17, hi: 22, fmt: (v) => v.toFixed(0) },
  { key: 'bias', label: 'Oximeter bias (points)', lo: -5.5, hi: 5.5, fmt: (v) => (v > 0 ? `+${v}` : `${v}`) },
  { key: 'pha', label: 'Arterial pH', lo: 7.2, hi: 7.36, fmt: (v) => v.toFixed(2) },
  { key: 'p50', label: 'Standard P_50 (mmHg)', lo: 18, hi: 20, fmt: (v) => v.toFixed(0) },
  { key: 'vo2', label: 'O_2 demand (mL/kg/min)', lo: 7, hi: 10, fmt: (v) => v.toFixed(0) },
  { key: 'q', label: 'Cardiac output (mL/kg/min)', lo: 130, hi: 190, fmt: (v) => v.toFixed(0) },
  { key: 'dph', label: 'A-V pH difference', lo: 0.03, hi: 0.09, fmt: (v) => v.toFixed(2) },
  { key: 'hb', label: 'Haemoglobin (g/dL)', lo: 14, hi: 18, fmt: (v) => v.toFixed(0) },
  { key: 'mult', label: 'Non-shunted flow fraction', lo: 0.8, hi: 1.0, fmt: (v) => v.toFixed(1) },
  { key: 'n', label: 'Hill exponent', lo: 2.5, hi: 2.9, fmt: (v) => v.toFixed(1) },
];

export function oatRows(spo2 = 50) {
  return OAT_RANGES.map((r) => {
    const a = evaluate({ ...DEFAULTS, spo2, [r.key]: r.lo }).M;
    const b = evaluate({ ...DEFAULTS, spo2, [r.key]: r.hi }).M;
    return { ...r, mLo: a, mHi: b, min: Math.min(a, b), max: Math.max(a, b) };
  }).sort((p, q) => q.max - q.min - (p.max - p.min));
}

export function TornadoFigure() {
  const rows = useMemo(() => oatRows(50), []);
  const base = evaluate(DEFAULTS).M;
  return (
    <Frame
      height={(w) => 40 + rows.length * (w < 560 ? 34 : 32) + 40}
      label="One-at-a-time sensitivity of the margin at a 50 percent reading. The critical venous PO2 floor, oximeter bias and arterial pH each move the margin across a range wider than its default value of 0.42."
    >
      {(w, h) => {
        const compact = w < 560;
        const labelW = compact ? 0 : 210;
        const m = { l: labelW + 12, r: 40, t: 24, b: 36 };
        const XMAX = 1.2;
        const x = (v: number) => m.l + (v / XMAX) * (w - m.l - m.r);
        const rowH = compact ? 34 : 32;
        return (
          <g fontSize={compact ? 11 : 12} className="pfig">
            {[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2].map((v) => (
              <g key={v}>
                <line x1={x(v)} x2={x(v)} y1={m.t - 8} y2={h - m.b} className={v === 1 ? 'pfig__unity' : 'pfig__grid'} />
                <text x={x(v)} y={h - m.b + 16} textAnchor="middle" className="pfig__tick">
                  {v.toFixed(1)}
                </text>
              </g>
            ))}
            <text x={w - m.r} y={h - 6} textAnchor="end" className="pfig__axis">
              M at a 50% reading
            </text>
            <line x1={x(base)} x2={x(base)} y1={m.t - 14} y2={h - m.b} className="pfig__base" />
            <text x={x(base) + 4} y={m.t - 12} className="pfig__ink">
              default 0.42
            </text>
            {rows.map((r, i) => {
              const yy = m.t + i * rowH + (compact ? 14 : 8);
              return (
                <g key={r.key}>
                  {compact ? (
                    <text x={m.l} y={yy - 3} className="pfig__muted">
                      <Sub t={r.label} />
                    </text>
                  ) : (
                    <text x={labelW} y={yy + 12} textAnchor="end" className="pfig__ink">
                      <Sub t={r.label} />
                    </text>
                  )}
                  <rect x={x(r.min)} y={yy + (compact ? 2 : 2)} width={Math.max(2, x(r.max) - x(r.min))} height={compact ? 12 : 14} className="pfig__bar" />
                  {!compact && (
                  <>
                  <text x={x(r.mLo) + (r.mLo < r.mHi ? -4 : 4)} y={yy + 13} textAnchor={r.mLo < r.mHi ? 'end' : 'start'} className="pfig__end">
                    {r.fmt(r.lo)}
                  </text>
                  <text x={x(r.mHi) + (r.mHi > r.mLo ? 4 : -4)} y={yy + 13} textAnchor={r.mHi > r.mLo ? 'start' : 'end'} className="pfig__end">
                    {r.fmt(r.hi)}
                  </text>
                  </>
                  )}
                </g>
              );
            })}
          </g>
        );
      }}
    </Frame>
  );
}
