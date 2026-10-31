import {
  caseMeta,
  doesNotShow,
  narrative,
  openQuestions,
  priorCalculator,
  sensitivityExample,
} from '../content/case';
import { rich } from '../lib/rich';
import { useReveal } from '../lib/hooks';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CaseTimeline } from '../components/CaseTimeline';
import { ClaimsTable } from '../components/ClaimsTable';
import { EvidenceGlyph } from '../components/EvidenceGlyph';


export function CaseStudy() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page="case" />
      <main id="main">
        <article className="cs">
          <header className="cs-hero">
            <div className="wrap">
              <p className="cs-crumb mono">
                <a href="/">Clinical Superintelligence</a>
                <span aria-hidden="true"> / </span>
                <span>Case study</span>
              </p>
              <h1 className="display cs-hero__title">{caseMeta.title}</h1>
              <p className="lede cs-hero__sub">{caseMeta.subtitle}</p>
              <dl className="cs-meta">
                <div>
                  <dt>Type</dt>
                  <dd>Illustrative retrospective case</dd>
                </div>
                <div>
                  <dt>Evidence class</dt>
                  <dd>
                    <EvidenceGlyph kind="reported" size={13} /> Reported
                  </dd>
                </div>
                <div>
                  <dt>Primary records</dt>
                  <dd>Not independently reviewed</dd>
                </div>
                <div>
                  <dt>Source analysis</dt>
                  <dd>AI-generated, unvalidated</dd>
                </div>
              </dl>
              <p className="provenance">
                <span>{caseMeta.provenance}</span>
              </p>
            </div>
          </header>

          <section className="cs-section" aria-labelledby="cs-narrative">
            <div className="wrap cs-cols">
              <div className="cs-cols__aside">
                <p className="section-label" aria-hidden="true">
                  <span className="n">01</span>
                  <span>Record</span>
                </p>
                <h2 id="cs-narrative" className="h3">
                  The supplied narrative
                </h2>
                <p className="small">
                  Six details, in relative time. Each is reported, not independently verified. The narrative does not
                  establish a continuous plateau between observations, or that positioning caused the reported change.
                </p>
              </div>
              <ol className="narrative reveal">
                {narrative.map((n) => (
                  <li key={n.t}>
                    <span className="narrative__t mono">
                      <span className="visually-hidden">Minute </span>
                      {n.t}
                    </span>
                    <span className="narrative__text">{rich(n.text)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="cs-section" aria-labelledby="cs-timeline">
            <div className="wrap">
              <p className="section-label" aria-hidden="true">
                <span className="n">02</span>
                <span>Timeline</span>
              </p>
              <div className="grid split split--tight">
                <h2 id="cs-timeline" className="h2 split__head">
                  The record, and the reconstruction built on it
                </h2>
                <p className="split__body body">
                  The source analysis turned these details into a continuous physiological account, with margins,
                  deficits, and a conclusion about the brain. Toggle between views to see exactly what was added, and
                  select a phase to trace each number back to its assumptions.
                </p>
              </div>
              <figure className="case-figure">
                <CaseTimeline headingLevel={3} />
                <figcaption className="figcaption">
                  <span className="figcaption__n mono">Fig. 1</span>
                  Reported details on a common time axis, with the source analysis&rsquo;s proposed reconstruction
                  available as a separate, clearly marked layer.
                </figcaption>
              </figure>
              <div className="case-claims">
                <ClaimsTable defaultOpen />
              </div>
            </div>
          </section>

          <section className="cs-section" aria-labelledby="cs-sens">
            <div className="wrap cs-cols">
              <div className="cs-cols__aside">
                <p className="section-label" aria-hidden="true">
                  <span className="n">03</span>
                  <span>Sensitivity</span>
                </p>
                <h2 id="cs-sens" className="h3">
                  {sensitivityExample.headline}
                </h2>
              </div>
              <div className="cs-cols__main reveal">
                {sensitivityExample.paragraphs.map((p) => (
                  <p key={p} className="lede-sm">
                    {p}
                  </p>
                ))}
                <figure className="margin-fig">
                  <svg viewBox="0 0 520 132" role="img" aria-labelledby="mf-t">
                    <title id="mf-t">
                      Source analysis arithmetic: cerebral margin 1.02 with blood flow assumed to double, about 0.48
                      without the assumed increase. A margin of 1.0 would mean supply exactly matches assumed demand.
                    </title>
                    <line x1="444" x2="444" y1="6" y2="112" stroke="var(--ink)" strokeDasharray="2 3" />
                    <text x="440" y="126" textAnchor="end" className="mf-label">
                      1.0 = assumed supply meets assumed demand
                    </text>
                    <text x="0" y="30" className="mf-label">
                      Flow assumed to double
                    </text>
                    <rect x="150" y="18" width={1.02 * 294} height="16" fill="none" stroke="var(--ink)" strokeDasharray="4 3" />
                    <text x={150 + 1.02 * 294 + 8} y="31" className="mf-value">
                      1.02
                    </text>
                    <text x="0" y="74" className="mf-label">
                      No assumed increase
                    </text>
                    <rect x="150" y="62" width={0.48 * 294} height="16" fill="none" stroke="var(--ink)" strokeDasharray="4 3" />
                    <text x={150 + 0.48 * 294 + 8} y="75" className="mf-value">
                      ~0.48
                    </text>
                    <line x1="150" x2="150" y1="6" y2="112" stroke="var(--ink)" />
                  </svg>
                  <figcaption className="figcaption">
                    <span className="figcaption__n mono">Fig. 2</span>
                    The source analysis&rsquo;s own cerebral margin at a reported 50% saturation, under two blood-flow
                    assumptions. Dashed outlines mark model outputs; neither value is validated.
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section className="cs-section" aria-labelledby="cs-prior">
            <div className="wrap cs-cols">
              <div className="cs-cols__aside">
                <p className="section-label" aria-hidden="true">
                  <span className="n">04</span>
                  <span>Models</span>
                </p>
                <h2 id="cs-prior" className="h3">
                  {priorCalculator.headline}
                </h2>
              </div>
              <div className="cs-cols__main reveal">
                {priorCalculator.paragraphs.map((p) => (
                  <p key={p} className="body">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="cs-section" aria-labelledby="cs-questions">
            <div className="wrap cs-cols">
              <div className="cs-cols__aside">
                <p className="section-label" aria-hidden="true">
                  <span className="n">05</span>
                  <span>Questions</span>
                </p>
                <h2 id="cs-questions" className="h3">
                  What would make this testable
                </h2>
              </div>
              <ol className="questions reveal">
                {openQuestions.map((q) => (
                  <li key={q}>{rich(q)}</li>
                ))}
              </ol>
            </div>
          </section>

          <section className="cs-section" aria-labelledby="cs-not">
            <div className="wrap cs-cols">
              <div className="cs-cols__aside">
                <p className="section-label" aria-hidden="true">
                  <span className="n">06</span>
                  <span>Limits</span>
                </p>
                <h2 id="cs-not" className="h3">
                  What this case does not show
                </h2>
              </div>
              <ul className="limits reveal">
                {doesNotShow.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="cs-section cs-section--takeaway" aria-labelledby="cs-take">
            <div className="wrap">
              <div className="takeaway takeaway--page">
                <h2 id="cs-take" className="takeaway__line">
                  {caseMeta.takeaway}
                </h2>
                <div className="takeaway__body">
                  {caseMeta.takeawayParagraphs.map((p) => (
                    <p key={p} className="body">
                      {p}
                    </p>
                  ))}
                  <p className="closing__links">
                    <a className="btn btn-primary" href="/#method">
                      Read our approach
                      <span className="arrow" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                    <a className="btn btn-secondary" href="/research/oxygen-extraction-margin/">
                      Read the working paper
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer page="case" />
    </>
  );
}
