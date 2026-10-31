import { caseMeta } from '../content/case';
import { capabilities, evidenceKinds, evidenceOrder, hero, method, research, vision } from '../content/site';
import { rich } from '../lib/rich';
import { useReveal } from '../lib/hooks';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HeroFigure } from '../components/HeroFigure';
import { CapabilityGlyph } from '../components/CapabilityGlyph';
import { CaseTimeline } from '../components/CaseTimeline';
import { ClaimsTable } from '../components/ClaimsTable';
import { EvidenceGlyph } from '../components/EvidenceGlyph';
import { SensitivityFigure } from '../components/SensitivityFigure';

function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <p className="section-label" aria-hidden="true">
      <span className="n">{n}</span>
      <span>{children}</span>
    </p>
  );
}

export function Home() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page="home" />
      <main id="main">
        {/* Hero ------------------------------------------------------- */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="wrap grid hero__grid">
            <div className="hero__text">
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1 id="hero-title" className="display hero__title">
                {hero.headline}
              </h1>
              <p className="lede hero__body">{hero.body}</p>
              <div className="hero__ctas">
                <a className="btn btn-primary" href={hero.primary.href}>
                  {hero.primary.label}
                  <span className="arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
                <a className="btn btn-secondary" href={hero.secondary.href}>
                  {hero.secondary.label}
                </a>
              </div>
            </div>
            <div className="hero__figure">
              <HeroFigure caption={hero.figureCaption} />
            </div>
          </div>
          <div className="wrap">
            <p className="hero__proposition">
              <span className="mono hero__proposition-label">Proposition</span>
              <span>{hero.proposition}</span>
            </p>
          </div>
        </section>

        {/* Vision ----------------------------------------------------- */}
        <section className="section" id="vision" aria-labelledby="vision-title">
          <div className="wrap">
            <SectionLabel n="01">{vision.label}</SectionLabel>
            <div className="grid split">
              <h2 id="vision-title" className="h2 split__head reveal">
                {vision.headline}
              </h2>
              <div className="split__body reveal">
                {vision.paragraphs.map((p) => (
                  <p className="lede-sm" key={p}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <p className="ambition reveal">{vision.ambition}</p>

            <dl className="qualities reveal">
              {vision.qualities.map((q, i) => (
                <div key={q.term} className="quality">
                  <dt>
                    <span className="mono quality__n">{String.fromCharCode(97 + i)}</span>
                    {q.term}
                  </dt>
                  <dd>{rich(q.text)}</dd>
                </div>
              ))}
            </dl>

            <aside className="origin reveal" aria-labelledby="origin-title">
              <h3 id="origin-title" className="eyebrow origin__label">
                {vision.origin.label}
              </h3>
              <div className="origin__text">
                {vision.origin.paragraphs.map((p) => (
                  <p key={p} className="body">
                    {p}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* Capabilities ----------------------------------------------- */}
        <section className="section" id="capabilities" aria-labelledby="cap-title">
          <div className="wrap">
            <SectionLabel n="02">{capabilities.label}</SectionLabel>
            <div className="grid split">
              <h2 id="cap-title" className="h2 split__head reveal">
                {capabilities.headline}
              </h2>
              <p className="split__body body reveal">{capabilities.intro}</p>
            </div>
            <ol className="caps">
              {capabilities.items.map((c) => (
                <li key={c.n} className="cap reveal">
                  <div className="cap__top">
                    <span className="mono cap__n">{c.n}</span>
                    <CapabilityGlyph kind={c.glyph} />
                  </div>
                  <h3 className="h3 cap__title">{c.title}</h3>
                  <p className="cap__text">{c.text}</p>
                  <p className="cap__detail small">{c.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Case study ------------------------------------------------- */}
        <section className="section section--case" id="case-study" aria-labelledby="case-title">
          <div className="wrap">
            <SectionLabel n="03">{caseMeta.label}</SectionLabel>
            <div className="case-head">
              <h2 id="case-title" className="display case-head__title reveal">
                {caseMeta.title}
              </h2>
              <p className="lede case-head__sub reveal">{caseMeta.subtitle}</p>
              <p className="provenance reveal">
                <EvidenceGlyph kind="reported" size={14} />
                <span>{caseMeta.provenance}</span>
              </p>
            </div>

            <figure className="case-figure reveal">
              <CaseTimeline />
              <figcaption className="figcaption">
                <span className="figcaption__n mono">Fig. 2</span>
                Reported details from the supplied narrative, placed on a common time axis. Switch to the proposed
                reconstruction to see what the source analysis added, and select a phase to examine it.
              </figcaption>
            </figure>

            <div className="case-claims">
              <ClaimsTable />
            </div>

            <div className="takeaway reveal">
              <p className="takeaway__line">{caseMeta.takeaway}</p>
              <div className="takeaway__body">
                {caseMeta.takeawayParagraphs.map((p) => (
                  <p key={p} className="body">
                    {p}
                  </p>
                ))}
                <p className="takeaway__link">
                  <a className="text-link" href="/case-study/">
                    Read the full case study
                  </a>
                  <span aria-hidden="true"> &rarr;</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Method ----------------------------------------------------- */}
        <section className="section" id="method" aria-labelledby="method-title">
          <div className="wrap">
            <SectionLabel n="04">{method.label}</SectionLabel>
            <div className="grid split">
              <h2 id="method-title" className="h2 split__head reveal">
                {method.headline}
              </h2>
              <p className="split__body lede-sm reveal">{method.intro}</p>
            </div>

            <div className="evidence reveal">
              <div className="evidence__scale" aria-hidden="true">
                <span>Directly observed</span>
                <span className="evidence__scale-line" />
                <span>Not established</span>
              </div>
              <ol className="evidence__list" aria-label="Five evidence categories">
                {evidenceOrder.map((k) => (
                  <li key={k} className={`evidence__item evidence__item--${k}`}>
                    <EvidenceGlyph kind={k} size={28} />
                    <h3 className="evidence__label">{evidenceKinds[k].label}</h3>
                    <p className="evidence__def">{evidenceKinds[k].definition}</p>
                    <p className="evidence__eg small">
                      <span className="visually-hidden">Example: </span>
                      {rich(evidenceKinds[k].example)}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="evidence__note small">{rich(method.caseNote)}</p>
            </div>

            <div className="workflow">
              <div className="grid split split--tight">
                <h3 className="h3 split__head reveal">{method.workflowHeadline}</h3>
                <p className="split__body body reveal">{method.workflowIntro}</p>
              </div>
              <ol className="workflow__steps reveal">
                {method.workflow.map((s, i) => (
                  <li key={s.title} className={`step${i === 4 ? ' step--key' : ''}`}>
                    <span className="step__n mono" aria-hidden="true">
                      {i + 1}
                    </span>
                    <h4 className="step__title">{s.title}</h4>
                    <p className="step__text small">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="sensitivity" id="sensitivity">
              <div className="sensitivity__text reveal">
                <p className="eyebrow">{method.sensitivity.eyebrow}</p>
                <h3 className="h2 sensitivity__title">{method.sensitivity.headline}</h3>
                {method.sensitivity.paragraphs.map((p) => (
                  <p key={p} className="body">
                    {p}
                  </p>
                ))}
              </div>
              <div className="sensitivity__figure reveal">
                <SensitivityFigure caption={method.sensitivity.figureCaption} />
              </div>
            </div>
          </div>
        </section>

        {/* Research --------------------------------------------------- */}
        <section className="section" id="research" aria-labelledby="research-title">
          <div className="wrap">
            <SectionLabel n="05">{research.label}</SectionLabel>
            <div className="grid split">
              <div className="split__head">
                <p className="eyebrow agenda-tag reveal">{research.eyebrow}</p>
                <h2 id="research-title" className="h2 reveal">
                  {research.headline}
                </h2>
              </div>
              <p className="split__body body reveal">{research.intro}</p>
            </div>
            <ol className="agenda">
              {research.items.map((r, i) => (
                <li key={r.title} className="agenda__item reveal">
                  <span className="mono agenda__n" aria-hidden="true">
                    {['I', 'II', 'III', 'IV'][i]}
                  </span>
                  <h3 className="h3 agenda__title">{r.title}</h3>
                  <p className="agenda__text">{r.text}</p>
                  <p className="agenda__qlabel mono">Open questions</p>
                  <ul className="agenda__questions">
                    {r.questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing ---------------------------------------------------- */}
        <section className="closing" aria-labelledby="closing-title">
          <div className="wrap closing__grid">
            <div className="closing__object" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="96" fill="var(--blue)" />
                <circle cx="100" cy="100" r="64" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="0.75" />
                <circle cx="100" cy="100" r="32" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="0.75" />
                <line x1="14" x2="186" y1="100" y2="100" stroke="#fff" strokeWidth="0.9" />
              </svg>
            </div>
            <div className="closing__text">
              <h2 id="closing-title" className="h2 reveal">
                {research.closing.headline}
              </h2>
              {research.closing.paragraphs.map((p) => (
                <p key={p} className="body reveal">
                  {p}
                </p>
              ))}
              <p className="closing__links reveal">
                <a className="btn btn-secondary" href="/case-study/">
                  Revisit the case study
                </a>
                <a className="btn btn-secondary" href="#method">
                  Review the method
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer page="home" />
    </>
  );
}
