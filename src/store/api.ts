// Client-side localStorage API — no server required
const STORAGE_KEYS = {
  PROGRESSION: 'kage_progression',
  WORKOUTS: 'kage_workouts',
  PRS: 'kage_prs',
  EXERCISE_HISTORY: 'kage_exercise_history',
  SOCIAL: 'kage_social',
  NUTRITION: 'kage_nutrition',
  CONFIG: 'kage_config',
  PROGRAM: 'kage_program',
};

function get<T>(key: string, defaultValue?: T): T | null {
  try {
    if (typeof window === 'undefined') return defaultValue ?? null;
    const data = localStorage.getItem(key);
    if (!data) return defaultValue ?? null;
    return JSON.parse(data) as T;
  } catch {
    return defaultValue ?? null;
  }
}

function set<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch { }
}

function _remove(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  } catch { }
}

function getArray<T>(key: string): T[] {
  const arr = get<T[]>(key);
  return Array.isArray(arr) ? arr : [];
}

function getRecord<T>(key: string): Record<string, T> {
  const obj = get<Record<string, T>>(key);
  return obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {};
}

// ── Progression ─────────────────────────────────────────────────────────
export async function apiGetProgression(): Promise<any> {
  return get<any>(STORAGE_KEYS.PROGRESSION, null);
}
export async function apiSaveProgression(data: any): Promise<any> {
  set(STORAGE_KEYS.PROGRESSION, data);
  return data;
}

// ── Workouts ─────────────────────────────────────────────────────────────
export async function apiGetWorkouts(): Promise<any[]> {
  return getArray<any>(STORAGE_KEYS.WORKOUTS);
}
export async function apiSaveWorkout(session: any): Promise<any> {
  const workouts = getArray<any>(STORAGE_KEYS.WORKOUTS);
  workouts.unshift(session);
  set(STORAGE_KEYS.WORKOUTS, workouts);
  return session;
}

// ── PRs ─────────────────────────────────────────────────────────────────
export async function apiGetPRs(): Promise<Record<string, any>> {
  return getRecord<any>(STORAGE_KEYS.PRS);
}
export async function apiSavePRs(prs: Record<string, any>): Promise<any> {
  set(STORAGE_KEYS.PRS, prs);
  return prs;
}

// ── Exercise History ─────────────────────────────────────────────────────
export async function apiGetExerciseHistory(name?: string): Promise<any[]> {
  const records = getArray<any>(STORAGE_KEYS.EXERCISE_HISTORY);
  return name ? records.filter(r => r.name === name) : records;
}
export async function apiSaveExerciseRecord(record: any): Promise<any> {
  const records = getArray<any>(STORAGE_KEYS.EXERCISE_HISTORY);
  records.unshift(record);
  set(STORAGE_KEYS.EXERCISE_HISTORY, records);
  return record;
}

// ── Social Feed ────────────────────────────────────────────────────────────
export async function apiGetPosts(): Promise<any[]> {
  return getArray<any>(STORAGE_KEYS.SOCIAL);
}
export async function apiCreatePost(post: any): Promise<any> {
  const posts = getArray<any>(STORAGE_KEYS.SOCIAL);
  const newPost = { ...post, id: Date.now().toString(), createdAt: Date.now() };
  posts.unshift(newPost);
  set(STORAGE_KEYS.SOCIAL, posts);
  return newPost;
}
export async function apiLikePost(postId: string, _userId: string): Promise<any[]> {
  const posts = getArray<any>(STORAGE_KEYS.SOCIAL);
  const post = posts.find(p => p.id === postId);
  if (post) { post.likes = (post.likes || 0) + 1; }
  set(STORAGE_KEYS.SOCIAL, posts);
  return posts;
}
export async function apiCommentPost(postId: string, data: any): Promise<any> {
  const posts = getArray<any>(STORAGE_KEYS.SOCIAL);
  const post = posts.find(p => p.id === postId);
  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push(data);
  }
  set(STORAGE_KEYS.SOCIAL, posts);
  return posts;
}

// ── Nutrition ──────────────────────────────────────────────────────────────
export async function apiGetNutrition(date?: string): Promise<any[]> {
  const records = getArray<any>(STORAGE_KEYS.NUTRITION);
  return date ? records.filter(r => r.date === date) : records;
}
export async function apiAddFood(entry: any): Promise<any> {
  const records = getArray<any>(STORAGE_KEYS.NUTRITION);
  const newEntry = { ...entry, id: entry.id || Date.now().toString() };
  records.push(newEntry);
  set(STORAGE_KEYS.NUTRITION, records);
  return newEntry;
}
export async function apiDeleteFood(id: string): Promise<void> {
  const records = getArray<any>(STORAGE_KEYS.NUTRITION);
  const filtered = records.filter(r => r.id !== id);
  set(STORAGE_KEYS.NUTRITION, filtered);
}

// ── Config ───────────────────────────────────────────────────────────────
export async function apiGetConfig(): Promise<any> {
  const result = get<any>(STORAGE_KEYS.CONFIG, null);
  return result || {};   // Never return null — prevents crashes in movementIntelligence
}
export async function apiSaveConfig(config: any): Promise<any> {
  const safeConfig = config || {};
  set(STORAGE_KEYS.CONFIG, safeConfig);
  return safeConfig;
}

// ── Program ──────────────────────────────────────────────────────────────
export async function apiGetProgram(): Promise<any> {
  return get<any>(STORAGE_KEYS.PROGRAM, null);
}
export async function apiSaveProgram(data: any): Promise<any> {
  set(STORAGE_KEYS.PROGRAM, data);
  return data;
}
export async function apiDeleteProgram(): Promise<any> {
  _remove(STORAGE_KEYS.PROGRAM);
  return null;
}

// ── Database Export/Import ──────────────────────────────────────────────
export async function apiExportDB(): Promise<any> {
  const data: Record<string, any> = {};
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      const val = localStorage.getItem(key);
      if (val) data[key] = JSON.parse(val);
    });
  }
  return data;
}

export async function apiImportDB(data: any): Promise<any> {
  if (typeof window === 'undefined') return;
  Object.entries(data).forEach(([key, val]) => {
    localStorage.setItem(key, JSON.stringify(val));
  });
  return data;
}
