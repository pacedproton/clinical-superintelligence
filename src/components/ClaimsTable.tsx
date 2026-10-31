import { claims } from '../content/case';
import { evidenceKinds } from '../content/site';
import { rich } from '../lib/rich';
import { EvidenceGlyph } from './EvidenceGlyph';

/** Compact, expandable table of the source model's key numbers and their evidential status. */
export function ClaimsTable({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <details className="claims" open={defaultOpen}>
      <summary className="claims__summary">
        <span className="claims__title">Claims under examination</span>
        <span className="claims__meta mono">{claims.length} claims from the source analysis</span>
        <span className="claims__chev" aria-hidden="true" />
      </summary>
      <div className="claims__body">
        <p className="small claims__intro">
          Numbers as stated by the AI-generated source analysis, with what each one rests on. None has been
          validated; they are listed here to be examined, not used.
        </p>
        <div className="claims__scroll">
          <table>
            <caption className="visually-hidden">
              Claims made by the source analysis, their stated values, what they rest on, and their evidential status
            </caption>
            <thead>
              <tr>
                <th scope="col">Claim</th>
                <th scope="col">Source value</th>
                <th scope="col">Rests on</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.claim}>
                  <th scope="row">{rich(c.claim)}</th>
                  <td className="mono claims__value">{rich(c.value)}</td>
                  <td>{rich(c.restsOn)}</td>
                  <td>
                    <span className="status">
                      <EvidenceGlyph kind={c.status} />
                      <span>
                        <span className="status__kind">{evidenceKinds[c.status].label}</span>
                        {c.statusNote !== evidenceKinds[c.status].label && (
                          <span className="status__note">{c.statusNote}</span>
                        )}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}
