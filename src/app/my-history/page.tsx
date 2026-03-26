import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { History, Utensils, Dumbbell, ArrowRight, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteHistoryButton from "@/components/history/DeleteHistoryButton";

type WorkoutFormData = {
  goal?: string;
  environment?: "home" | "gym";
  workoutDuration?: string;
  daysPerWeek?: string;
};

type MealInputData = {
  goal?: string;
  age?: string;
  weight?: string;
};

function toWorkoutFormData(value: unknown): WorkoutFormData {
  if (!value || typeof value !== "object") return {};
  const raw = value as Record<string, unknown>;
  return {
    goal: typeof raw.goal === "string" ? raw.goal : undefined,
    environment: raw.environment === "home" || raw.environment === "gym" ? raw.environment : undefined,
    workoutDuration: typeof raw.workoutDuration === "string" ? raw.workoutDuration : undefined,
    daysPerWeek: typeof raw.daysPerWeek === "string" ? raw.daysPerWeek : undefined,
  };
}

function toMealInputData(value: unknown): MealInputData {
  if (!value || typeof value !== "object") return {};
  const raw = value as Record<string, unknown>;
  return {
    goal: typeof raw.goal === "string" ? raw.goal : undefined,
    age: typeof raw.age === "string" ? raw.age : undefined,
    weight: typeof raw.weight === "string" ? raw.weight : undefined,
  };
}

export default async function MyHistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="relative min-h-screen bg-black px-4 pb-20 pt-28 text-white sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="container-shell relative z-10 space-y-8">
          <div className="rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl md:p-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5">
              <History size={14} className="text-primary" />
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#dff8be] uppercase">My History</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
              Workout + Meal History
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
              Sign in to access your saved workout plans, meal plans, and PDF exports.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-[#dff8be] uppercase transition hover:border-primary/50 hover:bg-primary/15"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-white/85 uppercase transition hover:border-primary/40 hover:text-primary"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [workoutHistory, mealHistory] = await Promise.all([
    prisma.workoutHistory.findMany({
      where: { clerkUserId: userId },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
    prisma.mealHistory.findMany({
      where: { clerkUserId: userId },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);
  const latestWorkoutId = workoutHistory[0]?.id;
  const latestMealId = mealHistory[0]?.id;
  const combinedExportParams = new URLSearchParams();
  if (latestWorkoutId) combinedExportParams.set("workoutId", latestWorkoutId);
  if (latestMealId) combinedExportParams.set("mealId", latestMealId);
  const combinedExportHref = combinedExportParams.toString()
    ? `/api/history/combined-pdf?${combinedExportParams.toString()}`
    : null;

  return (
    <div className="relative min-h-screen bg-black px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container-shell relative z-10 space-y-8">
        <div className="rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl md:p-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5">
            <History size={14} className="text-primary" />
            <span className="text-[11px] font-bold tracking-[0.18em] text-[#dff8be] uppercase">My History</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Workout + Meal History
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
            Review everything you generated, revisit old plans, and keep your progress organized.
          </p>
          {combinedExportHref && (
            <div className="mt-5">
              <a
                href={combinedExportHref}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-[#dff8be] uppercase transition hover:border-primary/50 hover:bg-primary/15"
              >
                <Download size={13} />
                Export Latest Workout + Meal PDF
              </a>
            </div>
          )}
        </div>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl md:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-wide text-white uppercase">
                <Dumbbell size={18} className="text-primary" />
                Workout History
              </h2>
              <Link
                href="/workout-planner#planner-tool"
                className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.15em] text-primary uppercase"
              >
                Open Planner <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {workoutHistory.length === 0 && (
                <p className="text-sm text-white/60">No saved workout plans yet.</p>
              )}
              {workoutHistory.map((item) => {
                const formData = toWorkoutFormData(item.formData);
                return (
                  <article key={item.id} className="rounded-2xl border border-white/10 bg-white/2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                          {formData.goal || "Workout Plan"}
                        </p>
                        <p className="mt-1 text-xs text-white/65">
                          {item.createdAt.toLocaleString()} | {(formData.environment || "home").toUpperCase()} |{" "}
                          {formData.workoutDuration || "30"} min | {formData.daysPerWeek || "5"} days/week
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/api/workout-history/${item.id}/pdf`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#dff8be] uppercase transition hover:border-primary/50 hover:bg-primary/15"
                        >
                          <Download size={12} />
                          PDF
                        </a>
                        <DeleteHistoryButton id={item.id} type="workout" />
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-3 text-xs leading-6 text-white/70">{item.generatedPlan}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl md:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-wide text-white uppercase">
                <Utensils size={18} className="text-primary" />
                Meal History
              </h2>
              <Link
                href="/meal-planner#nutrition-tool"
                className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.15em] text-primary uppercase"
              >
                Open Planner <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {mealHistory.length === 0 && <p className="text-sm text-white/60">No meal plans yet.</p>}
              {mealHistory.map((item) => {
                const input = toMealInputData(item.inputData);
                return (
                  <article key={item.id} className="rounded-2xl border border-white/10 bg-white/2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                          {item.goal || input.goal || "Meal Plan"}
                        </p>
                        <p className="mt-1 text-xs text-white/65">
                          {item.createdAt.toLocaleString()} | Age: {item.age ?? input.age ?? "-"} | Weight:{" "}
                          {item.weightKg ?? input.weight ?? "-"} kg
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/api/meal-history/${item.id}/pdf`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#dff8be] uppercase transition hover:border-primary/50 hover:bg-primary/15"
                        >
                          <Download size={12} />
                          PDF
                        </a>
                        <DeleteHistoryButton id={item.id} type="meal" />
                      </div>
                    </div>
                    {item.preferences && (
                      <p className="mt-1 text-[11px] text-white/55">Prefs: {item.preferences}</p>
                    )}
                    <p className="mt-3 line-clamp-3 text-xs leading-6 text-white/70">{item.generatedPlan}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
