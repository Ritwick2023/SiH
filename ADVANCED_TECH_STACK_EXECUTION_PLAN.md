# ⚡ StatVidya — Advanced Tech Stack Master Execution Plan & Developer Playbook
### *From Static Prototypes to Sovereign, Enterprise-Grade Digital Public Infrastructure (DPI)*

> **Document Type**: Comprehensive Implementation Blueprint, Developer Manual Setup Guide, and AI Agent Execution Protocol
> **Target Problem Statement**: SIH 26101 (MoSPI & NSSTA under Mission Karmayogi)
> **Source Blueprint**: [`ADVANCED_TECH_STACK_PLAN.md`](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/SiH/ADVANCED_TECH_STACK_PLAN.md)
> **Target System**: Next.js 16 (React 19) · Python 3.12 (FastAPI) · Celery + Redis · PostgreSQL 17 + pgvector · MinIO · Elasticsearch · Project Bhashini · Docker & Kubernetes (NIC MeghRaj)
> **Execution Strategy**: Zero-Downtime Dual-Mode Migration (Graceful Fallback & Parallel Run)

---

## 📑 Table of Contents

1. [Architectural Overview & Zero-Downtime Migration Strategy](#1-architectural-overview--zero-downtime-migration-strategy)
2. [SECTION 1: The Human Developer's Playbook (Manual Setup & Prerequisites)](#section-1-the-human-developers-playbook-manual-setup--prerequisites)
   - [1.1 Docker Desktop & Container Engine Setup](#11-docker-desktop--container-engine-setup)
   - [1.2 Kubernetes Local Cluster Setup (Beginner Friendly)](#12-kubernetes-local-cluster-setup-beginner-friendly)
   - [1.3 Python 3.12 Analytics Microservice Environment](#13-python-312-analytics-microservice-environment)
   - [1.4 Government DPI & External Service Onboarding](#14-government-dpi--external-service-onboarding)
   - [1.5 Master Environment Variables (`.env.local`)](#15-master-environment-variables-envlocal)
3. [SECTION 2: AI Agent Execution Protocol & Engineering Rules](#section-2-ai-agent-execution-protocol--engineering-rules)
   - [2.1 The 5 Inviolable Migration Laws](#21-the-5-inviolable-migration-laws)
   - [2.2 Dual-Mode Fallback Pattern (Code Contract)](#22-dual-mode-fallback-pattern-code-contract)
   - [2.3 Git Merge Conflict Resolution (Immediate Pre-requisite)](#23-git-merge-conflict-resolution-immediate-pre-requisite)
4. [SECTION 3: Complete Step-by-Step Execution Plan (Tasks A1 through D6)](#section-3-complete-step-by-step-execution-plan-tasks-a1-through-d6)
   - [PHASE A: Core Intelligence Upgrade & Statistical Brain](#phase-a-core-intelligence-upgrade--statistical-brain)
   - [PHASE B: Document Processing, Sovereign Storage & Bilingual AI](#phase-b-document-processing-sovereign-storage--bilingual-ai)
   - [PHASE C: Visualisation, Government DPI & Sovereign Credentials](#phase-c-visualisation-government-dpi--sovereign-credentials)
   - [PHASE D: Mobile Companion, Resilient Sync, Observability & Cloud Deployment](#phase-d-mobile-companion-resilient-sync-observability--cloud-deployment)
5. [SECTION 4: System Replacement & Migration Matrix](#section-4-system-replacement--migration-matrix)
6. [SECTION 5: Task Dependency Graph & Parallel Execution Order](#section-5-task-dependency-graph--parallel-execution-order)
7. [SECTION 6: Testing, Healthcheck & Pre-Flight Verification Playbook](#section-6-testing-healthcheck--pre-flight-verification-playbook)
8. [SECTION 7: npm & pip Package Installation Reference](#section-7-npm--pip-package-installation-reference)
9. [SECTION 8: Evaluator Pitch — The 3 Decisive Differentiators](#section-8-evaluator-pitch--the-3-decisive-differentiators)

---

## 1. Architectural Overview & Zero-Downtime Migration Strategy

Upgrading a live system from a lightweight client-side prototype (Next.js + Firebase + client-side OCR) to a distributed, sovereign, AI-driven digital platform cannot be accomplished by wiping existing code. Every upgrade is additive; every old system becomes a fallback.

### The Dual-Mode Coexistence Architecture

```
                                  ┌────────────────────────┐
                                  │   Next.js 16 Client    │
                                  │   (PWA / Web App)      │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         [MODE 1: ADVANCED MICROSERVICE]                  [MODE 2: RESILIENT LOCAL FALLBACK]
         (Docker / MeghRaj Cluster)                       (Client-Side / Firebase Emulated)
  ┌─────────────────────────────────────────┐      ┌─────────────────────────────────────────┐
  │ • FastAPI Analytics Engine (:8000)      │      │ • Client-side 3-stage heuristic tree    │
  │ • Celery Worker + Redis Queue           │      │ • unpdf + Tesseract.js (in-browser)     │
  │ • PostgreSQL 17 + pgvector (:5432)      │      │ • Static synthetic regression tables    │
  │ • MinIO S3 Object Storage (:9000)       │      │ • Standard Firebase Auth & Firestore    │
  │ • Elasticsearch Bilingual Search (:9200)│      │ • Browser Web Speech API fallback       │
  │ • MLflow Model Registry (:5001)         │      │ • In-memory mock vector search          │
  │ • MeitY Project Bhashini Cloud API      │      │ • Client-side Bhashini mock service     │
  └─────────────────────────────────────────┘      └─────────────────────────────────────────┘
```

### The Transition Principle: "Advance with a Safety Net"
1. **Never break existing user journeys**: Every UI screen (`/dashboard`, `/skill-gap`, `/assignments`, `/mcq-generator`, `/documents`, `/pathways`, `/profile`) continues to work uninterrupted.
2. **Dynamic service discovery & auto-fallback**: If a backend service is offline, the Next.js service layer detects failure within **1,500ms** and routes through the existing client-side logic.
3. **Additive database migrations**: New PostgreSQL tables mirror existing Firestore structures, enabling gradual dual-write migration before Firebase dependencies are retired.
4. **Resolve merge conflicts first**: The repo currently has unresolved git merge conflict markers in 9 files. These **must be resolved before any implementation task begins**. See [Section 2.3](#23-git-merge-conflict-resolution-immediate-pre-requisite).

---

## SECTION 1: The Human Developer's Playbook (Manual Setup & Prerequisites)

> **Important**: This section is written specifically for you as the project developer. It provides beginner-friendly, step-by-step instructions to set up the infrastructure and external services on macOS (Apple Silicon / Intel).

---

### 1.1 Docker Desktop & Container Engine Setup

Docker is the foundation that runs PostgreSQL, Redis, MinIO, Elasticsearch, MLflow, and Celery workers locally without polluting your machine.

#### Step-by-Step Installation
1. **Download Docker Desktop**:
   - Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/).
   - Select **"Apple Silicon"** (M1/M2/M3/M4) or **"Intel Chip"**.
   - Open the downloaded `.dmg` and drag Docker into `Applications`.
2. **Launch & Complete Initial Setup**:
   - Open Docker from Applications. Accept the service agreement.
   - Choose recommended settings (Install privileged helper components).
3. **Optimize Resource Allocation**:
   - Click the **Gear icon (Settings)**.
   - Navigate to **Resources**:
     - **CPUs**: At least **4 cores**.
     - **Memory (RAM)**: At least **8 GB** (Elasticsearch requires ≥ 4 GB alone).
     - **Virtual disk limit**: At least **40 GB** (ML model weights & DB data grow fast).
   - Navigate to **General**: Ensure **"Use VirtioFS"** is checked (10× faster macOS file sync).
   - Click **Apply & restart**.
4. **Verify in Terminal**:
   ```bash
   docker --version
   # Expected: Docker version 26.x or newer

   docker compose version
   # Expected: Docker Compose version v2.x or newer
   ```

> **⚠️ Elasticsearch RAM requirement**: Elasticsearch 8 allocates **1 GB JVM heap by default**. If Docker containers keep OOM-crashing, add `ES_JAVA_OPTS: "-Xms512m -Xmx1g"` to the Elasticsearch service in `docker-compose.yml` and increase Docker RAM allocation to 10 GB.

---

### 1.2 Kubernetes Local Cluster Setup (Beginner Friendly)

For NIC MeghRaj sovereign deployment, applications run as Kubernetes Pods. Docker Desktop provides a free single-node Kubernetes cluster for local development and testing.

#### Step-by-Step Enablement
1. Open **Docker Desktop Settings (Gear Icon)**.
2. Click the **Kubernetes** tab in the left sidebar.
3. Check the box **"Enable Kubernetes"**.
4. Leave "Show system containers" unchecked.
5. Click **Apply & restart**. Wait 2–3 minutes until the Kubernetes indicator in the bottom-left turns **green**.
6. **Install CLI tools via Homebrew**:
   ```bash
   # Install kubectl (K8s CLI) and helm (K8s package manager)
   brew install kubectl helm

   # Verify cluster connection
   kubectl cluster-info
   # Expected: Kubernetes control plane is running at https://kubernetes.docker.internal:6443

   kubectl get nodes
   # Expected: docker-desktop   Ready   control-plane   ...

   # Set the active context to Docker Desktop (in case multiple clusters exist)
   kubectl config use-context docker-desktop
   ```
   > **Pro Tip**: If you ever want to reset the local cluster, click **"Reset Kubernetes Cluster"** in Docker Desktop → Kubernetes settings.

---

### 1.3 Python 3.12 Analytics Microservice Environment

All heavy compute (LightGBM regression, IRT adaptive scoring, PyMuPDF, spaCy NER, Celery workers) runs in `services/analytics-engine/`, isolated from the Next.js app.

#### Step-by-Step Setup
1. **Check or Install Python 3.12**:
   ```bash
   python3 --version
   # If below 3.12, install:
   brew install python@3.12
   # Then ensure it is on PATH:
   echo 'export PATH="/opt/homebrew/opt/python@3.12/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   python3.12 --version   # Should output Python 3.12.x
   ```
2. **Create the Microservice Directory & Virtual Environment**:
   ```bash
   cd "/Users/vamsikrishna/Dev Projects/i proj/SiH"
   mkdir -p services/analytics-engine/tests
   cd services/analytics-engine
   python3.12 -m venv venv
   source venv/bin/activate
   # Your terminal prompt now shows (venv)
   ```
3. **Install Tesseract 5 system dependency (required by OCR engine)**:
   ```bash
   brew install tesseract tesseract-lang
   # Verify it installed the hin+eng language packs
   tesseract --list-langs | grep -E "hin|eng"
   # Expected output includes: eng, hin
   ```
4. **Install core Python dependencies** (once `requirements.txt` is created in Task A2):
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   # Download spaCy English model (used as base for fine-tuned NER)
   python -m spacy download en_core_web_sm
   ```
5. **Deactivate when done**:
   ```bash
   deactivate
   ```

---

### 1.4 Government DPI & External Service Onboarding

#### Project Bhashini (MeitY / NLTM)
- **What it is**: MeitY's AI platform for free Automatic Speech Recognition (ASR), Neural Machine Translation (NMT), and Text-to-Speech (TTS) across 22 Indian languages.
- **Registration**:
  1. Visit [bhashini.gov.in](https://bhashini.gov.in/) or the developer portal at [bhashini.gov.in/api](https://bhashini.gov.in/api).
  2. Register under **"Research & Hackathon / Startup"** tier.
  3. Obtain: `BHASHINI_USER_ID`, `BHASHINI_API_KEY`, `BHASHINI_PIPELINE_ID`.
- **Fallback / Mock Mode**: `BhashiniMockService` (implemented in Task B7) uses the browser's native `window.SpeechRecognition` API and local Hindi word lists. You can develop and demo without credentials.

#### DigiLocker Issuer Sandbox
- **What it is**: National Digital Locker for cryptographically signed government credentials.
- **Registration**:
  1. Access the [DigiLocker Partner Portal](https://partners.digitallocker.gov.in/).
  2. Register as an "Issuer" under the Sandbox/Demo tier.
  3. Obtain: `DIGILOCKER_ISSUER_ID`, `DIGILOCKER_API_KEY`, and generate an Ed25519 PEM private key for signing (`DIGILOCKER_SIGNING_KEY`).
- **Fallback / Mock Mode**: Generates fully compliant W3C Verifiable Credential JSON-LD files locally, signed with a local dev key, downloadable as `.jsonld` with a QR code.

#### Jan-Parichay / MeriPehchaan (OIDC SSO)
- **What it is**: NIC's National Single Sign-On gateway for government portals.
- **OIDC Authorization Code Flow**:
  1. Client redirects user to `https://accounts.india.gov.in/authorize?client_id=...`
  2. User authenticates with Parichay credentials.
  3. Parichay redirects to `http://localhost:3000/api/auth/parichay/callback` with an authorization code.
  4. Next.js backend (`/api/auth/parichay/callback`) exchanges code for `id_token`.
  5. JWT is verified; government claims (`ministry_code`, `cadre`, `designation`, `employee_id`) are extracted and a user session is created.
- **Demo Mode**: Built-in Parichay Simulator reads from `demoPersonas.ts` and synthesizes valid OIDC claims.

#### ISRO Bhuvan Satellite WMS
- **What it is**: ISRO's free geo-platform for high-resolution satellite imagery of India.
- **Endpoint**: `https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms`
- **Layers used**: `bhuvan:satellite`, `bhuvan:district_boundary`
- **Access**: No API keys required for standard WMS tile requests. Leaflet/MapLibre connect directly.
- **Caveat**: CORS restrictions apply. WMS calls must be proxied through a Next.js API route (`/api/maps/bhuvan`) or use a server-side tile proxy to avoid browser CORS errors.

#### AI Models (Gemini Flash & Groq Fallback)
1. **Google Gemini Flash 2.0 (Primary LLM)**:
   - Visit [aistudio.google.com](https://aistudio.google.com/).
   - Click **Get API key** → Create a key in a Google Cloud project.
   - Save as `GEMINI_API_KEY`.
   - **Rate limit note**: Gemini Flash free tier is 15 RPM / 1,500 RPD. For batch MCQ generation, add exponential backoff retry logic in `mcqService.ts`.
2. **Groq (Llama 3.3 70B Fallback)**:
   - Visit [console.groq.com](https://console.groq.com/).
   - Click **API Keys** → **Create API Key**.
   - Save as `GROQ_API_KEY`.

#### MLflow Model Registry (Local)
- MLflow runs locally at `http://localhost:5001`. Add it to `docker-compose.yml` as a service (image: `ghcr.io/mlflow/mlflow:latest`) with a volume for artifact storage. No external credentials required.

---

### 1.5 Master Environment Variables (`.env.local`)

Create or update `.env.local` in the **project root** with the following. Variables marked `# REQUIRED` will cause runtime errors if absent. Variables marked `# LEAVE EMPTY → triggers fallback` enable local development without live credentials.

```bash
# =============================================================================
# STATVIDYA ENTERPRISE ENVIRONMENT CONFIGURATION
# =============================================================================

# --- 1. CORE NEXT.JS ---
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_ENV="development"           # "development" | "staging" | "production"
NEXT_PUBLIC_DEFAULT_LOCALE="en"

# --- 2. FASTAPI ANALYTICS MICROSERVICE BRIDGE ---
# Used by Next.js route handlers to proxy to FastAPI
NEXT_PUBLIC_ANALYTICS_SERVICE_URL="http://localhost:8000"
ANALYTICS_SERVICE_INTERNAL_URL="http://analytics:8000"  # Docker internal name
ANALYTICS_API_SECRET="statvidya_local_dev_secret_key_2026"  # REQUIRED in prod

# --- 3. SOVEREIGN STORAGE (MinIO S3 Compatible) ---
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ROOT_USER="statvidya_admin"           # REQUIRED
MINIO_ROOT_PASSWORD="statvidya_secure_minio_password_2026"  # REQUIRED — change in prod
MINIO_BUCKET_MANUALS="statvidya-manuals"
MINIO_BUCKET_VIDEOS="statvidya-training-videos"
MINIO_BUCKET_CERTS="statvidya-certificates"
MINIO_PUBLIC_URL="http://localhost:9000"

# --- 4. RELATIONAL & VECTOR DATABASE (PostgreSQL + pgvector) ---
DATABASE_URL="postgresql://statvidya_user:statvidya_secure_pg_pass_2026@localhost:5432/statvidya_db"
POSTGRES_DB="statvidya_db"
POSTGRES_USER="statvidya_user"              # REQUIRED
POSTGRES_PASSWORD="statvidya_secure_pg_pass_2026"  # REQUIRED — change in prod
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"

# --- 5. ASYNC TASK QUEUE (Redis & Celery) ---
REDIS_URL="redis://localhost:6379/0"
CELERY_BROKER_URL="redis://localhost:6379/0"
CELERY_RESULT_BACKEND="redis://localhost:6379/1"  # Use DB 1 to separate from broker

# --- 6. BILINGUAL SEARCH & DEDUPLICATION (Elasticsearch) ---
ELASTICSEARCH_URL="http://localhost:9200"
ELASTICSEARCH_QUESTIONS_INDEX="statvidya_question_bank"
ELASTICSEARCH_DOCS_INDEX="statvidya_documents"

# --- 7. GOVERNMENT DPI INTEGRATIONS ---

# Project Bhashini (Speech & Translation)
BHASHINI_USER_ID=""                         # LEAVE EMPTY → triggers browser Web Speech API fallback
BHASHINI_API_KEY=""                         # LEAVE EMPTY → triggers fallback
BHASHINI_PIPELINE_ID=""
NEXT_PUBLIC_BHASHINI_ENABLED="false"        # Set "true" once keys are added

# DigiLocker Verifiable Credentials
DIGILOCKER_ISSUER_ID="NSSTA-HACKATHON-2026"
DIGILOCKER_API_KEY=""                       # LEAVE EMPTY → triggers local signed JSON-LD generator
DIGILOCKER_SIGNING_KEY=""                   # PEM private key (base64-encoded for env safety)
DIGILOCKER_SANDBOX_MODE="true"

# Jan-Parichay / MeriPehchaan (OIDC SSO)
PARICHAY_CLIENT_ID="statvidya_sih_client"
PARICHAY_CLIENT_SECRET="statvidya_parichay_secret_dev"
PARICHAY_ISSUER_URL="https://accounts.india.gov.in"
PARICHAY_AUTH_URL="https://accounts.india.gov.in/authorize"
PARICHAY_TOKEN_URL="https://accounts.india.gov.in/token"
PARICHAY_REDIRECT_URI="http://localhost:3000/api/auth/parichay/callback"
PARICHAY_SIMULATOR_ENABLED="true"           # Set "false" when using real credentials

# ISRO Bhuvan Geo-Services (no key required, but CORS proxy needed)
NEXT_PUBLIC_BHUVAN_WMS_PROXY_URL="/api/maps/bhuvan"  # Next.js proxy route to avoid browser CORS

# --- 8. AI & LARGE LANGUAGE MODELS ---
GEMINI_API_KEY=""                           # Google AI Studio — LEAVE EMPTY → Groq takes over
GROQ_API_KEY=""                             # Groq Llama 3.3 70B — REQUIRED for MCQ generation
MLFLOW_TRACKING_URI="http://localhost:5001"

# --- 9. LEGACY FIREBASE (PARALLEL RUN / TRANSITION) ---
NEXT_PUBLIC_FIREBASE_API_KEY=""             # REQUIRED — existing Firebase keys from .env
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID="statvidya-sih"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

> **Security note**: `.env.local` is git-ignored. Never commit credentials. For production, inject all secrets via Kubernetes Secrets or NIC MeghRaj's Vault service.

---

## SECTION 2: AI Agent Execution Protocol & Engineering Rules

> **Instructions for AI Agents**: When implementing any task from this plan in a subsequent session, you must adhere strictly to these contracts without exception.

---

### 2.1 The 5 Inviolable Migration Laws

1. **Never Break `npm run build` or `npm test`**: Before closing any task, execute `npm run build && npm test`. Do not leave broken imports, unresolved TypeScript errors, or missing type definitions. The test output in this session showed **220 tests passing** — all must continue to pass.
2. **Dual-Mode Graceful Fallback**: Every service bridge (`pgvectorClient.ts`, `bhashiniService.ts`, `analyticsService.ts`, `minioClient.ts`) must wrap all network calls in the `executeWithFallback` helper (see §2.2). A 1,500ms timeout triggers fallback automatically.
3. **No Decorative Placeholders**: Never insert `TODO: implement later` or `throw new Error("Not implemented")`. Provide production-grade logic with working mock/local algorithmic fallbacks.
4. **Follow Next.js 16 & React 19 Conventions**: Check `node_modules/next/dist/docs/` before writing any Next.js code (per `AGENTS.md` rule). Use `"use client"` only on components requiring browser APIs or React hooks. Route handlers (`route.ts`) must be server-only.
5. **Preserve Mission Karmayogi FRAC Standards**: Maintain the 5 proficiency levels (L1–L5), cadres (FOD, SSS, ISS, NSSTA), and all existing competency IDs (`comp-capi`, `comp-demarcation`, `comp-survey`, `comp-scrutiny`).

### 2.2 Dual-Mode Fallback Pattern (Code Contract)

Place this utility in `src/lib/serviceUtils.ts`. Every upgraded service bridge must import and use it:

```typescript
// src/lib/serviceUtils.ts
/**
 * executeWithFallback — Universal resilient service bridge for dual-mode architecture.
 * Attempts the remote action; if it fails or times out in 1,500ms, invokes the local fallback.
 * Logs all fallback activations with the service name for monitoring purposes.
 */
export async function executeWithFallback<T>(
  remoteAction: () => Promise<T>,
  localFallback: () => Promise<T> | T,
  serviceName: string,
  timeoutMs: number = 1500
): Promise<T> {
  try {
    const result = await Promise.race([
      remoteAction(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`${serviceName} timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
    return result;
  } catch (error) {
    console.warn(
      `[StatVidya Fallback] ${serviceName} unavailable: ${(error as Error).message}. Routing to local fallback.`
    );
    return await localFallback();
  }
}

/** Type-safe environment variable reader that also works in both client & server contexts */
export function getServiceUrl(envKey: string, fallback: string): string {
  const val = (typeof window === 'undefined'
    ? process.env[envKey]
    : (window as Record<string, unknown>)[envKey] as string | undefined
  ) ?? process.env[envKey];
  return val ?? fallback;
}
```

---

### 2.3 Git Merge Conflict Resolution (Immediate Pre-Requisite)

> **⚠️ BLOCKER — Must be resolved before any implementation task.**

The repository is currently in a merge conflict state on branch `flow-currections`. Nine files contain unresolved `<<<<<<<`/`=======`/`>>>>>>>` markers that prevent `npm run build` and break 3 test suites.

**Affected files** (verified by grep scan):
1. `src/components/dashboard/learner/LearnerDashboard.tsx` (3 conflict blocks)
2. `src/components/layout/Topbar.tsx` (2 conflict blocks)
3. `src/components/copilot/CopilotPanel.tsx` (2 conflict blocks)
4. `src/components/mcq/DocumentPracticeCard.tsx` (1 conflict block)
5. `src/app/(app)/pathways/PathwaysClient.tsx` (3 conflict blocks)
6. `src/app/(app)/profile/ProfileClient.tsx` (9 conflict blocks)
7. `src/app/(app)/skill-gap/SkillGapClient.tsx` (3 conflict blocks)
8. `src/app/(app)/mcq-generator/page.tsx` (4 conflict blocks)
9. `src/app/(app)/assessment/[id]/AssessmentClient.tsx` (needs inspection)

**Resolution strategy**: The `origin/master` side introduced `useSafeLocale` (already created as `src/lib/useSafeLocale.ts`) to replace `useLocale()` calls from `next-intl` (which was crashing in some contexts). The correct resolution for all conflicts is to **accept the `origin/master` (incoming) changes** — they represent the more stable version with the safe locale hook.

**Commands**:
```bash
# Option 1: Accept all incoming (origin/master) changes for all 9 conflict files
git checkout --theirs src/components/dashboard/learner/LearnerDashboard.tsx
git checkout --theirs src/components/layout/Topbar.tsx
git checkout --theirs src/components/copilot/CopilotPanel.tsx
git checkout --theirs src/components/mcq/DocumentPracticeCard.tsx
git checkout --theirs "src/app/(app)/pathways/PathwaysClient.tsx"
git checkout --theirs "src/app/(app)/profile/ProfileClient.tsx"
git checkout --theirs "src/app/(app)/skill-gap/SkillGapClient.tsx"
git checkout --theirs "src/app/(app)/mcq-generator/page.tsx"
git checkout --theirs "src/app/(app)/assessment/[id]/AssessmentClient.tsx"

# Stage and commit
git add -A
git commit -m "fix: resolve merge conflicts — adopt useSafeLocale from origin/master"

# Verify all tests pass
npm test
```

---

## SECTION 3: Complete Step-by-Step Execution Plan (Tasks A1 through D6)

---

### PHASE A: Core Intelligence Upgrade & Statistical Brain

**Phase Goal**: Replace all mock data and fragile heuristics with live, scientifically sound, adaptive engines.
**Execution order**: A1 → A2 → A8 (A3/A4/A5/A6/A7/A9 can proceed in parallel once A1+A2 are done).

---

#### Task A1: Containerized Foundation (`docker-compose.yml`)

- **Status prerequisite**: Git conflicts must be resolved (§2.3).
- **Files to Create**:
  - `docker-compose.yml` (project root)
  - `docker/postgres/init-pgvector.sql`
  - `docker/elasticsearch/index-templates.json` ← also used by Task B6
- **Purpose**: Single command to launch all backing services locally.
- **Key Service Specifications**:

| Service | Image | Ports | Notes |
| :--- | :--- | :--- | :--- |
| `postgres` | `pgvector/pgvector:pg17` | `5432:5432` | `init-pgvector.sql` runs `CREATE EXTENSION IF NOT EXISTS vector;` on first boot |
| `redis` | `redis:7-alpine` | `6379:6379` | Used as Celery broker (DB 0) and result backend (DB 1) |
| `minio` | `minio/minio:latest` | `9000:9000`, `9001:9001` | Command: `server /data --console-address ":9001"` |
| `elasticsearch` | `elasticsearch:8.15.0` | `9200:9200` | Env: `discovery.type=single-node`, `xpack.security.enabled=false`, `ES_JAVA_OPTS: "-Xms512m -Xmx1g"` |
| `mlflow` | `ghcr.io/mlflow/mlflow:latest` | `5001:5000` | Command: `mlflow server --host 0.0.0.0 --port 5000 --default-artifact-root /mlflow/artifacts` |

- **`init-pgvector.sql` content**:
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;

  CREATE TABLE IF NOT EXISTS document_chunks (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id VARCHAR(255) NOT NULL,
    page_number INT NOT NULL,
    section_title TEXT,
    chunk_text  TEXT NOT NULL,
    embedding   VECTOR(384),      -- all-MiniLM-L6-v2 dimension (384, not 768)
    provenance  TEXT DEFAULT 'UPLOADED_MANUAL',
    created_at  TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
    ON document_chunks USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

  CREATE TABLE IF NOT EXISTS competency_records (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    official_id     VARCHAR(255) NOT NULL,
    competency_id   VARCHAR(255) NOT NULL,
    theta           FLOAT NOT NULL,
    standard_error  FLOAT NOT NULL,
    evidence_type   VARCHAR(50) DEFAULT 'SELF_REPORTED',  -- 'IRT_VERIFIED' | 'SELF_REPORTED'
    assessed_at     TIMESTAMP NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS outcome_events (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    official_id     VARCHAR(255) NOT NULL,
    event_type      VARCHAR(50) NOT NULL,  -- 'gap_detected' | 'course_enrolled' | 'course_completed' | 'reassessment'
    competency_id   VARCHAR(255),
    course_id       VARCHAR(255),
    theta_before    FLOAT,
    theta_after     FLOAT,
    delta_theta     FLOAT,
    metadata        JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
  );
  ```

- **Verification**: `docker compose up -d && docker ps` — all 5 containers show `healthy` or `running`.

---

#### Task A2: FastAPI Analytics Microservice Core

- **Depends on**: A1 (containers running).
- **Files to Create**:
  - `services/analytics-engine/main.py`
  - `services/analytics-engine/requirements.txt`
  - `services/analytics-engine/Dockerfile`
  - `services/analytics-engine/__init__.py`
  - `services/analytics-engine/routers/__init__.py`
  - `services/analytics-engine/routers/health.py`
  - `services/analytics-engine/config.py` ← reads env vars centrally
  - `services/analytics-engine/tests/__init__.py`
  - `services/analytics-engine/tests/test_health.py`
- **Purpose**: Establishes the Python ASGI backend. All other Python tasks (A3–A7, B2–B5) add routers/modules to this app.
- **`requirements.txt` contents**:
  ```
  fastapi==0.115.0
  uvicorn[standard]==0.32.0
  pydantic==2.9.2
  pydantic-settings==2.5.2
  numpy==2.1.2
  scipy==1.14.1
  scikit-learn==1.5.2
  lightgbm==4.5.0
  celery==5.4.0
  redis==5.1.1
  pymupdf==1.24.11
  opencv-python-headless==4.10.0.84
  spacy==3.8.2
  sentence-transformers==3.1.1
  psycopg2-binary==2.9.10
  pgvector==0.3.5
  minio==7.2.10
  elasticsearch==8.15.1
  mlflow==2.17.0
  pytest==8.3.3
  httpx==0.27.2
  ```
- **Key API Contracts**:
  ```
  GET  /health                              → Service status, DB connectivity, ML model availability
  POST /api/v1/assessment/next-question     → IRT: return next question ID and current θ estimate
  POST /api/v1/assessment/finalize          → IRT: compute final level + SE
  POST /api/v1/analytics/correlate-scrutiny → Live OLS+LightGBM regression
  POST /api/v1/analytics/gap-score          → Bayesian evidence-weighted gap computation
  POST /api/v1/recommendations/rank         → Multi-signal LightGBM course ranker
  POST /api/v1/documents/process-async      → Enqueue PDF to Celery; return job_id
  GET  /api/v1/documents/status/{job_id}    → Poll: PENDING→EXTRACTING→CHUNKED→EMBEDDED→DONE
  POST /api/v1/nlp/extract-entities         → spaCy NER tags for uploaded text
  POST /api/v1/outcomes/log-event           → Log outcome event to PostgreSQL
  GET  /api/v1/outcomes/attribution         → Course effectiveness leaderboard (Δθ per course)
  ```
- **Auth**: All `/api/v1/*` routes require `Authorization: Bearer <ANALYTICS_API_SECRET>` header, validated via FastAPI dependency.
- **Verification**: `cd services/analytics-engine && source venv/bin/activate && uvicorn main:app --port 8000 --reload` then `curl http://localhost:8000/health`.

---

#### Task A3: 2-Parameter Logistic (2PL) IRT Adaptive Assessment Engine

- **Depends on**: A2.
- **Files to Create**:
  - `services/analytics-engine/ml/__init__.py`
  - `services/analytics-engine/ml/irt_model.py`
  - `services/analytics-engine/routers/assessment.py`
  - `services/analytics-engine/tests/test_irt_model.py`
- **Files to Modify**:
  - `src/services/assessmentService.ts` ← replace `nextStage()` state machine with IRT API calls
  - `src/services/assessmentEngine.ts` ← update scoring to use continuous `θ` from API
- **Purpose**: Replace the fragile 3-question binary decision tree with continuous ability estimation.
- **Algorithm Specifications**:
  - **Item Response Function**:
    ```
    P(correct | θ) = 1 / (1 + exp(-a * (θ - b)))
    ```
    Where `a ∈ [0.5, 2.5]` is item discrimination and `b ∈ [-3.0, +3.0]` is difficulty (calibrated per question in `adaptiveQuestionBank.ts`).
  - **Maximum Fisher Information** question selection:
    ```
    I(θ) = a² × P(θ) × (1 - P(θ))
    ```
    Always select the unanswered question with the highest `I(θ)` at the current estimate.
  - **Stopping Criteria**: Stop when `SE(θ) < 0.30` (94% confidence) or `question_count ≥ 15`.
  - **Level Mapping**:
    ```
    θ < -2.0  → L1 | -2.0 ≤ θ < -0.5 → L2 | -0.5 ≤ θ < 1.0 → L3
    1.0 ≤ θ < 2.5 → L4 | θ ≥ 2.5 → L5
    ```
  - **MLE Update**: Newton-Raphson optimization after each answer.
- **`adaptiveQuestionBank.ts` extension**: Each question must have `irt_a: number` (discrimination) and `irt_b: number` (difficulty) fields added alongside existing fields.
- **Correct API route**: The assessment submit event triggers at `src/app/api/assessment/sync/route.ts` (not `assessments/submit/route.ts`).
- **Dual-Mode Contract**: `assessmentService.ts` checks `NEXT_PUBLIC_ANALYTICS_SERVICE_URL` availability; if offline within 1,500ms, falls back to the existing 3-stage deterministic tree.

---

#### Task A4: Bayesian Evidence-Weighted Gap Scoring & Priority Readiness

- **Depends on**: A3 (IRT θ values must be available before weighting).
- **Files to Modify**:
  - `src/services/competencyService.ts` ← upgrade `computeGapSeverity()` and `computeReadinessIndex()`
  - `src/components/dashboard/learner/PriorityGapsCard.tsx` ← add evidence badge
  - `src/components/dashboard/learner/LearnerHeroBento.tsx` ← weighted readiness ring
- **Files to Create**:
  - `services/analytics-engine/routers/analytics.py` (gap-score endpoint)
- **Mathematical Formula**:
  ```
  WeightedGapScore = max(0, targetLevel - θ̂) × W_priority × W_evidence × Δ_decay

  W_priority:  { critical: 3, important: 2, desirable: 1 }  [unchanged from current code]
  W_evidence:  1.00  IRT-verified < 30 days
               0.85  IRT-verified 30–90 days
               0.65  IRT-verified > 90 days
               0.50  Self-assessed during onboarding
               0.30  Never assessed (default)
  Δ_decay:     exp(-λ × days_since_assessment / 180)  where λ = 0.35
  ```
- **Upgraded Priority-Weighted Readiness Index**:
  ```
  WeightedReadiness = Σ(min(θ̂ᵢ, targetᵢ) × W_priority_i × W_evidence_i)
                      ─────────────────────────────────────────────────────
                      Σ(targetᵢ × W_priority_i)
  ```
- **UI Changes**:
  - `PriorityGapsCard.tsx`: Adds badge `🛡️ IRT-Verified` vs `✍️ Self-Reported` with `evidenceWeight` displayed.
  - `LearnerHeroBento.tsx`: Readiness ring shows `WeightedReadiness%` instead of simple `metCount / total`.

---

#### Task A5: Multi-Signal LightGBM Recommendation Engine + Collaborative Filter

- **Depends on**: A4 (gap scores), A8 (pgvector for semantic signal).
- **Files to Create**:
  - `services/analytics-engine/ml/recommendation_engine.py`
  - `services/analytics-engine/ml/collaborative_filter.py`
  - `services/analytics-engine/routers/recommendations.py`
  - `services/analytics-engine/tests/test_recommendation_engine.py`
- **Files to Modify**:
  - `src/services/recommendationService.ts` ← replace static rule ranker with FastAPI call + enhanced local fallback
- **Combined Scoring**:
  ```
  FinalScore = 0.50 × S_gap + 0.30 × S_collab + 0.20 × S_semantic
  ```
  - `S_gap`: Bayesian-weighted gap coverage (from A4)
  - `S_collab`: Truncated SVD matrix factorization on `(cadre, division, course_id, delta_theta)` outcome matrix
  - `S_semantic`: Cosine similarity between gap embedding and course curriculum embedding (pgvector)
- **Prerequisite/Difficulty Gate**: Only surface `FOUNDATIONAL` courses when gap > 2 levels, `APPLIED` when 1–2, `CAPSTONE` when < 1.
- **Explainability string format**:
  ```
  "Bridges your L2→L4 gap in Boundary Demarcation (IRT-verified).
   78% of JSOs in FOD Maharashtra found this effective (avg. +1.3 levels in 32 days)."
  ```
- **Fallback**: If FastAPI offline, `recommendationService.ts` falls back to the enhanced 5-course local catalog using existing `SEVERITY_WEIGHTS` formula.

---

#### Task A6: Closed-Loop Outcome Attribution Pipeline & MLflow Tracking

- **Depends on**: A2, A3 (IRT θ before and after).
- **Files to Create**:
  - `services/analytics-engine/ml/outcome_attributor.py`
  - `src/components/dashboard/admin/AdminOutcomeAttributionPanel.tsx`
- **Files to Modify**:
  - `src/app/api/assessment/sync/route.ts` ← correct path (NOT `assessments/submit`); add outcome event logging after sync
- **Event pipeline**:
  ```
  Assessment synced → query previous θ from competency_records →
  compute Δθ → attribute to last completed course →
  POST /api/v1/outcomes/log-event →
  MLflow logs run to 'statvidya_course_effectiveness' experiment →
  Weekly Celery scheduled task retrains collaborative filter (Signal B in A5)
  ```
- **Admin Dashboard Panel**: Table columns: `Course Title | Avg Δθ | Avg Days to Improvement | Sample Size`. Sorted by descending `Avg Δθ`.

---

#### Task A7: Live Statistical Scrutiny Correlation Engine (Replacing Mock Data)

- **Depends on**: A2 (FastAPI core), A8 (competency_records table in PostgreSQL).
- **Files to Create**:
  - `services/analytics-engine/ml/regression.py`
- **Files to Modify**:
  - `services/analytics-engine/routers/analytics.py` ← add `correlate-scrutiny` endpoint
  - `src/data/surveyScrutinyMetrics.ts` ← convert `SYNTHETIC_DEMO_DATA` → live fetch with NSS 78th Round empirical seed fallback
  - `src/components/dashboard/admin/OutcomeCorrelationChart.tsx` ← consume live API data
- **Endpoint behavior**:
  - If `competency_records` table has ≥ 10 rows: run OLS regression on real data, return live `slope`, `p_value`, `r_squared`, `ci_lower`, `ci_upper`.
  - If < 10 rows: return empirical NSS 78th Round seed values (same as current `SYNTHETIC_DEMO_DATA`) but set `provenance: "EMPIRICAL_NSS78_BOOTSTRAP"` instead of `"SYNTHETIC_DEMO_DATA"`.
- **Provenance tracking**: `surveyScrutinyMetrics.ts` must expose the `provenance` field in the chart so MoSPI evaluators can see the data source clearly.

---

#### Task A8: PostgreSQL + pgvector Semantic Knowledge Base

- **Depends on**: A1 (postgres container running with `init-pgvector.sql`).
- **Files to Create**:
  - `src/lib/db/pgvectorClient.ts`
  - `services/analytics-engine/db/schema.sql` ← mirrors `init-pgvector.sql` for reference
- **Files to Modify**:
  - `src/lib/copilotPrompt.ts` ← replace 20KB static string with dynamic chunk injection
  - `src/services/mcqService.ts` ← add RAG context retrieval before LLM call
- **Correct embedding dimension**: Use **384** (not 768). `all-MiniLM-L6-v2` outputs 384 dimensions. Ensure `VECTOR(384)` in schema.
- **`pgvectorClient.ts` interface**:
  ```typescript
  export interface DocumentChunk {
    id: string;
    document_id: string;
    page_number: number;
    section_title: string | null;
    chunk_text: string;
    provenance: string;
  }

  export async function semanticSearch(
    query: string,
    topK: number = 3,
    documentId?: string   // optional filter to a specific uploaded manual
  ): Promise<DocumentChunk[]>

  export async function upsertChunk(chunk: Omit<DocumentChunk, 'id'>, embedding: number[]): Promise<void>
  ```
- **Dual-mode**: If PostgreSQL is unreachable, falls back to scanning in-memory `FRAC_KNOWLEDGE_BASE` array in `copilotPrompt.ts`.

---

#### Task A9: Client-Side Offline Semantic Search (ONNX Runtime Web / WASM)

- **Depends on**: A8 (pgvector stores chunks that are also cached locally).
- **Files to Create**:
  - `src/lib/wasm/semanticSearch.ts`
  - `src/lib/wasm/modelLoader.ts` ← handles one-time ONNX model download + IndexedDB caching
- **Purpose**: Field investigators in zero-connectivity zones can search MoSPI manuals via semantic query inside the PWA.
- **Implementation**:
  - Downloads quantized `all-MiniLM-L6-v2` ONNX model (~23MB) to CacheStorage on first connectivity.
  - Runs tokenizer + embedding in a **Web Worker** (not main thread) to avoid UI blocking.
  - Computes cosine similarity against document chunks cached in IndexedDB `offline_document_chunks` store.
  - Target latency: < 15ms per query on a mid-range Android tablet.
- **npm packages required**: `npm install onnxruntime-web @xenova/transformers`

---

### PHASE B: Document Processing, Sovereign Storage & Bilingual AI

**Phase Goal**: Eliminate browser-blocking OCR, add sovereign storage, enable bilingual workflows.
**Execution order**: B1 must precede B2. B3 and B4 are sub-steps of B2. B5 and B6 can run in parallel. B7 and B8 are independent.

---

#### Task B1: MinIO Sovereign Object Storage Integration

- **Depends on**: A1 (MinIO container running).
- **Files to Create**:
  - `src/lib/storage/minioClient.ts`
  - `scripts/setup-minio-buckets.sh`
- **Purpose**: Replaces Firebase Storage with sovereign, zero-egress-fee S3-compatible storage.
- **`minioClient.ts` interface**:
  ```typescript
  export async function generatePresignedUploadUrl(
    bucket: string, filename: string, mimeType: string, expirySeconds?: number
  ): Promise<string>

  export async function getDownloadUrl(bucket: string, objectKey: string): Promise<string>

  export async function deleteObject(bucket: string, objectKey: string): Promise<void>

  export async function listObjects(bucket: string, prefix?: string): Promise<string[]>
  ```
- **`setup-minio-buckets.sh`** runs on first-time setup to create the 3 required buckets: `statvidya-manuals`, `statvidya-training-videos`, `statvidya-certificates`.
- **Dual-mode**: If MinIO is unreachable, falls back to Firebase Storage SDK calls.

---

#### Task B2: Celery Async PDF Extraction Pipeline

- **Depends on**: A2 (FastAPI core), B1 (MinIO for file storage).
- **Files to Create**:
  - `services/analytics-engine/tasks/__init__.py`
  - `services/analytics-engine/tasks/celery_app.py`
  - `services/analytics-engine/tasks/pdf_pipeline.py`
  - `services/analytics-engine/routers/documents.py`
  - `services/analytics-engine/tests/test_pdf_pipeline.py`
- **Purpose**: Moves synchronous browser-blocking PDF parsing to an async background queue.
- **Pipeline stages** (executed by Celery worker):
  1. Download file from MinIO to worker temp storage.
  2. Run PyMuPDF to extract digital text layer and page structure.
  3. Detect tables via OpenCV morphology (Task B3).
  4. If scanned: run Tesseract `hin+eng` OCR (Task B4).
  5. Run spaCy NER tagging on extracted text (Task B5).
  6. Split into 512-token overlapping chunks with 64-token stride.
  7. Generate 384-dim embeddings via SentenceTransformers.
  8. `UPSERT` chunks into PostgreSQL `document_chunks` table (A8 schema).
  9. Publish final status `DONE` to Redis Pub/Sub channel `document:{job_id}`.
- **Real-time status flow**: Next.js SSE route subscribes to `document:{job_id}` Redis channel and streams status updates to `IngestedDocumentsLedger.tsx`.
- **Correct component path**: `src/components/dashboard/trainer/IngestedDocumentsLedger.tsx` (not `src/components/documents/`).

---

#### Task B3: Table-Aware Schedule Parser (OpenCV Morphology + PyMuPDF)

- **Depends on**: B2 (invoked within the pdf_pipeline Celery task).
- **Files to Create**:
  - `services/analytics-engine/nlp/__init__.py`
  - `services/analytics-engine/nlp/table_extractor.py`
- **Purpose**: Preserves row-column structure of NSS survey schedules (Schedule 0.0, 1.0, 10.0, PLFS blocks) during extraction.
- **Pipeline**:
  1. OpenCV: Convert page to grayscale → apply morphological dilation with horizontal kernel (100×1) and vertical kernel (1×100) → find contours.
  2. Classify contours as table cells based on aspect ratio and area.
  3. PyMuPDF: Extract text clipped to each detected cell bounding box.
  4. Reconstruct table as `{"headers": [...], "rows": [[...], ...]}` JSON.
- **Output**: Structured JSON table fed into MCQ generator as formatted context.

---

#### Task B4: Bilingual OCR Engine (Tesseract `hin+eng`)

- **Depends on**: B2 (invoked within the pdf_pipeline Celery task when digital text layer is absent or < 50 chars).
- **Files to Create**:
  - `services/analytics-engine/nlp/ocr_engine.py`
- **Purpose**: Enables extraction from scanned Hindi-language state government circulars and field returns.
- **Implementation**:
  - Preprocessing: `cv2.cvtColor(GRAY)` → Otsu thresholding → `cv2.deskew()` (custom or via `imutils`) → 300 DPI upscale.
  - Tesseract invocation: `pytesseract.image_to_string(img, lang='hin+eng', config='--psm 6')`
  - Returns merged `ExtractionResult` with `method: "ocr_bilingual_tesseract"`.

---

#### Task B5: Domain spaCy Statistical Entity NER Tagger

- **Depends on**: B2 (invoked within the pdf_pipeline task).
- **Files to Create**:
  - `services/analytics-engine/nlp/ner_tagger.py`
  - `services/analytics-engine/nlp/training_data/ner_training_examples.jsonl` ← annotated sentences
- **Purpose**: Auto-tags extracted text to the correct FRAC competency ID based on MoSPI domain entities.
- **Recognized entity types**:
  - `SURVEY_UNIT`: FSU, SSU, Stratum, UFS Block, Hamlet Group, Segment
  - `SCHEDULE_REF`: Schedule 0.0, Schedule 1.0, Schedule 2.1, PLFS, HCES, CES
  - `STAT_CONCEPT`: Multiplier, Substitution, Non-response, Circular Systematic Sampling, Scrutiny Flag
  - `CADRE_ROLE`: JSO, SSO, FOD Field Investigator, Regional Director, NSSO Supervisor
- **Training approach**: Fine-tune `en_core_web_sm` with MoSPI-domain spaCy training examples (30–50 annotated sentences per entity type).

---

#### Task B6: Bilingual Question Deduplication (Elasticsearch 8.x)

- **Depends on**: A1 (Elasticsearch container running), B5 (NER tagging gives competency context).
- **Files to Create**:
  - `src/services/searchService.ts`
  - `docker/elasticsearch/index-templates.json` ← created in A1
- **Purpose**: Prevents question bank bloat; stops trainers from unknowingly adding duplicate MCQs.
- **Index settings**:
  - `icu_analyzer` for Hindi Devanagari tokenization.
  - `asciifolding` + `lowercase` for English normalization.
  - Phonetic `soundex` filter for homophone matching.
- **Deduplication check**: Before publishing any AI-generated question, run fuzzy search against existing bank. Flag items with combined similarity score > 82%.
- **`searchService.ts` interface**:
  ```typescript
  export async function checkDuplicate(questionStem: string, lang: 'en' | 'hi'): Promise<{isDuplicate: boolean; similarQuestions: string[]}>
  export async function indexQuestion(questionId: string, stem: string, competencyId: string): Promise<void>
  export async function searchQuestions(query: string, competencyId?: string): Promise<string[]>
  ```

---

#### Task B7: Project Bhashini Voice & Translation Integration

- **Depends on**: None (fully self-contained with fallback).
- **Files to Create**:
  - `src/services/bhashiniService.ts`
  - `src/components/common/VoiceInputButton.tsx`
- **Files to Modify**:
  - `src/components/copilot/CopilotPanel.tsx` ← add `VoiceInputButton` and translate response if Hindi locale
  - `src/app/(app)/assessment/[id]/test/QuestionPanel.tsx` ← correct path; add TTS button to read question aloud
- **Features**:
  - `VoiceInputButton.tsx`: Records 16kHz WAV audio via `MediaRecorder` → sends to Bhashini ASR → returns Devanagari transcript → populates input field.
  - Translation: After copilot generates English response, if `locale === 'hi'`, call Bhashini NMT to translate.
  - TTS: `BhashiniService.synthesize(text, 'hi')` → returns `AudioBuffer` → plays via Web Audio API.
  - **Fallback chain**: Bhashini API → `window.SpeechRecognition` (Web Speech API) → manual text input (no-op).
- **`bhashiniService.ts` interface**:
  ```typescript
  export class BhashiniService {
    static async transcribeHindi(audioBlob: Blob): Promise<string>
    static async translate(text: string, from: 'en' | 'hi', to: 'en' | 'hi'): Promise<string>
    static async synthesize(text: string, lang: 'hi' | 'en'): Promise<AudioBuffer>
    static isAvailable(): boolean  // checks if BHASHINI_API_KEY is set
  }
  ```

---

#### Task B8: Next.js Document Service Transition & SSE Progress Ledger

- **Depends on**: B1 (MinIO upload), B2 (Celery pipeline), A8 (pgvector store).
- **Files to Modify**:
  - `src/services/textExtractionService.ts` ← add `extractAsync()` method that POSTs to FastAPI; existing `extractText()` becomes the offline fallback
  - `src/services/documentService.ts` ← route uploads through MinIO presigned URL when available
  - `src/components/dashboard/trainer/IngestedDocumentsLedger.tsx` ← correct path; add live SSE status badges
- **SSE Stage Labels** (displayed in the ledger):
  ```
  UPLOADED → EXTRACTING_TABLES → OCR_HIN_ENG → NER_TAGGING → CHUNKING → EMBEDDING_PGVECTOR → INDEXING_ES → READY
  ```
- **Fallback**: Client-side `extractText()` via `unpdf` + `tesseract.js` triggers instantly for files < 5MB when FastAPI is offline, providing immediate (lower-quality) preview.

---

### PHASE C: Visualisation, Government DPI & Sovereign Credentials

**Phase Goal**: Add interactive data visualizations, connect to Indian DPI services, and enable government-grade credentials.
**Execution order**: All Phase C tasks are independent and can run in parallel.

---

#### Task C1: D3.js Zoomable Sunburst FRAC Hierarchy Visualizer

- **Depends on**: None (reads from existing `fracCadres.ts` data).
- **Files to Create**:
  - `src/components/charts/FracSunburstHierarchy.tsx`
- **Files to Modify**:
  - `src/components/dashboard/admin/AdminDashboard.tsx` ← embed `FracSunburstHierarchy`
- **npm packages required**: `npm install d3 @types/d3`
- **Purpose**: Transforms flat FRAC card lists into a multi-level zoomable sunburst with readiness heat-mapping.
- **Interactivity**:
  - Arc width = official headcount in that cadre/role.
  - Color gradient: Dark Crimson (L1 avg readiness) → Bright Emerald (L5 avg readiness) using D3 sequential color scale.
  - Click a segment to zoom into that level; click center ring to zoom out one level.
  - Tooltip: headcount, critical gap count, top recommended course title.
  - Animated `arcTween` transitions on zoom (300ms ease-in-out).

---

#### Task C2: D3.js Live Scrutiny Outcome Correlation Chart

- **Depends on**: A7 (live regression endpoint).
- **Files to Modify**:
  - `src/components/dashboard/admin/OutcomeCorrelationChart.tsx`
- **Visual Elements**:
  - D3 `line` + `area` generators render regression fit line and shaded 95% CI polygon.
  - `d3.transition()` with 400ms duration on series switch.
  - Per-district `tooltip` on hover showing department name, competency level, error rate, and sample size.
  - `provenance` badge in chart footer: shows `🔬 Live Data (n=87)` or `📊 NSS 78th Round Baseline` depending on API response.

---

#### Task C3: Jan-Parichay / MeriPehchaan Real OIDC Authentication Flow

- **Depends on**: None (Firebase Auth remains parallel fallback).
- **Files to Create**:
  - `src/app/api/auth/parichay/route.ts` ← generates authorization URL & redirects
  - `src/app/api/auth/parichay/callback/route.ts` ← exchanges code for id_token, creates session
  - `src/components/auth/ParichayLoginButton.tsx`
- **Files to Modify**:
  - `src/app/(auth)/auth/login/LoginForm.tsx` ← correct path; add `ParichayLoginButton`
- **Correct callback URL path**: `src/app/api/auth/parichay/callback/route.ts` (NOT inside `(auth)` group — it is an API route).
- **JWT Verification**: Verify Parichay `id_token` using NIC's public JWKS endpoint. Extract `sub`, `email`, `ministry_code`, `cadre`, `designation`.
- **Simulator Mode**: When `PARICHAY_SIMULATOR_ENABLED=true`, the callback route returns synthetic claims from `demoPersonas.ts`.

---

#### Task C4: DigiLocker W3C Verifiable Credential Issuance

- **Depends on**: A6 (outcome attribution confirms L4/L5 achievement).
- **Files to Create**:
  - `src/services/digilockerService.ts`
  - `src/components/profile/DigiLockerBadge.tsx`
- **Files to Modify**:
  - `src/app/api/assessment/sync/route.ts` ← correct path; trigger credential issuance when final_level ≥ L4
- **Credential Format** (W3C VC Data Model 2.0):
  ```json
  {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential", "CompetencyCredential"],
    "issuer": "did:web:statvidya.nssta.gov.in",
    "issuanceDate": "2026-09-19T00:00:00Z",
    "credentialSubject": {
      "id": "did:gov:in:<employee_id>",
      "holder_name": "...",
      "cadre": "JSO",
      "competency_name": "Census Boundary Demarcation & Listing",
      "level_achieved": "L4",
      "assessment_date": "2026-09-19",
      "issuer_authority": "NSSTA / MoSPI"
    }
  }
  ```
- **Fallback**: If DigiLocker API is unavailable, generate the signed credential JSON-LD locally and offer it as a file download with a QR code containing the credential hash.

---

#### Task C5: ISRO Bhuvan Satellite UFS Block Demarcation Map

- **Depends on**: None (reads static WMS tile service).
- **Files to Create**:
  - `src/components/maps/BhuvanUFSBlockMap.tsx`
  - `src/app/api/maps/bhuvan/route.ts` ← server-side WMS proxy to resolve CORS restriction
- **Files to Modify**:
  - `src/components/dashboard/learner/CAPIFieldStationTab.tsx` ← correct path; embed `BhuvanUFSBlockMap`
- **npm packages required**: `npm install leaflet @types/leaflet react-leaflet`
- **Purpose**: Trains field investigators on UFS boundary demarcation using real ISRO satellite imagery.
- **Implementation**:
  - Proxy route `/api/maps/bhuvan?bbox=...&layer=...` forwards WMS tile requests server-side, adding `Origin` header to satisfy CORS.
  - Leaflet map with ISRO satellite tile layer + `GeoJSON` UFS block boundaries overlay.
  - Interactive training mode: Investigator clicks to place boundary markers; auto-validates against reference coordinates.

---

### PHASE D: Mobile Companion, Resilient Sync, Observability & Cloud Deployment

**Phase Goal**: Production hardening — resilient offline sync, monitoring, and NIC MeghRaj deployment.
**Execution order**: D1 is independent. D2 is independent. D3 is long-running (separate project); D4→D5→D6 are sequential.

---

#### Task D1: Serwist Background Sync & Offline Vault V2

- **Depends on**: None (builds on existing `sw.ts` and `offlineService.ts`).
- **Files to Modify**:
  - `src/app/sw.ts` ← add `BackgroundSyncPlugin` for assessment POST requests
  - `src/services/offlineService.ts` ← upgrade IndexedDB to `DB_VERSION = 2`; add `offline_media_cache` store
  - `src/components/layout/Topbar.tsx` ← add Offline Vault badge (unresolved conflict must be fixed first via §2.3)
- **Key Upgrades**:
  - Serwist `BackgroundSyncPlugin`: Queue name `statvidya-assessment-sync`. Max retries: 5. Max age: 7 days.
  - `DB_VERSION = 2` migration adds: `offline_media_cache` store with keys `question_id` and fields `audio_blob`, `image_blob`, `cached_at`.
  - Topbar badge: Animated pulsing dot when `pendingCount > 0`; spinner when syncing; green checkmark when all synced.
- **Idempotency guarantee**: Server-side `src/app/api/assessment/sync/route.ts` checks `local_id` for duplicates using a `seen_local_ids` Set in Redis; silently returns `200` for already-processed submissions.

---

#### Task D2: Adaptive Bitrate Video Player (Video.js + HLS.js)

- **Depends on**: B1 (MinIO stores `.m3u8` manifests and `.ts` video chunks).
- **Files to Create**:
  - `src/components/media/HlsVideoPlayer.tsx`
- **npm packages required**: `npm install video.js hls.js @types/video.js`
- **Features**:
  - `HLS.js` auto-selects between 240p / 360p / 720p renditions based on `navigator.connection.downlink`.
  - Service worker (`sw.ts`) caches streamed `.ts` segments in `Cache API` named `statvidya-video-segments`.
  - At `ended` event: fires custom event `video:competency-quiz-ready` that `MoSPIFieldManualsShelf.tsx` listens to and opens 3-question formative assessment modal.
  - Accessible controls: WCAG 2.1 AA compliant captions, keyboard focus, and ARIA labels.

---

#### Task D3: React Native / Expo NSSO Field Investigator App

- **Depends on**: Nothing in the web project; runs as a separate Expo project.
- **Files to Create** (in a new `apps/field-app/` monorepo workspace):
  - `apps/field-app/package.json`
  - `apps/field-app/App.tsx`
  - `apps/field-app/src/db/schema.ts` ← WatermelonDB model definitions
  - `apps/field-app/src/services/syncManager.ts` ← background sync via Expo `TaskManager`
  - `apps/field-app/src/screens/AssessmentScreen.tsx`
  - `apps/field-app/src/screens/BoundaryDemarcationScreen.tsx`
- **Shared TypeScript types**: Add `"workspace:*"` reference in `apps/field-app/package.json` pointing to `../../src/lib/types.ts` via a shared `@statvidya/types` workspace package.
- **Setup command**: `cd apps && npx create-expo-app@latest field-app --template blank-typescript`
- **Key features**:
  - WatermelonDB relational SQLite engine (10× faster than IndexedDB on budget Android tablets).
  - Expo Location API for GPS geo-tagging of household listing entries.
  - Expo Camera + OpenCV WASM for on-device photo OCR of handwritten Schedule 0.0 forms.
  - Expo Background Fetch (wrapping Android `WorkManager`) for background sync when app is closed.

---

#### Task D4: Kubernetes Helm Charts for NIC MeghRaj Cloud Deployment

- **Depends on**: All preceding tasks (full stack must be working locally).
- **Files to Create**:
  - `k8s/meghraj-helm-chart/Chart.yaml`
  - `k8s/meghraj-helm-chart/values.yaml`
  - `k8s/meghraj-helm-chart/templates/deployment-web.yaml`
  - `k8s/meghraj-helm-chart/templates/deployment-analytics.yaml`
  - `k8s/meghraj-helm-chart/templates/deployment-celery.yaml`
  - `k8s/meghraj-helm-chart/templates/statefulset-postgres.yaml`
  - `k8s/meghraj-helm-chart/templates/statefulset-redis.yaml`
  - `k8s/meghraj-helm-chart/templates/deployment-minio.yaml`
  - `k8s/meghraj-helm-chart/templates/deployment-elasticsearch.yaml`
  - `k8s/meghraj-helm-chart/templates/hpa.yaml`
  - `k8s/meghraj-helm-chart/templates/ingress.yaml`
  - `k8s/meghraj-helm-chart/templates/networkpolicy.yaml` ← isolates DB tier from public ingress
- **HPA configuration**: Celery workers scale `2→20` replicas based on Redis queue depth metric (requires Prometheus KEDA adapter on MeghRaj).
- **Security contexts**: All pods run as non-root (`runAsNonRoot: true`), with read-only root filesystem where possible.
- **Verification**: `helm lint k8s/meghraj-helm-chart && helm template statvidya k8s/meghraj-helm-chart | kubectl apply --dry-run=client -f -`

---

#### Task D5: Enterprise Observability (Prometheus, Grafana & OpenTelemetry)

- **Depends on**: D4 (K8s manifests define scrape targets for Prometheus).
- **Files to Create**:
  - `monitoring/prometheus.yml`
  - `monitoring/grafana/provisioning/datasources/prometheus.yml`
  - `monitoring/grafana/dashboards/statvidya-overview.json`
  - `monitoring/grafana/dashboards/celery-workers.json`
  - `monitoring/grafana/dashboards/irt-model-performance.json`
- **Add to `docker-compose.yml`**:
  - `prometheus` service: `prom/prometheus:latest`, port `9090`.
  - `grafana` service: `grafana/grafana-oss:latest`, port `3001` (avoid conflict with Next.js on 3000).
- **Key Grafana Dashboard Panels**:
  1. Active concurrent assessments (gauge)
  2. IRT θ computation latency P50/P95/P99 (histogram)
  3. Offline sync queue backlog per FOD division (geo map)
  4. Celery worker throughput: tasks/min (time series)
  5. MCQ AI approval rate by prompt version (bar chart)
  6. PostgreSQL pgvector query latency (time series)
- **Alerting rules**: Prometheus alert fires when sync failure rate > 5% for 5 minutes, or Celery queue depth > 50 jobs for 10 minutes. Alert routes to StatVidya admin's registered email.

---

#### Task D6: GitHub Actions Enterprise CI/CD Pipeline

- **Depends on**: D5 (observability validates healthy deployments).
- **Files to Create**:
  - `.github/workflows/ci.yml` ← runs on every PR
  - `.github/workflows/deploy.yml` ← runs on merge to `main`
  - `.github/workflows/nightly-model-retrain.yml` ← scheduled weekly
- **`ci.yml` stages** (runs on every pull request):
  1. `lint-typecheck`: `npm run lint && npx tsc --noEmit`
  2. `test-frontend`: `npm run test -- --run` (must achieve 220+ passing tests)
  3. `test-python`: `cd services/analytics-engine && pytest tests/ -v --tb=short`
  4. `python-quality`: `flake8 services/ && black --check services/`
- **`deploy.yml` stages** (runs on push to `main`):
  1. `build-docker`: Build and push multi-arch images to container registry.
  2. `helm-dry-run`: Validate Helm chart schema against K8s 1.30.
  3. `deploy-staging`: `helm upgrade --install statvidya k8s/meghraj-helm-chart -n staging`.
  4. `smoke-test`: Hit `/health`, `/api/v1/assessment/next-question`, and `/api/auth/parichay` endpoints.
  5. `deploy-production`: Only runs if smoke tests pass; requires manual approval gate.
- **`nightly-model-retrain.yml`**: Runs at 02:00 IST weekly. Triggers Celery task `retrain_collaborative_filter` and logs new model version to MLflow. Posts results to admin Slack/email webhook.

---

## SECTION 4: System Replacement & Migration Matrix

| Component Area | Current Implementation | Upgraded Target | Transition & Fallback Strategy |
| :--- | :--- | :--- | :--- |
| **Assessment Engine** | 3-question binary tree `assessmentService.ts` | 2PL IRT adaptive model in FastAPI | Dual-mode via `executeWithFallback`; heuristic tree fallback if FastAPI offline. |
| **Skill Gap Scoring** | Unweighted `max(0, T-C) × priorityWeight` | Bayesian `W_evidence × Δ_decay` formula | Implemented in TypeScript; no backend dependency for computation. |
| **Recommendation Engine** | 5 hardcoded courses, static rule formula | Multi-Signal LightGBM + SVD collaborative filter | FastAPI call + enhanced local 5-course fallback. |
| **Scrutiny Outcome Data** | Hardcoded `SYNTHETIC_DEMO_DATA` constants | Live OLS + LightGBM regression on real records | Fetch from FastAPI; NSS 78th Round bootstrap if < 10 records. |
| **PDF Text Extraction** | Sync browser `unpdf` + `tesseract.js` (tab freeze) | Celery async pipeline + OpenCV table parser | SSE progress ledger; client `unpdf` preview for < 5MB files offline. |
| **RAG / Copilot Context** | 20KB static string in `copilotPrompt.ts` | PostgreSQL pgvector semantic chunk retrieval (top-3) | Injects live chunks; curated FRAC context fallback when DB is empty. |
| **Object Storage** | Google Firebase Storage (US-hosted) | MinIO on-premise S3-compatible | S3 SDK client; local filesystem fallback in dev mode. |
| **Identity & SSO** | Firebase Auth + mock `demoPersonas.ts` | Jan-Parichay / MeriPehchaan OIDC SSO | OIDC flow with built-in Parichay Simulator for hackathon demo. |
| **Language & Speech** | `next-intl` static JSON + English-only Tesseract | Project Bhashini ASR + NMT + TTS | Bhashini API; Web Speech API + client translation dict fallback. |
| **Competency Certificates** | Firestore record only; no portable credential | DigiLocker W3C Verifiable Credential | Live DigiLocker push; local signed JSON-LD download fallback. |
| **Cloud Deployment** | Vercel / Cloudflare | Docker + Kubernetes Helm on NIC MeghRaj | Local Docker Compose; K8s manifests compatible with any sovereign cloud. |

---

## SECTION 5: Task Dependency Graph & Parallel Execution Order

Understanding dependencies prevents blocked work. Tasks connected by arrows must complete in that order.

```
 [§2.3 Merge Conflicts] ──────────────────────────────────────────────────────────┐
        │                                                                         │
        ▼                                                                         ▼
     [A1: Docker Compose]                                             [B7: Bhashini]
        │                                                                [C1: D3.js Sunburst]
        ├──────────► [A2: FastAPI Core]                                 [C3: Parichay SSO]
        │                    │                                          [C5: Bhuvan Map]
        │        ┌───────────┼──────────────────────┐                  [D1: Serwist Sync]
        │        ▼           ▼           ▼           ▼                  [D2: HLS Video]
        │     [A3: IRT]  [A7: Regr.]  [B2: Celery] [A6: Attribution]
        │        │                        │
        │        ▼                   ┌────┴────────────────────┐
        │     [A4: Gap Score]        [B3: Table Parser]  [B4: OCR]  [B5: NER]
        │        │
        ▼        ▼
     [A8: pgvector] ────► [A5: Recommendation] ────► [C2: D3.js Correlation]
        │                                              [C4: DigiLocker] (needs A6)
        ▼
     [A9: WASM Search]
        │
     [B1: MinIO] ──► [B2: Celery] ──► [B6: ES Dedup] ──► [B8: Doc Service]
        │
     All features stable
        │
        ▼
     [D3: Expo App] ──► [D4: Helm Charts] ──► [D5: Observability] ──► [D6: CI/CD]
```

**Recommended parallel execution batches**:
- **Batch 1** (Immediate): §2.3 (merge conflicts) — this is a blocker for everything.
- **Batch 2** (After Batch 1): A1, B7, C1, C3, C5, D1, D2 — all independent.
- **Batch 3** (After A1): A2, B1.
- **Batch 4** (After A2): A3, A7, A6, B2.
- **Batch 5** (After A3): A4.
- **Batch 6** (After A4 + A8 + B2): A5, B3, B4, B5, B8.
- **Batch 7** (After A5): C2, C4, B6.
- **Batch 8** (After full stack stable): D3, D4 → D5 → D6.

---

## SECTION 6: Testing, Healthcheck & Pre-Flight Verification Playbook

### 6.1 Current Test Baseline (Must Not Regress)

Before starting any task, run:
```bash
cd "/Users/vamsikrishna/Dev Projects/i proj/SiH"
npm run test -- --run
```
Expected baseline output: **220 tests passing, 30 test files passing** (3 currently failing due to unresolved merge conflicts — Task §2.3 fixes these).

### 6.2 Automated Full-Stack Healthcheck

Run [`scripts/verify-all-services.sh`](file:///Users/vamsikrishna/Dev%20Projects/i%20proj/SiH/scripts/verify-all-services.sh) to check all containers and services in one command:

```bash
chmod +x scripts/verify-all-services.sh
./scripts/verify-all-services.sh
```

### 6.3 Per-Phase Acceptance Criteria

| Phase | Acceptance Criteria | Command |
| :--- | :--- | :--- |
| §2.3 Conflicts | `npm test` shows 0 failed suites | `npm run test -- --run` |
| A1 | All 5 Docker containers report `healthy` | `docker ps` |
| A2 | FastAPI `/health` returns `{"status": "healthy"}` | `curl http://localhost:8000/health` |
| A3 | IRT endpoint returns θ ± SE for a 5-answer sequence | `curl -X POST http://localhost:8000/api/v1/assessment/finalize -d '...'` |
| A7 | `correlate-scrutiny` returns live `p_value`, `r_squared` | `curl -X POST http://localhost:8000/api/v1/analytics/correlate-scrutiny` |
| A8 | `pgvectorClient.semanticSearch("UFS block boundary")` returns ≥ 1 chunk | Manual test via Next.js API route |
| B1 | MinIO bucket `statvidya-manuals` exists | `curl http://localhost:9000/minio/health/live` |
| B2 | PDF upload to `/documents` page processes and shows `READY` status | Manual upload test in browser |
| B7 | Hindi voice input in Copilot transcribes spoken word | Manual test with microphone |
| C1 | D3 Sunburst renders with 4 cadre arcs and drill-down interaction | Visual browser test |
| D1 | Disconnect network, submit assessment → reconnect → assessment syncs | Manual offline test |
| D6 | Push to `main` → CI pipeline runs all stages green | GitHub Actions UI |

### 6.4 Python Microservice Tests

```bash
cd services/analytics-engine
source venv/bin/activate
pytest tests/ -v --tb=short
```

---

## SECTION 7: npm & pip Package Installation Reference

### 7.1 New npm Packages Required

Install all at once from the project root:
```bash
npm install \
  d3 @types/d3 \
  leaflet @types/leaflet react-leaflet \
  video.js hls.js @types/video.js \
  onnxruntime-web @xenova/transformers \
  @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

> **Note on `@xenova/transformers`**: ~50MB package; ensure `.gitignore` excludes `node_modules`. Model files are downloaded to `~/.cache/huggingface/` at runtime.

### 7.2 New Python Packages (`requirements.txt` — already listed in Task A2)

Key additions beyond the existing Next.js/Firebase stack:
```
fastapi uvicorn[standard] pydantic pydantic-settings
numpy scipy scikit-learn lightgbm
celery redis
pymupdf opencv-python-headless pytesseract
spacy sentence-transformers
psycopg2-binary pgvector
minio elasticsearch
mlflow
pytest httpx
```

---

## SECTION 8: Evaluator Pitch — The 3 Decisive Differentiators

When presenting StatVidya to MoSPI leadership and Smart India Hackathon evaluators:

1. **Live Statistical Science — Not Synthetic Numbers**:
   > *"Other teams show static graphs with hardcoded R² values. StatVidya runs a live ordinary least squares and LightGBM regression engine on actual submitted assessment records. Our p-values are scientific realities, not strings in a TypeScript file. A MoSPI evaluator who understands statistics will see the difference immediately."*

2. **Sovereign Indic Language AI (Project Bhashini)**:
   > *"Field investigators in rural Jharkhand and Bihar do not type on small screens — they speak. StatVidya integrates MeitY's Project Bhashini for hands-free Hindi voice assessment, bilingual Devanagari OCR, and real-time Hindi translation of AI responses. India's language infrastructure, serving India's workers, keeping India's data inside India."*

3. **NIC MeghRaj Cloud Deployable — Full Data Sovereignty**:
   > *"Every component — MinIO object storage, PostgreSQL with pgvector, local vLLM inference fallback — runs inside Docker and Kubernetes containers certified for NIC MeghRaj Sovereign Cloud. Zero government records ever leave Indian servers. Full DPDP Act 2023 compliance. This is not a prototype built on American cloud infrastructure — this is a sovereign Digital Public Infrastructure platform ready for production deployment."*
