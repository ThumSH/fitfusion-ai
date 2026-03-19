import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
const DEFAULT_GEMINI_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"];
const GEMINI_MODELS = [process.env.GEMINI_MODEL?.trim(), ...DEFAULT_GEMINI_MODELS].filter(
  (model, index, arr): model is string => Boolean(model) && arr.indexOf(model) === index
);

const SYSTEM_PROMPT = `You are a certified sports nutritionist AI with deep expertise in macro/micronutrient estimation from food images. You analyze meal photographs and return precise nutritional data.

RULES:
- Estimate calories and macros as accurately as possible based on visual portion sizes
- Always return ONLY valid JSON - no markdown, no backticks, no commentary
- If you cannot identify the food, still attempt your best estimate and note uncertainty in the summary
- All numeric values must be numbers, not strings
- Ratings must be exactly one of: "Excellent", "Good", "Moderate", "Poor"`;

function buildUserPrompt(goalLabel: string, goalDesc: string) {
  return `Analyze this meal image. The user's fitness goal is: ${goalLabel} - ${goalDesc}

Return this EXACT JSON structure (no other text):
{
  "meal_name": "string - a clear descriptive name for the meal",
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "fiber_g": number,
  "sugar_g": number,
  "sodium_mg": number,
  "ingredients": ["array of identified ingredients"],
  "portion_size": "string - estimated portion (e.g. '1 large bowl, ~350g')",
  "verdicts": [
    {"goal": "Bulking", "rating": "Excellent|Good|Moderate|Poor", "reason": "1 concise sentence"},
    {"goal": "Cutting", "rating": "Excellent|Good|Moderate|Poor", "reason": "1 concise sentence"},
    {"goal": "Lean Bulk", "rating": "Excellent|Good|Moderate|Poor", "reason": "1 concise sentence"},
    {"goal": "Keto", "rating": "Excellent|Good|Moderate|Poor", "reason": "1 concise sentence"},
    {"goal": "Maintenance", "rating": "Excellent|Good|Moderate|Poor", "reason": "1 concise sentence"},
    {"goal": "Athletic Performance", "rating": "Excellent|Good|Moderate|Poor", "reason": "1 concise sentence"}
  ],
  "summary": "2-3 sentence overall nutritional assessment tailored to the ${goalLabel} goal",
  "tip": "1 specific, actionable tip to optimize this meal for ${goalLabel}"
}`;
}

function extractRetryAfterSeconds(message: string): number | undefined {
  const match = message.match(/retry in\s+([\d.]+)s/i) ?? message.match(/"retryDelay":"(\d+)s"/i);
  if (!match) return undefined;
  const num = Number(match[1]);
  if (!Number.isFinite(num) || num <= 0) return undefined;
  return Math.max(1, Math.ceil(num));
}

function isModelUnavailableError(error: unknown) {
  const err = error as { message?: string; status?: number };
  const message = (err?.message ?? "").toLowerCase();

  return (
    err?.status === 404 ||
    message.includes("not_found") ||
    message.includes("no longer available") ||
    (message.includes("model") && message.includes("not found"))
  );
}

async function generateWithFallback(image: string, mimeType: string, goalLabel: string, goalDesc: string) {
  if (!ai) throw new Error("Gemini client is not configured.");

  let lastError: unknown = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: image,
                },
              },
              {
                text: buildUserPrompt(goalLabel, goalDesc),
              },
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.3,
          maxOutputTokens: 1200,
        },
      });

      return response.text ?? "";
    } catch (error) {
      if (!isModelUnavailableError(error)) throw error;
      lastError = error;
      console.warn(`Gemini model unavailable: ${model}. Trying next fallback model...`);
    }
  }

  throw lastError ?? new Error("No supported Gemini model is available for this API key/project.");
}

export async function POST(request: NextRequest) {
  try {
    if (!ai) {
      return NextResponse.json(
        { error: "API configuration error. Set GOOGLE_API_KEY or GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { image, mimeType, goalLabel, goalDesc } = body;

    if (!image || !mimeType || !goalLabel || !goalDesc) {
      return NextResponse.json(
        { error: "Missing required fields: image, mimeType, goalLabel, goalDesc" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${mimeType}. Use JPG, PNG, or WEBP.` },
        { status: 400 }
      );
    }

    const text = await generateWithFallback(image, mimeType, goalLabel, goalDesc);
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned) as Record<string, unknown>;
    } catch {
      console.error("Gemini returned invalid JSON:", cleaned);
      return NextResponse.json(
        { error: "AI returned invalid response. Please try again with a clearer photo." },
        { status: 502 }
      );
    }

    const requiredFields = [
      "meal_name",
      "calories",
      "protein_g",
      "carbs_g",
      "fat_g",
      "fiber_g",
      "sugar_g",
      "sodium_mg",
      "ingredients",
      "portion_size",
      "verdicts",
      "summary",
      "tip",
    ];

    const missing = requiredFields.filter((field) => !(field in parsed));
    if (missing.length > 0) {
      console.error("Missing fields in AI response:", missing);
      return NextResponse.json({ error: "Incomplete analysis. Please try again." }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Meal analysis error:", error);

    const err = error as { message?: string; status?: number };
    const message = err?.message ?? "";
    const status = err?.status;

    if (message.includes("API key")) {
      return NextResponse.json(
        { error: "API configuration error. Check GOOGLE_API_KEY / GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    if (message.includes("SAFETY")) {
      return NextResponse.json(
        { error: "Image was flagged by safety filters. Please try a different photo." },
        { status: 400 }
      );
    }

    if (isModelUnavailableError(error)) {
      return NextResponse.json(
        {
          error:
            "The configured Gemini model is unavailable. Set GEMINI_MODEL=gemini-2.5-flash in .env.local and restart the dev server.",
        },
        { status: 503 }
      );
    }

    const quotaError =
      status === 429 || message.includes("RESOURCE_EXHAUSTED") || message.toLowerCase().includes("quota exceeded");

    if (quotaError) {
      return NextResponse.json(
        {
          error: "Gemini quota exceeded. Check plan/billing in Google AI Studio or retry later.",
          code: "QUOTA_EXCEEDED",
          retryAfterSeconds: extractRetryAfterSeconds(message),
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: "Failed to analyze meal. Please try again." }, { status: 500 });
  }
}
