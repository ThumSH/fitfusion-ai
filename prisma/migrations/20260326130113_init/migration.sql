-- CreateTable
CREATE TABLE "WorkoutHistory" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "generatedPlan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealHistory" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "age" INTEGER,
    "weightKg" DOUBLE PRECISION,
    "goal" TEXT,
    "preferences" TEXT,
    "inputData" JSONB NOT NULL,
    "generatedPlan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkoutHistory_clerkUserId_createdAt_idx" ON "WorkoutHistory"("clerkUserId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "MealHistory_clerkUserId_createdAt_idx" ON "MealHistory"("clerkUserId", "createdAt" DESC);
