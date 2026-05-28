// Kage Movement Intelligence Store
// This is the foundation for long-term, premium AI coaching memory.

import { apiGetConfig, apiSaveConfig } from './api';

export interface MovementInsight {
  exercise: string;
  date: number;
  commonIssues: string[];
  strengths: string[];
  llmSummary?: string;
}

export interface MovementProfile {
  insights: Record<string, MovementInsight[]>; // key = exerciseName
  chronicWeaknesses: string[]; // e.g. ["Left knee valgus", "Early hip rise in deadlifts"]
  lastUpdated: number;
}

const STORAGE_KEY = 'kage_movement_profile';

export async function getMovementProfile(): Promise<MovementProfile> {
  const cfg = await apiGetConfig();
  return cfg.movementProfile || {
    insights: {},
    chronicWeaknesses: [],
    lastUpdated: Date.now(),
  };
}

export async function saveMovementInsight(exercise: string, issues: string[], strengths: string[], llmSummary?: string) {
  const profile = await getMovementProfile();
  
  if (!profile.insights[exercise]) {
    profile.insights[exercise] = [];
  }

  const newInsight: MovementInsight = {
    exercise,
    date: Date.now(),
    commonIssues: issues,
    strengths,
    llmSummary,
  };

  profile.insights[exercise].unshift(newInsight);
  // Keep only last 8 sessions per exercise
  profile.insights[exercise] = profile.insights[exercise].slice(0, 8);

  // Simple chronic weakness detection (very basic for now, can be LLM-enhanced later)
  const allIssues = Object.values(profile.insights).flat().flatMap(i => i.commonIssues);
  const issueCounts: Record<string, number> = {};
  allIssues.forEach(issue => {
    issueCounts[issue] = (issueCounts[issue] || 0) + 1;
  });

  profile.chronicWeaknesses = Object.entries(issueCounts)
    .filter(([_, count]) => count >= 3)
    .map(([issue]) => issue)
    .slice(0, 5);

  profile.lastUpdated = Date.now();

  const cfg = await apiGetConfig();
  cfg.movementProfile = profile;
  await apiSaveConfig(cfg);

  return profile;
}

export async function getChronicWeaknesses(): Promise<string[]> {
  const profile = await getMovementProfile();
  return profile.chronicWeaknesses;
}

// Premium feature: Generate an intelligent, long-term coaching debrief
import { callSenseiAI } from '@/utils/gemini';

export async function generateSenseiDebrief(exercise: string, recentInsights: MovementInsight[]): Promise<string> {
  const chronic = await getChronicWeaknesses();

  const historyText = recentInsights.slice(0, 5).map(i => 
    `• ${new Date(i.date).toLocaleDateString()}: Issues - ${i.commonIssues.join(', ')} | Strengths - ${i.strengths.join(', ')}`
  ).join('\n');

  const system = `You are Sensei, a legendary long-term coach who has worked with the same athlete for years.
You have deep memory of this person's movement patterns. Write a premium, insightful, slightly poetic but highly practical debrief report.
Structure it beautifully with these sections:
1. Current Session Observation
2. Pattern Recognition (across sessions)
3. The Real Root Issue (your expert diagnosis)
4. Prescribed Work (specific drills or mindset shifts)

Keep it under 220 words. Speak with authority and care.`;

  const prompt = `Athlete's movement history for ${exercise}:
${historyText}

Known chronic weaknesses across all training: ${chronic.length ? chronic.join(', ') : 'None recorded yet'}

Write the premium debrief report now.`;

  const report = await callSenseiAI(system, prompt);
  return report || 'The data is quiet tonight. We will reflect more deeply after the next session, warrior.';
}

// === MAX UPGRADE: Full Premium Movement Report ===
export async function generateFullMovementReport(): Promise<string> {
  const profile = await getMovementProfile();
  const chronic = profile.chronicWeaknesses;

  // Gather the most recent insights across all exercises
  const allInsights = Object.values(profile.insights).flat().sort((a, b) => b.date - a.date).slice(0, 12);

  const summaryByExercise = Object.keys(profile.insights).map(ex => {
    const ins = profile.insights[ex];
    return `${ex}: ${ins.length} sessions recorded. Recent issues: ${ins[0]?.commonIssues?.slice(0,2).join(', ') || 'none'}`;
  }).join('\n');

  const system = `You are the most elite movement coach in the world. You have been tracking this warrior for months.
Write a comprehensive, premium "Movement Intelligence Report".
Make it feel expensive, insightful, and actionable. Use sections with clear headings.
Tone: Respectful but direct. Never generic.`;

  const prompt = `Athlete's overall movement profile:

Chronic weaknesses identified: ${chronic.length ? chronic.join(' | ') : 'None yet detected'}

Recent activity summary:
${summaryByExercise}

Latest 12 individual session insights:
${allInsights.map(i => `- ${new Date(i.date).toLocaleDateString()} | ${i.exercise}: ${i.commonIssues?.join(', ')}`).join('\n')}

Write a full, high-quality Movement Report for this warrior. Include:
- Overall Assessment
- Key Patterns & Chronic Issues
- Strengths Observed
- Priority Focus Areas for the next 4 weeks
- Recommended Practices / Drills

Keep the total report between 350-450 words. Make it feel personal and premium.`;

  const report = await callSenseiAI(system, prompt);
  return report || "The warrior's path has many layers. We need more data before we can give a full report. Continue training with awareness.";
}