# Issue #10 — CI/CD: GitHub Actions → Docker Hub → k3s

**Priority:** P3  
**Depends on:** Semua issue sebelumnya (app harus build clean)  
**Branch:** `feature/issue-10-cicd`

---

## Context

Setup automated deployment pipeline dari push ke `main` → build Docker image → push ke Docker Hub → rolling deploy ke k3s cluster. App sudah punya `output: "standalone"` di `next.config.ts` (dari Issue #1).

---

## Files to Create

| File | Keterangan |
|---|---|
| `Dockerfile` | Multi-stage build (builder + runner) |
| `k8s/deployment.yaml` | k8s Deployment manifest |
| `k8s/service.yaml` | ClusterIP Service |
| `k8s/ingress.yaml` | Ingress dengan TLS |
| `k8s/configmap.yaml` | Non-secret env vars |
| `.github/workflows/deploy.yaml` | GitHub Actions pipeline |
| `app/api/health/route.ts` | Health check endpoint |

---

## 1. Health Check Endpoint

**`app/api/health/route.ts`** — GET handler, return JSON `{ status: "ok", timestamp: <ISO string> }` dengan status 200. Dipakai k8s readiness/liveness probe.

---

## 2. Dockerfile

Multi-stage:
- **Stage builder** — `node:22-alpine`, copy package files, `npm ci`, `npm run build`
- **Stage runner** — `node:22-alpine`, copy `.next/standalone` + `.next/static` + `public`, set `NODE_ENV=production`, `EXPOSE 3000`, `CMD ["node", "server.js"]`

---

## 3. Kubernetes Manifests (`k8s/`)

### `deployment.yaml`
- 1 replica, image dari Docker Hub dengan tag `<username>/prime-property:<sha>`
- Env vars dari Secret (`supabase-url`, `session-secret`, dll)
- Env vars non-secret dari ConfigMap
- Readiness probe: GET `/api/health`, initialDelaySeconds: 15
- Liveness probe: GET `/api/health`, periodSeconds: 30

### `service.yaml`
- Type: ClusterIP, port 3000

### `ingress.yaml`
- Host: `prime-pro.irhamu.dev`
- TLS termination via cert-manager (annotation `cert-manager.io/cluster-issuer: letsencrypt-prod`)
- Path: `/` → service port 3000

### `configmap.yaml`
- `NEXT_PUBLIC_APP_URL=https://prime-pro.irhamu.dev`
- Non-secret env vars lainnya

---

## 4. GitHub Actions (`.github/workflows/deploy.yaml`)

Trigger: `push` ke branch `main`

Steps berurutan:
1. Checkout code
2. Setup Node.js 22
3. `npm ci && npm run lint && npm run build` — fail fast jika build error
4. Docker build & tag dengan `${{ github.sha }}`
5. Docker push ke Docker Hub (pakai secrets `DOCKERHUB_USERNAME` + `DOCKERHUB_TOKEN`)
6. `kubectl set image deployment/prime-property prime-property=<image>:<sha>` via `KUBECONFIG` secret
7. `kubectl rollout status deployment/prime-property --timeout=120s`

---

## GitHub Secrets yang Wajib Dikonfigurasi

```
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
KUBECONFIG              # base64-encoded kubeconfig k3s
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SESSION_SECRET
NEXT_PUBLIC_APP_URL
ADMIN_EMAIL
```

> Secrets ini diset manual di GitHub repo Settings → Secrets and variables → Actions.

---

## Acceptance Criteria

- [ ] `GET /api/health` return `{ status: "ok" }` dengan 200
- [ ] `docker build` berhasil dan image bisa dijalankan locally
- [ ] Push ke `main` memicu workflow Actions
- [ ] Image ter-push ke Docker Hub dengan tag SHA
- [ ] Deployment di k3s rolling update tanpa downtime
- [ ] App accessible di `https://prime-pro.irhamu.dev`
