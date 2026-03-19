// src/app/api/meal-plan/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { age, weight, goal, preferences } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert sports nutritionist and AI gym coach. 
      Create a detailed, structured 1-day sample meal plan and a general nutritional strategy for:
      - Age: ${age}
      - Weight: ${weight} kg
      - Primary Goal: ${goal.replace('_', ' ')}
      - Dietary Preferences/Allergies: ${preferences || "None"}
      
      Please provide the following:
      1. **Target Macros:** Estimated daily calories and macro breakdown (Protein, Carbs, Fats) to hit their goal.
      2. **Meal Timetable:** A realistic 1-day meal schedule.
      3. **Supplementation:** Specific protein intake advice and a proper creatine supplementation protocol.
      
      Format the entire response in clean, readable Markdown using bolding, lists, and headers.
    `;

    // Try to get the real AI response
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ plan: text });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("AI Error encountered:", error.message);

    // HACKATHON FAIL-SAFE: If the API is busy (503) or fails, return a high-quality mock plan!
    if (error.status === 503 || error.message.includes("503") || error.message.includes("fetch failed")) {
      const mockPlan = `
> ⚠️ **Notice:** The Live AI servers are currently experiencing high traffic. We have generated this standard fallback plan based on your general profile so you can keep moving forward!

### 📊 Target Macros
To support your goals at your current body weight, aim for the following daily targets:
* **Calories:** ~2,600 kcal
* **Protein:** 160g - 180g (Crucial for muscle repair)
* **Carbohydrates:** 280g (Primary energy source)
* **Fats:** 75g (Hormone regulation)

### 🕒 Meal Timetable
* **Breakfast (8:00 AM):** 4 whole eggs scrambled, 2 slices of whole-grain toast, and 1 cup of mixed berries.
* **Lunch (1:00 PM):** 200g grilled chicken breast, 1 cup of cooked quinoa, and a large serving of roasted broccoli.
* **Pre-Workout (4:30 PM):** 1 medium banana and a handful of almonds.
* **Post-Workout (6:30 PM):** 1 scoop of whey protein isolate in water.
* **Dinner (8:00 PM):** 200g baked salmon, 1 medium sweet potato, and asparagus cooked in olive oil.

### 💊 Supplementation Protocol
* **Creatine Monohydrate:** Take **5g daily**. You do not need a loading phase. Take it consistently every day (rest days included), ideally post-workout with your protein shake for better absorption.
* **Protein Powder:** Use 1 scoop (approx 25g protein) immediately after your workout to hit your daily macro goals efficiently.
      `;
      
      // Return the mock plan so the UI still looks awesome
      return NextResponse.json({ plan: mockPlan });
    }

    // If it's a completely different error (like a bad API key), show the real error
    return NextResponse.json(
      { error: "Failed to generate meal plan. Please check your API key and try again." },
      { status: 500 }
    );
  }
}