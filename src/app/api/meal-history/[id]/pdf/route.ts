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

type MealInputData = {
  age?: string;
  weight?: string;
  goal?: string;
  preferences?: string;
};

function isMealInputData(value: unknown): value is MealInputData {
  if (!value || typeof value !== "object") return false;
  return true;
}

function buildMealFallbackLines(input: MealInputData) {
  const goal = input.goal ? input.goal.replaceAll("_", " ") : "General fitness";
  const preferences = input.preferences?.trim() ? input.preferences : "None";
  const weightNum = Number.parseFloat(input.weight ?? "");
  const proteinTarget = Number.isFinite(weightNum)
    ? `${Math.round(weightNum * 1.8)}-${Math.round(weightNum * 2.2)} g`
    : "160-190 g";

  return [
    "Structured Daily Meal Schedule",
    `Goal: ${goal}`,
    `Protein target: ${proteinTarget}`,
    `Preferences: ${preferences}`,
    "",
    "Breakfast (8:00): oats (80 g), whey (1 scoop), banana (1), peanut butter (1 tbsp)",
    "Snack (11:00): greek yogurt (200 g), berries (100 g), almonds (15 g)",
    "Lunch (13:30): chicken/fish (180 g), rice (220 g cooked), vegetables (150 g)",
    "Pre-workout (16:30): whole-grain toast (2 slices), eggs (2 whole + 2 whites), fruit",
    "Post-workout (18:30): whey (1 scoop) + creatine monohydrate (5 g)",
    "Dinner (20:30): lean protein (180 g), potatoes (250 g), large salad",
    "",
    "Hydration: 30-40 ml/kg/day, more in hot weather or high-sweat sessions.",
  ];
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
      .replace(/^[-*+]\s+/, "- ")
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
    const item = await prisma.mealHistory.findFirst({
      where: {
        id,
        clerkUserId: userId,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Meal history entry not found." }, { status: 404 });
    }

    const pdf = await PDFDocument.create();
    let page = pdf.addPage([595.28, 841.89]);
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

    drawLine("FitFusion Meal Plan", { bold: true, size: 18, color: rgb(0.75, 1, 0.4) });
    drawLine(`Generated: ${item.createdAt.toLocaleString()}`, { size: 10, color: rgb(0.33, 0.4, 0.46) });
    drawLine(
      `Goal: ${item.goal ?? "N/A"} | Age: ${item.age ?? "-"} | Weight: ${item.weightKg ?? "-"} kg`,
      { size: 10, color: rgb(0.28, 0.35, 0.42) }
    );
    if (item.preferences) {
      drawLine(`Preferences: ${item.preferences}`, { size: 10, color: rgb(0.28, 0.35, 0.42) });
    }
    cursorY -= 4;

    const rawPlan = item.generatedPlan ?? "";
    const plainTextPlan = markdownToPdfText(rawPlan);
    const hasMealMarkers = /\bbreakfast\b|\blunch\b|\bdinner\b|\bpre-workout\b|\bpost-workout\b/i.test(plainTextPlan);

    const mergedText = (() => {
      if (hasMealMarkers) return plainTextPlan;
      if (isMealInputData(item.inputData)) {
        return `${plainTextPlan}\n\n${buildMealFallbackLines(item.inputData).join("\n")}`;
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
    const filename = `fitfusion-meal-${item.id}.pdf`;

    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Meal PDF export error:", error);
    return NextResponse.json({ error: "Failed to export meal PDF." }, { status: 500 });
  }
}
