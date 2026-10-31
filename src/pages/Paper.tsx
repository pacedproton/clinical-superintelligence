import type { ReactNode } from 'react';
import { useReveal } from '../lib/hooks';
import { rich } from '../lib/rich';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EvidenceGlyph } from '../components/EvidenceGlyph';
import { ContentFigure, MarginFigure, MarginLegend, TornadoFigure, oatRows } from '../papers/oxygenMargin/figures';
import { DEFAULTS, PRIORS } from '../papers/oxygenMargin/model';
import { paper, references } from '../papers/oxygenMargin/meta';
import { claims } from '../content/case';

/* ---------- small typographic helpers ---------- */

function Cite({ n }: { n: number | number[] }) {
  const list = Array.isArray(n) ? n : [n];
  return (
    <sup className="cite">
      [
      {list.map((k, i) => (
        <span key={k}>
          {i > 0 && ','}
          <a href={`#ref-${k}`} aria-label={`Reference ${k}`}>
            {k}
          </a>
        </span>
      ))}
      ]
    </sup>
  );
}

function Eq({ n, mathml, label }: { n: number; mathml: string; label: string }) {
  return (
    <div className="eq" role="group" aria-label={`Equation ${n}: ${label}`}>
      <div className="eq__math" dangerouslySetInnerHTML={{ __html: mathml }} />
      <span className="eq__n mono" aria-hidden="true">
        ({n})
      </span>
    </div>
  );
}

function H2({ id, n, children }: { id: string; n: string; children: ReactNode }) {
  return (
    <h2 id={id} className="p-h2">
      <span className="p-h2__n mono">{n}</span>
      {children}
    </h2>
  );
}

function H3({ id, n, children }: { id?: string; n: string; children: ReactNode }) {
  return (
    <h3 id={id} className="p-h3">
      <span className="p-h3__n mono">{n}</span>
      {children}
    </h3>
  );
}

function Fig({ n, id, title, children, caption }: { n: number; id: string; title: string; children: ReactNode; caption: ReactNode }) {
  return (
    <figure className="p-fig" id={id}>
      <p className="p-fig__title">
        <span className="mono">Figure {n}.</span> {title}
      </p>
      {children}
      <figcaption className="p-fig__cap">{caption}</figcaption>
    </figure>
  );
}

function Tbl({ n, id, title, children, note }: { n: number; id: string; title: string; children: ReactNode; note?: ReactNode }) {
  return (
    <div className="p-tbl" id={id}>
      <p className="p-tbl__title">
        <span className="mono">Table {n}.</span> {title}
      </p>
      <div className="p-tbl__scroll" tabIndex={0} role="region" aria-label={`Table ${n}`}>
        <table>{children}</table>
      </div>
      {note && <p className="p-tbl__note">{note}</p>}
    </div>
  );
}

const m = (s: string) => `<math display="block">${s}</math>`;
const mi = (s: string) => `<math>${s}</math>`;

/* ---------- equations (MathML) ---------- */
const EQ = {
  sat: m(`<msub><mi>S</mi><mi>a</mi></msub><mo>=</mo><mfrac><mrow><msub><mi>SpO</mi><mn>2</mn></msub><mo>&#x2212;</mo><mi>b</mi></mrow><mn>100</mn></mfrac>`),
  bohr: m(`<msub><mi>P</mi><mrow><mn>50</mn><mo>,</mo><mi>a</mi></mrow></msub><mo>=</mo><msub><mi>P</mi><mn>50</mn></msub><mo>&#xB7;</mo><msup><mn>10</mn><mrow><mn>0.48</mn><mo>(</mo><mn>7.4</mn><mo>&#x2212;</mo><msub><mtext>pH</mtext><mi>a</mi></msub><mo>)</mo></mrow></msup><mo>,</mo><mspace width="1em"/><msub><mi>P</mi><mrow><mn>50</mn><mo>,</mo><mi>v</mi></mrow></msub><mo>=</mo><msub><mi>P</mi><mn>50</mn></msub><mo>&#xB7;</mo><msup><mn>10</mn><mrow><mn>0.48</mn><mo>(</mo><mn>7.4</mn><mo>&#x2212;</mo><msub><mtext>pH</mtext><mi>a</mi></msub><mo>+</mo><mi>&#x394;</mi><mtext>pH</mtext><mo>)</mo></mrow></msup>`),
  hill: m(`<msub><mtext>PaO</mtext><mn>2</mn></msub><mo>=</mo><msub><mi>P</mi><mrow><mn>50</mn><mo>,</mo><mi>a</mi></mrow></msub><msup><mrow><mo>(</mo><mfrac><msub><mi>S</mi><mi>a</mi></msub><mrow><mn>1</mn><mo>&#x2212;</mo><msub><mi>S</mi><mi>a</mi></msub></mrow></mfrac><mo>)</mo></mrow><mrow><mn>1</mn><mo>/</mo><mi>n</mi></mrow></msup>`),
  floor: m(`<msub><mi>S</mi><mrow><mi>v</mi><mo>,</mo><mtext>crit</mtext></mrow></msub><mo>=</mo><mfrac><msubsup><mi>P</mi><mrow><mi>v</mi><mo>,</mo><mtext>crit</mtext></mrow><mi>n</mi></msubsup><mrow><msubsup><mi>P</mi><mrow><mi>v</mi><mo>,</mo><mtext>crit</mtext></mrow><mi>n</mi></msubsup><mo>+</mo><msubsup><mi>P</mi><mrow><mn>50</mn><mo>,</mo><mi>v</mi></mrow><mi>n</mi></msubsup></mrow></mfrac>`),
  content: m(`<msub><mtext>CaO</mtext><mn>2</mn></msub><mo>=</mo><mn>1.34</mn><mspace width="0.2em"/><mtext>Hb</mtext><mspace width="0.2em"/><msub><mi>S</mi><mi>a</mi></msub><mo>+</mo><mn>0.003</mn><mspace width="0.2em"/><msub><mtext>PaO</mtext><mn>2</mn></msub><mo>,</mo><mspace width="1em"/><msub><mi>C</mi><mrow><mi>v</mi><mo>,</mo><mtext>crit</mtext></mrow></msub><mo>=</mo><mn>1.34</mn><mspace width="0.2em"/><mtext>Hb</mtext><mspace width="0.2em"/><msub><mi>S</mi><mrow><mi>v</mi><mo>,</mo><mtext>crit</mtext></mrow></msub><mo>+</mo><mn>0.003</mn><mspace width="0.2em"/><msub><mi>P</mi><mrow><mi>v</mi><mo>,</mo><mtext>crit</mtext></mrow></msub>`),
  margin: m(`<mi>M</mi><mo>=</mo><mfrac><mrow><mi>Q</mi><mspace width="0.15em"/><mi>f</mi><mspace width="0.15em"/><mo>(</mo><msub><mtext>CaO</mtext><mn>2</mn></msub><mo>&#x2212;</mo><msub><mi>C</mi><mrow><mi>v</mi><mo>,</mo><mtext>crit</mtext></mrow></msub><mo>)</mo></mrow><mrow><msub><mover><mi>V</mi><mo>&#x2D9;</mo></mover><mrow><msub><mi>O</mi><mn>2</mn></msub></mrow></msub></mrow></mfrac>`),
  elastic: m(`<msub><mi>&#x3B5;</mi><mi>&#x3B8;</mi></msub><mo>=</mo><mfrac><mrow><mo>&#x2202;</mo><mi>ln</mi><mi>M</mi></mrow><mrow><mo>&#x2202;</mo><mi>ln</mi><mi>&#x3B8;</mi></mrow></mfrac><mo>,</mo><mspace width="1.2em"/><msub><mi>&#x3B5;</mi><msub><mi>S</mi><mi>a</mi></msub></msub><mo>&#x2248;</mo><mfrac><msub><mi>S</mi><mi>a</mi></msub><mrow><msub><mi>S</mi><mi>a</mi></msub><mo>&#x2212;</mo><msub><mi>S</mi><mrow><mi>v</mi><mo>,</mo><mtext>crit</mtext></mrow></msub></mrow></mfrac>`),
  debt: m(`<mi>D</mi><mo>=</mo><munder><mo>&#x2211;</mo><mi>i</mi></munder><msub><mover><mi>V</mi><mo>&#x2D9;</mo></mover><mrow><msub><mi>O</mi><mn>2</mn></msub></mrow></msub><mspace width="0.15em"/><mo>max</mo><mo>(</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>&#x2212;</mo><msub><mi>M</mi><mi>i</mi></msub><mo>)</mo><mspace width="0.15em"/><mi>&#x394;</mi><msub><mi>t</mi><mi>i</mi></msub>`),
};

