const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// === Sensei Reliability Layer (Professional-grade for real users) ===
let lastCallTime = 0;
let consecutiveFailures = 0;
const MIN_TIME_BETWEEN_CALLS = 1200; // Reduced for better chat UX
const MAX_BACKOFF = 18000;

const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 45000;

const pendingRequests = new Map<string, Promise<string | null>>();

// Force clear rate limiting state (used when user explicitly retries)
export function resetSenseiRateLimit() {
  lastCallTime = 0;
  consecutiveFailures = 0;
  pendingRequests.clear();
}

function getCacheKey(messages: Array<any>): string {
  return JSON.stringify(messages.slice(-3)); // Use last 3 messages as cache key
}

async function tryGroqWithKey(apiKey: string, messages: Array<any>, maxTokens: number): Promise<{ok: boolean; response: string | null; rateLimited: boolean; authError: boolean}> {
  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: maxTokens,
        temperature: 0.75,
      }),
    });

    if (res.status === 429) {
      return { ok: false, response: null, rateLimited: true, authError: false };
    }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, response: null, rateLimited: false, authError: true };
    }
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Groq API error:', res.status, errorText);
      return { ok: false, response: null, rateLimited: false, authError: false };
    }

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content || null;
    return { ok: true, response, rateLimited: false, authError: false };
  } catch (err) {
    console.error('Groq network error:', err);
    return { ok: false, response: null, rateLimited: false, authError: false };
  }
}

// === Highly Reliable Sensei API Caller (Roundtable #1 priority) ===
export async function callGroqAPI(messages: Array<any>, maxTokens = 800, forceFresh = false): Promise<{ text: string | null; reason: string }> {
  try {
    const PRIMARY_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    const BACKUP_KEY = process.env.EXPO_PUBLIC_GROQ_BACKUP_API_KEY;

    const hasPrimary = PRIMARY_KEY && PRIMARY_KEY.length >= 50;
    const hasBackup = BACKUP_KEY && BACKUP_KEY.length >= 50;

    if (!hasPrimary && !hasBackup) {
      return { text: null, reason: 'NO_KEYS' };
    }

    const cacheKey = getCacheKey(messages);
    
    if (!forceFresh) {
      const cached = responseCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { text: cached.response, reason: 'CACHED' };
      }
      if (pendingRequests.has(cacheKey)) {
        const result = await pendingRequests.get(cacheKey)!;
        return { text: result, reason: 'DEDUPE' };
      }
    }

    // Much gentler rate limiting for actual chat usage
    const now = Date.now();
    const backoffTime = forceFresh ? 0 : Math.min(MIN_TIME_BETWEEN_CALLS * Math.pow(1.6, consecutiveFailures), MAX_BACKOFF);
    
    if (!forceFresh && now - lastCallTime < backoffTime) {
      return { text: null, reason: 'RATE_LIMIT' };
    }
    
    lastCallTime = now;

    const requestPromise = (async () => {
      const keysToTry = [];
      if (hasPrimary) keysToTry.push({ key: PRIMARY_KEY!, label: 'primary' });
      if (hasBackup) keysToTry.push({ key: BACKUP_KEY!, label: 'backup' });

      for (const { key, label } of keysToTry) {
        const res = await tryGroqWithKey(key, messages, maxTokens);
        
        if (res.ok && res.response) {
          responseCache.set(cacheKey, { response: res.response, timestamp: Date.now() });
          consecutiveFailures = 0;
          console.log(`[Sensei] Success using ${label} key`);
          return res.response;
        }
        
        if (res.rateLimited) {
          console.warn(`[Sensei] Rate limited on ${label}`);
          consecutiveFailures = Math.min(consecutiveFailures + 1, 4);
        } else if (res.authError) {
          console.error(`[Sensei] Auth error on ${label} key`);
        } else {
          consecutiveFailures = Math.min(consecutiveFailures + 1, 4);
        }
      }

      return null;
    })();

    pendingRequests.set(cacheKey, requestPromise);
    const finalText = await requestPromise;
    pendingRequests.delete(cacheKey);

    if (finalText) {
      return { text: finalText, reason: 'SUCCESS' };
    }
    return { text: null, reason: 'ALL_KEYS_FAILED' };

  } catch (err) {
    console.error('[Sensei] Unexpected error in callGroqAPI', err);
    return { text: null, reason: 'NETWORK_ERROR' };
  }
}

// ── Conversation State ────────────────────────────────────────────────────────
interface HistoryEntry { role: string; content: string; }
let sessionHistory: HistoryEntry[] = [];

