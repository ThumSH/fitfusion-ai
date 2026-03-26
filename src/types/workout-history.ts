export type WorkoutFormPayload = {
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

export type WorkoutHistoryItem = {
  id: string;
  userId: string;
  createdAt: string;
  formData: WorkoutFormPayload;
  generatedPlan: string;
};
