# Phase 0 — Git Force-Push Safety Procedure (Locked Decision)

**Decision**: User chose **"Force-push local to test branch"** on 2026-05-30.

**Risk**: This is a destructive operation. It will replace whatever is currently on GitHub `test` with your current local `D:\oussema\aziz\Kage2` folder.

**We will not run the force push until you explicitly confirm after the safety steps below.**

---

## Exact Safety Sequence (Do This in Order)

### Step 1: Create a permanent backup of the current remote `test` branch (do this first, from any machine)

Run these commands from a folder that has the old remote cloned (or just use GitHub UI + a fresh clone):

```bash
# 1. Clone the current state of test (this becomes your permanent archive)
git clone --branch test https://github.com/azizharrabi07-byte/Kage.git Kage-test-backup-2026-05-30

cd Kage-test-backup-2026-05-30

# 2. Create a permanent tag + branch from the old state so it can never be lost
git tag archive/pre-backend-migration-2026-05-30
git branch archive/test-pre-force-push-2026-05-30

# 3. Push the tag and archive branch (these will survive the force push)
git push origin archive/pre-backend-migration-2026-05-30
git push origin archive/test-pre-force-push-2026-05-30
```

After this, even if we destroy `test`, the old code is safe forever under the `archive/` branches and tag.

### Step 2: On your development machine (D:\), prepare the local state

```bash
cd "D:\oussema\aziz\Kage2"

# Make absolutely sure you are on the correct local state (the one with the real backend)
git status
git log --oneline -5

# Create one final local safety tag (in case something goes wrong during push)
git tag local/pre-force-push-2026-05-30
```

### Step 3: Final verification (I will help you with this)

Before the force push I will run one last check from your machine:
- Confirm no `server.js` / `tunnel.js` / GIFs exist in the working tree (outside node_modules)
- Confirm `backend/` folder is present and healthy
- Confirm `src/api/apiClient.ts` and the new Diet/ModelThinking wiring exist

### Step 4: The actual force push (only after your explicit "GO" message)

```bash
cd "D:\oussema\aziz\Kage2"

# Add the remote if not already set (usually origin)
git remote -v

# THIS IS THE DESTRUCTIVE COMMAND — only run after Steps 1-3 + my final green light
git push --force origin test
```

After this, the GitHub `test` branch will be identical to your current excellent local folder.

---

## What Happens After the Force Push

- The `test` branch becomes the new source of truth (matches your local D:).
- All future work (the 6 phases) will be done on feature branches created from `test`.
- Old dead code (server.js, tunnel.js, etc.) will finally be gone from the branch you actually use.
- We immediately create a new working branch for Phase 1: `git checkout -b feat/auth-and-persistence`

---

## Your Confirmation Required

Reply with exactly one of these when you have completed **Step 1** (the backup tag + archive branch on GitHub):

- "Backup complete. Ready for final verification and force push."
- Or tell me if you want to change the strategy before we touch Git.

I will not suggest or execute the force push until you give that confirmation.

---

**This is the careful, professional way to do a force push when it is genuinely the right call.**

We are protecting your history while giving you the clean slate you want for the real backend migration.