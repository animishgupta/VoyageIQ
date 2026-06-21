/**
 * VoyageIQ – Shared Groq API client utility
 * All AI features across the app funnel through this single helper.
 * Set NEXT_PUBLIC_GROQ_API_KEY in .env.local to enable live AI.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function groqChat(
  messages: GroqMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  } = {}
): Promise<string> {
  const apiKey =
    (typeof window !== "undefined" && localStorage.getItem("groqApiKey")) ||
    process.env.NEXT_PUBLIC_GROQ_API_KEY ||
    "";

  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const body: Record<string, any> = {
    model: options.model ?? DEFAULT_MODEL,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 1024,
  };

  if (options.jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

/** Parse a JSON response from Groq safely */
export function parseGroqJson<T = any>(raw: string): T | null {
  try {
    // strip markdown code fences if present
    const clean = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    // try to find a JSON block inside the text
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/** Convenience: one-shot user prompt, returns plain text */
export async function groqAsk(
  prompt: string,
  systemPrompt = "You are VoyageIQ, an expert AI Indian travel planning assistant. Be concise and helpful.",
  opts?: Parameters<typeof groqChat>[1]
): Promise<string> {
  return groqChat(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    opts
  );
}
