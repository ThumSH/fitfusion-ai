import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type WorkoutFormPayload = {
  age: string;
  weight: string;
  height: string;
  goal: string;
  experience: string;
  daysPerWeek: string;
  workoutDuration: string;
  environment: "home" | "gym";
  notes: string;
};

function isWorkoutFormPayload(value: unknown): value is WorkoutFormPayload {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.age === "string" &&
    typeof data.weight === "string" &&
    typeof data.height === "string" &&
    typeof data.goal === "string" &&
    typeof data.experience === "string" &&
    typeof data.daysPerWeek === "string" &&
    typeof data.workoutDuration === "string" &&
    typeof data.notes === "string" &&
    (data.environment === "home" || data.environment === "gym")
  );
}

function clampNumber(input: string, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(input, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function getPreviewLines(formData: WorkoutFormPayload) {
  const days = clampNumber(formData.daysPerWeek, 5, 1, 7);
  const duration = clampNumber(formData.workoutDuration, 30, 20, 120);
  const isHome = formData.environment === "home";
  const isBeginner = formData.experience.toLowerCase().includes("beginner");
  const isStrength = formData.goal.toLowerCase().includes("strength");

  const exerciseCount = duration <= 20 ? 3 : duration <= 30 ? 4 : duration <= 45 ? 5 : 6;
  const reps = isStrength ? (isBeginner ? "3 x 8 reps" : "4 x 5 reps") : isBeginner ? "3 x 10 reps" : "4 x 8-12 reps";
  const rest = isStrength ? "120s rest" : "90s rest";

  const home = {
    warmup: ["Jumping Jacks - 1 min", "Arm Circles - 1 min", "Bodyweight Squats - 1 min"],
    push: ["Incline Push-ups", "Chair Dips", "Pike Push-ups", "Arm Circles", "Diamond Push-ups", "Plank to Down Dog"],
    pull: ["Door Frame Rows", "Superman Holds", "Reverse Snow Angels", "Towel Pull-ins", "Bird-Dog", "Prone Swimmers"],
    legs: ["Lunges", "Glute Bridges", "Wall Sit", "Calf Raises", "Sumo Squats", "Jump Squats"],
  };

  const gym = {
    warmup: ["Treadmill / Bike - 5 mins", "Dynamic Arm Swings - 1 min", "Bodyweight Lunges - 1 min"],
    push: ["Bench Press", "Dumbbell Flyes", "Overhead Press", "Tricep Extensions", "Lateral Raises", "Push-ups"],
    pull: ["Deadlifts", "Barbell Rows", "Lat Pulldowns", "Face Pulls", "Hammer Curls", "Back Extensions"],
    legs: ["Barbell Squats", "Romanian Deadlifts", "Leg Press", "Walking Lunges", "Calf Raises", "Hip Thrusts"],
  };

  const active = isHome ? home : gym;
  const lines: string[] = [];
  lines.push("Workout Schedule Snapshot");
  lines.push(`Environment: ${isHome ? "Home" : "Gym"} | Session: ${duration} min | ${days} days/week`);
  lines.push("");

  for (let day = 1; day <= days; day += 1) {
    const rotation = (day - 1) % 3;
    const focus = rotation === 0 ? "Push Focus" : rotation === 1 ? "Pull Focus" : "Legs & Core";
    const exercises = (rotation === 0 ? active.push : rotation === 1 ? active.pull : active.legs).slice(0, exerciseCount);

    lines.push(`Day ${day}: ${focus}`);
    lines.push(`Warm-up: ${active.warmup.join(", ")}`);
    for (const exercise of exercises) {
      lines.push(`- ${exercise} | ${reps} | ${rest}`);
    }
    lines.push("");
  }

  return lines;
}

function markdownToPdfText(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const result: string[] = [];
  let inCodeBlock = false;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (!trimmed) {
      result.push("");
      continue;
    }

    if (inCodeBlock) {
      result.push(trimmed);
      continue;
    }

    if (/^\|/.test(trimmed)) {
      const isSeparator = /^(\|\s*:?-{2,}:?\s*)+\|?$/.test(trimmed);
      if (isSeparator) continue;
      const cells = trimmed
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      result.push(cells.join(" | "));
      continue;
    }

    let line = trimmed
      .replace(/^#{1,6}\s*/, "")
      .replace(/^>\s?/, "")
      .replace(/^\d+\.\s+/, "")
      .replace(/^[-*+]\s+/, "• ")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)")
      .replace(/!\[(.*?)\]\((.*?)\)/g, "Image: $1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/_(.*?)_/g, "$1");

    line = line
      .replace(/[“”]/g, "\"")
      .replace(/[‘’]/g, "'")
      .replace(/[—–]/g, "-")
      .replace(/…/g, "...")
      .replace(/•/g, "-")
      .normalize("NFKD")
      .replace(/[^\x20-\x7E\n]/g, "");

    if (line.trim()) {
      result.push(line);
    } else {
      result.push("");
    }
  }

  return result.join("\n");
}

function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number) {
  const result: string[] = [];
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      result.push("");
      continue;
    }

    const words = paragraph.split(/\s+/);
    let line = "";

    for (const word of words) {
      if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
        const chars = word.split("");
        let chunk = "";
        for (const ch of chars) {
          const candidateChunk = `${chunk}${ch}`;
          if (font.widthOfTextAtSize(candidateChunk, fontSize) <= maxWidth) {
            chunk = candidateChunk;
          } else {
            if (chunk) result.push(chunk);
            chunk = ch;
          }
        }
        if (chunk) {
          if (line) result.push(line);
          line = chunk;
        }
        continue;
      }

      const candidate = line ? `${line} ${word}` : word;
      const width = font.widthOfTextAtSize(candidate, fontSize);
      if (width <= maxWidth) {
        line = candidate;
      } else {
        if (line) result.push(line);
        line = word;
      }
    }

    if (line) result.push(line);
  }

  return result;
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const item = await prisma.workoutHistory.findFirst({
      where: {
        id,
        clerkUserId: userId,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Workout history entry not found." }, { status: 404 });
    }

    const pdf = await PDFDocument.create();
    let page = pdf.addPage([595.28, 841.89]); // A4 portrait
    const regularFont = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    const marginX = 48;
    const marginY = 48;
    const lineHeight = 16;
    const textSize = 11;
    const contentWidth = page.getWidth() - marginX * 2;
    let cursorY = page.getHeight() - marginY;

    const drawLine = (text: string, options?: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb> }) => {
      const size = options?.size ?? textSize;
      const font = options?.bold ? boldFont : regularFont;
      const color = options?.color ?? rgb(0.12, 0.16, 0.2);
      page.drawText(text, {
        x: marginX,
        y: cursorY,
        size,
        font,
        color,
      });
      cursorY -= size + 5;
    };

    const ensureSpace = (neededLines = 1) => {
      const neededHeight = neededLines * lineHeight;
      if (cursorY - neededHeight < marginY) {
        page = pdf.addPage([595.28, 841.89]);
        cursorY = page.getHeight() - marginY;
      }
    };

    drawLine("FitFusion Workout Plan", { bold: true, size: 18, color: rgb(0.75, 1, 0.4) });
    drawLine(`Generated: ${item.createdAt.toLocaleString()}`, { size: 10, color: rgb(0.33, 0.4, 0.46) });
    cursorY -= 4;

    const rawPlan = item.generatedPlan ?? "";
    const plainTextPlan = markdownToPdfText(rawPlan);
    const hasWorkoutMarkers = /\bday\s*\d+\b|\bsets?\b|\breps?\b|\bwarm[\s-]?up\b/i.test(plainTextPlan);

    const mergedText = (() => {
      if (hasWorkoutMarkers) return plainTextPlan;
      if (isWorkoutFormPayload(item.formData)) {
        return `${plainTextPlan}\n\n${getPreviewLines(item.formData).join("\n")}`;
      }
      return plainTextPlan;
    })();

    const lines = wrapText(mergedText, contentWidth, regularFont, textSize);
    for (const line of lines) {
      ensureSpace(1);
      if (!line) {
        cursorY -= 7;
        continue;
      }
      page.drawText(line, {
        x: marginX,
        y: cursorY,
        size: textSize,
        font: regularFont,
        color: rgb(0.12, 0.12, 0.12),
      });
      cursorY -= lineHeight;
    }

    const pdfBytes = await pdf.save();
    const filename = `fitfusion-workout-${item.id}.pdf`;

    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Workout PDF export error:", error);
    return NextResponse.json({ error: "Failed to export workout PDF." }, { status: 500 });
  }
}
