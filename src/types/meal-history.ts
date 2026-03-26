export type MealHistoryInput = {
  age?: string;
  weight?: string;
  goal?: string;
  preferences?: string;
};

export type MealHistoryItem = {
  id: string;
  userId: string;
  createdAt: string;
  age: number | null;
  weightKg: number | null;
  goal: string | null;
  preferences: string | null;
  generatedPlan: string;
  inputData: MealHistoryInput;
};
