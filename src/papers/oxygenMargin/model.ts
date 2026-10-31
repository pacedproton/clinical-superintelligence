/**
 * Re-implementation of the extraction-margin model used by the neonatal O2
 * sufficiency calculator (v2) examined in working paper CSI-WP-2026-01.
 *
 * Purpose: reproduction and uncertainty analysis only. This is NOT a clinical
 * tool and its outputs are not patient findings.
 */

export type Params = {
  spo2: number; // pulse-oximeter reading, %
  bias: number; // oximeter bias SpO2 - SaO2, percentage points
  p50: number; // standard P50 at pH 7.4, mmHg
  n: number; // Hill exponent
  pha: number; // arterial pH
  dph: number; // arterio-venous pH difference
  pvc: number; // critical venous PO2 floor, mmHg
  hb: number; // haemoglobin, g/dL
  vo2: number; // oxygen demand, mL/kg/min
  q: number; // cardiac output, mL/kg/min
  mult: number; // effective non-shunted flow multiplier
};

/** Default inputs of the examined calculator. */
export const DEFAULTS: Params = {
  spo2: 50,
  bias: 0,
  p50: 19,
  n: 2.7,
  pha: 7.28,
  dph: 0.06,
  pvc: 19.5,
  hb: 16,
  vo2: 8.5,
  q: 160,
  mult: 0.9,
};

/** Bohr coefficient implied by the calculator's displayed P50 values (19 -> 21.7 mmHg at pH 7.28). */
export const BOHR = 0.48;

export function evaluate(p: Params) {
  const sa = Math.min(0.995, Math.max(0.001, (p.spo2 - p.bias) / 100));
  const p50a = p.p50 * 10 ** (BOHR * (7.4 - p.pha));
  const p50v = p.p50 * 10 ** (BOHR * (7.4 - (p.pha - p.dph)));
  const pao2 = p50a * (sa / (1 - sa)) ** (1 / p.n);
  const svc = p.pvc ** p.n / (p.pvc ** p.n + p50v ** p.n);
  const cao2 = 1.34 * p.hb * sa + 0.003 * pao2;
  const cvc = 1.34 * p.hb * svc + 0.003 * p.pvc;
  const qs = (p.q * p.mult) / 100; // dL/kg/min
  const vmax = Math.max(0, qs * (cao2 - cvc));
  return { sa, p50a, p50v, pao2, svc, cao2, cvc, qs, vmax, M: vmax / p.vo2, deliveryRatio: (qs * cao2) / p.vo2 };
}

/** Deterministic PRNG so prerendered and hydrated figures match. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rand: () => number) {
  const u = Math.max(rand(), 1e-12);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Illustrative input distributions (Table 2). Means are the calculator defaults. */
export const PRIORS: { key: keyof Params; label: string; sd: number; unit: string; note: string }[] = [
  { key: 'bias', label: 'Oximeter bias', sd: 5.5, unit: 'points', note: 'SD as stated by the calculator itself at SpO_2 50%' },
  { key: 'p50', label: 'Standard P_50', sd: 0.75, unit: 'mmHg', note: 'Assumed' },
  { key: 'n', label: 'Hill exponent', sd: 0.1, unit: '', note: 'Assumed' },
  { key: 'pha', label: 'Arterial pH', sd: 0.05, unit: '', note: 'Not measured in the interval' },
  { key: 'dph', label: 'A-V pH difference', sd: 0.02, unit: '', note: 'Assumed' },
  { key: 'pvc', label: 'Critical venous PO_2', sd: 1.5, unit: 'mmHg', note: 'Assumed' },
  { key: 'hb', label: 'Haemoglobin', sd: 1.2, unit: 'g/dL', note: 'Not measured in the interval' },
  { key: 'vo2', label: 'O_2 demand', sd: 1.2, unit: 'mL/kg/min', note: 'Assumed' },
  { key: 'q', label: 'Cardiac output', sd: 25, unit: 'mL/kg/min', note: 'Assumed' },
  { key: 'mult', label: 'Non-shunted flow fraction', sd: 0.05, unit: '', note: 'Assumed; truncated to 0.6-1.0' },
];

export function drawParams(rand: () => number, spo2: number): Params {
  const p: Params = { ...DEFAULTS, spo2 };
  for (const pr of PRIORS) p[pr.key] = DEFAULTS[pr.key] + pr.sd * gauss(rand);
  p.dph = Math.max(0, p.dph);
  p.vo2 = Math.max(3, p.vo2);
  p.q = Math.max(60, p.q);
  p.mult = Math.min(1, Math.max(0.6, p.mult));
  return p;
}

/** Monte Carlo quantiles of M across a range of SpO2 readings. Common random numbers across x. */
export function marginBand(spo2s: number[], n = 1500, seed = 7) {
  const rand = mulberry32(seed);
  const draws = Array.from({ length: n }, () => drawParams(rand, 50));
  return spo2s.map((s) => {
    const ms = draws.map((d) => evaluate({ ...d, spo2: s }).M).sort((a, b) => a - b);
    const q = (f: number) => ms[Math.min(ms.length - 1, Math.floor(f * ms.length))];
    return { spo2: s, p05: q(0.05), p25: q(0.25), p50: q(0.5), p75: q(0.75), p95: q(0.95) };
  });
}
