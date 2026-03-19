export type MuscleGroupId =
  | "arms"
  | "chest"
  | "shoulders"
  | "abs"
  | "legs"
  | "back";

export type SubMuscle = {
  name: string;
  description: string;
  x: number; // Percentage (0-100) for UI positioning
  y: number; // Percentage (0-100) for UI positioning
};

export type MuscleGroupData = {
  id: MuscleGroupId;
  label: string;
  description: string;
  imageUrl: string;
  subMuscles: SubMuscle[]; // Replaced the string array with our new detailed object
  workouts: string[];
  tips: string[];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
};