# Kage — Martial Arts Gym App

**Status**: Active development — Major foundation work completed (auth + visualizations + data wiring)

This repository contains the full-stack Kage application: a React Native (Expo) mobile + web app with a FastAPI + Supabase backend, built around a dark Japanese martial arts aesthetic.

The project is currently in an advanced prototype / early alpha state with strong progress on authentication, real data persistence, and beautiful custom visualizations.

---

## Current State Summary (as of late May 2026)

### What We Have (Working / Mostly Working)

**Core Experience**
- 6 main tabs: Home, Diet, Feed, Sensei, Train (Workout), Soul (Profile)
- Strong dark aesthetic with neon cyan (#00F5D4) and Japanese design elements
- Model Thinking strategic AI (grounded to real programs from database)

**Authentication (Recently Completed)**
- Full Supabase-powered auth on frontend
- Real `signInWithPassword` + `signUp`
- Persistent sessions via AsyncStorage
- Automatic Bearer token attachment on all API calls
- Basic login modal in Profile (ready to be turned into a proper screen)
- Backend JWT validation using Supabase tokens

**Data & Persistence**
- Real workout logging (`POST /workouts`) that saves sessions and auto-updates Personal Records
- `/prs` endpoint returning user personal records
- Real Diet history pulled from `nutritionStore`
- Weekly volume and strength trend charts now use real user data (with some fallbacks)

**Visualizations (Strong Recent Focus)**
- Custom SVG charts (KageLineChart, KageBarChart, KagePieChart, KageRadarChart)
- Training Analytics section on Home (desktop)
- PR History per exercise with selector in Profile
- XP Radar chart
- Consistency Heatmap (12-week calendar with live streak counter)
- Post-workout feedback (Radar + Heatmap in `WorkoutComplete`)
- Macro pie on Diet page

**Backend**
- Clean modular FastAPI structure
- Supabase service layer with methods for workouts, PRs, nutrition, AI reports
- New `/prs` endpoint
- Improved auth dependencies with Supabase JWT validation + dev bypass
- Docker + Railway/Fly ready files

**Other**
- Good documentation in `/docs` (Photo Convention, Architecture, Git safety)
- Custom per-exercise photo mapping foundation
- Responsive design (especially strong on desktop/web)

---

## What Is Still Missing / Weak

### Critical / High Priority
- **Real protected routes** — Currently no strong guard preventing unauthenticated users from seeing tabs.
- **Auth UX polish** — Login is still inside a modal in Profile. Needs a proper onboarding/login flow.
- **Full data layer consistency** — Some flows are still hybrid (localStorage + backend). Need clearer strategy.
- **Error handling & loading states** — Many new chart sections and post-workout UI lack proper states.
- **Mobile chart experience** — Visualizations are still desktop-leaning.

### Medium Priority
- Expand backend test coverage (only basic PR tests exist)
- Complete per-exercise real history from backend `/prs`
- Better Diet logging and weekly framework features
- Photo completeness (many exercises still missing proper images)
- AI memory (previous Model Thinking reports influencing future recommendations)

### Lower / Polish
- Full deploy pipeline (Railway/Fly instructions + env management)
- More advanced charts (e.g. strength curves per specific lift with real history)
- Movement intelligence + form feedback depth
- Social / Feed features maturity

---

## Architecture Overview

**Frontend**
- Expo SDK 54 + expo-router + React Native Web
- Zustand for state management (still mixed with localStorage in many places)
- Custom SVG chart library (no heavy charting dependencies)
- Theme system with dark-first Japanese aesthetic

**Backend**
- FastAPI (modular structure)
- Supabase (Postgres + Auth)
- Groq for AI (Model Thinking)
- Pydantic models + service layer pattern

**Key Endpoints (as of now)**
- `/auth/me`
- `/ai/model-thinking`
- `/diet/recommendation`
- `/workouts/` (POST) + `/workouts/recent` + `/workouts/prs`
- Various user/program stubs still exist

---

## How to Run Locally

### 1. Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Frontend
```bash
npx expo start --clear --port 8081
```

Recommended: Use the web version (`http://localhost:8081`) for the best experience of the new charts and desktop layouts.

**Required Environment Variables**
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` (frontend)
- Backend needs full Supabase keys + Groq key (see `backend/.env`)

---

## Git & Branching

- Main working branch: `feat/full-backend-migration` (contains all recent auth + visualization work)
- Shared branch: `test` (has received force-pushes in the past — history is not clean)
- We have good documentation in `/docs` about the Git strategy used during development.

**Recommendation for future work**: Avoid further force-pushes to `test`. Use feature branches + clean PRs or rebases.

---

## Handover / Next Priorities (Recommended Order)

1. **Auth Hardening**
   - Proper protected route guards in expo-router
   - Turn the login modal into a real flow (onboarding/login screens)
   - Handle signup → profile creation in Supabase
   - Better error states and loading during auth

2. **Data Layer Cleanup**
   - Decide on source of truth for PRs, workouts, nutrition
   - Make more flows consistently use the backend
   - Improve offline resilience

3. **Stability & Polish**
   - Add proper error boundaries around new chart sections
   - Expand backend tests
   - Mobile responsiveness for visualizations

4. **Feature Completion**
   - Finish per-exercise real history from `/prs`
   - Improve Diet weekly frameworks + logging
   - Complete photo library

5. **Production Readiness**
   - Full deploy (Railway/Fly) with proper environments
   - Remove / clean dev bypass paths
   - Performance & bundle optimization

---

## Known Technical Debt & Notes

- Many `.pyc` files and `__pycache__` folders exist (should be gitignored properly).
- The app still has some legacy localStorage-heavy stores (`src/store/api.ts`).
- Custom charts are excellent but will need real data sources wired in more places.
- The project mixes very high-quality recent work with older inconsistent parts.

---

## Contact / Context

This document was created as a handover after significant work on authentication, real data persistence, and custom visualizations.

The team has been moving fast on features while the foundational auth + data layer was being completed. The next agent should prioritize stability and real auth flow before adding many new features.

Good luck — the aesthetic and vision are genuinely strong.

---

**Last updated**: Late May 2026 (during active auth + visualization sprint)