export const paper = {
  id: 'CSI-WP-2026-01',
  version: '1.0',
  date: '31 October 2026',
  authors: 'Clinical Superintelligence',
  title: 'Reproducing and stress-testing an oxygen extraction margin',
  subtitle:
    'An uncertainty analysis of an AI-assisted reconstruction of a neonatal oxygenation timeline',
  url: 'https://clinical-superintelligence.com/research/oxygen-extraction-margin/',
  citation:
    'Clinical Superintelligence. Reproducing and stress-testing an oxygen extraction margin: an uncertainty analysis of an AI-assisted reconstruction of a neonatal oxygenation timeline. Working paper CSI-WP-2026-01, version 1.0. 31 October 2026. https://clinical-superintelligence.com/research/oxygen-extraction-margin/',
};

type Ref = { text: string; doi?: string; url?: string; note: string };

const RECORD = 'Verified against bibliographic record and abstract.';

export const references: Ref[] = [
  {
    text: 'Dawson JA, Kamlin COF, Vento M, et al. Defining the reference range for oxygen saturation for infants after birth. Pediatrics. 2010;125(6):e1340-e1347.',
    doi: '10.1542/peds.2009-1510',
    note: RECORD,
  },
  {
    text: 'Lee HC, Strand ML, Finan E, et al. Part 5: Neonatal resuscitation: 2025 American Heart Association and American Academy of Pediatrics guidelines for cardiopulmonary resuscitation and emergency cardiovascular care. Circulation. 2025;152(16 Suppl 2):S385-S423.',
    doi: '10.1161/CIR.0000000000001367',
    note: 'Verified against bibliographic record and published algorithm summary.',
  },
  {
    text: 'Pritišanac E, Urlesberger B, Schwaberger B, Pichler G. Accuracy of pulse oximetry in the presence of fetal hemoglobin: a systematic review. Children (Basel). 2021;8(5):361.',
    doi: '10.3390/children8050361',
    note: RECORD,
  },
  {
    text: 'Benaron DA, Benitz WE. Maximizing the stability of oxygen delivered via nasal cannula. Arch Pediatr Adolesc Med. 1994;148(3):294-300.',
    doi: '10.1001/archpedi.1994.02170030064015',
    note: RECORD,
  },
  {
    text: 'Bertzouanis A, Sinopidis X, Pelekouda P, Karatza A, Dimitriou G, Fouzas S. Optimizing oxygen delivery by low-flow nasal cannula to small infants: a bench study. Diagnostics (Basel). 2024;14(9):889.',
    doi: '10.3390/diagnostics14090889',
    note: RECORD,
  },
  {
    text: 'Severinghaus JW. Simple, accurate equations for human blood O2 dissociation computations. J Appl Physiol Respir Environ Exerc Physiol. 1979;46(3):599-602.',
    doi: '10.1152/jappl.1979.46.3.599',
    note: RECORD,
  },
  {
    text: 'Rice JE 3rd, Vannucci RC, Brierley JB. The influence of immaturity on hypoxic-ischemic brain damage in the rat. Ann Neurol. 1981;9(2):131-141.',
    note: RECORD,
  },
  {
    text: 'Vannucci RC, Vannucci SJ. Perinatal hypoxic-ischemic brain damage: evolution of an animal model. Dev Neurosci. 2005;27(2-4):81-86.',
    doi: '10.1159/000085978',
    note: RECORD,
  },
  {
    text: 'Altman DI, Powers WJ, Perlman JM, Herscovitch P, Volpe SL, Volpe JJ. Cerebral blood flow requirement for brain viability in newborn infants is lower than in adults. Ann Neurol. 1988;24(2):218-226.',
    doi: '10.1002/ana.410240208',
    note: RECORD,
  },
  {
    text: 'Neonatal O2 Sufficiency: Physiological Calculator (v2). Web application.',
    url: 'https://scilytics.com/hbf/',
    note: 'Content as supplied to the authors; inputs, intermediate values and presets transcribed in October 2026.',
  },
];
