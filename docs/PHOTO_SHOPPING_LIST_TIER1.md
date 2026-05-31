# KAGE Tier 1 Photo Shopping List (Highest Priority)

**For**: Shadow Strength (Powerlifting) + Iron Body (Calisthenics) programs only.  
**Total unique photos needed for excellent MVP**: 18–22  
**When we need them**: Phase 6 (after persistence + auth are solid). You can start shooting earlier if you want.

All filenames must follow the convention in `docs/PHOTO_CONVENTION.md`.

---

## Shadow Strength — Powerlifting (Highest Volume of Heavy Compounds)

These appear across the 5 weeks. Get these right and the program feels real.

| # | Exact Filename (use this)                  | Exercise / Movement                  | Ideal Shot Description                                                                 | Program Days (approx) |
|---|--------------------------------------------|--------------------------------------|----------------------------------------------------------------------------------------|-----------------------|
| 1 | `chest-barbell-bench-press.jpg`            | Barbell Bench Press                  | Side or 45° angle, full ROM, bar touching chest, strong bracing, dark gym background   | Week 1-4 Heavy Upper |
| 2 | `back-bent-over-row.jpg`                   | Bent Over Barbell Row                | Side profile, bar close to shins on eccentric, strong hip hinge, lats engaged          | Week 1-4 Heavy Upper |
| 3 | `legs-barbell-back-squat.jpg`              | Barbell Back Squat                   | Front/side, deep squat (hip crease below knee), upright torso, strong brace            | Week 1-5 (multiple)  |
| 4 | `legs-romanian-deadlift.jpg`               | Romanian Deadlift                    | Side view, bar dragging shins, big hip hinge, flat back, hamstrings stretched          | Week 1-4 Heavy Lower |
| 5 | `legs-front-squat.jpg`                     | Front Squat / Goblet Squat           | Front or side, elbows high, upright torso, deep squat                                  | Volume Lower days    |
| 6 | `shoulders-overhead-press.jpg`             | Strict Overhead Press                | Side or front, bar locked out overhead, no excessive lean back                         | Volume Upper days    |
| 7 | `arms-ez-bar-curl.jpg`                     | EZ Bar or Straight Bar Curl          | Side profile, full extension at bottom, peak contraction, controlled                 | Upper days finisher  |
| 8 | `core-plank.jpg`                           | Plank / Ab Wheel / Core Finisher     | Strong plank position, body straight, shoulders over wrists or ab wheel under body     | Many days            |

---

## Iron Body — Calisthenics (Bodyweight Mastery)

Many of these are skill-based. Clean lines and full range are critical.

| # | Exact Filename                              | Exercise / Movement                  | Ideal Shot Description                                                                 | Program Days |
|---|---------------------------------------------|--------------------------------------|----------------------------------------------------------------------------------------|--------------|
| 9 | `back-pull-up.jpg`                          | Pull-Up (or Weighted)                | Full dead hang at bottom, chin clearly over bar at top, controlled                     | Multiple weeks |
| 10| `chest-dip.jpg`                             | Parallel Bar Dip                     | Full depth (shoulders below elbows), vertical torso or slight lean, locked out top     | Multiple weeks |
| 11| `legs-pistol-squat.jpg`                     | Pistol Squat (or assisted)           | Side view, working leg deep, non-working leg extended, excellent balance               | Lower days   |
| 12| `shoulders-pike-push-up.jpg`                | Pike Push-Up / HSPU Progression      | Clear pike position, head tracking between hands, full lockout                         | Upper days   |
| 13| `core-dragon-flag.jpg`                      | Dragon Flag (or progression)         | Full body tension, hips high, straight line from shoulders to toes                     | Core finishers |
| 14| `core-l-sit.jpg`                            | L-Sit (or tuck progression)          | Hips off ground, legs straight or tucked, shoulders depressed                          | Skill days   |
| 15| `full-muscle-up-progression.jpg`            | Muscle-Up Transition / False Grip    | Clear transition phase or high pull + dip position (can be two photos if needed)       | Later weeks  |
| 16| `legs-nordic-curl.jpg` or `legs-glute-ham.jpg` | Nordic Curl / Glute-Ham Raise     | Side view, full eccentric control, body straight                                       | Posterior chain days |

---

## Bonus High-Value / Frequently Seen (Strongly Recommended)

| # | Exact Filename                              | Exercise                             | Notes                                                                                  |
|---|---------------------------------------------|--------------------------------------|----------------------------------------------------------------------------------------|
| 17| `back-chin-up.jpg`                          | Chin-Up                              | Supinated grip, full ROM                                                               |
| 18| `chest-diamond-push-up.jpg`                 | Diamond / Close-Grip Push-Up         | Triceps focus, clean form                                                              |
| 19| `legs-bulgarian-split-squat.jpg`            | Bulgarian Split Squat                | Rear foot elevated, deep lunge, upright torso                                          |
| 20| `core-hollow-body-hold.jpg`                 | Hollow Body Hold                     | Classic gymnastics position, lower back pressed into floor                             |
| 21| `arms-dips-tricep-focus.jpg`                | Bench Dips or Ring Dips              | Deep stretch at bottom                                                                 |
| 22| `full-handstand-hold.jpg`                   | Handstand Hold (wall or freestanding)| Clean line, strong shoulders                                                           |

---

## Shooting Guidelines (for Best Aesthetic Match)

- Gym should feel dark, serious, Japanese martial arts vibe (low key lighting is perfect).
- Athlete should look focused and powerful — no smiling, no gym bro faces.
- Clothing: Black, dark grey, or deep navy. Minimal logos. Gi pants or clean training shorts + tank/tee.
- No phones, water bottles, or messy backgrounds in frame if possible.
- Shoot in both landscape and portrait — we will pick the best crop.
- Include at least one photo per exercise showing the **bottom** (stretch) and one showing the **top** (contraction/lockout) if the movement has clear extremes.

---

## How We Will Use These

Once you deliver the files with the exact names above:

1. I move them into `assets/images/exercises/`
2. I rewrite `src/constants/exerciseImages.ts` as a clean per-exercise-id map (no more generic movementType sharing)
3. I update `ExerciseDemoModal.tsx`, `ExerciseCard.tsx`, and any other consumers
4. I add a small dev-only screen that lists every exercise still missing its photo

---

**You do not need to shoot all 22 at once.**

Prioritize 1–16 first (the ones that actually appear in the two main programs). That alone will make the app feel dramatically more professional.

When you are ready to start shooting, tell me and I will give you a prioritized weekly shooting order based on the actual program days.

This list is the single source of truth for Tier 1 photos. No more guessing.