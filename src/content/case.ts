/**
 * Case study content: "Thirty-two minutes after birth".
 *
 * Every figure below is either a REPORTED detail from a supplied narrative
 * (not independently verified) or an UNVALIDATED claim from an AI-generated
 * source analysis. None of it is a patient finding or clinical guidance.
 * Times are relative to birth; no identifying details are included.
 */
import type { EvidenceKind } from './site';

export const caseMeta = {
  label: 'Case Study',
  title: 'Thirty-two minutes after birth',
  subtitle:
    'A neonatal oxygenation timeline shows both the promise of computational reasoning and the need to test its assumptions.',
  provenance:
    'Illustrative retrospective case based on a supplied narrative and an AI-generated analysis. Original clinical records have not been independently reviewed for this website. Identifying details have been removed and times are given relative to birth.',
  takeaway: 'The breakthrough is making deeper reasoning possible, inspectable, and testable.',
  takeawayParagraphs: [
    'Retrospective modelling can reveal useful questions and competing explanations that a brief record does not make obvious. Here, it turned a handful of reported details into a detailed physiological account and showed precisely where that account depends on things nobody observed.',
    'Its conclusions are only as strong as the quality of the record, the validity of the model, and the robustness of its assumptions. This page makes no judgement about the infant’s outcome or about the care provided.',
  ],
};

/** The supplied narrative, in relative time. All details are reported, not verified. */
export const narrative = [
  { t: '0', text: 'Birth.' },
  { t: '0-17', text: 'No continuous saturation record is supplied.' },
  { t: '~17', text: 'A dusky appearance is noticed, with an SpO_2 reading of around 50%.' },
  { t: '17-27', text: 'Prone positioning and chest physiotherapy. A room-air SpO_2 of around 58% is reported.' },
  { t: '~27', text: 'Nasal cannula oxygen begins at 3 L/min.' },
  { t: '~32', text: 'SpO_2 reportedly reaches 94%.' },
];

/** Reported points from the narrative. SpO2 in %, time in minutes after birth. */
export const reportedReadings = [
  {
    id: 'r17',
    t: 17,
    spo2: 50,
    label: '~50%',
    note: 'Dusky appearance; SpO_2 around 50%',
  },
  {
    id: 'r22',
    t: 22,
    tFrom: 17,
    tTo: 27,
    spo2: 58,
    label: '~58%',
    note: 'Room-air SpO_2 around 58%; exact time within minutes 17-27 not given',
  },
  {
    id: 'r32',
    t: 32,
    spo2: 94,
    label: '~94%',
    note: 'SpO_2 reportedly reached 94%',
  },
] as const;

export const reportedInterventions = [
  {
    id: 'prone',
    from: 17,
    to: 27,
    label: 'Prone positioning, chest physiotherapy',
    short: 'Positioning, physiotherapy',
  },
  {
    id: 'o2',
    from: 27,
    to: 35,
    label: 'Nasal cannula oxygen, 3 L/min',
    short: 'Nasal cannula O_2, 3 L/min',
    ongoing: true,
  },
] as const;

export type Phase = {
  id: string;
  range: [number, number];
  when: string;
  title: string;
  reported: string[];
  inferred: string[];
  assumptions: string[];
  evidence: string[];
};

