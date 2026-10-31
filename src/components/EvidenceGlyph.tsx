import { useId } from 'react';
import type { EvidenceKind } from '../content/site';

/**
 * One shape per evidential status, used consistently across every figure,
 * so status is carried by form as well as colour:
 *   measured  filled disc      reported  ring
 *   inferred  open triangle    assumed   dashed diamond
 *   unknown   hatched square
 */
export function EvidenceGlyph({
  kind,
  size = 16,
  title,
}: {
  kind: EvidenceKind;
  size?: number;
  title?: string;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className="evidence-glyph"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <GlyphShape kind={kind} patternId={`h${id}`} />
    </svg>
  );
}

/** Raw shape centred on (8,8) in a 16-unit box; reusable inside larger SVGs. */
export function GlyphShape({ kind, patternId }: { kind: EvidenceKind; patternId: string }) {
  switch (kind) {
    case 'measured':
      return <circle cx="8" cy="8" r="5.5" fill="var(--blue)" />;
    case 'reported':
      return <circle cx="8" cy="8" r="5" fill="var(--paper)" stroke="var(--blue)" strokeWidth="2" />;
    case 'inferred':
      return (
        <path
          d="M8 2.5 L13.5 12.5 L2.5 12.5 Z"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      );
    case 'assumed':
      return (
        <path
          d="M8 2 L14 8 L8 14 L2 8 Z"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.5"
          strokeDasharray="2.2 1.8"
        />
      );
    case 'unknown':
      return (
        <>
          <defs>
            <pattern id={patternId} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="3" stroke="var(--ink-3)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="2.5" y="2.5" width="11" height="11" fill={`url(#${patternId})`} stroke="var(--ink-3)" strokeWidth="1" />
        </>
      );
  }
}
