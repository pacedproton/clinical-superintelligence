import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { phases, reportedInterventions, reportedReadings } from '../content/case';
import { rich } from '../lib/rich';
import { useElementWidth } from '../lib/hooks';
import { EvidenceGlyph } from './EvidenceGlyph';

type Mode = 'reported' | 'reconstruction';

const T_MAX = 35;
const S_MIN = 40;
const S_MAX = 100;

/** Renders "O_2" style subscripts inside SVG text without relying on baseline-shift. */
function SvgRich({ text }: { text: string }) {
  const parts = text.split(/_(\d+)/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <tspan key={i} dy="3" fontSize="0.72em">
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

export function CaseTimeline({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const [mode, setMode] = useState<Mode>('reported');
  const [phaseIdx, setPhaseIdx] = useState(1);
  const [boxRef, width] = useElementWidth<HTMLDivElement>(960);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId().replace(/:/g, '');

  const w = Math.max(300, width);
  const compact = w < 640;
  const fs = compact ? 11 : 12.5;
  const m = { l: compact ? 36 : 60, r: compact ? 14 : 28 };
  const plotTop = compact ? 70 : 78;
  const plotBottom = compact ? 248 : 300;
  const laneTop = plotBottom + (compact ? 30 : 38);
  const laneH = compact ? 14 : 18;
  const axisY = laneTop + laneH + (compact ? 40 : 46);
  const h = axisY + (compact ? 40 : 46);

  const x = (t: number) => m.l + (t / T_MAX) * (w - m.l - m.r);
  const y = (s: number) => plotBottom - ((s - S_MIN) / (S_MAX - S_MIN)) * (plotBottom - plotTop);

  const phase = phases[phaseIdx];
  const recon = mode === 'reconstruction';
  const H = (headingLevel === 3 ? 'h3' : 'h4') as 'h3' | 'h4';

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % phases.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + phases.length) % phases.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = phases.length - 1;
    else return;
    e.preventDefault();
    setPhaseIdx(next);
    tabRefs.current[next]?.focus();
  };

  // Proposed reconstruction from the source analysis (illustrative; dashed).
  const reconPath = [
    `M${x(5)} ${y(50)}`,
    `H${x(17)}`,
    `V${y(58)}`,
    `H${x(27)}`,
    `L${x(28.5)} ${y(64)}`,
    `L${x(32)} ${y(94)}`,
  ].join(' ');

  const [p0, p1] = phase.range;

  return (
    <div className="case-timeline">
      <div className="case-timeline__controls">
        <fieldset className="segmented">
          <legend className="visually-hidden">Timeline view</legend>
          {(
            [
              ['reported', 'Reported observations'],
              ['reconstruction', 'Proposed reconstruction'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={`segmented__option${mode === value ? ' is-checked' : ''}`}>
              <input
                type="radio"
                name={`mode-${uid}`}
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <p className="case-timeline__status small" aria-live="polite">
          {recon
            ? 'Showing the source analysis’s proposed reconstruction. Dashed lines and diamonds are assumptions, not measurements.'
            : 'Showing only what the supplied narrative reports. Nothing is drawn between readings.'}
        </p>
      </div>

      <div className="case-timeline__chart" ref={boxRef}>
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-labelledby={`${uid}-t ${uid}-d`}
          style={{ fontSize: fs }}
        >
          <title id={`${uid}-t`}>Reported oxygen saturation timeline, minutes 0 to 35 after birth</title>
          <desc id={`${uid}-d`}>
            {'No continuous saturation record for minutes 0 to 17. Reported readings: about 50% around minute 17, about 58% at an unspecified time between minutes 17 and 27, and 94% around minute 32. Reported interventions: prone positioning and chest physiotherapy from minute 17 to 27; nasal cannula oxygen at 3 litres per minute from about minute 27.' +
              (recon
                ? ' Proposed reconstruction shown as a dashed line: an assumed plateau at 50% from minute 5, an assumed plateau at 58%, and a rise through a proposed, unvalidated 64% threshold to 94%.'
                : '')}
          </desc>
          <defs>
            <pattern id={`${uid}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-3)" strokeWidth="0.7" strokeOpacity="0.55" />
            </pattern>
            <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 Z" fill="var(--ink)" />
            </marker>
          </defs>

          {/* selected phase */}
          <rect
            className="case-timeline__phase-band"
            x={x(p0)}
            y={plotTop - 22}
            width={Math.max(6, x(p1) - x(p0))}
            height={laneTop + laneH + 10 - (plotTop - 22)}
            fill="var(--blue-wash)"
          />

          {/* grid */}
          {[40, 50, 60, 70, 80, 90, 100].map((s) => (
            <g key={s}>
              <line x1={m.l} x2={w - m.r} y1={y(s)} y2={y(s)} stroke="var(--rule)" strokeWidth={s === 40 ? 1 : 0.75} />
              <text x={m.l - 8} y={y(s) + 4} textAnchor="end" className="tl-axis">
                {s}
              </text>
            </g>
          ))}
          <text x={0} y={plotTop - 34} className="tl-axis tl-axis--title">
            <SvgRich text="SpO_2 %" />
          </text>

          {/* unobserved interval */}
          <rect x={x(0)} y={plotTop} width={x(17) - x(0)} height={plotBottom - plotTop} fill={`url(#${uid}-hatch)`} />
          <rect x={x(0)} y={plotTop} width={x(17) - x(0)} height={plotBottom - plotTop} fill="none" stroke="var(--rule-strong)" strokeDasharray="3 3" />
          <g className="tl-note">
            <text x={x(8.5)} y={y(compact ? 84 : 86)} textAnchor="middle" className="tl-strong">
              {compact ? 'No record' : 'No continuous saturation record'}
            </text>
            <text x={x(8.5)} y={y(compact ? 84 : 86) + (compact ? 14 : 17)} textAnchor="middle" className="tl-muted">
              {compact ? 'min 0-17' : 'supplied for minutes 0-17'}
            </text>
          </g>

          {/* birth */}
          <line x1={x(0)} x2={x(0)} y1={plotTop - 18} y2={laneTop + laneH} stroke="var(--ink)" strokeWidth="1.25" />
          <text x={x(0) + 6} y={plotTop - 8} className="tl-strong">
            Birth
          </text>

          {/* reconstruction overlay */}
          <g className={`tl-recon${recon ? ' is-on' : ''}`} aria-hidden={!recon}>
            {/* inferred exposure bracket */}
            <g>
              <path
                d={`M${x(5)} ${plotTop - 6} V${plotTop - 14} H${x(28.5)} V${plotTop - 6}`}
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1"
              />
              <text x={x(16.75)} y={plotTop - 20} textAnchor="middle" className="tl-ink">
                {compact ? 'Inferred exposure 22-24 min' : 'Inferred “hypoxic exposure”, 22-24 min (source analysis)'}
              </text>
            </g>
            {/* assumed transition 0-5 */}
            <rect
              x={x(0)}
              y={y(60)}
              width={x(5) - x(0)}
              height={y(50) - y(60)}
              fill="none"
              stroke="var(--ink)"
              strokeDasharray="3 3"
            />
            {/* threshold */}
            <line x1={m.l} x2={w - m.r} y1={y(64)} y2={y(64)} stroke="var(--ink-3)" strokeDasharray="1 4" strokeWidth="1.25" />
            <text x={m.l + 8} y={y(64) - 7} className="tl-ink">
              {compact ? '64% threshold (unvalidated)' : 'Proposed 64% threshold · unvalidated'}
            </text>
            {/* dashed reconstruction */}
            <path d={reconPath} fill="none" stroke="var(--ink)" strokeWidth="1.75" strokeDasharray="6 5" />
            {/* assumption markers */}
            {[
              { t: 11, s: 50, label: compact ? 'assumed' : 'Assumed plateau ~50%', below: true },
              { t: 22, s: 58, label: compact ? '' : 'Assumed plateau ~58%', below: true },
              { t: 28.5, s: 64, label: compact ? '' : 'Assumed crossing', below: false, left: true },
            ].map((a) => (
              <g key={a.t}>
                <path
                  d={`M${x(a.t)} ${y(a.s) - 7} L${x(a.t) + 7} ${y(a.s)} L${x(a.t)} ${y(a.s) + 7} L${x(a.t) - 7} ${y(a.s)} Z`}
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth="1.25"
                  strokeDasharray="2.2 1.8"
                />
                {a.label && (
                  <text
                    x={'left' in a ? x(a.t) - 12 : x(a.t)}
                    y={a.below ? y(a.s) + 22 : y(a.s) - 8}
                    textAnchor={'left' in a ? 'end' : 'middle'}
                    className="tl-ink"
                  >
                    {a.label}
                  </text>
                )}
              </g>
            ))}
            {/* assumed FiO2 */}
            <text x={x(27)} y={laneTop - 8} className="tl-ink" textAnchor={compact ? 'end' : 'start'} dx={compact ? -4 : 4}>
              <SvgRich text={compact ? 'FiO_2 ~50%?' : 'Assumed FiO_2 ~50%'} />
            </text>
          </g>

          {/* reported readings */}
          {reportedReadings.map((r) => (
            <g key={r.id}>
              {'tFrom' in r && (
                <g stroke="var(--blue)" strokeWidth="1.25">
                  <line x1={x(r.tFrom)} x2={x(r.tTo)} y1={y(r.spo2)} y2={y(r.spo2)} strokeDasharray="1 3" />
                  <line x1={x(r.tFrom)} x2={x(r.tFrom)} y1={y(r.spo2) - 6} y2={y(r.spo2) + 6} />
                  <line x1={x(r.tTo)} x2={x(r.tTo)} y1={y(r.spo2) - 6} y2={y(r.spo2) + 6} />
                </g>
              )}
              <circle cx={x(r.t)} cy={y(r.spo2)} r={compact ? 6 : 7.5} fill="var(--paper)" stroke="var(--blue)" strokeWidth="2.5" />
              <text
                x={x(r.t) + (r.id === 'r32' ? -12 : 0)}
                y={r.id === 'r17' ? y(r.spo2) + (compact ? 22 : 26) : y(r.spo2) - (compact ? 12 : 15)}
                textAnchor={r.id === 'r32' ? 'end' : 'middle'}
                className="tl-reading"
              >
                {r.label}
              </text>
            </g>
          ))}
          {!compact && !recon && (
            <text x={x(22)} y={y(58) + 24} textAnchor="middle" className="tl-muted">
              time within interval not given
            </text>
          )}

          {/* intervention lane */}
          <text x={m.l + 8} y={laneTop - 10} className="tl-muted">
            {compact ? 'Interventions' : 'Reported interventions'}
          </text>
          <line x1={m.l} x2={w - m.r} y1={laneTop + laneH / 2} y2={laneTop + laneH / 2} stroke="var(--rule)" />
          {reportedInterventions.map((iv) => {
            const isO2 = iv.id === 'o2';
            return (
              <g key={iv.id}>
                {isO2 ? (
                  <>
                    <line
                      x1={x(iv.from)}
                      x2={x(iv.to) - 2}
                      y1={laneTop + laneH / 2}
                      y2={laneTop + laneH / 2}
                      stroke="var(--ink)"
                      strokeWidth="2"
                      markerEnd={`url(#${uid}-arrow)`}
                    />
                    <rect x={x(iv.from) - laneH / 2} y={laneTop} width={laneH} height={laneH} fill="var(--ink)" />
                  </>
                ) : (
                  <rect
                    x={x(iv.from)}
                    y={laneTop}
                    width={x(iv.to) - x(iv.from)}
                    height={laneH}
                    fill="var(--paper)"
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                  />
                )}
                <text
                  x={isO2 ? (compact ? w - m.r : x(iv.from)) : compact ? x(iv.to) - 12 : x((iv.from + iv.to) / 2)}
                  y={laneTop + laneH + (compact ? 15 : 18)}
                  textAnchor={isO2 ? (compact ? 'end' : 'start') : compact ? 'end' : 'middle'}
                  className="tl-ink"
                >
                  <SvgRich text={compact ? (isO2 ? 'O_2 3 L/min' : 'Positioning') : iv.short} />
                </text>
              </g>
            );
          })}

          {/* x axis */}
          <line x1={m.l} x2={w - m.r} y1={axisY} y2={axisY} stroke="var(--ink)" />
          {[0, 5, 10, 15, 20, 25, 30, 35].map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={axisY} y2={axisY + 5} stroke="var(--ink)" />
              <text x={x(t)} y={axisY + 19} textAnchor="middle" className="tl-axis">
                {t}
              </text>
            </g>
          ))}
          <text x={w - m.r} y={axisY + 36} textAnchor="end" className="tl-axis tl-axis--title">
            Minutes after birth
          </text>

          {/* mouse targets for phases (keyboard users use the tabs below) */}
          {phases
            .map((p, i) => ({ p, i }))
            .sort((a, b) => (b.p.range[1] - b.p.range[0]) - (a.p.range[1] - a.p.range[0]))
            .map(({ p, i }) => (
            <rect
              key={p.id}
              x={x(p.range[0])}
              y={plotTop - 22}
              width={Math.max(14, x(p.range[1]) - x(p.range[0]))}
              height={laneTop + laneH - plotTop + 22}
              fill="transparent"
              className="tl-hit"
              aria-hidden="true"
              onClick={() => setPhaseIdx(i)}
            />
          ))}
        </svg>
      </div>

      <ul className="tl-legend" aria-label="Legend">
        <li>
          <EvidenceGlyph kind="reported" /> Reported reading
        </li>
        <li>
          <svg width="22" height="10" aria-hidden="true">
            <line x1="1" x2="21" y1="5" y2="5" stroke="var(--blue)" strokeWidth="1.25" strokeDasharray="1 3" />
            <line x1="1" x2="1" y1="0" y2="10" stroke="var(--blue)" strokeWidth="1.25" />
            <line x1="21" x2="21" y1="0" y2="10" stroke="var(--blue)" strokeWidth="1.25" />
          </svg>
          Reported time window
        </li>
        <li>
          <EvidenceGlyph kind="unknown" /> No record supplied
        </li>
        <li>
          <svg width="16" height="16" aria-hidden="true">
            <rect x="2" y="4" width="12" height="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
          </svg>
          Reported intervention
        </li>
        <li className={recon ? '' : 'is-dim'}>
          <svg width="26" height="10" aria-hidden="true">
            <line x1="0" x2="26" y1="5" y2="5" stroke="var(--ink)" strokeWidth="1.75" strokeDasharray="6 5" />
          </svg>
          Proposed reconstruction (illustrative)
        </li>
        <li className={recon ? '' : 'is-dim'}>
          <EvidenceGlyph kind="assumed" /> Assumption
        </li>
      </ul>

      <div className="phase-tabs" role="tablist" aria-label="Phases of the timeline">
        {phases.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${p.id}`}
            aria-selected={i === phaseIdx}
            aria-controls={`${uid}-panel`}
            tabIndex={i === phaseIdx ? 0 : -1}
            className="phase-tab"
            onClick={() => setPhaseIdx(i)}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            <span className="phase-tab__when mono">{p.when}</span>
            <span className="phase-tab__title">{p.title}</span>
          </button>
        ))}
      </div>

      <div
        className="phase-panel"
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${phase.id}`}
        tabIndex={0}
      >
        <PanelBlock H={H} glyph={<EvidenceGlyph kind="reported" />} title="What the narrative reports" items={phase.reported} />
        <PanelBlock
          H={H}
          glyph={<EvidenceGlyph kind="inferred" />}
          title="What the AI analysis inferred"
          items={phase.inferred}
          tone="claim"
        />
        <PanelBlock
          H={H}
          glyph={<EvidenceGlyph kind="assumed" />}
          title="Assumptions behind the numbers"
          items={phase.assumptions}
        />
        <PanelBlock
          H={H}
          glyph={<EvidenceGlyph kind="unknown" />}
          title="Evidence that would help evaluate it"
          items={phase.evidence}
        />
      </div>
      <p className="phase-panel__foot small">
        Inferred values are unvalidated claims from the source analysis, shown so they can be examined. They are not
        patient findings or clinical guidance.
      </p>
    </div>
  );
}

function PanelBlock({
  H,
  glyph,
  title,
  items,
  tone,
}: {
  H: 'h3' | 'h4';
  glyph: ReactNode;
  title: string;
  items: string[];
  tone?: 'claim';
}) {
  return (
    <section className={`phase-block${tone ? ` phase-block--${tone}` : ''}`}>
      <H className="phase-block__title">
        {glyph}
        {title}
      </H>
      <ul>
        {items.map((it) => (
          <li key={it}>{rich(it)}</li>
        ))}
      </ul>
    </section>
  );
}