export const phases: Phase[] = [
  {
    id: 'unrecorded',
    range: [0, 17],
    when: 'Minutes 0-17',
    title: 'An unrecorded interval',
    reported: [
      'Birth at minute 0.',
      'No continuous saturation record is supplied for the first 17 minutes.',
    ],
    inferred: [
      'Minutes 0-5 are treated as a normal transition, and minutes 5-17 as sustained low saturation.',
      'Minute 5 becomes the start of a “22-24-minute hypoxic exposure” lasting until about minute 28.5.',
    ],
    assumptions: [
      'That saturation sat at about 50% throughout minutes 5-17: a plateau extended backwards from a single later reading.',
      'That the trajectory was flat, rather than falling, rising, or fluctuating.',
      'That any exposure began at minute 5 rather than at some later point.',
    ],
    evidence: [
      'Any observations from the first 17 minutes: colour, breathing, heart rate, Apgar scores.',
      'When a pulse oximeter was first applied, and where.',
      'Delivery and early-care records, and umbilical cord blood gas results if obtained.',
    ],
  },
  {
    id: 'first-reading',
    range: [16, 18],
    when: 'Around minute 17',
    title: 'The first reported reading',
    reported: ['A dusky appearance is noticed.', 'An SpO_2 reading of around 50% is reported.'],
    inferred: [
      'Arterial oxygen tension (PaO_2, the partial pressure of oxygen in arterial blood) of 21.2 mmHg.',
      'A “systemic extractable margin” of 0.37-0.42 and an oxygen deficit of 5.0-5.4 mL O_2/kg/min.',
      'A cerebral margin of 1.02, described as “knife-edge” but adequate.',
    ],
    assumptions: [
      'A specific oxygen-haemoglobin dissociation curve, used to convert saturation into PaO_2.',
      'Whole-body oxygen consumption and cardiac output values not taken from this infant.',
      'Cerebral oxygen consumption of 1.8 mL O_2/100 g/min, and cerebral blood flow rising from 40 to 80-85 mL/100 g/min.',
      'That a single reading at this level was accurate and representative.',
    ],
    evidence: [
      'Device, probe site, and signal quality for the reading.',
      'Heart rate at the time, which the supplied narrative does not report.',
      'Any blood gas or lactate measurement, and repeat readings.',
    ],
  },
  {
    id: 'positioning',
    range: [17, 27],
    when: 'Minutes 17-27',
    title: 'Positioning and physiotherapy',
    reported: [
      'Prone positioning and chest physiotherapy are described.',
      'A room-air SpO_2 of around 58% is reported during this interval.',
    ],
    inferred: [
      'Positioning “recruited” lung and raised saturation to 58%, which then held for ten minutes.',
      'PaO_2 of 24.4 mmHg, a systemic margin of 0.71, and a deficit of 2.47 mL O_2/kg/min.',
      'A cerebral margin of 1.86, presented as “safe cerebral reserve”.',
    ],
    assumptions: [
      'A continuous plateau at 58% between observations.',
      'That positioning caused the change. The narrative does not establish this; ongoing transition, measurement variation, or other factors could also contribute.',
      'The same physiological inputs as before, unchanged over ten minutes.',
    ],
    evidence: [
      'Time-stamped readings across the interval.',
      'Whether the 58% reading came before or after positioning began.',
      'Heart rate and respiratory observations during the interval.',
    ],
  },
  {
    id: 'oxygen',
    range: [26, 29],
    when: 'Around minute 27',
    title: 'Oxygen begins',
    reported: ['Nasal cannula oxygen reportedly begins at 3 L/min.'],
    inferred: [
      'An inspired oxygen fraction (FiO_2) of about 50%.',
      'Saturation crossed a proposed 64% “aerobic threshold” within about 1.5 minutes, ending the exposure at minute 28.5.',
    ],
    assumptions: [
      'A fixed conversion from cannula flow to FiO_2. The record does not establish what oxygen fraction this infant actually received.',
      'A crossing time for 64%, although no reading is reported between minutes 27 and 32.',
      'That 64% is a meaningful threshold. It is an output of the source model, not a validated value.',
    ],
    evidence: [
      'Oxygen delivery details: device, flow, and any blender setting.',
      'Readings between minutes 27 and 32.',
    ],
  },
  {
    id: 'recovery',
    range: [31, 33],
    when: 'Around minute 32',
    title: 'A reported 94%',
    reported: ['SpO_2 reportedly reaches 94%.'],
    inferred: [
      'PaO_2 of 57.5 mmHg and a systemic margin of 2.56, described as “fully restored”.',
      'A cumulative systemic oxygen debt of about 91 mL O_2/kg across minutes 5-28.5.',
      'Permanent brain injury “almost certainly” absent if heart rate stayed at or above 100 beats per minute.',
    ],
    assumptions: [
      'Every assumption above, since the cumulative debt integrates deficits across assumed plateaus.',
      'A heart rate that is not reported in the supplied narrative.',
      'That a rapid response to oxygen demonstrates intact circulation throughout the earlier, unrecorded interval.',
    ],
    evidence: [
      'Heart rate and blood pressure observations across the whole period.',
      'Neurological outcome cannot be determined by a reconstruction of this kind. It requires clinical assessment.',
    ],
  },
];

export type Claim = {
  claim: string;
  value: string;
  restsOn: string;
  status: EvidenceKind;
  statusNote: string;
};

