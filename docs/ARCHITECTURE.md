# KAGE Architecture (Current State → Target)

**Version**: 1.0 — Phase 0 of Master Backend Migration Plan  
**Date**: 2026-05-30  
**Source of Truth**: This document + the approved Master Plan (plan.md)

---

## Current State (May 2026)

### Frontend (Expo SDK 54 + React Native + react-native-web)
- **Navigation**: expo-router (file-based tabs + modals)
- **State**: Heavy use of Zustand stores. Almost all persistence goes through `src/store/api.ts` → localStorage / AsyncStorage shim.
- **API Layer**: Brand new `src/api/apiClient.ts` + thin services (`aiService.ts`, `dietService.ts`). Only partially adopted (ModelThinkingCard and Diet page are the best examples of the desired pattern).
- **Theming**: Excellent dark Japanese martial arts system (`src/theme/`) with neon cyan #00F5D4.
- **Desktop**: Good responsive hooks (`useResponsive` in multiple screens) + 2-col layouts on wide screens. No real charts yet.
- **Photos**: Coarse movement-type mapping. ~12-18 images total. Two folders with inconsistent naming.

**Biggest Liability**: `src/store/api.ts` (complete local-only shim for workouts, PRs, nutrition, social, progression, program). This is why "real data persistence" is priority #1.

### Backend (FastAPI + Supabase)
- **Structure**: Clean modular (core/config/dependencies, services, api/v1/endpoints + router, schemas with Pydantic, utils).
- **SupabaseService**: Real methods exist and are production-grade for profiles, user_programs, workout_sessions (JSONB), personal_records, movement_insights, nutrition_logs, ai_reports.
- **AI**: Strong. `ai_service.py` already does the critical thing you asked for — fetches real programs and forces the LLM to pick only from them (with validation fallback).
- **Auth**: Still dev placeholder. `get_current_user` accepts anything or falls back to "dev-user-123". No real JWT validation against Supabase.
- **Endpoints**: Router is complete. Most endpoint files are still stubs (`workouts.py`, `auth.py`, parts of others). Only AI and Diet have real recent work.
- **DB Schema**: Excellent (001_initial_schema.sql). All necessary tables + basic RLS skeleton exist. Programs table is defined but not yet populated/used in all places.

**Biggest Liability**: Backend capacity exists but is not wired to most frontend flows. The "real" path is not exercised, so old bugs (Powerlifting program editing, etc.) can hide.

### Assets & Data
- Strong program definitions in `src/constants/programs.ts` (Shadow Strength powerlifting + Iron Body calisthenics — 5 weeks each).
- Good exercise type system (`src/store/types.ts`).
- Food database exists but nutrition flow is still local.

---

## Target Architecture (End State After All 6 Phases)

### Frontend
- **Auth**: Real Supabase Auth (email/password + session). `src/auth/AuthContext.tsx` + `useAuth`. Token automatically attached by apiClient.
- **Persistence Layer**: `src/api/persistence.ts` (or enhanced apiClient) is the single source of truth.
  - Smart: Prefers backend when authenticated + online.
  - Resilient: Local cache + write queue for offline.
  - Gradual: Old stores can migrate one by one without breaking the app.
- **Stores**: Become thin orchestrators. Real data comes from the persistence layer + React Query / SWR-style cache.
- **API Client**: Comprehensive typed layer (`workoutsApi`, `prsApi`, `nutritionApi`, `insightsApi`, `aiApi`, `dietApi`, `programsApi`, `usersApi`).
- **Photos**: Strict per-exercise-id mapping per `docs/PHOTO_CONVENTION.md`. 20-25 high-quality images minimum for MVP excellence.
- **Visualizations**: Desktop-first charts (consistency heatmap, strength curves, XP radar, program timeline) using a chosen charting library. All data real.
- **Screens**: Every tab and major screen (Feed, Soul/Profile, History, Movement Report, Diet) reads and writes real user data.

### Backend
- **Auth**: Real Supabase JWT validation (JWKS) in `dependencies.py`. Proper `CurrentUser` with verified `id`.
- **Endpoints**: All major ones implemented and tested:
  - Auth (login/refresh if needed)
  - Workouts (log full session + side effects on PRs + insights)
  - Programs (served from DB `programs` table)
  - Diet (recommendation + weekly framework + nutrition logging)
  - AI (model-thinking + memory from previous reports)
  - Users / Profiles
- **Services**: SupabaseService continues to grow only as needed. Business logic stays thin.
- **AI Memory**: Model Thinking and Diet recommendations now read previous `ai_reports` + recent activity for personalization.
- **Tests**: pytest + integration tests for every critical endpoint (happy path + auth failures).
- **Deploy**: Proper Dockerfile + environment separation (dev/staging/prod Supabase projects).

### Data Flow (Target)
```
User action (finish workout)
  → WorkoutComplete component
  → persistence layer (online? → real API : queue)
  → FastAPI /workouts (validated JWT)
  → SupabaseService.create_workout_session + update personal_records + save_movement_insight
  → Response
  → UI updates (optimistic or from fresh fetch)
  → Charts and history reflect real data on next load (even from another device)
```

---

## Key Architectural Patterns We Will Enforce

1. **Prefer real backend, graceful fallback** (already started in ModelThinkingCard — replicate everywhere).
2. **Typed contracts first** (Pydantic + TypeScript interfaces live in `src/api/types/` and `backend/app/schemas/`).
3. **One persistence abstraction** during migration (never let stores talk directly to localStorage again for new code).
4. **RLS is the source of truth for ownership** — never trust client to filter "my data".
5. **Offline is a feature, not an afterthought** (write queue + visible sync status).
6. **Photos are treated as real content** (strict convention + missing photo policy).

---

## Non-Goals (What We Explicitly Will Not Do)

- Rewrite the entire UI from scratch.
- Add a new state manager (Zustand stays).
- Make the app work fully offline with conflict resolution (simple queue is enough for phase 1-3).
- Support multiple programs active at once (current model is fine).
- Build a full social network in Feed (keep it lightweight for now).

---

## Open Decisions (to be locked during Phase 0/1)

- Exact Supabase Auth flow (email+password vs magic links) — small UX impact.
- Charting library (leaning react-native-chart-kit for speed).
- Supabase Storage vs base64 for meal photos (Storage is strongly preferred long-term).
- Git strategy for the divergence between local `D:\` and GitHub `test` branch (see separate question).

---

## How to Evolve This Document

- Every major phase completion should append a "Phase X Completed" section with actual files changed and lessons learned.
- Keep it short and decision-oriented. Detailed implementation notes belong in the phase execution todos and commit messages.

---

**This architecture gives us the best chance of delivering a product that actually feels alive and respects the serious athlete.**

Local `D:\oussema\aziz\Kage2` is now the single source of truth for all future work.