# 📡 FoundersRadar

> **Algorithmic Biography-Matching & Real-Time Market Calibration for First-Time Founders.**

FoundersRadar is a global, mass-market B2C SaaS platform ($14.99/month) designed to eliminate the 90% failure rate of first-time startups due to "founder-to-idea mismatch." The platform analyzes an aspiring entrepreneur's unique career history (Person A) and cross-references it against a global vector database of historically successful entrepreneurs (Person B) to output a highly personalized, market-validated, month-by-month startup roadmap.

---

## 📈 Current Project Phase: Phase 1 (Pre-Launch Validation)

**CRITICAL STRATEGIC FOCUS:** We are currently in the **Pre-Seed / Pre-Launch Validation phase**. 
To protect company capital and safeguard intellectual property from competitors, **DO NOT connect or deploy live third-party LLM APIs (OpenAI/Anthropic) to the frontend client.** 

This version of the codebase acts as a **local experimental matching engine** embedded into the existing company website's `SERVICES` section. It uses a curated sample dataset and does not claim to provide objective business validation.

---

## 🗺️ System Architecture Overview
```
[User Resume / Profile Text] ──► [Local UI Verification] ──► [On-Device PII Masking]
                                                                      │
                                                                      ▼
[Pre-Seed Investor Metrics] ◄─── [Supabase Database] ◄─── [Secure Waitlist Data Ingestion]
```
---

## 🛠️ Tech Stack & Dependencies

*   **Frontend Framework:** Next.js (React)
*   **Styling:** Tailwind CSS (Mobile-First, Responsive Design Layouts)
*   **UI Components:** shadcn/ui (Accessible HTML Primitives)
*   **Database & Auth:** Supabase / PostgreSQL (`foundersradar_waitlist` collection)
*   **Development Framework:** Kiro IDE (Spec-Driven Development Environment)

---

## 📋 Technical Requirements

### 1. Frontend Interface UI/UX (`/components/services/founders_radar`)
*   **Service Hero Card:** A modern, clean container introducing the platform value proposition with clear visibility of the target mass-market pricing ($14.99/mo).
*   **Frictionless File/Text Upload Wrapper:** A responsive interface containing an input container titled *"Paste your LinkedIn profile text or drop a Resume"* to simulate top-of-funnel data gathering.
*   **3-Step Interactive Preview Questionnaire:** A lightweight form sequence capturing basic operational competencies (Sales, Operations, Development, etc.) to mirror the future AI onboarding experience.
*   **The Churn-Guard Paywall Overlay:** A polished fallback modal triggered upon form submission to capture user intents without breaking the budget on backend AI servers.

### 2. Data Ingestion & Security
*   **Database Endpoint Mapping:** User inputs must securely map to the local database table schema titled `foundersradar_waitlist`.
*   **On-Device Masking Protocol:** Before strings leave the browser, client-side regex scripts must scrub out obvious PII (Personally Identifiable Information) such as names, phone numbers, and physical addresses to maintain universal GDPR/CCPA data compliance.
*   **Intellectual Property Protection:** Core promotional text and value strings must be rendered in native plain HTML/CSS arrays rather than structural JavaScript constants to block competitors from harvesting business rules via basic inspection utilities.

---

## 🚀 Kiro Development Workflow (For Engineering Team)

Because we utilize **Kiro IDE**, the development team must strictly adhere to the **Spec-Driven Development** flow. Do not write raw code without executing these sequential pipeline stages:

### Step 1: Define Requirements (`.kiro/specs/requirements.md`)
Create or edit the requirements file detailing explicit parameter bounds, input forms, and data sanitation parameters.
```bash
# Example Kiro requirement validation command
kiro spec:validate requirements.md
```

### Step 2: Establish Structural Architecture Blueprint (`.kiro/specs/architecture.md`)
Map out component placement indices, state wrappers, and layout endpoints before generating files.

### Step 3: Sequential Implementation Task Checklist
Break the development into individual atomic checkpoints. Run the development environment in parallel sandbox targets to isolate code side-effects.

---

## ⚠️ Safe Coding Protocols (Beginner Guardrails)

1.  **API Budget Hard Caps:** Go to your individual developer portal accounts (OpenAI/Anthropic Dashboard) and hardcode a strict **$50/month spending threshold limit** on Day 1 to prevent accidental runaway code loop billing.
2.  **Use Pre-Built Primitives Only:** Do not try to program unique layout algorithms from scratch. Use **Tailwind CSS classes** and verified components to guarantee immediate security, responsiveness, and performance.
3.  **Strict Data Decoupling:** Keep business descriptions out of variable states. Hardcode typography strings directly inside structural elements to eliminate competitor scraping vectors.

---

## 📝 Database Table Schema Reference (`foundersradar_waitlist`)

| Column Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique entry record key. |
| `created_at` | `timestamp` | DEFAULT now() | Data creation entry timeline. |
| `email` | `text` | UNIQUE, NOT NULL | Cleaned target user user email. |
| `profile_payload_masked` | `text` | NULLABLE | Anonymized user professional text. |
| `competency_scores` | `jsonb` | NULLABLE | Object recording core onboarding paths. |

---

## 🔌 Backend Setup

The waitlist form submits masked profile text and competency answers to `POST /api/waitlist`. The route validates the payload server-side and upserts by email through Supabase using the service-role key. The service-role key must remain server-only and must never use a `NEXT_PUBLIC_` prefix.

1. Create a Supabase project.
2. Run [`supabase/migrations/001_create_foundersradar_waitlist.sql`](supabase/migrations/001_create_foundersradar_waitlist.sql) in the Supabase SQL editor.
3. Copy [`.env.example`](.env.example) to `.env.local` and fill in the project URL and service-role key.
4. Start the app with `npm run dev`.

Without those environment variables, the API intentionally returns `503` rather than reporting a false successful signup.

## 🚀 Deployment Setup

This project is prepared for both Vercel and Netlify.

### Vercel
1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Set the environment variables from [`.env.example`](.env.example) in the Vercel dashboard.
4. Use the default Next.js build settings.

### Netlify
1. Add the repository to Netlify.
2. Set the same environment variables in Site settings → Environment variables.
3. Use the default build command: `npm run build`.
4. The repo includes a [`netlify.toml`](netlify.toml) file so the Netlify Next.js plugin is configured automatically.

## 🧪 Experimental Product Capabilities

The local experiment currently includes:

*   A deterministic matcher at `POST /api/matches` using four curated startup patterns.
*   Ranked match results with fit scores, matched strengths, gaps, and six-month roadmaps.
*   PDF, DOCX, and TXT resume parsing at `POST /api/parse-resume`, with on-device/server-boundary masking.
*   A Supabase Auth-shaped sign-in screen at `/auth` for the future magic-link integration.
*   Supabase migrations for profiles, saved matches, and match history.
*   A local analytics event buffer and an LLM provider interface with a no-cost template fallback.
*   Vitest coverage for the matcher and common PII masking behavior.

The sample startup patterns are intentionally illustrative. Replace them with reviewed, licensed data before presenting match scores as research-backed recommendations. The LLM adapter is also disabled by default; adding a provider requires a server-side key, privacy review, rate limits, and output evaluation.

***

Developed using **Kiro IDE** | © 2026 FoundersRadar. All Rights Reserved.
