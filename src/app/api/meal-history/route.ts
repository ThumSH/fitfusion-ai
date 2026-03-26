import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitRaw = Number(searchParams.get("limit"));
    const limit = Number.isFinite(limitRaw) ? limitRaw : 20;
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const items = await prisma.mealHistory.findMany({
      where: { clerkUserId: userId },
      orderBy: { createdAt: "desc" },
      take: safeLimit,
    });

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        userId: item.clerkUserId,
        createdAt: item.createdAt.toISOString(),
        age: item.age,
        weightKg: item.weightKg,
        goal: item.goal,
        preferences: item.preferences,
        generatedPlan: item.generatedPlan,
        inputData: item.inputData,
      })),
    });
  } catch (error) {
    console.error("Meal history GET error:", error);
    return NextResponse.json({ error: "Failed to load meal history." }, { status: 500 });
  }
}
