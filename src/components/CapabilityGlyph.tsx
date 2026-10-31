import type { CapabilityGlyph as Kind } from '../content/site';

/** Small explanatory diagrams for the six capabilities. Decorative to AT; the text carries meaning. */
export function CapabilityGlyph({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 160 96" className="cap-glyph" aria-hidden="true">
      <defs>
        <pattern id={`cap-hatch-${kind}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--ink-3)" strokeWidth="0.8" />
        </pattern>
      </defs>
      {draw(kind)}
    </svg>
  );
}

const ink = 'var(--ink)';
const blue = 'var(--blue)';
const muted = 'var(--rule-strong)';

function draw(kind: Kind) {
  switch (kind) {
    case 'timeline':
      // observations on an axis, with a preserved (hatched) gap
      return (
        <g>
          <line x1="8" x2="152" y1="62" y2="62" stroke={ink} />
          <rect x="52" y="44" width="46" height="36" fill={`url(#cap-hatch-${kind})`} />
          {[20, 38, 112, 128, 144].map((x) => (
            <circle key={x} cx={x} cy={62} r="4.5" fill="var(--paper)" stroke={blue} strokeWidth="2" />
          ))}
          {[30, 120].map((x) => (
            <rect key={x} x={x - 4} y={22} width="8" height="8" fill="none" stroke={ink} strokeWidth="1.25" />
          ))}
          {[30, 120].map((x) => (
            <line key={`l${x}`} x1={x} x2={x} y1={30} y2={56} stroke={ink} strokeWidth="0.75" strokeDasharray="2 2" />
          ))}
        </g>
      );
    case 'physiology':
      // a chain of compartments: lung -> blood -> tissue
      return (
        <g fill="none" strokeWidth="1.25">
          <circle cx="28" cy="48" r="18" stroke={ink} />
          <circle cx="80" cy="48" r="18" fill={blue} stroke={blue} />
          <circle cx="132" cy="48" r="18" stroke={ink} />
          <path d="M48 48 H58 M52 44 L58 48 L52 52" stroke={ink} />
          <path d="M100 48 H110 M104 44 L110 48 L104 52" stroke={ink} />
          <path d="M132 70 C 132 90, 28 90, 28 70" stroke={muted} strokeDasharray="3 3" />
        </g>
      );
    case 'disciplines':
      return (
        <g fill="none" strokeWidth="1.25">
          <circle cx="62" cy="40" r="26" stroke={ink} />
          <circle cx="98" cy="40" r="26" stroke={ink} />
          <circle cx="80" cy="66" r="26" stroke={ink} />
          <circle cx="80" cy="50" r="7" fill={blue} stroke="none" />
        </g>
      );
    case 'hypotheses':
      // one observation, two explanations, a distinguishing test
      return (
        <g fill="none" strokeWidth="1.25">
          <circle cx="16" cy="48" r="5" fill="var(--paper)" stroke={blue} strokeWidth="2" />
          <path d="M21 48 C 50 48, 54 22, 88 22 H112" stroke={ink} />
          <path d="M21 48 C 50 48, 54 74, 88 74 H112" stroke={ink} strokeDasharray="4 3" />
          <path d="M120 22 L126 28 L120 34 L114 28 Z" stroke={ink} transform="translate(0 -6)" />
          <path d="M120 74 L126 80 L120 86 L114 80 Z" stroke={ink} transform="translate(0 -6)" />
          <line x1="144" x2="144" y1="10" y2="86" stroke={blue} strokeWidth="2" />
          <circle cx="144" cy="48" r="4" fill={blue} stroke="none" />
        </g>
      );
    case 'uncertainty':
      // the five evidential glyphs in a row
      return (
        <g>
          <circle cx="20" cy="48" r="8" fill={blue} />
          <circle cx="50" cy="48" r="7.5" fill="var(--paper)" stroke={blue} strokeWidth="2" />
          <path d="M80 39 L89 56 L71 56 Z" fill="none" stroke={ink} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M110 38 L120 48 L110 58 L100 48 Z" fill="none" stroke={ink} strokeWidth="1.5" strokeDasharray="2.5 2" />
          <rect x="132" y="39" width="18" height="18" fill={`url(#cap-hatch-${kind})`} stroke="var(--ink-3)" />
          <line x1="8" x2="152" y1="76" y2="76" stroke={muted} />
        </g>
      );
    case 'audit':
      // a conclusion traced back to its inputs
      return (
        <g fill="none" strokeWidth="1.25">
          <rect x="112" y="34" width="36" height="28" fill={blue} stroke={blue} />
          {[18, 48, 78].map((y, i) => (
            <g key={y}>
              <path d={`M30 ${y} C 70 ${y}, 72 48, 112 48`} stroke={ink} strokeWidth="0.9" />
              {i === 0 && <circle cx="22" cy={y} r="5" fill={blue} stroke="none" />}
              {i === 1 && <circle cx="22" cy={y} r="5" fill="var(--paper)" stroke={blue} strokeWidth="2" />}
              {i === 2 && <path d={`M22 ${y - 6} L28 ${y} L22 ${y + 6} L16 ${y} Z`} stroke={ink} strokeDasharray="2 1.6" />}
            </g>
          ))}
        </g>
      );
  }
}
