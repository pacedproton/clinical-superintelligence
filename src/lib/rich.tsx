import { Fragment, type ReactNode } from 'react';

/**
 * Minimal inline markup for content strings, so copy can live in plain data:
 *   O_2      -> O<sub>2</sub>   (underscore followed by one or more digits)
 *   *text*   -> <em>text</em>
 */
export function rich(text: string): ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{subs(part.slice(1, -1))}</em>;
    }
    return <Fragment key={i}>{subs(part)}</Fragment>;
  });
}

function subs(text: string): ReactNode {
  // Keep numeric ranges such as 0.37-0.42 or 80-85 on one line.
  const ranges = text.split(/(\d[\d.]*-\d[\d.]*%?)/g);
  if (ranges.length > 1) {
    return ranges.map((r, i) =>
      i % 2 === 1 ? (
        <span key={i} className="nowrap">
          {r}
        </span>
      ) : (
        <Fragment key={i}>{subscripts(r)}</Fragment>
      ),
    );
  }
  return subscripts(text);
}

function subscripts(text: string): ReactNode {
  const parts = text.split(/_(\d+)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? <sub key={i}>{part}</sub> : <Fragment key={i}>{part}</Fragment>,
  );
}

/** Plain-text form of a rich string, for aria labels and titles. */
export function plain(text: string): string {
  return text.replace(/\*/g, '').replace(/_(\d+)/g, '$1');
}
