#!/usr/bin/env python3
"""
Reproduction script for working paper CSI-WP-2026-01,
"Reproducing and stress-testing an oxygen extraction margin".
https://clinical-superintelligence.com/research/oxygen-extraction-margin/

Re-implements the extraction-margin model (Equations 1-8) and regenerates the
reproduction values (Table 3), local elasticities (Table 4), one-at-a-time
ranges (Figure 2), Monte Carlo results (Table 5) and the debt analysis
(Section 4.5).

Standard library only. Run: python3 reproduce.py

NOT A CLINICAL TOOL. Outputs are properties of a model under stated inputs,
not findings about any patient.
"""
import math
import random

BOHR = 0.48  # inferred from the calculator's displayed P50 values

DEFAULTS = dict(spo2=50.0, bias=0.0, p50=19.0, n=2.7, pha=7.28, dph=0.06,
                pvc=19.5, hb=16.0, vo2=8.5, q=160.0, mult=0.9)

PRIOR_SD = dict(bias=5.5, p50=0.75, n=0.1, pha=0.05, dph=0.02, pvc=1.5,
                hb=1.2, vo2=1.2, q=25.0, mult=0.05)

OAT = dict(pvc=(17, 22), bias=(-5.5, 5.5), pha=(7.20, 7.36), p50=(18, 20),
           vo2=(7, 10), q=(130, 190), dph=(0.03, 0.09), hb=(14, 18),
           mult=(0.8, 1.0), n=(2.5, 2.9))


def evaluate(p):
    sa = min(0.995, max(0.001, (p["spo2"] - p["bias"]) / 100))           # (1)
    p50a = p["p50"] * 10 ** (BOHR * (7.4 - p["pha"]))                    # (2)
    p50v = p["p50"] * 10 ** (BOHR * (7.4 - (p["pha"] - p["dph"])))
    pao2 = p50a * (sa / (1 - sa)) ** (1 / p["n"])                         # (3)
    svc = p["pvc"] ** p["n"] / (p["pvc"] ** p["n"] + p50v ** p["n"])      # (4)
    cao2 = 1.34 * p["hb"] * sa + 0.003 * pao2                             # (5)
    cvc = 1.34 * p["hb"] * svc + 0.003 * p["pvc"]
    qs = p["q"] * p["mult"] / 100                                         # dL/kg/min
    vmax = max(0.0, qs * (cao2 - cvc))
    return dict(sa=sa, p50a=p50a, p50v=p50v, pao2=pao2, svc=svc, cao2=cao2,
                cvc=cvc, extractable=cao2 - cvc, M=vmax / p["vo2"],    # (6)
                delivery_ratio=qs * cao2 / p["vo2"])


def M(**kw):
    return evaluate(dict(DEFAULTS, **kw))["M"]


def crossing(target):
    lo, hi = 30.0, 99.9
    for _ in range(80):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if M(spo2=mid) < target else (lo, mid)
    return (lo + hi) / 2


def draw(rng, spo2):
    p = dict(DEFAULTS, spo2=spo2)
    for k, sd in PRIOR_SD.items():
        p[k] = DEFAULTS[k] + sd * rng.gauss(0, 1)
    p["dph"] = max(0.0, p["dph"])
    p["vo2"] = max(3.0, p["vo2"])
    p["q"] = max(60.0, p["q"])
    p["mult"] = min(1.0, max(0.6, p["mult"]))
    return p


def debt(p, start):                                                       # (8)
    total = 0.0
    for s, a, b in ((50, start, 17), (58, 17, 27), (61, 27, 28.5)):
        if b > a:
            m = evaluate(dict(p, spo2=s))["M"]
            total += p["vo2"] * max(0.0, 1 - m) * (b - a)
    return total


def quantiles(xs, *fs):
    xs = sorted(xs)
    return [xs[min(len(xs) - 1, int(f * len(xs)))] for f in fs]


def main():
    r = evaluate(DEFAULTS)
    print("Table 3: reproduction at default inputs, reading 50%")
    for k in ("p50a", "p50v", "pao2", "svc", "cao2", "cvc", "extractable", "delivery_ratio", "M"):
        print(f"  {k:15s} {r[k]:.3f}")
    for s in (58, 94):
        e = evaluate(dict(DEFAULTS, spo2=s))
        print(f"  reading {s}%: PaO2 {e['pao2']:.1f} mmHg, M {e['M']:.3f}")
    print(f"  M = 0 above {crossing(1e-9):.1f}%, M = 1 at {crossing(1):.1f}%, M = 1.5 at {crossing(1.5):.1f}%")
    print(f"  effective flow needed for M = 2.56 at 94%: {144 * 2.56 / M(spo2=94):.0f} mL/kg/min")

    print("\nTable 4: elasticities at 50%")
    for k in ("p50", "pvc", "spo2", "n", "hb", "q", "mult", "vo2", "dph"):
        h = 1e-4
        up = M(**{k: DEFAULTS[k] * (1 + h)})
        dn = M(**{k: DEFAULTS[k] * (1 - h)})
        print(f"  {k:5s} {(math.log(up) - math.log(dn)) / (2 * h):+.2f}")
    slope = (M(pha=7.29) - M(pha=7.27)) / 0.02
    print(f"  pha   {slope:+.2f} per pH unit (absolute)")

    print("\nFigure 2: one-at-a-time ranges")
    for s in (50, 58):
        for k, (a, b) in OAT.items():
            print(f"  {s}%  {k:5s} {a:>6} -> M {M(spo2=s, **{k: a}):.2f}   {b:>6} -> M {M(spo2=s, **{k: b}):.2f}")

    print("\nTable 5: Monte Carlo (20,000 draws, seed 1)")
    rng = random.Random(1)
    for s in (50, 58, 94):
        ms = []
        for _ in range(20000):
            p = draw(rng, s)
            if p["spo2"] - p["bias"] >= 99.5:
                p["bias"] = p["spo2"] - 99.5
            ms.append(evaluate(p)["M"])
        med, lo, hi = quantiles(ms, 0.5, 0.05, 0.95)
        below1 = sum(m < 1 for m in ms) / len(ms)
        below15 = sum(m < 1.5 for m in ms) / len(ms)
        print(f"  {s}%: median {med:.2f}, 90% {lo:.2f}-{hi:.2f}, P(M<1) {below1:.3f}, P(M<1.5) {below15:.3f}")

    print("\nSection 4.5: cumulative debt (mL O2/kg)")
    for start in (5, 10, 15, 17):
        print(f"  deficit from minute {start:2d}: {debt(DEFAULTS, start):.1f}")
    rng = random.Random(2)
    for start in (5, 17):
        ds = [debt(draw(rng, 50), start) for _ in range(20000)]
        med, lo, hi = quantiles(ds, 0.5, 0.05, 0.95)
        print(f"  Monte Carlo, from minute {start}: median {med:.1f}, 90% {lo:.1f}-{hi:.1f}")

    print("\nSection 4.7: adult-curve PO2 at 50%, then fetal curve")
    def sev(po2):
        return 1 / (23400 / (po2 ** 3 + 150 * po2) + 1)
    lo, hi = 1.0, 200.0
    for _ in range(100):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if sev(mid) < 0.5 else (lo, mid)
    pa = (lo + hi) / 2
    for p50f in (18, 19, 20):
        print(f"  fetal P50 {p50f}: saturation {sev(pa * 26.8 / p50f) * 100:.1f}%")


if __name__ == "__main__":
    main()
