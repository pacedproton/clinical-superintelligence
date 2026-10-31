import { GlyphShape } from './EvidenceGlyph';
import type { EvidenceKind } from '../content/site';

/**
 * Illustrative composition: five streams of a clinical record arrive as
 * fragments at irregular times, and are drawn into one model (the disc).
 * Positions are invented for composition. No patient data.
 */

const X0 = 128;
const X1 = 392;
const DISC = { cx: 522, cy: 196, r: 104 };

type Mark = { x: number; kind: EvidenceKind | 'tick' | 'bar' | 'square' };
const streams: { label: string; y: number; marks: Mark[]; gap?: [number, number] }[] = [
  { label: 'Observations', y: 52, marks: [{ x: 146, kind: 'reported' }, { x: 236, kind: 'reported' }, { x: 338, kind: 'reported' }] },
  {
    label: 'Monitor',
    y: 112,
    gap: [140, 262],
    marks: [{ x: 276, kind: 'tick' }, { x: 288, kind: 'tick' }, { x: 300, kind: 'tick' }, { x: 312, kind: 'tick' }, { x: 324, kind: 'tick' }, { x: 336, kind: 'tick' }, { x: 348, kind: 'tick' }, { x: 360, kind: 'tick' }],
  },
  { label: 'Laboratory', y: 172, marks: [{ x: 214, kind: 'measured' }, { x: 352, kind: 'measured' }] },
  { label: 'Interventions', y: 232, marks: [{ x: 258, kind: 'square' }, { x: 318, kind: 'square' }] },
  { label: 'Notes', y: 292, marks: [{ x: 180, kind: 'bar' }, { x: 296, kind: 'bar' }, { x: 376, kind: 'bar' }] },
];

// Connector targets on the disc's left-hand arc.
function arcPoint(i: number, n: number) {
  const a0 = (150 * Math.PI) / 180;
  const a1 = (210 * Math.PI) / 180;
  const a = a0 + ((a1 - a0) * i) / (n - 1);
  return { x: DISC.cx + DISC.r * Math.cos(a), y: DISC.cy + DISC.r * Math.sin(a) };
}

export function HeroFigure({ caption }: { caption: string }) {
  const all = streams.flatMap((s) =>
    s.marks.filter((m) => m.kind !== 'tick').map((m) => ({ x: m.x, y: s.y })),
  );
  // Monitor contributes one connector from the end of its run of ticks.
  all.push({ x: 360, y: 112 });
  all.sort((a, b) => a.y - b.y || a.x - b.x);

  return (
    <figure className="hero-figure">
      <svg viewBox="0 0 640 372" role="img" aria-labelledby="hero-fig-title">
        <title id="hero-fig-title">
          Illustration: five streams of a clinical record, with fragments at irregular times and a gap in the
          monitor stream, converging into a single model.
        </title>
        <defs>
          <pattern id="hero-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--ink-3)" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* connectors, drawn behind */}
        <g className="hero-figure__links" fill="none" stroke="var(--ink-3)" strokeWidth="0.75">
          {all.map((p, i) => {
            const t = arcPoint(i, all.length);
            const c1x = p.x + (t.x - p.x) * 0.55;
            return (
              <path
                key={i}
                d={`M${p.x} ${p.y} C ${c1x} ${p.y}, ${c1x} ${t.y}, ${t.x} ${t.y}`}
                pathLength={1}
                style={{ animationDelay: `${0.5 + i * 0.07}s` }}
              />
            );
          })}
        </g>

        {streams.map((s, si) => (
          <g key={s.label} className="hero-figure__stream" style={{ animationDelay: `${si * 0.08}s` }}>
            <text x="0" y={s.y + 4} className="hero-figure__label">
              {s.label}
            </text>
            <line x1={X0} x2={X1} y1={s.y} y2={s.y} stroke="var(--rule-strong)" strokeWidth="1" />
            {s.gap && (
              <rect x={s.gap[0]} y={s.y - 9} width={s.gap[1] - s.gap[0]} height="18" fill="url(#hero-hatch)" opacity="0.7" />
            )}
            {s.marks.map((m, mi) => {
              if (m.kind === 'tick')
                return <line key={mi} x1={m.x} x2={m.x} y1={s.y - 8} y2={s.y + 8} stroke="var(--blue)" strokeWidth="1.5" />;
              if (m.kind === 'bar')
                return <rect key={mi} x={m.x - 12} y={s.y - 2} width="24" height="4" fill="var(--ink)" />;
              if (m.kind === 'square')
                return <rect key={mi} x={m.x - 6} y={s.y - 6} width="12" height="12" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />;
              return (
                <g key={mi} transform={`translate(${m.x - 9} ${s.y - 9}) scale(1.125)`}>
                  <GlyphShape kind={m.kind} patternId="hero-glyph" />
                </g>
              );
            })}
          </g>
        ))}

        {/* the model */}
        <g className="hero-figure__disc">
          <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r} fill="var(--blue)" />
          <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r * 0.7} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.75" />
          <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r * 0.4} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.75" />
          <line x1={DISC.cx - DISC.r + 14} x2={DISC.cx + DISC.r - 14} y1={DISC.cy} y2={DISC.cy} stroke="#fff" strokeWidth="1" />
          <circle cx={DISC.cx - 34} cy={DISC.cy} r="3.5" fill="var(--blue)" stroke="#fff" strokeWidth="1.5" />
          <circle cx={DISC.cx + 6} cy={DISC.cy} r="3.5" fill="var(--blue)" stroke="#fff" strokeWidth="1.5" />
          <circle cx={DISC.cx + 52} cy={DISC.cy} r="3.5" fill="#fff" />
        </g>

        {/* time axis */}
        <g className="hero-figure__axis">
          <line x1={X0} x2={X1} y1="340" y2="340" stroke="var(--ink)" strokeWidth="1" />
          {Array.from({ length: 12 }, (_, i) => X0 + i * 24).map((x) => (
            <line key={x} x1={x} x2={x} y1="340" y2="345" stroke="var(--ink)" strokeWidth="1" />
          ))}
          <text x={X1 + 10} y="344" className="hero-figure__label hero-figure__label--axis">
            time
          </text>
        </g>
      </svg>
      <figcaption className="figcaption">
        <span className="figcaption__n mono">Fig. 1</span>
        {caption}
      </figcaption>
    </figure>
  );
}