function getMessages(systemPrompt: string, prompt: string): any[] {
  const messages = [{ role: 'system', content: systemPrompt }];
  // Include last 10 turns of conversation context
  sessionHistory.slice(-10).forEach(h => {
    messages.push({ role: h.role === 'model' ? 'assistant' : h.role, content: h.content });
  });
  messages.push({ role: 'user', content: prompt });
  return messages;
}

// ── Deep System Prompts ───────────────────────────────────────────────────────
const BASE_SYSTEM_PROMPT = `You are Sensei - a legendary martial arts and fitness coach with 40+ years of real-world experience. You are NOT a generic chatbot. You are a real person with deep expertise, personality, and wisdom.

## WHO YOU ARE:
- You trained Olympic athletes, UFC fighters, and military special forces
- You hold a Master's in Exercise Physiology and black belts in Kyokushin Karate, Judo, and BJJ
- You studied under traditional masters in Japan and Okinawa for 10 years
- You trained in Thailand for Muay Thai and in Brazil for Jiu-Jitsu
- You have coached over 10,000 students across 30+ years
- You are both a scientist (evidence-based) and a traditionalist (respecting ancient wisdom)
- You are warm, wise, and genuinely care about your students
- You speak with authority but never arrogance
- You use Japanese martial arts terminology naturally but explain it for beginners
- You adapt your tone: gentle and patient with beginners, direct and challenging with advanced students
- When a student approaches you, you assess where they are mentally and physically before coaching

## YOUR EXPERTISE (You know everything about):
### Strength Training:
- All major lifts (squat, deadlift, bench, press, row, pull-up) - biomechanics, muscle activation, programming
- Olympic weightlifting (snatch, clean & jerk) - technique, mobility, accessory work
- Powerlifting: periodization for peaking, competition strategy, recovery
- Hypertrophy: volume thresholds, muscle fiber types, sarcoplasmic vs myofibrillar, blood flow restriction, metabolic stress
- Progressive overload methods: linear, wave, auto-regulation, conjugate, DUP
- Form analysis and corrective exercises for every major movement pattern

### Martial Arts:
- Striking: Boxing, Muay Thai, Kyokushin, Karate (Shotokan, Goju-Ryu, Shito-Ryu)
- Grappling: BJJ (Gi and No-Gi), Judo, Wrestling (Freestyle, Greco, Catch), Sambo
- Training: Padwork, sparring progression, fight camp structure, cutting weight safely
- Philosophy: Bushido, Zazen meditation, Ki development, Mushin (no-mind state)
- Self-defense: Situational awareness, de-escalation, legal considerations, realistic training
- Weapon arts: Escrima, Kali, Kobudo (basic principles for fitness cross-training)

### Nutrition:
- Sports nutrition for all goals: muscle gain, fat loss, performance, health
- Macro and micronutrient optimization, meal timing, nutrient partitioning
- Supplementation: evidence-based (creatine, caffeine, beta-alanine, whey, etc.)
- Eating disorders: recognizing warning signs, healthy relationship with food
- Special populations: vegan athletes, keto for athletes, intermittent fasting myths
- Cooking and meal prep strategies for busy lifters

### Recovery & Mobility:
- Sleep optimization science (chronobiology, sleep architecture, environment)
- Active recovery protocols, deload strategies, injury prevention
- Fascia, myofascial release, RPR (reflexive performance reset)
- Joint health: prehab/rehab for shoulders, knees, lower back, hips, wrists
- Pain science: acute vs chronic pain, central sensitization, graded exposure

### Mindset & Psychology:
- Mental toughness and resilience training (grit, growth mindset, flow state)
- Overcoming plateaus: physical and psychological strategies
- Habits and behavior change: atomic habits, identity-based change, cue-routine-reward
- Stress management: cortisol regulation, breathwork (Wim Hof, box breathing, 4-7-8), cold exposure
- Burnout prevention and recovery, training-life balance
- Motivation science: intrinsic vs extrinsic, dopamine regulation, the role of community

## HOW YOU RESPOND:
- ALWAYS be conversational and natural. You speak as a real human coach, not a robot.
- When greeting a student (like "hi", "hello", "hey"), be warm and engaging. Ask what brings them to the dojo today.
- You remember context across the conversation. Reference things they said earlier.
- Give SPECIFIC, actionable advice. Vague responses are unacceptable.
- When asked about an exercise, give: exact cues, muscles worked, common errors, and 2-3 progression paths.
- When asked about nutrition, give: specific macro targets, food examples, meal timing, and what to avoid.
- When asked about mindset, share REAL stories from your coaching career. Be vulnerable. Be honest about failures too.
- Use Japanese terminology naturally: 道 (Do - the way), 根性 (Konjō - fighting spirit), 気合 (Kiai - fighting shout/spirit), 無心 (Mushin - no-mind), 段位 (Dan - rank). EXPLAIN each term the first time you use it with a new student.
- You are culturally aware - you blend Japanese martial arts culture with modern Western sports science seamlessly.
- If you don't know something, you ADMIT IT. Never make up information.
- You challenge your students when they need it. If they're making excuses, you call them out - but with love.
- You celebrate their wins with genuine joy.
- Keep responses concise but rich. 2-4 sentences for casual chat, 1-3 paragraphs for technical questions.`;

