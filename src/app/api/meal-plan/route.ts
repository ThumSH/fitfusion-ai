import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { MealHistoryInput } from "@/types/meal-history";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function buildPrompt(input: Required<MealHistoryInput>) {
  return `
You are an expert sports nutritionist and AI gym coach.
Create a detailed, structured 1-day sample meal plan and a general nutritional strategy for:
- Age: ${input.age}
- Weight: ${input.weight} kg
- Primary Goal: ${input.goal.replace("_", " ")}
- Dietary Preferences/Allergies: ${input.preferences || "None"}

Please provide:
1. Target macros: estimated daily calories and macro breakdown (protein, carbs, fats)
2. Meal timetable: practical 1-day schedule with at least 5 eating slots and food quantities
3. Supplementation: protein intake advice + creatine protocol
4. A compact shopping list for the day

Rules:
- Do not return only generic advice.
- Include explicit meal-by-meal entries (breakfast/lunch/etc) with grams or household measures.
- Keep output concise but concrete.

Format in clean markdown with headers, bullets, and practical clarity.
`;
}

function buildFallbackPlan() {
  return `
> Notice: Live AI servers are currently under high traffic. A fallback plan is generated so you can keep progressing.

### Target Macros
- Calories: ~2,600 kcal
- Protein: 160g-180g
- Carbohydrates: 280g
- Fats: 75g

### Meal Timetable
- Breakfast (8:00 AM): eggs, whole-grain toast, berries
- Lunch (1:00 PM): grilled chicken, quinoa, broccoli
- Pre-workout (4:30 PM): banana + almonds
- Post-workout (6:30 PM): whey isolate in water
- Dinner (8:00 PM): salmon, sweet potato, asparagus

### Supplementation Protocol
- Creatine monohydrate: 5g daily, every day
- Protein powder: ~25g post-workout to help hit daily target
`;
}

function hasStructuredMealPlan(text: string) {
  const lower = text.toLowerCase();
  const hasMealMarkers =
    lower.includes("breakfast") ||
    lower.includes("lunch") ||
    lower.includes("dinner") ||
    lower.includes("pre-workout") ||
    lower.includes("post-workout");
  const hasMacros = lower.includes("protein") && (lower.includes("carb") || lower.includes("fat"));
  return hasMealMarkers && hasMacros;
}

function buildStructuredMealAppendix(input: Required<MealHistoryInput>) {
  const goalText = input.goal.replaceAll("_", " ");
  const weightNum = Number.parseFloat(input.weight);
  const proteinTarget = Number.isFinite(weightNum)
    ? `${Math.round(weightNum * 1.8)}-${Math.round(weightNum * 2.2)} g`
    : "160-190 g";

  const caloriesByGoal: Record<string, string> = {
    lean_bulk: "2,500-2,900 kcal",
    dirty_bulk: "2,900-3,300 kcal",
    cut: "1,900-2,300 kcal",
    maintenance: "2,200-2,700 kcal",
  };

  const calories = caloriesByGoal[input.goal] ?? "2,300-2,700 kcal";

  return `
## Structured Daily Plan (Auto-completed)
- Goal: ${goalText}
- Calories: ${calories}
- Protein target: ${proteinTarget}
- Dietary preferences: ${input.preferences || "None"}

### Meal Timetable
- Breakfast (8:00): oats (80 g), whey (1 scoop), banana (1), peanut butter (1 tbsp)
- Snack (11:00): greek yogurt (200 g), berries (100 g), almonds (15 g)
- Lunch (13:30): chicken breast (180 g), rice (220 g cooked), mixed vegetables (150 g), olive oil (1 tsp)
- Pre-workout (16:30): toast (2 slices), eggs (2 whole + 2 whites), fruit (1 serving)
- Post-workout (18:30): whey (1 scoop) + creatine monohydrate (5 g) + water
- Dinner (20:30): fish or lean meat (180 g), potatoes (250 g), salad (large bowl)

### Supplement Protocol
- Creatine monohydrate: 3-5 g daily, same time each day.
- Protein powder: use 20-35 g servings only when whole-food protein is short.
- Hydration: 30-40 ml/kg/day, increase in hot climate or high sweat sessions.

### Shopping List (1 Day)
- Protein: chicken/fish/eggs, greek yogurt, whey protein
- Carbs: oats, rice, potatoes, fruit, bread
- Fats: olive oil, nuts, peanut butter
- Micronutrients: mixed vegetables, leafy greens, berries
`;
}

async function persistMealHistory(userId: string | null, input: Required<MealHistoryInput>, generatedPlan: string) {
  if (!userId) return;

  const ageNum = Number.parseInt(input.age, 10);
  const weightNum = Number.parseFloat(input.weight);

  try {
    await prisma.mealHistory.create({
      data: {
        clerkUserId: userId,
        age: Number.isFinite(ageNum) ? ageNum : null,
        weightKg: Number.isFinite(weightNum) ? weightNum : null,
        goal: input.goal || null,
        preferences: input.preferences || null,
        inputData: input,
        generatedPlan,
      },
    });
  } catch (error) {
    // Plan generation should still succeed even if history save fails.
    console.error("Meal history save error:", error);
  }
}

export async function POST(req: Request) {
  let generatedPlan = "";
  let input: Required<MealHistoryInput> = {
    age: "",
    weight: "",
    goal: "",
    preferences: "",
  };

  try {
    const body = await req.json();
    input = {
      age: String(body.age ?? "").trim(),
      weight: String(body.weight ?? "").trim(),
      goal: String(body.goal ?? "").trim(),
      preferences: String(body.preferences ?? "").trim(),
    };

    if (!input.age || !input.weight || !input.goal) {
      return NextResponse.json(
        { error: "Missing required fields: age, weight, goal." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });
    const result = await model.generateContent(buildPrompt(input));
    generatedPlan = result.response.text().trim();

    if (!generatedPlan) {
      return NextResponse.json({ error: "Meal plan generation returned empty output." }, { status: 502 });
    }

    if (!hasStructuredMealPlan(generatedPlan)) {
      generatedPlan = `${generatedPlan}\n\n${buildStructuredMealAppendix(input)}`.trim();
    }
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    const message = err.message ?? "";
    const isHighTrafficFallback =
      err.status === 503 || message.includes("503") || message.toLowerCase().includes("fetch failed");

    if (isHighTrafficFallback) {
      generatedPlan = buildFallbackPlan();
    } else {
      console.error("Meal plan generation error:", error);
      return NextResponse.json(
        { error: "Failed to generate meal plan. Please check API key/model and try again." },
        { status: 500 }
      );
    }
  }

  try {
    const { userId } = await auth();
    await persistMealHistory(userId ?? null, input, generatedPlan);
  } catch (authOrSaveError) {
    // Keep generation response successful even if auth/history write fails.
    console.error("Meal auth/history pipeline warning:", authOrSaveError);
  }

  return NextResponse.json({ plan: generatedPlan });
}
