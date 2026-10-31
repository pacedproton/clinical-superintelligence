/**
 * Site copy, kept separate from presentation. Inline markup: O_2 for
 * subscripts and *emphasis*. See src/lib/rich.tsx.
 */

export const site = {
  name: 'Clinical Superintelligence',
  domain: 'clinical-superintelligence.com',
  discipline: 'Computational Clinical Reasoning',
  footerStatement:
    'Research initiative. The material presented is exploratory and is not a clinical decision tool.',
};

export const nav = [
  { id: 'vision', label: 'Vision' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'case-study', label: 'Case Study' },
  { id: 'method', label: 'Method' },
  { id: 'research', label: 'Research' },
] as const;

export const hero = {
  eyebrow: 'Computational Clinical Reasoning',
  headline: 'Every patient deserves deeper reasoning.',
  body: 'Clinical Superintelligence explores how AI can connect physiology, evidence, and the unfolding patient timeline into a more complete understanding of clinical care.',
  primary: { label: 'Explore the clinical case', href: '#case-study' },
  secondary: { label: 'Read our approach', href: '#method' },
  proposition:
    'Connecting physiology, evidence, and time to make clinical reasoning deeper, clearer, and testable.',
  figureCaption:
    'Fragments of a record, placed on one timeline and drawn into a single model. Illustrative composition; no patient data.',
};

export const vision = {
  label: 'Vision',
  headline: 'The next frontier is the depth of understanding.',
  paragraphs: [
    'Clinical information arrives in fragments: observations, monitor readings, laboratory results, treatment responses, and notes written at different times. Understanding a case requires connecting those fragments with physiology and relevant evidence.',
    'AI creates an opportunity to explore more explanations, examine more interactions, and make assumptions easier to inspect.',
  ],
  ambition:
    'Our ambition is clinical reasoning that is interdisciplinary, temporally precise, mechanistically grounded, and open to challenge.',
  qualities: [
    {
      term: 'Interdisciplinary',
      text: 'Drawing on every specialty a case touches, rather than the one it first presented to.',
    },
    {
      term: 'Temporally precise',
      text: 'Treating *when* something happened as evidence, alongside what happened.',
    },
    {
      term: 'Mechanistically grounded',
      text: 'Explaining a trajectory through physiology, not only through pattern and precedent.',
    },
    {
      term: 'Open to challenge',
      text: 'Showing every input, so that any conclusion can be questioned and corrected.',
    },
  ],
  origin: {
    label: 'Where the idea began',
    paragraphs: [
      'The initiative began with a contrast. A detailed AI-assisted reconstruction of one newborn’s first half hour explored mechanisms, interactions, and timings at length. A newborn life-support course, seen around the same time, taught the protocols clinicians rely on: clear, deliberately simplified, and designed to be carried out reliably under pressure.',
      'Both have a purpose. Protocols and expert practice encode hard-won collective experience and make good care repeatable. The question we are pursuing is whether computational reasoning can add patient-specific depth around those foundations without losing the clarity that makes them work. The reconstruction itself, examined below, shows why that depth must be tested before it is trusted.',
    ],
  },
};

export type CapabilityGlyph =
  | 'timeline'
  | 'physiology'
  | 'disciplines'
  | 'hypotheses'
  | 'uncertainty'
  | 'audit';

export const capabilities = {
  label: 'Capabilities',
  headline: 'Six capabilities we intend to build and test.',
  intro:
    'These describe the research approach, not a deployed product. Each is a capability we aim to develop, evaluate against real clinical records, and expose to expert criticism.',
  items: [
    {
      n: '01',
      glyph: 'timeline' as CapabilityGlyph,
      title: 'Reconstruct the timeline',
      text: 'Connect observations, interventions, and responses. Preserve gaps in the record.',
      detail: 'A missing interval is information. It should remain visible, not be smoothed over.',
    },
    {
      n: '02',
      glyph: 'physiology' as CapabilityGlyph,
      title: 'Reason through physiology',
      text: 'Explore the mechanisms that could explain a patient’s trajectory.',
      detail: 'From ventilation to oxygen delivery to tissue demand: each step stated, each step checkable.',
    },
    {
      n: '03',
      glyph: 'disciplines' as CapabilityGlyph,
      title: 'Connect disciplines',
      text: 'Bring relevant knowledge across specialties into a shared analysis.',
      detail: 'Neonatology, cardiology, respiratory physiology and pharmacology rarely meet in one note.',
    },
    {
      n: '04',
      glyph: 'hypotheses' as CapabilityGlyph,
      title: 'Test competing explanations',
      text: 'Compare hypotheses and identify observations that would distinguish them.',
      detail: 'The most useful output is often the next measurement that would settle a question.',
    },
    {
      n: '05',
      glyph: 'uncertainty' as CapabilityGlyph,
      title: 'Expose uncertainty',
      text: 'Separate measurements, reported observations, inferences, assumptions, and unknowns.',
      detail: 'Five categories, carried through every figure and every claim.',
    },
    {
      n: '06',
      glyph: 'audit' as CapabilityGlyph,
      title: 'Make reasoning auditable',
      text: 'Link conclusions to their evidence, model inputs, and limitations.',
      detail: 'A conclusion without a trail back to its inputs cannot be reviewed, only believed.',
    },
  ],
};

