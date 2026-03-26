import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

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
      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
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

function workoutMeta(formData: unknown) {
  if (!formData || typeof formData !== "object") return "";
  const value = formData as Record<string, unknown>;
  const goal = typeof value.goal === "string" ? value.goal : "N/A";
  const environment = value.environment === "home" || value.environment === "gym" ? value.environment : "N/A";
  const duration = typeof value.workoutDuration === "string" ? value.workoutDuration : "N/A";
  const days = typeof value.daysPerWeek === "string" ? value.daysPerWeek : "N/A";
  return `Goal: ${goal} | ${String(environment).toUpperCase()} | ${duration} min | ${days} days/week`;
}

function mealMeta(inputData: unknown) {
  if (!inputData || typeof inputData !== "object") return "";
  const value = inputData as Record<string, unknown>;
  const goal = typeof value.goal === "string" ? value.goal : "N/A";
  const age = typeof value.age === "string" ? value.age : "-";
  const weight = typeof value.weight === "string" ? value.weight : "-";
  return `Goal: ${goal} | Age: ${age} | Weight: ${weight} kg`;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get("workoutId");
    const mealId = searchParams.get("mealId");

    const [workoutItem, mealItem] = await Promise.all([
      workoutId
        ? prisma.workoutHistory.findFirst({
            where: { id: workoutId, clerkUserId: userId },
          })
        : prisma.workoutHistory.findFirst({
            where: { clerkUserId: userId },
            orderBy: { createdAt: "desc" },
          }),
      mealId
        ? prisma.mealHistory.findFirst({
            where: { id: mealId, clerkUserId: userId },
          })
        : prisma.mealHistory.findFirst({
            where: { clerkUserId: userId },
            orderBy: { createdAt: "desc" },
          }),
    ]);

    if (!workoutItem && !mealItem) {
      return NextResponse.json({ error: "No workout or meal history found for export." }, { status: 404 });
    }

    const pdf = await PDFDocument.create();
    let page = pdf.addPage([595.28, 841.89]);
    const regularFont = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    const marginX = 48;
    const marginY = 48;
    const textSize = 11;
    const lineHeight = 16;
    const contentWidth = page.getWidth() - marginX * 2;
    let cursorY = page.getHeight() - marginY;

    const ensureSpace = (neededLines = 1) => {
      const neededHeight = neededLines * lineHeight;
      if (cursorY - neededHeight < marginY) {
        page = pdf.addPage([595.28, 841.89]);
        cursorY = page.getHeight() - marginY;
      }
    };

    const drawLine = (text: string, options?: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb> }) => {
      const size = options?.size ?? textSize;
      const font = options?.bold ? boldFont : regularFont;
      const color = options?.color ?? rgb(0.12, 0.12, 0.12);
      page.drawText(text, {
        x: marginX,
        y: cursorY,
        size,
        font,
        color,
      });
      cursorY -= size + 5;
    };

    drawLine("FitFusion Combined Report", { bold: true, size: 18, color: rgb(0.75, 1, 0.4) });
    drawLine(`Generated: ${new Date().toLocaleString()}`, { size: 10, color: rgb(0.33, 0.4, 0.46) });
    cursorY -= 4;

    const renderSection = (title: string, meta: string, generatedPlan: string, createdAt: Date) => {
      ensureSpace(4);
      drawLine(title, { bold: true, size: 14, color: rgb(0.1, 0.3, 0.56) });
      drawLine(`Saved: ${createdAt.toLocaleString()}`, { size: 10, color: rgb(0.28, 0.35, 0.42) });
      if (meta) {
        drawLine(meta, { size: 10, color: rgb(0.28, 0.35, 0.42) });
      }
      cursorY -= 2;

      const plainText = markdownToPdfText(generatedPlan || "");
      const lines = wrapText(plainText, contentWidth, regularFont, textSize);
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
      cursorY -= 8;
    };

    if (workoutItem) {
      renderSection("Workout Plan", workoutMeta(workoutItem.formData), workoutItem.generatedPlan, workoutItem.createdAt);
    }

    if (mealItem) {
      renderSection("Meal Plan", mealMeta(mealItem.inputData), mealItem.generatedPlan, mealItem.createdAt);
    }

    const pdfBytes = await pdf.save();
    const filename = `fitfusion-combined-${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Combined PDF export error:", error);
    return NextResponse.json({ error: "Failed to export combined history PDF." }, { status: 500 });
  }
}