export const claims: Claim[] = [
  {
    claim: 'Duration of hypoxic exposure',
    value: '22-24 min (minute 5 to ~28.5)',
    restsOn: 'Assumed start at minute 5; assumed crossing time at 64%',
    status: 'inferred',
    statusNote: 'Inferred from assumptions',
  },
  {
    claim: 'SpO_2 during minutes 5-17',
    value: '~50% plateau',
    restsOn: 'One later reading, extended backwards',
    status: 'assumed',
    statusNote: 'Assumed',
  },
  {
    claim: 'PaO_2 estimates',
    value: '21.2, 24.4, 57.5 mmHg',
    restsOn: 'Choice of dissociation curve; accuracy of reported readings',
    status: 'inferred',
    statusNote: 'Model-dependent',
  },
  {
    claim: 'Systemic extractable margin',
    value: '0.37-0.42, 0.71, 2.56',
    restsOn: 'Proposed metric; assumed oxygen consumption and cardiac output',
    status: 'inferred',
    statusNote: 'Metric not validated',
  },
  {
    claim: 'Systemic oxygen deficit',
    value: '5.0-5.4 and 2.47 mL O_2/kg/min',
    restsOn: 'Same inputs as the margin',
    status: 'inferred',
    statusNote: 'Model-dependent',
  },
  {
    claim: 'Cumulative systemic oxygen debt',
    value: '~91 mL O_2/kg',
    restsOn: 'Deficits integrated over assumed plateaus',
    status: 'inferred',
    statusNote: 'Inferred from assumptions',
  },
  {
    claim: 'Cerebral oxygen consumption',
    value: '1.8 mL O_2/100 g/min',
    restsOn: 'Population value, not measured in this infant',
    status: 'assumed',
    statusNote: 'Assumed',
  },
  {
    claim: 'Cerebral blood flow',
    value: '40, rising to 80-85 mL/100 g/min',
    restsOn: 'Assumed compensatory vasodilation',
    status: 'assumed',
    statusNote: 'Assumed',
  },
  {
    claim: 'Cerebral margin',
    value: '1.02 at 50%; 1.86 at 58%',
    restsOn: 'Assumed flow and consumption, plus PaO_2 estimates',
    status: 'inferred',
    statusNote: 'Highly sensitive to assumptions',
  },
  {
    claim: 'Aerobic supply threshold',
    value: 'SpO_2 64%',
    restsOn: 'Output of the source model',
    status: 'inferred',
    statusNote: 'Not a validated threshold',
  },
  {
    claim: 'FiO_2 from 3 L/min nasal cannula',
    value: '~50%',
    restsOn: 'Fixed flow-to-fraction conversion',
    status: 'assumed',
    statusNote: 'Assumed',
  },
  {
    claim: 'Neurological outcome',
    value: 'Injury “almost certainly” absent if heart rate ≥ 100 bpm',
    restsOn: 'Heart rate not in the narrative; all inputs above',
    status: 'unknown',
    statusNote: 'Cannot be established from this source',
  },
];

export const priorCalculator = {
  headline: 'When one model critiques another',
  paragraphs: [
    'The source analysis was itself a response to an earlier calculator. That calculator reportedly converted a 50% pulse-oximeter reading into 71.1% saturation using fetal haemoglobin assumptions, assumed a cardiac output of 400 mL/kg/min, and displayed a result of “5.67x SAFE”.',
    'The later analysis rejected those inputs and reached a far less reassuring set of numbers. It then reached its own confident conclusion about the brain, from inputs that were also assumed.',
    'Two models, built on the same handful of reported details, arrived at opposite characterisations of the same interval. That is not a reason to pick the more persuasive one. It is a demonstration that the inputs, not the arithmetic, determine the answer, and that the inputs are where scrutiny belongs. Neither calculator has been reviewed for this website.',
  ],
};

export const sensitivityExample = {
  headline: 'One assumption, two conclusions',
  paragraphs: [
    'In the source’s own arithmetic, the cerebral margin scales with assumed cerebral blood flow. With flow assumed to double, the margin at 50% saturation is 1.02. Remove the assumed increase and the same calculation gives roughly 0.48.',
    'A conclusion that moves from “adequate” to “inadequate” within the range of its own assumptions is not yet a finding. It is a precise statement of what would need to be measured.',
  ],
};

export const openQuestions = [
  'What did the first 17 minutes actually look like? Every downstream number depends on an interval with no supplied readings.',
  'How reliable is a single pulse-oximeter reading at low saturation in a newborn, with this device and probe site?',
  'Was heart rate recorded? The most consequential conclusion in the source is conditional on it.',
  'Which of the reported changes coincided with interventions, and which preceded them?',
  'Would independent physiologists choose the same model inputs, and would their conclusions agree?',
];

export const doesNotShow = [
  'It does not show what happened to this infant, before or after minute 32.',
  'It does not assess the quality, timeliness, or legality of the care provided.',
  'It does not validate any threshold, margin, or safety calculation.',
  'It does not demonstrate that computational reasoning improves outcomes. That would require prospective evaluation.',
];