export type EvidenceKind = 'measured' | 'reported' | 'inferred' | 'assumed' | 'unknown';

export const evidenceKinds: Record<
  EvidenceKind,
  { label: string; definition: string; example: string }
> = {
  measured: {
    label: 'Measured',
    definition: 'Values captured by an identified instrument or test.',
    example: 'A time-stamped oximeter export with device and probe site recorded.',
  },
  reported: {
    label: 'Reported',
    definition: 'Observations described in a narrative or record.',
    example: '“Dusky, SpO_2 around 50%” written in an account of events.',
  },
  inferred: {
    label: 'Inferred',
    definition: 'Interpretations drawn from available evidence.',
    example: 'An arterial oxygen tension estimated from a saturation reading.',
  },
  assumed: {
    label: 'Assumed',
    definition: 'Inputs introduced to make a model possible.',
    example: 'A population value for cerebral oxygen consumption.',
  },
  unknown: {
    label: 'Unknown',
    definition: 'Information the available evidence cannot establish.',
    example: 'Saturation during an interval when nothing was recorded.',
  },
};

export const evidenceOrder: EvidenceKind[] = ['measured', 'reported', 'inferred', 'assumed', 'unknown'];

export const method = {
  label: 'Method',
  headline: 'Every conclusion should show what supports it.',
  intro:
    'A reconstruction can be detailed and still be wrong. The safeguard is structure: every statement carries its evidential status, and every number can be traced to the inputs that produced it.',
  caseNote:
    'In the case study, every observation is classed as *reported*, because the primary records have not been independently reviewed.',
  workflowHeadline: 'A research workflow',
  workflowIntro:
    'The workflow we intend to develop and evaluate. It describes how a case should be examined; it has not been completed for the example on this site.',
  workflow: [
    {
      title: 'Assemble and reconcile the record',
      text: 'Gather notes, observations, monitor data, and results onto one time axis, reconciling clocks and duplicates.',
    },
    {
      title: 'Identify gaps and conflicting observations',
      text: 'Mark intervals with no data and readings that disagree, before any explanation is attempted.',
    },
    {
      title: 'Construct competing mechanistic explanations',
      text: 'Generate several physiological accounts of the trajectory, not one preferred story.',
    },
    {
      title: 'Link claims to primary evidence',
      text: 'Attach every claim to the observation, source, or assumption it depends on.',
    },
    {
      title: 'Test sensitivity to uncertain inputs',
      text: 'Vary assumptions across plausible ranges and see which conclusions survive.',
    },
    {
      title: 'Seek expert review and empirical validation',
      text: 'Put the analysis in front of clinicians and test models against outcomes they did not see.',
    },
  ],
  sensitivity: {
    eyebrow: 'Sensitivity analysis',
    headline: 'Does a conclusion persist when plausible assumptions change?',
    paragraphs: [
      'Most clinical models need inputs nobody measured: an organ’s oxygen consumption, a blood flow, a curve relating one quantity to another. Sensitivity analysis asks what happens to a conclusion when each of those inputs moves across the range it could plausibly take.',
      'A conclusion that holds across the whole range is robust. One that reverses within it is a hypothesis, and the analysis has identified exactly which measurement would settle it.',
    ],
    figureCaption:
      'Schematic. Two generic uncertain inputs; each point is one combination of values. Widen the plausible range and watch where the conclusion stops holding. Not derived from any patient.',
  },
};

export const research = {
  label: 'Research',
  eyebrow: 'Research agenda',
  headline: 'Four proposed directions.',
  intro:
    'This is a research agenda: the questions we intend to pursue. It is not a record of completed work, and no results are claimed.',
  items: [
    {
      title: 'Temporal clinical reasoning',
      text: 'Understanding trajectories and intervention responses.',
      questions: [
        'How should irregular, incomplete, time-stamped records be represented for reasoning?',
        'How can a system distinguish a response to treatment from coincident change?',
      ],
    },
    {
      title: 'Mechanistic model integration',
      text: 'Connecting language models with explicit physiological models.',
      questions: [
        'When should a language model hand a question to an explicit, inspectable model?',
        'How are model limits and validity ranges carried into the final explanation?',
      ],
    },
    {
      title: 'Evidence provenance',
      text: 'Tracing claims to sources, observations, and assumptions.',
      questions: [
        'What is the minimum provenance a clinical claim needs to be reviewable?',
        'How should evidential status propagate through a chain of inferences?',
      ],
    },
    {
      title: 'Evaluation and calibration',
      text: 'Testing accuracy, uncertainty, failure modes, and clinical usefulness.',
      questions: [
        'Do stated uncertainties match how often conclusions turn out to be wrong?',
        'Does deeper reasoning change clinicians’ decisions, and for the better?',
      ],
    },
  ],
  closing: {
    headline: 'Toward a more complete understanding of every case.',
    paragraphs: [
      'This work needs people who rarely share a room: clinicians who know what a record leaves out, physiologists who can say when a model is wrong, machine learning researchers who understand failure modes, and scientific computing engineers who can make models honest and reproducible.',
      'We welcome collaboration in principle across medicine, physiology, machine learning, and scientific computing. Formal channels will be announced here as the initiative develops.',
    ],
  },
};
