# KAGE Photo Convention (Strict Standard)

**Status**: Authoritative — Phase 0 of Master Plan  
**Date**: 2026-05-30  
**Applies to**: All exercise demonstration photos in the app.

## Core Principles

1. **One source of truth**: `assets/images/exercises/` (flat, no subfolders).
2. **Per-exercise, not per-movement**: Mapping is by exact `exercise.id` from `src/constants/programs.ts` and `src/constants/workouts.ts`.
3. **Deterministic, human-readable filenames**: `kebab-case-descriptive.jpg`
4. **Graceful degradation**: Missing photos must never break the UI. Always have a beautiful fallback.
5. **Future-proof**: Easy to add WebP + optimization later.

## Required Naming Format

`{primary-muscle-or-movement}-{specific-exercise-slug}.jpg`

Examples (final names we will use):
- `chest-barbell-bench-press.jpg`
- `back-weighted-pull-up.jpg`
- `legs-barbell-back-squat.jpg`
- `legs-romanian-deadlift.jpg`
- `core-dragon-flag.jpg`
- `shoulders-pike-push-up.jpg`

**Never** use generic names like `chest.jpg`, `back.jpg` for individual exercises anymore.

## Current Reality (as of Phase 0)

We currently have only ~12-18 usable photos across two folders, mapped very coarsely in `src/constants/exerciseImages.ts` (many movementTypes share the same 6 images).

This is insufficient for a professional experience.

## Exact Photo Requirements — Priority Order

### Tier 1 (Must have for Shadow Strength + Iron Body programs — highest impact)

From `program_shadow_strength` (Powerlifting focus):

1. `chest-barbell-bench-press.jpg` (ex1)
2. `back-barbell-row.jpg` or `back-bent-over-row.jpg` (ex4 / ex25)
3. `legs-barbell-back-squat.jpg` (ex3)
4. `legs-conventional-deadlift.jpg` or `legs-romanian-deadlift.jpg` (ex5)
5. `legs-front-squat.jpg` or `legs-goblet-squat.jpg` (ex15)
6. `shoulders-overhead-press.jpg` or `shoulders-military-press.jpg` (ex24)
7. `arms-barbell-curl.jpg` (ex17)
8. `core-plank.jpg` or `core-ab-wheel-rollout.jpg` (various core finishers)

From `program_iron_body` (Calisthenics focus) — many overlaps, but key unique ones:

9. `back-pull-up.jpg` or `back-weighted-pull-up.jpg`
10. `chest-dip.jpg` or `chest-chest-dip.jpg`
11. `legs-pistol-squat.jpg` or `legs-assisted-pistol-squat.jpg`
12. `shoulders-pike-push-up.jpg` or `shoulders-handstand-push-up-progression.jpg`
13. `core-dragon-flag.jpg` or `core-hanging-leg-raise.jpg`
14. `full-l-sit.jpg` or `core-l-sit-progression.jpg`

### Tier 2 (Remaining high-usage exercises across programs)

- `legs-bulgarian-split-squat.jpg`
- `legs-walking-lunge.jpg`
- `back-chin-up.jpg`
- `chest-incline-push-up.jpg` or `chest-diamond-push-up.jpg`
- `arms-diamond-push-up.jpg` (close grip variation)
- `core-hollow-body-hold.jpg`
- `full-muscle-up-progression.jpg` (if we ever expand)

**Total for excellent MVP experience**: ~20-25 high-quality photos.

## File Specifications (for best results)

- Format: JPEG (or WebP later)
- Resolution: Minimum 1200px on longest side, ideally 1600-2000px
- Aspect: 4:3 or 3:2 (landscape or portrait both ok, we will crop consistently in code)
- Lighting: Good contrast, dark gym aesthetic preferred (matches the app)
- Style: Real photos of athletes (you or models) performing the movement cleanly. No text overlays. Minimal background clutter.
- Compression: Standard (not ultra-compressed)

## Fallback Strategy (Already Implemented in Spirit)

In `ExerciseDemoModal.tsx` and `ExerciseCard.tsx`:
- If exact photo missing → use category default (chest/back/legs/core) or a beautiful fixed "shadow warrior" silhouette from `assets/images/background/`.
- Show subtle label "Demonstration photo coming soon" in a small elegant badge (Japanese ink style).

## Migration Steps (for Phase 6)

1. You provide the Tier 1 photos with the exact filenames above.
2. I update `src/constants/exerciseImages.ts` to a full per-exercise-id map.
3. Update `ExerciseDemoModal`, `ExerciseCard`, and any other consumers.
4. Add a small admin/dev tool (or script) that lists every exercise id that still has no photo.
5. (Optional) Add a simple image optimization step in the build.

## Example Mapping (Future Shape)

```ts
// src/constants/exerciseImages.ts
export const exercisePhotos: Record<string, any> = {
  'ex1': require('../../assets/images/exercises/chest-barbell-bench-press.jpg'),
  'ex3': require('../../assets/images/exercises/legs-barbell-back-squat.jpg'),
  // ...
};

// Fallback helper
export function getExercisePhoto(exerciseId: string, movementType?: string) {
  return exercisePhotos[exerciseId] || movementPhotos[movementType] || defaultShadowWarrior;
}
```

## Your Action Required

When we reach Phase 6, I will give you a clean, numbered shopping list with the exact 20-25 filenames + which program/day they appear on + a short description of the ideal angle/lighting for each.

For now, keep any new photos you shoot in a folder named `incoming-exercise-photos/` at the project root so they are easy to process.

---

**This document is the single source of truth for all photo work going forward.**

No more guessing filenames. No more generic `chest.jpg` for everything. Professional standard only.