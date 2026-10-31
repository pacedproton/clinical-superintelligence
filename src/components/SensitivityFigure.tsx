import { useId, useMemo, useState } from 'react';

/**
 * Schematic sensitivity analysis over two generic inputs, each scaled 0-1.
 * The conclusion "holds" above an invented boundary curve. Purely explanatory;
 * not a model of any physiology or patient.
 */
const NOMINAL = { a: 0.6, b: 0.6 };
const STEP = 0.05;
const N = Math.round(1 / STEP) + 1;
const boundary = (a: number) => 0.78 - 0.9 * a + 0.25 * a * a;
const holds = (a: number, b: number) => b > boundary(a);

const SIZE = 400;
const PAD = { l: 44, r: 16, t: 16, b: 44 };
const PLOT = SIZE - PAD.l - PAD.r;
const px = (a: number) => PAD.l + a * PLOT;
const py = (b: number) => PAD.t + (1 - b) * PLOT;

export function SensitivityFigure({ caption }: { caption: string }) {
  const [step, setStep] = useState(2);
  const uid = useId().replace(/:/g, '');
  const r = 0.05 * step;

  const { points, inRange, holding } = useMemo(() => {
    const pts: { a: number; b: number; inside: boolean; ok: boolean }[] = [];
    let n = 0;
    let ok = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const a = +(i * STEP).toFixed(2);
        const b = +(j * STEP).toFixed(2);
        const inside = Math.abs(a - NOMINAL.a) <= r + 1e-9 && Math.abs(b - NOMINAL.b) <= r + 1e-9;
        const good = holds(a, b);
        if (inside) {
          n++;
          if (good) ok++;
        }
        pts.push({ a, b, inside, ok: good });
      }
    }
    return { points: pts, inRange: n, holding: ok };
  }, [r]);

  const pct = Math.round((holding / inRange) * 100);
  const verdict =
    holding === inRange
      ? 'Robust across this range.'
      : pct >= 70
        ? 'Sensitive: reverses at the edge of the range.'
        : 'Not robust: a hypothesis, not a finding.';

  const curve = Array.from({ length: 41 }, (_, i) => i / 40)
    .map((a) => [a, boundary(a)] as const)
    .filter(([, b]) => b >= 0 && b <= 1)
    .map(([a, b], i) => `${i ? 'L' : 'M'}${px(a).toFixed(1)} ${py(b).toFixed(1)}`)
    .join(' ');

  return (
    <figure className="sens">
      <div className="sens__plot">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby={`${uid}-t`}>
          <title id={`${uid}-t`}>
            {`Schematic grid of input combinations. Within the selected range, ${holding} of ${inRange} combinations support the conclusion.`}
          </title>
          <rect x={PAD.l} y={PAD.t} width={PLOT} height={PLOT} fill="none" stroke="var(--rule)" />
          {/* evaluated range */}
          <rect
            className="sens__range"
            x={px(Math.max(0, NOMINAL.a - r))}
            y={py(Math.min(1, NOMINAL.b + r))}
            width={px(Math.min(1, NOMINAL.a + r)) - px(Math.max(0, NOMINAL.a - r))}
            height={py(Math.max(0, NOMINAL.b - r)) - py(Math.min(1, NOMINAL.b + r))}
            fill="var(--blue-wash)"
            stroke="var(--blue)"
            strokeWidth="1"
          />
          {points.map((p) =>
            !p.inside ? (
              <circle key={`${p.a}-${p.b}`} cx={px(p.a)} cy={py(p.b)} r="1.4" fill="var(--rule-strong)" />
            ) : p.ok ? (
              <circle key={`${p.a}-${p.b}`} cx={px(p.a)} cy={py(p.b)} r="4.6" fill="var(--blue)" />
            ) : (
              <circle
                key={`${p.a}-${p.b}`}
                cx={px(p.a)}
                cy={py(p.b)}
                r="4"
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth="1.4"
              />
            ),
          )}
          <path d={curve} fill="none" stroke="var(--ink)" strokeWidth="1" strokeDasharray="4 4" />
          <text x={px(0.03)} y={py(0.04)} className="sens__label">
            Below the dashed line, the conclusion reverses
          </text>
          {/* nominal */}
          <g stroke="var(--ink)" strokeWidth="1.25">
            <line x1={px(NOMINAL.a) - 11} x2={px(NOMINAL.a) + 11} y1={py(NOMINAL.b)} y2={py(NOMINAL.b)} />
            <line x1={px(NOMINAL.a)} x2={px(NOMINAL.a)} y1={py(NOMINAL.b) - 11} y2={py(NOMINAL.b) + 11} />
          </g>
          <text x={PAD.l + PLOT / 2} y={SIZE - 12} textAnchor="middle" className="sens__label">
            Uncertain input A
          </text>
          <text
            x={14}
            y={PAD.t + PLOT / 2}
            textAnchor="middle"
            transform={`rotate(-90 14 ${PAD.t + PLOT / 2})`}
            className="sens__label"
          >
            Uncertain input B
          </text>
        </svg>
      </div>

      <div className="sens__controls">
        <label htmlFor={`${uid}-range`} className="sens__control-label">
          Plausible range of each input
          <span className="mono">&plusmn;{Math.round(r * 100)}%</span>
        </label>
        <input
          id={`${uid}-range`}
          type="range"
          min={1}
          max={8}
          step={1}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          aria-valuetext={`plus or minus ${Math.round(r * 100)} percent`}
        />
        <div className="sens__readout" aria-live="polite">
          <p className="sens__count">
            <span className="sens__num">{holding}</span>
            <span className="sens__of"> of {inRange} combinations support the conclusion</span>
          </p>
          <div className="sens__bar" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="sens__verdict">{verdict}</p>
        </div>
        <ul className="sens__key small" aria-label="Key">
          <li>
            <svg width="12" height="12" aria-hidden="true">
              <path d="M0 6 H12 M6 0 V12" stroke="var(--ink)" strokeWidth="1.25" />
            </svg>
            Values chosen for the model
          </li>
          <li>
            <svg width="12" height="12" aria-hidden="true">
              <circle cx="6" cy="6" r="4.6" fill="var(--blue)" />
            </svg>
            Conclusion holds
          </li>
          <li>
            <svg width="12" height="12" aria-hidden="true">
              <circle cx="6" cy="6" r="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.4" />
            </svg>
            Conclusion reverses
          </li>
        </ul>
      </div>
      <figcaption className="figcaption">
        <span className="figcaption__n mono">Fig. 3</span>
        {caption}
      </figcaption>
    </figure>
  );
}
