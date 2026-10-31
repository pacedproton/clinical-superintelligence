#!/bin/sh
# Offline checks that the deploy files agree with each other. Exits non-zero on the first mismatch.
set -eu
cd "$(dirname "$0")/.."
y=openshift/clinical-superintelligence.yaml
oc apply --dry-run=client -f "$y" -f argocd/clinical-superintelligence.yaml >/dev/null
grep -q 'listen 8080;' nginx.conf
grep -q 'containerPort: 8080' "$y"
grep -q 'targetPort: 8080' "$y"
grep -q 'port: 8080' "$y"
grep -q 'location = /healthz' nginx.conf
grep -q 'path: openshift' argocd/clinical-superintelligence.yaml
grep -q 'namespace: csi' argocd/clinical-superintelligence.yaml
# every namespaced object in the manifest is in csi (Argo would otherwise sync it elsewhere)
test "$(grep -c '^  namespace:' "$y")" = "$(grep -c '^  namespace: csi$' "$y")"
# the Dockerfile copies what the build produces and the config it serves
grep -q 'COPY nginx.conf' Dockerfile
grep -q '/src/dist' Dockerfile
echo deploy files ok
