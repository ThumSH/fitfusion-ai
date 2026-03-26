import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
const DEFAULT_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"];
const WORKOUT_MODELS = [process.env.GEMINI_MODEL?.trim(), ...DEFAULT_MODELS].filter(
  (model, index, arr): model is string => Boolean(model) && arr.indexOf(model) === index
);
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

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
    (message.includes("model") && message.includes("available"))
  );
}

function toNumber(value: unknown) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return num;
}

function hasStructuredWorkoutPlan(text: string) {
  return /\bday\s*\d+\b/i.test(text) && /\bsets?\b|\breps?\b|\bwarm[\s-]?up\b/i.test(text);
}

function buildFallbackWorkoutMarkdown(input: {
  environment: string;
  days: number;
  duration: number;
  goal: string;
  experience: string;
}) {
  const isHome = input.environment.toLowerCase() === "home";
  const isBeginner = input.experience.toLowerCase().includes("beginner");
  const isStrength = input.goal.toLowerCase().includes("strength");
  const exerciseCount = input.duration <= 20 ? 3 : input.duration <= 30 ? 4 : input.duration <= 45 ? 5 : 6;
  const scheme = isStrength ? (isBeginner ? "3 x 8 reps" : "4 x 5 reps") : isBeginner ? "3 x 10 reps" : "4 x 8-12 reps";
  const rest = isStrength ? "120s rest" : "90s rest";

  const db = isHome
    ? {
        warmup: ["Jumping Jacks - 1 min", "Arm Circles - 1 min", "Bodyweight Squats - 1 min"],
        push: ["Incline Push-ups", "Chair Dips", "Pike Push-ups", "Arm Circles", "Diamond Push-ups", "Plank to Down Dog"],
        pull: ["Door Frame Rows", "Superman Holds", "Reverse Snow Angels", "Towel Pull-ins", "Bird-Dog", "Prone Swimmers"],
        legs: ["Lunges", "Glute Bridges", "Wall Sit", "Calf Raises", "Sumo Squats", "Jump Squats"],
      }
    : {
        warmup: ["Treadmill / Bike - 5 mins", "Dynamic Arm Swings - 1 min", "Bodyweight Lunges - 1 min"],
        push: ["Bench Press", "Dumbbell Flyes", "Overhead Press", "Tricep Extensions", "Lateral Raises", "Push-ups"],
        pull: ["Deadlifts", "Barbell Rows", "Lat Pulldowns", "Face Pulls", "Hammer Curls", "Back Extensions"],
        legs: ["Barbell Squats", "Romanian Deadlifts", "Leg Press", "Walking Lunges", "Calf Raises", "Hip Thrusts"],
      };

  const blocks: string[] = [];
  blocks.push("## Structured Weekly Plan (Auto-completed)");
  blocks.push(`- Environment: ${isHome ? "Home" : "Gym"}`);
  blocks.push(`- Session length: ${input.duration} minutes`);
  blocks.push(`- Frequency: ${input.days} days/week`);
  blocks.push("");

  for (let day = 1; day <= input.days; day += 1) {
    const rotation = (day - 1) % 3;
    const focus = rotation === 0 ? "Push Focus" : rotation === 1 ? "Pull Focus" : "Legs & Core";
    const exercises = (rotation === 0 ? db.push : rotation === 1 ? db.pull : db.legs).slice(0, exerciseCount);
    blocks.push(`### Day ${day} - ${focus}`);
    blocks.push(`- Warm-up: ${db.warmup.join(", ")}`);
    for (const exercise of exercises) {
      blocks.push(`- ${exercise}: ${scheme}, ${rest}`);
    }
    blocks.push("- Cool-down: 5 minutes light stretching and breathing.");
    blocks.push("");
  }

  return blocks.join("\n");
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
    const {
      age,
      height,
      weight,
      goal,
      experience,
      daysPerWeek,
      workoutDuration,
      environment,
      notes,
    } = body;

    if (!age || !height || !weight || !goal || !experience || !daysPerWeek || !workoutDuration || !environment) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: age, height, weight, goal, experience, daysPerWeek, workoutDuration, environment",
        },
        { status: 400 }
      );
    }

    const ageNum = toNumber(age);
    const heightNum = toNumber(height);
    const weightNum = toNumber(weight);
    const daysNum = toNumber(daysPerWeek);
    const durationNum = toNumber(workoutDuration);

    if (!ageNum || !heightNum || !weightNum || !daysNum || !durationNum) {
      return NextResponse.json({ error: "Invalid numeric fields in workout request." }, { status: 400 });
    }

    if (
      ageNum < 12 ||
      ageNum > 90 ||
      heightNum < 120 ||
      heightNum > 230 ||
      weightNum < 35 ||
      weightNum > 250 ||
      daysNum < 1 ||
      daysNum > 7 ||
      durationNum < 20 ||
      durationNum > 120
    ) {
      return NextResponse.json(
        { error: "One or more values are out of allowed range for a safe plan." },
        { status: 400 }
      );
    }

    const prompt = `You are an elite strength and conditioning coach.

Create a practical weekly workout plan in clean markdown for this person:
- Age: ${ageNum}
- Height: ${heightNum} cm
- Weight: ${weightNum} kg
- Goal: ${goal}
- Experience Level: ${experience}
- Training Days/Week: ${daysNum}
- Session Duration: ${durationNum} minutes
- Environment: ${environment}
- Notes / Injuries / Preferences: ${notes || "None"}

Rules:
- Keep the plan realistic and safe for the user's experience.
- Include dynamic warm-up and cool-down guidance.
- For each training day, include:
  - Focus
  - Exercise list
  - Sets x reps
  - Rest times
  - Optional substitutions for home/gym constraints
- Include progression rules for 4 weeks.
- Include recovery guidance (sleep, hydration, rest day strategy).
- Do not include medical diagnosis.
- Keep it concise and practical; avoid filler.

Format with markdown headings, short bullet points, and concise tables where useful.`;

    let text = "";
    let lastError: unknown = null;

    for (const model of WORKOUT_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          config: {
            temperature: 0.4,
            maxOutputTokens: 2200,
          },
        });

        text = response.text?.trim() ?? "";
        break;
      } catch (modelError) {
        if (!isModelUnavailableError(modelError)) throw modelError;
        lastError = modelError;
      }
    }

    if (!text && lastError) throw lastError;
    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned an empty workout plan. Please try again." },
        { status: 502 }
      );
    }

    if (!hasStructuredWorkoutPlan(text)) {
      const fallback = buildFallbackWorkoutMarkdown({
        environment,
        days: daysNum,
        duration: durationNum,
        goal,
        experience,
      });
      text = `${text}\n\n${fallback}`.trim();
    }

    return NextResponse.json({ plan: text });
  } catch (error: unknown) {
    console.error("Workout plan generation error:", error);

    const err = error as { message?: string; status?: number };
    const message = err?.message ?? "";
    const status = err?.status;

    if (message.includes("API key")) {
      return NextResponse.json(
        { error: "API configuration error. Check GOOGLE_API_KEY / GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const quotaError =
      status === 429 || message.includes("RESOURCE_EXHAUSTED") || message.toLowerCase().includes("quota");
    if (quotaError) {
      return NextResponse.json(
        {
          error: "Gemini quota exceeded. Retry later or check billing/limits.",
          code: "QUOTA_EXCEEDED",
          retryAfterSeconds: extractRetryAfterSeconds(message),
        },
        { status: 429 }
      );
    }

    if (isModelUnavailableError(error)) {
      return NextResponse.json(
        { error: "Gemini model unavailable. Set GEMINI_MODEL=gemini-2.5-flash and restart the server." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate workout plan. Please try again." },
      { status: 500 }
    );
  }
}