const fmt2 = (v: number) => v.toFixed(2);

export function Paper() {
  useReveal();
  const oat = oatRows(50);
  const oat58 = oatRows(58);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page="paper" />
      <main id="main">
        <article className="paper" aria-labelledby="paper-title">
          {/* ------------------------------------------------ front matter */}
          <header className="paper-head">
            <div className="wrap">
              <p className="cs-crumb mono">
                <a href="/">Clinical Superintelligence</a>
                <span aria-hidden="true"> / </span>
                <a href="/#research">Research</a>
                <span aria-hidden="true"> / </span>
                <span>{paper.id}</span>
              </p>
              <p className="paper-head__type mono">
                <span>Working paper</span>
                <span>{paper.id}</span>
                <span>Version {paper.version}</span>
                <span>Not peer reviewed</span>
              </p>
              <h1 id="paper-title" className="paper-head__title">
                {paper.title}
              </h1>
              <p className="paper-head__subtitle">{paper.subtitle}</p>
              <dl className="paper-meta">
                <div>
                  <dt>Authors</dt>
                  <dd>{paper.authors}</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>{paper.date}</dd>
                </div>
                <div>
                  <dt>Discipline</dt>
                  <dd>Computational Clinical Reasoning</dd>
                </div>
                <div>
                  <dt>Downloads</dt>
                  <dd className="paper-meta__links">
                    <a href="/papers/csi-wp-2026-01/csi-wp-2026-01.pdf">PDF</a>
                    <a href="/papers/csi-wp-2026-01/reproduce.py" download>
                      Reproduction script
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </header>

          <div className="wrap paper-body">
            <nav className="paper-toc" aria-label="Contents">
              <p className="paper-toc__label mono">Contents</p>
              <ol>
                <li><a href="#abstract">Abstract</a></li>
                <li><a href="#introduction">1 Introduction</a></li>
                <li><a href="#materials">2 Materials</a></li>
                <li><a href="#methods">3 Methods</a></li>
                <li><a href="#results">4 Results</a></li>
                <li><a href="#discussion">5 Discussion</a></li>
                <li><a href="#limitations">6 Limitations</a></li>
                <li><a href="#conclusion">7 Conclusion</a></li>
                <li><a href="#declarations">Declarations</a></li>
                <li><a href="#references">References</a></li>
              </ol>
            </nav>

            <div className="paper-text">
              {/* ------------------------------------------------ abstract */}
              <section className="abstract" id="abstract" aria-labelledby="abstract-h">
                <h2 id="abstract-h" className="abstract__h mono">
                  Abstract
                </h2>
                <p>
                  <strong>Background.</strong> Large language models can now produce detailed physiological
                  reconstructions of clinical events from sparse records. Such reconstructions look rigorous, but their
                  conclusions may rest on unmeasured inputs. We examine one example: an AI-assisted reconstruction of the
                  first 32 minutes after a newborn&rsquo;s birth, together with the &ldquo;oxygen extraction margin&rdquo;
                  calculator that produced its numbers.
                </p>
                <p>
                  <strong>Methods.</strong> We extracted every quantitative claim and classed it as reported, inferred,
                  assumed, or unknown. We re-implemented the calculator from its displayed equations and intermediate
                  values, reproduced its outputs, and then measured how its central quantity, the ratio of extractable
                  oxygen delivery to demand (<em>M</em>), responds to its inputs: analytically through elasticities, one
                  input at a time over stated ranges, and jointly by Monte Carlo propagation.
                </p>
                <p>
                  <strong>Results.</strong> The calculator&rsquo;s values at reported saturations of 50% and 58% were
                  reproduced exactly (<em>M</em> = 0.42 and 0.71). Its value at 94% (2.56) was not reproduced by the
                  default inputs (2.04). Because <em>M</em> is proportional to a small difference between two oxygen
                  contents, it amplifies input error: at a 50% reading, a 1% relative change in saturation, standard
                  P<sub>50</sub>, or critical venous PO<sub>2</sub> moves <em>M</em> by 4.4-5.6%. Across plausible single
                  inputs, <em>M</em> at 50% ranged from 0.13 to 0.72. Under illustrative joint uncertainty, the 90% interval
                  was 0.00-1.03 at 50%, 0.18-1.38 at 58%, and 1.24-3.11 at 94%. The estimated cumulative oxygen debt depended
                  chiefly on an assumption about an interval with no recorded saturations: about 86 mL O<sub>2</sub>/kg if a
                  deficit is assumed from minute 5, and 27 mL O<sub>2</sub>/kg if it is counted only from the first reading.
                  The supplied materials also disagree on what the first recorded saturation was.
                </p>
                <p>
                  <strong>Interpretation.</strong> The model is transparent and internally coherent. Its qualitative
                  conclusion of an oxygen shortfall at the lowest reading holds across most of the explored input space,
                  but its precise margins, its threshold, its cumulative debt, and any conclusion about neurological
                  outcome do not follow from the available record. We propose eight reporting practices for computational
                  reconstructions of clinical events.
                </p>
                <p className="abstract__kw">
                  <span className="mono">Keywords</span> neonatal transition; oxygen delivery; pulse oximetry; fetal
                  haemoglobin; sensitivity analysis; uncertainty quantification; reproducibility; large language models;
                  clinical reasoning
                </p>
              </section>

              <aside className="p-note" aria-label="Status of this document">
                <EvidenceGlyph kind="reported" size={14} />
                <p>
                  Methodological research. This paper does not assess the care any infant received, does not offer a view
                  on any infant&rsquo;s outcome, and is not clinical guidance. Case details are de-identified and given in
                  minutes after birth. Clinical records were not reviewed by the authors; every case detail is
                  therefore <em>reported</em>.
                </p>
              </aside>

              {/* ------------------------------------------------ 1 */}
              <section aria-labelledby="introduction">
                <H2 id="introduction" n="1">
                  Introduction
                </H2>
                <p>
                  Clinical records rarely capture physiology continuously. Around a birth, observations arrive as a few
                  time-stamped notes, a saturation reading when a probe is attached, and an intervention recorded after
                  the fact. Reasoning about what happened between those points has always required inference.
                </p>
                <p>
                  Large language models change the economics of that inference. In minutes, they can turn a handful of
                  observations into a narrative with oxygen contents, extraction ratios, deficits, and a verdict. The output
                  is fluent, numerate, and often physiologically literate. It is also difficult to audit, because the
                  assumptions that generate the numbers are rarely separated from the observations they are attached to.
                </p>
                <p>
                  This paper treats one such reconstruction as an object of study. Our question is not whether its
                  conclusions are correct, which the available record cannot establish, but which of them are
                  <em> determined by the data</em> and which are <em>determined by the model&rsquo;s inputs</em>. We
                  answer it by reproducing the calculation, then deliberately stressing it.
                </p>
                <p>Our contributions are:</p>
                <ol className="p-list">
                  <li>a complete specification and independent re-implementation of the extraction-margin model used, with its outputs reproduced;</li>
                  <li>an analytic explanation of why this class of margin amplifies measurement and parameter error near the critical threshold;</li>
                  <li>one-at-a-time and joint uncertainty analyses at each reported reading;</li>
                  <li>a claim-by-claim evidential audit of the reconstruction; and</li>
                  <li>reporting practices for computational reconstructions of clinical events.</li>
                </ol>
              </section>

              {/* ------------------------------------------------ 2 */}
              <section aria-labelledby="materials">
                <H2 id="materials" n="2">
                  Materials
                </H2>
                <H3 n="2.1">Case narrative</H3>
                <p>
                  The case concerns a term newborn. A family member supplied a narrative summary, a calculator, and a
                  timeline table compiled from the clinical record. As reported, there is no continuous saturation record
                  for the first 17 minutes. Around minute 17 the infant was noted to be dusky. A pulse oximeter was applied,
                  the infant was placed prone, and chest physiotherapy was given. Room-air SpO<sub>2</sub> values of about
                  50% and about 58% are reported for the period from minute 17 to minute 27. Nasal cannula oxygen at
                  3 L/min began around minute 27, and SpO<sub>2</sub> was 94% at minute 32. The supplied materials also
                  refer to arterial blood gas measurements taken hours later; these are outside the scope of this paper.
                </p>
                <p>
                  <strong>A discrepancy in the record.</strong> The supplied materials disagree about the first documented
                  saturation. The calculator&rsquo;s timeline table lists 50% at minute 17, followed by 58% after the
                  interventions. A separate summary of the same record gives the first documented SpO<sub>2</sub> entry as
                  58%, at the same time as the note of a dusky appearance. We could not resolve this without the primary
                  record. We analyse both readings, but the discrepancy itself is a finding (Section 4.6).
                </p>

                <H3 n="2.2">The source reconstruction</H3>
                <p>
                  The reconstruction was produced with the assistance of a large language model. It asserted that a
                  hypoxic exposure of about 22-24 minutes ran from minute 5 to minute 28.5. It assumed that SpO<sub>2</sub> sat
                  at about 50% throughout the unmonitored interval. It reported extraction margins, deficits, and a
                  cumulative systemic oxygen debt of about 91 mL O<sub>2</sub>/kg. It modelled cerebral oxygen delivery
                  with an assumed doubling of cerebral blood flow, and it concluded that permanent brain injury was
                  &ldquo;almost certainly&rdquo; absent if heart rate remained at or above 100 beats per minute. The
                  reconstruction also stated that care fell short of resuscitation guidelines. We do not evaluate that
                  statement (Section 5.4).
                </p>

                <H3 n="2.3">The calculator</H3>
                <p>
                  The numbers in the reconstruction come from a web calculator, &ldquo;Neonatal O<sub>2</sub>
                  Sufficiency: Physiological Calculator (v2)&rdquo;
                  <Cite n={10} />. It converts a pulse-oximeter reading into arterial PO<sub>2</sub> through a
                  Bohr-adjusted Hill equation. It then defines a critical venous oxygen floor and expresses oxygen
                  delivery above that floor as a multiple of an assumed demand. The calculator displays its inputs, its
                  intermediate values, and preset scenarios with their margins. It replaced an earlier version (v1) whose
                  output at the same 50% reading was reported as &ldquo;5.67x SAFE&rdquo;; v1 was not available to us
                  and is discussed only as described by the reconstruction (Section 4.7).
                </p>
              </section>

              {/* ------------------------------------------------ 3 */}
              <section aria-labelledby="methods">
                <H2 id="methods" n="3">
                  Methods
                </H2>
                <H3 n="3.1">Claim extraction and evidential classification</H3>
                <p>
                  Each quantitative or causal statement in the reconstruction was recorded with its stated value and the
                  inputs it depends on. Each was assigned one of five categories:
                </p>
                <ul className="p-list p-list--glyph">
                  <li><EvidenceGlyph kind="measured" /> <strong>measured</strong>: captured by an identified instrument;</li>
                  <li><EvidenceGlyph kind="reported" /> <strong>reported</strong>: described in a narrative or record not reviewed by us;</li>
                  <li><EvidenceGlyph kind="inferred" /> <strong>inferred</strong>: derived from other quantities by a model;</li>
                  <li><EvidenceGlyph kind="assumed" /> <strong>assumed</strong>: introduced so that a model could run; and</li>
                  <li><EvidenceGlyph kind="unknown" /> <strong>unknown</strong>: not establishable from the available evidence.</li>
                </ul>
                <p>
                  Because no primary record was reviewed, no case observation could be classed as measured.
                </p>
                <Tbl
                  n={1}
                  id="table-1"
                  title="Quantitative claims in the source reconstruction and their evidential status"
                  note="Values as stated by the reconstruction. Status is assigned by the authors of this paper."
                >
                  <thead>
                    <tr>
                      <th scope="col">Claim</th>
                      <th scope="col">Stated value</th>
                      <th scope="col">Rests on</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((c) => (
                      <tr key={c.claim}>
                        <th scope="row">{rich(c.claim)}</th>
                        <td className="num">{rich(c.value)}</td>
                        <td>{rich(c.restsOn)}</td>
                        <td>
                          <span className="status">
                            <EvidenceGlyph kind={c.status} />
                            <span>{c.statusNote}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Tbl>

                <H3 n="3.2">Model specification</H3>
                <p>
                  The calculator was re-implemented from its displayed equations, labels, and intermediate values. The
                  pulse-oximeter reading, corrected for an optional bias <em>b</em>, is taken as arterial saturation:
                </p>
                <Eq n={1} mathml={EQ.sat} label="arterial saturation from the oximeter reading" />
                <p>
                  The standard P<sub>50</sub> (the PO<sub>2</sub> at which haemoglobin is half saturated) is shifted for
                  arterial and venous pH. A Bohr coefficient of 0.48 reproduces the calculator&rsquo;s displayed values
                  (19 mmHg at pH 7.40 becomes 21.7 mmHg at pH 7.28 and 23.2 mmHg at 7.22):
                </p>
                <Eq n={2} mathml={EQ.bohr} label="Bohr-adjusted arterial and venous P50" />
                <p>Arterial PO<sub>2</sub> follows by inverting the Hill equation with exponent <em>n</em>:</p>
                <Eq n={3} mathml={EQ.hill} label="arterial PO2 from the Hill equation" />
                <p>
                  A critical venous PO<sub>2</sub>, <i>P</i><sub>v,crit</sub>, labelled by the calculator as a
                  &ldquo;cerebral/coronary limit&rdquo;, defines the saturation below which oxygen is treated as
                  unavailable to tissue:
                </p>
                <Eq n={4} mathml={EQ.floor} label="critical venous saturation" />
                <p>Oxygen contents (mL O<sub>2</sub>/dL) use the conventional binding and solubility constants:</p>
                <Eq n={5} mathml={EQ.content} label="arterial and critical venous oxygen content" />
                <p>
                  The extraction margin is the oxygen deliverable above the floor, per unit demand, where <em>Q</em> is
                  cardiac output, <em>f</em> the fraction of flow treated as non-shunted, and
                  {' '}<span dangerouslySetInnerHTML={{ __html: mi('<msub><mover><mi>V</mi><mo>&#x2D9;</mo></mover><mrow><msub><mi>O</mi><mn>2</mn></msub></mrow></msub>') }} />{' '}
                  whole-body oxygen demand:
                </p>
                <Eq n={6} mathml={EQ.margin} label="extraction margin" />
                <p>
                  Values of <em>M</em> below 1 are interpreted by the calculator as a hypoxic deficit. Default inputs are
                  listed in Table 2.
                </p>

                <H3 n="3.3">Reproduction</H3>
                <p>
                  We compared re-implemented outputs with every value displayed by the calculator at default inputs, and
                  with each preset scenario whose inputs could be inferred. For the arterial PO<sub>2</sub> values quoted
                  in the reconstruction, we also computed the Severinghaus equation
                  <Cite n={6} /> with PO<sub>2</sub> scaled to a P<sub>50</sub> of 21.2 mmHg, as a cross-check on the
                  dissociation curve that may have been used.
                </p>

                <H3 n="3.4">Local and one-at-a-time sensitivity</H3>
                <p>
                  Local sensitivity was measured by the elasticity of <em>M</em> with respect to each input, by central
                  differences at default values:
                </p>
                <Eq n={7} mathml={EQ.elastic} label="elasticity definition and approximation for saturation" />
                <p>
                  An elasticity of 4 means that a 1% relative change in the input changes <em>M</em> by about 4%. The
                  approximation in Equation 7 neglects dissolved oxygen and follows directly from Equations 5 and 6. Each
                  input was then varied alone across the range in Table 2, with all others at default.
                </p>

                <H3 n="3.5">Joint uncertainty</H3>
                <p>
                  Inputs were drawn independently from normal distributions centred on the calculator&rsquo;s defaults,
                  with the standard deviations in Table 2, and propagated through Equations 1-6 (20,000 draws per reading,
                  seed 1). The oximeter standard deviation of 5.5 points is the value stated by the calculator itself for
                  a 50% reading. The other spreads are illustrative: they are not derived from population data, and they
                  are chosen so that a reader can judge whether the conclusion depends on them. Inputs were not
                  correlated, which probably overstates some combinations and understates others.
                </p>
                <Tbl n={2} id="table-2" title="Model inputs: calculator defaults and illustrative uncertainty">
                  <thead>
                    <tr>
                      <th scope="col">Input</th>
                      <th scope="col">Default</th>
                      <th scope="col">SD (Monte Carlo)</th>
                      <th scope="col">One-at-a-time range</th>
                      <th scope="col">Basis in this case</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIORS.map((p) => {
                      const r = oat.find((o) => o.key === p.key);
                      return (
                        <tr key={p.key}>
                          <th scope="row">{rich(p.label)}</th>
                          <td className="num">
                            {DEFAULTS[p.key]}
                            {p.unit ? ` ${p.unit}` : ''}
                          </td>
                          <td className="num">{p.sd}</td>
                          <td className="num">{r ? `${r.fmt(r.lo)} to ${r.fmt(r.hi)}` : 'n/a'}</td>
                          <td>{rich(p.note)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Tbl>

                <p>Cumulative oxygen debt was computed as in the reconstruction:</p>
                <Eq n={8} mathml={EQ.debt} label="cumulative oxygen debt" />
                <p>
                  with phases at 50% (start of the assumed deficit to minute 17), 58% (minutes 17-27), and a 1.5-minute
                  transition at 61%. We varied the assumed start of the deficit from minute 5 to minute 17.
                </p>

                <H3 n="3.6">Literature verification</H3>
                <p>
                  Statements in the reconstruction that rely on external physiology or guidance were checked against
                  published sources where possible. Network restrictions in the drafting environment prevented full-text
                  retrieval. References 1-9 were therefore verified against bibliographic records and abstracts, and
                  statements attributed to them are limited to what those records support.
                </p>
              </section>

              {/* ------------------------------------------------ 4 */}
              <section aria-labelledby="results">
                <H2 id="results" n="4">
                  Results
                </H2>

                <H3 n="4.1">The model was reproduced, except at 94%</H3>
                <p>
                  The re-implementation matched every displayed default value (Table 3). At a 50% reading the arterial
                  content is 10.79 mL/dL and the critical venous content 8.32 mL/dL, so only 2.47 mL/dL counts as
                  extractable. That is 23% of the arterial content, although total delivery is 1.83 times demand (Figure
                  1). The margin is 0 below a reading of 38.5%, reaches 1.0 at 65.9%, and reaches 1.5 at 79.6%. These
                  values correspond to the &ldquo;~64%&rdquo; threshold in the reconstruction and to the calculator&rsquo;s
                  own description of its curve.
                </p>
                <p>
                  The preset for a 94% reading displays <em>M</em> = 2.56, but the default inputs give 2.04. Reproducing
                  2.56 requires an effective flow of about 181 mL/kg/min rather than 144, or an equivalent change
                  elsewhere. The inputs behind the preset are not displayed. The arterial PO<sub>2</sub> values quoted in the
                  reconstruction (21.2, 24.4 and 57.5 mmHg) also differ slightly from the calculator&rsquo;s (21.7, 24.4 and
                  60.1 mmHg), which suggests that versions or parameters changed between the two documents.
                </p>

                <Tbl
                  n={3}
                  id="table-3"
                  title="Reproduction of displayed calculator values"
                  note="Reproduced values use Equations 1-6 at the default inputs in Table 2. The Severinghaus column scales PO2 to a P50 of 21.2 mmHg."
                >
                  <thead>
                    <tr>
                      <th scope="col">Quantity</th>
                      <th scope="col">Reading</th>
                      <th scope="col">Calculator / reconstruction</th>
                      <th scope="col">Reproduced</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Arterial P_50 / venous P_50 (mmHg)', '50%', '21.7 / 23.2', '21.7 / 23.2', 'Exact'],
                      ['Critical venous saturation', '50%', '38.5%', '38.5%', 'Exact'],
                      ['CaO_2 / critical venous content / extractable (mL/dL)', '50%', '10.79 / 8.32 / 2.47', '10.79 / 8.32 / 2.47', 'Exact'],
                      ['Total delivery / demand', '50%', '1.83', '1.83', 'Exact'],
                      ['Extraction margin M', '50%', '0.42', '0.418', 'Exact'],
                      ['Extraction margin M', '58%', '0.71', '0.709', 'Exact'],
                      ['Extraction margin M', '94%', '2.56', '2.04', 'Not reproduced'],
                      ['Reading at which M = 0 / 1 / 1.5', 'n/a', '~38% / ~66% / ~80%', '38.5% / 65.9% / 79.6%', 'Exact'],
                      ['PaO_2 (mmHg): calculator', '50 / 58 / 94%', '21.7 (50% only)', '21.7 / 24.4 / 60.1', 'Hill, n = 2.7'],
                      ['PaO_2 (mmHg): reconstruction', '50 / 58 / 94%', '21.2 / 24.4 / 57.5', '21.2 / 24.0 / 56.1', 'Severinghaus, approximate'],
                    ].map((r) => (
                      <tr key={r[0] + r[1]}>
                        <th scope="row">{rich(r[0])}</th>
                        <td className="num">{r[1]}</td>
                        <td className="num">{r[2]}</td>
                        <td className="num">{r[3]}</td>
                        <td>{r[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Tbl>

                <Fig
                  n={1}
                  id="figure-1"
                  title="Where the margin comes from"
                  caption={
                    <>
                      Arterial oxygen content (solid) against the saturation entering the model, at default inputs.
                      Only the shaded region above the critical venous content counts as extractable. At a 50% reading,
                      that gap is 2.47 mL/dL. The margin reaches 1 where arterial content reaches the dashed line, near
                      65.9%. Below 38.5%, nothing is counted as extractable.
                    </>
                  }
                >
                  <ContentFigure />
                </Fig>

                <H3 n="4.2">The margin amplifies error near its threshold</H3>
                <p>
                  Equation 7 explains the model&rsquo;s behaviour. Near the floor, the extractable content is a small
                  difference between two large, similar quantities, so relative errors in either one are magnified. At a
                  50% reading, with a critical venous saturation of 38.5%, the approximate elasticity with respect to
                  saturation is 0.50 / (0.50 &minus; 0.385) &asymp; 4.3, and the numerical value is 4.4 (Table 4). Inputs
                  that move the floor are amplified similarly: standard P<sub>50</sub> (+5.6) and critical venous
                  PO<sub>2</sub> (&minus;5.6). Arterial pH acts through both curves. Because a lower pH raises the
                  venous P<sub>50</sub> and lowers the critical venous saturation, a 0.1 fall in pH <em>increases</em>
                  <em> M</em> by about 0.26 at this reading. By contrast, haemoglobin, cardiac output, the non-shunted
                  fraction, and demand enter linearly, with elasticities of exactly &plusmn;1.
                </p>

                <Tbl n={4} id="table-4" title="Local elasticity of M at a 50% reading (default inputs)">
                  <thead>
                    <tr>
                      <th scope="col">Input</th>
                      <th scope="col">Elasticity</th>
                      <th scope="col">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Standard P_50', '+5.6', 'Moves both arterial PO_2 and the floor'],
                      ['Critical venous PO_2', '−5.6', 'Defines the floor directly'],
                      ['Saturation (reading)', '+4.4', 'Difference of near-equal contents'],
                      ['Hill exponent', '+1.0', 'Shape of curve near P_50'],
                      ['Haemoglobin, cardiac output, flow fraction', '+1.0', 'Linear scaling'],
                      ['O_2 demand', '−1.0', 'Linear scaling'],
                      ['A-V pH difference', '+0.4', 'Shifts the venous curve'],
                      ['Arterial pH', '−2.6 per pH unit', 'Absolute sensitivity; elasticity not meaningful for pH'],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <th scope="row">{rich(r[0])}</th>
                        <td className="num">{r[1]}</td>
                        <td>{rich(r[2])}</td>
                      </tr>
                    ))}
                  </tbody>
                </Tbl>

                <H3 n="4.3">Single inputs can move the conclusion across the threshold</H3>
                <p>
                  Varied one at a time across the ranges in Table 2, single inputs moved <em>M</em> at a 50% reading
                  between 0.13 and 0.72 (Figure 2). The largest effects came from the critical venous PO<sub>2</sub>
                  (17-22 mmHg: {fmt2(oat.find((r) => r.key === 'pvc')!.max)} to {fmt2(oat.find((r) => r.key === 'pvc')!.min)}), oximeter bias (&plusmn;5.5 points:{' '}
                  {fmt2(oat.find((r) => r.key === 'bias')!.max)} to {fmt2(oat.find((r) => r.key === 'bias')!.min)}),
                  and arterial pH (7.20-7.36: {fmt2(oat.find((r) => r.key === 'pha')!.max)} to{' '}
                  {fmt2(oat.find((r) => r.key === 'pha')!.min)}). None of these was measured in the interval
                  concerned. At a 58% reading, a critical venous PO<sub>2</sub> of 17 mmHg alone raises <em>M</em> to{' '}
                  {fmt2(oat58.find((r) => r.key === 'pvc')!.max)}, which removes the &ldquo;deficit&rdquo; at that
                  reading.
                </p>

                <Fig
                  n={2}
                  id="figure-2"
                  title="One input at a time, at a 50% reading"
                  caption={
                    <>
                      Each bar spans the margin produced as one input moves across its range in Table 2, with all others
                      at default.{' '}
                      <span className="hide-sm">Numbers at the bar ends are the input values producing each end.</span>{' '}
                      The solid vertical line marks the default margin of 0.42; the dashed line marks <em>M</em> = 1.
                    </>
                  }
                >
                  <TornadoFigure />
                </Fig>

                <H3 n="4.4">Joint uncertainty</H3>
                <p>
                  Under joint uncertainty (Table 5, Figure 3), the qualitative conclusion at the lowest reading is
                  fairly stable: 94% of draws give <em>M</em> &lt; 1 at 50%. At 58% the proportion falls to 79%, and the
                  90% interval spans 1. At 94%, 99% of draws give <em>M</em> &gt; 1, but the value is uncertain to within
                  roughly a factor of 2.5. The precise margins quoted in the reconstruction, such as 0.37-0.42, 0.71,
                  and 2.56, sit inside much wider intervals than their two-decimal presentation implies.
                </p>

                <Tbl
                  n={5}
                  id="table-5"
                  title="Monte Carlo propagation of input uncertainty (20,000 draws per reading)"
                  note="Input distributions in Table 2. The spreads are illustrative; the proportions should be read as statements about the model under those inputs, not as probabilities about the infant."
                >
                  <thead>
                    <tr>
                      <th scope="col">Reported reading</th>
                      <th scope="col">Calculator M</th>
                      <th scope="col">Median M</th>
                      <th scope="col">90% interval</th>
                      <th scope="col">Share with M &lt; 1</th>
                      <th scope="col">Share with M &lt; 1.5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">50%</th>
                      <td className="num">0.42</td>
                      <td className="num">0.40</td>
                      <td className="num">0.00-1.03</td>
                      <td className="num">94%</td>
                      <td className="num">&gt;99%</td>
                    </tr>
                    <tr>
                      <th scope="row">58%</th>
                      <td className="num">0.71</td>
                      <td className="num">0.69</td>
                      <td className="num">0.18-1.38</td>
                      <td className="num">79%</td>
                      <td className="num">97%</td>
                    </tr>
                    <tr>
                      <th scope="row">94%</th>
                      <td className="num">2.56</td>
                      <td className="num">1.99</td>
                      <td className="num">1.24-3.11</td>
                      <td className="num">1%</td>
                      <td className="num">16%</td>
                    </tr>
                  </tbody>
                </Tbl>

                <Fig
                  n={3}
                  id="figure-3"
                  title="The margin across readings, with propagated uncertainty"
                  caption={
                    <>
                      Margin <em>M</em> against the pulse-oximeter reading. Shaded bands are Monte Carlo percentiles (1,500
                      draws, computed in the browser, seed 7; Table 5 uses 20,000 draws). The three reported readings
                      are drawn as rings with horizontal bars of &plusmn;5.5 points, the calculator&rsquo;s own stated
                      oximeter uncertainty. Note how much of the band lies on both sides of <em>M</em> = 1 between
                      readings of about 50% and 75%.
                    </>
                  }
                >
                  <MarginFigure />
                  <MarginLegend />
                </Fig>


                <H3 n="4.5">Quantities determined by assumptions</H3>
                <p>Several headline quantities in the reconstruction are fixed by assumptions rather than by observations.</p>
                <p>
                  <strong>The exposure window.</strong> The 22-24-minute exposure begins at minute 5, but no saturation is
                  reported before minute 17. In a reference cohort of 468 infants who received no delivery-room
                  intervention, the median time to reach SpO<sub>2</sub> above 90% was 7.9 minutes (interquartile range
                  5.0-10)
                  <Cite n={1} />, so values below 90% at minute 5 are common in uncomplicated transition. The start of the
                  window is therefore an assumption. Current guidelines give target ranges for infants receiving
                  resuscitation that rise from 80-85% at 5 minutes to 85-95% at 10 minutes
                  <Cite n={2} />. They describe a target, not the trajectory of any individual infant.
                </p>
                <p>
                  <strong>The cumulative debt.</strong> With default inputs, Equation 8 gives about 86 mL
                  O<sub>2</sub>/kg if the 50% plateau starts at minute 5. This is close to the reconstruction&rsquo;s 91.
                  The debt falls to 62 if the plateau starts at minute 10, 37 at minute 15, and 27 if the deficit is
                  counted only from the first reading. Under joint uncertainty, the 90% interval was 0-192 mL
                  O<sub>2</sub>/kg for a minute-5 start, and 0-84 for a minute-17 start. The concept also assumes that
                  unmet demand accumulates as debt instead of being met by reduced consumption. The record contains no
                  lactate or blood gas value from the interval to test this.
                </p>
                <p>
                  <strong>The inspired oxygen fraction.</strong> The reconstruction equates 3 L/min by nasal cannula with an
                  FiO<sub>2</sub> of about 50%. Published methods estimate effective FiO<sub>2</sub> from cannula flow,
                  oxygen concentration, and the infant&rsquo;s breathing (inspiratory time, tidal volume, and the
                  fraction of nasal breathing)
                  <Cite n={4} />. A bench study found that commonly used formulas misestimate the delivered fraction as
                  ventilation changes
                  <Cite n={5} />. Without the infant&rsquo;s weight and breathing pattern, the effective FiO<sub>2</sub> is
                  unknown. It does not, in any case, enter the margin calculation at 94%, which uses the reading directly.
                </p>
                <p>
                  <strong>The cerebral margin.</strong> The reconstruction&rsquo;s cerebral margins have the same
                  structure as Equation 6. Its values of 1.02 at 50% and 1.86 at 58%, with cerebral blood flow of 85
                  mL/100 g/min and cerebral oxygen consumption of 1.8 mL/100 g/min, are reproduced by a haemoglobin of
                  about 16.6 g/dL and a floor saturation of about 0.40. The margin is proportional to the assumed blood
                  flow: without the assumed doubling it is 0.48. An assumed cerebral blood flow therefore separates
                  &ldquo;adequate&rdquo; from &ldquo;inadequate&rdquo;. Cerebral blood flow requirements in newborns
                  differ from those in adults
                  <Cite n={9} />, so adult-derived values should not be assumed to transfer.
                </p>

                <H3 n="4.6">The record itself is uncertain</H3>
                <p>
                  The two summaries of the same record give different first readings (Section 2.1). If the first
                  documented value was 58%, the 50% plateau from minute 5, and the largest component of the cumulative
                  debt, rest on a reading that may not exist. If both readings exist, their order and timing within
                  minutes 17-27 are not established. Either way, the record determines the result more than any model
                  input. Resolving the discrepancy requires the primary record, and no amount of modelling can replace it.
                </p>

                <H3 n="4.7">The earlier calculator</H3>
                <p>
                  As described by the reconstruction, the earlier calculator converted a 50% pulse-oximeter reading into a
                  71.1% saturation &ldquo;because of fetal haemoglobin&rdquo; and assumed a cardiac output of 400
                  mL/kg/min, giving &ldquo;5.67x SAFE&rdquo;. The conversion mixes two quantities. Fetal haemoglobin
                  shifts the relationship between PO<sub>2</sub> and saturation, but a pulse oximeter reports saturation.
                  A systematic review of ten neonatal studies found SpO<sub>2</sub>-SaO<sub>2</sub> bias between about
                  &minus;3.6 and +4.2 percentage points, and found that higher fetal haemoglobin altered the PO<sub>2</sub>-SpO<sub>2</sub>
                  relationship
                  <Cite n={3} />. A correction of 21 percentage points lies far outside that range. In our
                  reproduction, applying an adult curve to obtain PO<sub>2</sub> and then a fetal curve to obtain
                  saturation gives 69-75% for fetal P<sub>50</sub> values of 18-20 mmHg. This is the likely origin of the
                  71.1%, and it counts the same left shift twice. The 400 mL/kg/min output is 2.5 times the v2 default
                  of 160. The v2 calculator corrected both. Our results show that its own outputs still need intervals.
                </p>
              </section>

              {/* ------------------------------------------------ 5 */}
              <section aria-labelledby="discussion">
                <H2 id="discussion" n="5">
                  Discussion
                </H2>
                <H3 n="5.1">Principal findings</H3>
                <p>
                  The calculator is a coherent, inspectable model, and we could reproduce it from its own display. That
                  matters: most AI-generated clinical reasoning cannot be reproduced at all. Its qualitative signal at the
                  lowest reading, that oxygen above a critical venous floor was less than assumed demand, held in most of
                  the input space we explored. Its quantitative outputs did not. The margins are reported to two decimal
                  places, but they belong to wide intervals that, at 58%, straddle the threshold that gives them meaning.
                  The cumulative debt and the length of the exposure are set mainly by an assumption about an interval
                  with no recorded saturation. On the record supplied, it is also uncertain which readings exist.
                </p>

                <H3 n="5.2">Why near-threshold margins mislead</H3>
                <p>
                  The amplification in Section 4.2 is a general property, not a defect of this calculator. Any index
                  defined as a difference above a floor, then divided by a demand, will be most sensitive exactly where
                  clinicians most want to use it: near the floor. Reporting such an index without propagated uncertainty
                  invites false precision. The calculator&rsquo;s own Monte Carlo panel acknowledges this. Our
                  contribution is to show how large the effect is at the readings in question.
                </p>

                <H3 n="5.3">Isolated hypoxaemia and hypoxia-ischaemia</H3>
                <p>
                  The reconstruction distinguished isolated hypoxaemia, low arterial oxygen with preserved circulation,
                  from hypoxia-ischaemia, in which blood flow also fails. The distinction is established in experimental
                  work: the classic neonatal rodent model produces injury by combining carotid ligation with hypoxia, and
                  uses the hemisphere exposed to hypoxia alone as an internal comparison
                  <Cite n={[7, 8]} />. That framework makes circulatory status central. In this case, circulatory status
                  is not documented: heart rate is not reported for the interval, and the reconstruction&rsquo;s
                  inference of intact circulation from the later response to oxygen is plausible but indirect.
                  Evidence from rodents also does not set thresholds for human infants. A conclusion about neurological
                  outcome cannot be drawn from this record or this model. That question belongs to clinical assessment.
                </p>

                <H3 n="5.4">What we did not assess</H3>
                <p>
                  We did not assess whether care met any standard. Doing so would require the primary record, the
                  clinical context, and expert clinical review, none of which a model can supply. Guideline target ranges
                  <Cite n={2} /> are cited above only to show what such targets describe.
                </p>

                <H3 n="5.5">Implications for computational clinical reasoning</H3>
                <p>
                  The case shows both sides of the opportunity. An AI-assisted analysis turned four or five reported
                  details into an explicit, mechanistic, and reproducible model, which is more than most retrospective
                  reasoning achieves. The same fluency turned assumptions into apparent findings. We propose eight
                  practices for any computational reconstruction of a clinical event:
                </p>
                <ol className="p-list p-list--rec">
                  <li><strong>Separate evidence classes.</strong> Label every value as measured, reported, inferred, assumed, or unknown.</li>
                  <li><strong>Preserve gaps.</strong> Never interpolate through an unrecorded interval without labelling the interpolation as an assumption.</li>
                  <li><strong>Publish the model.</strong> State equations, parameters, and software versions so that results can be reproduced.</li>
                  <li><strong>Report intervals, not points.</strong> Propagate measurement error, including device error at low saturation.</li>
                  <li><strong>Show sensitivity near thresholds.</strong> Identify the inputs that can move a conclusion across a decision boundary.</li>
                  <li><strong>Reconcile the record first.</strong> Resolve conflicting observations before modelling them.</li>
                  <li><strong>Name the decisive measurement.</strong> State which observation would most change the conclusion.</li>
                  <li><strong>Keep verdicts out of models.</strong> Outcome, causation, and standard of care require clinical and expert judgement.</li>
                </ol>
              </section>

              {/* ------------------------------------------------ 6 */}
              <section aria-labelledby="limitations">
                <H2 id="limitations" n="6">
                  Limitations
                </H2>
                <ul className="p-list">
                  <li>The primary clinical record was not reviewed; all case details are reported, and the record contains at least one unresolved discrepancy.</li>
                  <li>The calculator was re-implemented from its displayed equations and values, not from source code; the Bohr coefficient was inferred from displayed values, and the inputs behind the 94% preset were not available.</li>
                  <li>Input spreads for the Monte Carlo analysis are illustrative and independent; real inputs are correlated, and population-derived distributions could narrow or widen the intervals.</li>
                  <li>The model is a single-compartment abstraction; regional flow, shunt, and heterogeneous critical thresholds are not represented, and the model itself has not been validated against outcomes.</li>
                  <li>Literature was verified at the level of bibliographic records and abstracts because of network restrictions; full-text review is planned for a subsequent version.</li>
                  <li>The analysis was drafted with AI assistance (see Declarations); all calculations were independently reproduced by script.</li>
                </ul>
              </section>

              {/* ------------------------------------------------ 7 */}
              <section aria-labelledby="conclusion">
                <H2 id="conclusion" n="7">
                  Conclusion
                </H2>
                <p>
                  An AI-assisted physiological reconstruction of a neonatal oxygenation timeline could be reproduced,
                  interrogated, and stress-tested. Its qualitative signal at the lowest reading was fairly robust. Its
                  precise margins, threshold, cumulative debt, and neurological conclusion were not supported by the
                  record. The value of computational reasoning in such cases lies less in the verdicts it produces than in
                  making its dependence on assumptions explicit, and in identifying the measurements that would settle
                  the question.
                </p>
              </section>

              {/* ------------------------------------------------ declarations */}
              <section aria-labelledby="declarations" className="declarations">
                <H2 id="declarations" n="">
                  Declarations
                </H2>
                <dl>
                  <dt>Ethics and privacy</dt>
                  <dd>
                    Case materials were supplied privately for research use. Names, places, dates, clock times, and
                    record page references have been removed, and times are expressed in minutes after birth.
                  </dd>
                  <dt>Clinical use</dt>
                  <dd>
                    Nothing in this paper is clinical guidance. The model and calculator discussed are not clinical
                    decision tools and have not been validated.
                  </dd>
                  <dt>Use of AI</dt>
                  <dd>
                    The source reconstruction was generated with the assistance of a large language model. This paper was
                    drafted with AI assistance under the direction of the authors; all quantitative results were
                    produced by the reproduction script, and all references were checked against bibliographic records.
                  </dd>
                  <dt>Code and data</dt>
                  <dd>
                    Equations 1-8 fully specify the model. A dependency-free{' '}
                    <a href="/papers/csi-wp-2026-01/reproduce.py" download>
                      Python reproduction script
                    </a>{' '}
                    regenerates Tables 3-5 and the debt analysis. Figures are computed in the browser from the same
                    equations.
                  </dd>
                  <dt>How to cite</dt>
                  <dd className="cite-as">{paper.citation}</dd>
                </dl>
              </section>

              {/* ------------------------------------------------ references */}
              <section aria-labelledby="references" className="references">
                <H2 id="references" n="">
                  References
                </H2>
                <ol>
                  {references.map((r, i) => (
                    <li key={r.text} id={`ref-${i + 1}`}>
                      <span>{r.text}</span>
                      {r.doi && (
                        <>
                          {' '}
                          <a href={`https://doi.org/${r.doi}`} rel="noopener">
                            doi:{r.doi}
                          </a>
                        </>
                      )}
                      {r.url && (
                        <>
                          {' '}
                          <a href={r.url} rel="noopener">
                            {r.url.replace('https://', '')}
                          </a>
                        </>
                      )}
                      <span className="ref-note"> {r.note}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <p className="paper-back">
                <a className="btn btn-secondary" href="/case-study/">
                  Explore the case interactively
                </a>
                <a className="btn btn-secondary" href="/#method">
                  Our method
                </a>
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer page="paper" />
    </>
  );
}
