import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.workoutHistory.findFirst({
      where: {
        id,
        clerkUserId: userId,
      },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Workout history entry not found." }, { status: 404 });
    }

    await prisma.workoutHistory.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Workout history DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete workout history." }, { status: 500 });
  }
}
