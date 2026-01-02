import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Homework } from "../type";
import {
  GEMINI_CONFIG,
  GEMINI_PROMPT,
  ERROR_MESSAGES,
} from "../config/constants";

const apiKey = GEMINI_CONFIG.API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

let cachedModel: string | null = null;
let cachedAvailableModels: string[] | null = null;

async function listModelsFromAPI(): Promise<string[]> {
  if (!apiKey) throw new Error(ERROR_MESSAGES.MISSING_API_KEY_FOR_LIST_MODELS);
  const url = `${GEMINI_CONFIG.API_BASE_URL}/models?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`ListModels failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const names: string[] = (data.models || [])
    .map((m: any) => (m.name || "").split("/").pop())
    .filter((n: string) => !!n);
  return names;
}

async function getAvailableModels(): Promise<string[]> {
  if (cachedAvailableModels) return cachedAvailableModels;
  const names = await listModelsFromAPI();
  cachedAvailableModels = names;
  return names;
}

function prioritizeModels(models: string[]): string[] {
  const tried = new Set<string>();
  const ordered: string[] = [];
  for (const m of GEMINI_CONFIG.MODEL_CANDIDATES) {
    if (models.includes(m) && !tried.has(m)) {
      tried.add(m);
      ordered.push(m);
    }
  }
  for (const m of models) {
    if (!tried.has(m)) {
      tried.add(m);
      ordered.push(m);
    }
  }
  return ordered;
}

export async function explainHomework(hw: Homework): Promise<string> {
  if (!genAI) {
    throw new Error(ERROR_MESSAGES.GEMINI_API_KEY_MISSING);
  }

  const prompt = [
    GEMINI_PROMPT.INTRO,
    GEMINI_PROMPT.GUIDELINES,
    GEMINI_PROMPT.INCLUDE,
    GEMINI_PROMPT.ASSUMPTIONS,
    "\n---\n",
    `Subject: ${hw.subject}`,
    `Class: ${hw.className ?? "N/A"}`,
    `Due Date: ${hw.date ?? "N/A"}`,
    `Description: ${hw.description ?? "N/A"}`,
  ].join("\n");

  const toTry = cachedModel
    ? [cachedModel, ...GEMINI_CONFIG.MODEL_CANDIDATES]
    : [...GEMINI_CONFIG.MODEL_CANDIDATES];
  const tried: string[] = [];
  for (const m of toTry) {
    if (tried.includes(m)) continue;
    tried.push(m);
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      cachedModel = m;
      return response.text();
    } catch (err: any) {
      const message = String(err?.message || err);
      const isNotFound =
        message.includes("404") ||
        message.includes("not found") ||
        message.includes("not supported");
      const isAuth = message.includes("401") || message.includes("PERMISSION");
      if (isAuth) {
        throw new Error(
          "Gemini request unauthorized. Check your API key and access.",
        );
      }
      if (!isNotFound) {
        throw err;
      }
      // otherwise continue to next model
    }
  }
  // Try discovering available models via ListModels and retry in priority order
  try {
    const available = await getAvailableModels();
    const ordered = prioritizeModels(available);
    for (const m of ordered) {
      if (tried.includes(m)) continue;
      tried.push(m);
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        cachedModel = m;
        return response.text();
      } catch {
        // continue
      }
    }
  } catch (e: any) {
    // If listing models fails, surface combined message below
  }
  throw new Error(
    `No accessible Gemini model. Tried: ${tried.join(", ")}. Ensure the Generative Language API is enabled for your key, or use a server proxy.`,
  );
}