const COACHING_PROMPT = `${BASE_SYSTEM_PROMPT}

You are currently observing a student's workout form in real-time. 
Give immediate, actionable coaching feedback. Be precise. 
Focus on ONE critical issue at a time - the most impactful fix.
Mention specific body parts and movement patterns.
Reference Japanese martial arts concepts if applicable.
Keep it to 1-2 sentences. Be firm but encouraging.`;

const NUTRITION_PROMPT = `${BASE_SYSTEM_PROMPT}

You are analyzing a meal photo. Provide detailed nutritional analysis.
Be specific about macros and portions. Give practical advice.
If you see something concerning (too little protein, too much sugar), mention it gently.
Format as JSON when requested.`;

const CONVERSATION_PROMPT = `${BASE_SYSTEM_PROMPT}

Engage naturally in conversation. Remember what the student has said before.
Warm greetings for hellos. Deep knowledge for questions. 
Challenge excuses. Celebrate wins. Be the coach they need right now.`;

// ── Public API ─────────────────────────────────────────────────────────────────

export async function callSenseiAI(system: string, prompt: string, forceFresh = false): Promise<{ reply: string; success: boolean; reason?: string }> {
  sessionHistory.push({ role: 'user', content: prompt });
  if (sessionHistory.length > 20) sessionHistory = sessionHistory.slice(-20);
  
  const messages = getMessages(system || CONVERSATION_PROMPT, prompt);
  const result = await callGroqAPI(messages, 820, forceFresh);
  
  if (result.text) {
    sessionHistory.push({ role: 'assistant', content: result.text });
    return { reply: result.text, success: true };
  }

  const lastUserMessage = prompt.toLowerCase();
  let fallback = 'The path is quiet for a moment. Breathe. What do you need guidance on right now?';

  if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi') || lastUserMessage.includes('sensei')) {
    fallback = 'The dojo is open. What brings you here today, warrior?';
  } else if (lastUserMessage.includes('form') || lastUserMessage.includes('angle') || lastUserMessage.includes('rep')) {
    fallback = 'Control the eccentric. Tell me exactly what you feel in this rep.';
  } else if (lastUserMessage.includes('eat') || lastUserMessage.includes('diet') || lastUserMessage.includes('protein')) {
    fallback = 'Protein first. Then we talk timing and portions. What is your goal right now?';
  } else if (result.reason === 'RATE_LIMIT') {
    fallback = 'Sensei is catching his breath. Wait 2 seconds and ask again, warrior.';
  } else if (result.reason === 'NO_KEYS' || result.reason === 'ALL_KEYS_FAILED') {
    fallback = 'The old master cannot speak. Check your Groq API keys in the .env file.';
  }

  return { reply: fallback, success: false, reason: result.reason };
}

export function clearSenseiHistory(): void {
  sessionHistory = [];
}

export async function getSenseiCoaching(exerciseName: string, formData: string): Promise<string | null> {
  const prompt = `Exercise: ${exerciseName}\nForm Analysis Data:\n${formData}\n\nGive ONE sentence of focused coaching feedback.`;
  sessionHistory.push({ role: 'user', content: prompt });
  
  const messages = getMessages(COACHING_PROMPT, prompt);
  const response = await callGroqAPI(messages, 300);
  
  if (response) {
    sessionHistory.push({ role: 'assistant', content: response });
    return response;
  }
  return 'Focus your mind. Control your breath. The path reveals itself to those who seek it with discipline.';
}

export async function analyzeFoodPhoto(imageBase64: string): Promise<{
  items: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number; serving: string }>;
  totals: { calories: number; protein: number; carbs: number; fat: number };
} | null> {
  try {
    const messages = [
      { role: 'system', content: NUTRITION_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this food photo. Provide nutritional breakdown in JSON format. Be specific with macros and serving sizes. Include calories, protein, carbs, fat for each item and totals.' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ] as any,
      },
    ];
    const text = await callGroqAPI(messages, 500);
    if (text) {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      }
    }
  } catch (err) {
    console.error('Food analysis error:', err);
  }
  return null;
}
