import { apiGetConfig, apiSaveConfig } from '@/store/api';

export function getDefaultApiKey(): string {
  return process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
}

export async function getApiKey(): Promise<string> {
  const cfg = await apiGetConfig();
  return cfg.groqApiKey || getDefaultApiKey();
}

export async function setApiKey(key: string): Promise<void> {
  const cfg = await apiGetConfig();
  cfg.groqApiKey = key;
  await apiSaveConfig(cfg);
}

export async function getBodyWeight(): Promise<number> {
  const cfg = await apiGetConfig();
  return cfg.bodyWeight || 75;
}

export async function setBodyWeight(kg: number): Promise<void> {
  const cfg = await apiGetConfig();
  cfg.bodyWeight = kg;
  await apiSaveConfig(cfg);
}
