import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { WorkoutFormPayload } from "@/types/workout-history";

export const runtime = "nodejs";

function isValidFormPayload(value: unknown): value is WorkoutFormPayload {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  const requiredStringFields = [
    "age",
    "weight",
    "height",
    "goal",
    "experience",
    "daysPerWeek",
    "workoutDuration",
    "notes",
  ];
  const hasValidStrings = requiredStringFields.every((field) => typeof data[field] === "string");
  if (!hasValidStrings) return false;
  return data.environment === "home" || data.environment === "gym";
}

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

    const items = await prisma.workoutHistory.findMany({
      where: { clerkUserId: userId },
      orderBy: { createdAt: "desc" },
      take: safeLimit,
    });

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        userId: item.clerkUserId,
        createdAt: item.createdAt.toISOString(),
        formData: item.formData,
        generatedPlan: item.generatedPlan,
      })),
    });
  } catch (error) {
    console.error("Workout history GET error:", error);
    return NextResponse.json({ error: "Failed to load workout history." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const generatedPlan = typeof body.generatedPlan === "string" ? body.generatedPlan.trim() : "";
    const formData = body.formData;

    if (!generatedPlan) {
      return NextResponse.json({ error: "Missing generated plan content." }, { status: 400 });
    }
    if (!isValidFormPayload(formData)) {
      return NextResponse.json({ error: "Invalid form payload." }, { status: 400 });
    }

    const item = await prisma.workoutHistory.create({
      data: {
        clerkUserId: userId,
        formData,
        generatedPlan,
      },
    });

    return NextResponse.json(
      {
        item: {
          id: item.id,
          userId: item.clerkUserId,
          createdAt: item.createdAt.toISOString(),
          formData: item.formData,
          generatedPlan: item.generatedPlan,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Workout history POST error:", error);
    return NextResponse.json({ error: "Failed to save workout plan." }, { status: 500 });
  }
}
