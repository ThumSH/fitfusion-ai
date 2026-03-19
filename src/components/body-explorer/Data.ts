import type { MuscleGroupData, MuscleGroupId } from "./ideal";

export const muscleData: Record<MuscleGroupId, MuscleGroupData> = {
  arms: {
    id: "arms",
    label: "Arms",
    description: "The arms support pulling, curling, pressing, and extension-based movements.",
    imageUrl: "/arm.png",
    subMuscles: [
      {
        name: "Biceps Brachii",
        description: "The primary muscle for elbow flexion and forearm supination. Targeted with curls.",
        x: 40, y: 35,
      },
      {
        name: "Triceps Brachii",
        description: "Makes up about 2/3 of the upper arm mass. Responsible for elbow extension.",
        x: 75, y: 40,
      },
      {
        name: "Brachialis",
        description: "Lies beneath the biceps. Pushes the biceps up to create a thicker arm profile.",
        x: 55, y: 55,
      },
      {
        name: "Forearms (Flexors/Extensors)",
        description: "Controls grip strength and wrist movement. Crucial for heavy pulling movements.",
        x: 50, y: 80,
      }
    ],
    workouts: ["Bicep Curls", "Hammer Curls", "Tricep Dips", "Tricep Pushdowns"],
    tips: [
      "Avoid swinging the weight",
      "Use controlled tempo",
      "Keep elbows stable during curls"
    ],
    cameraPosition: [1.1, 0.65, 1.2],
    cameraTarget: [0.5, 0.55, 0],
  },

  chest: {
    id: "chest",
    label: "Chest",
    description: "The chest muscles are the primary pushing muscles of the upper body.",
    imageUrl: "/chest.png",
    subMuscles: [
      {
        name: "Clavicular Head (Upper Chest)",
        description: "Attaches to the collarbone. Best targeted with incline pressing movements.",
        x: 50, y: 25,
      },
      {
        name: "Sternocostal Head (Mid/Lower Chest)",
        description: "The largest portion of the chest. Handles heavy flat pressing and flyes.",
        x: 50, y: 65,
      },
      {
        name: "Pectoralis Minor",
        description: "A smaller muscle situated beneath the pec major, assisting with drawing the shoulder blade forward.",
        x: 75, y: 45,
      }
    ],
    workouts: ["Bench Press", "Incline Dumbbell Press", "Cable Crossovers", "Dips"],
    tips: [
      "Retract shoulder blades for stability",
      "Focus on the stretch at the bottom of the movement",
      "Keep wrists straight during presses"
    ],
    cameraPosition: [0, 0.85, 1.5],
    cameraTarget: [0, 0.7, 0],
  },

  shoulders: {
    id: "shoulders",
    label: "Shoulders",
    description: "The deltoid is a large, triangular muscle covering the shoulder joint, crucial for arm elevation and rotation.",
    imageUrl: "/shoulder.png",
    subMuscles: [
      {
        name: "Anterior Deltoid (Front)",
        description: "Lifts the arm forward. Highly engaged in pressing movements like bench press and overhead press.",
        x: 20, y: 50,
      },
      {
        name: "Lateral Deltoid (Side)",
        description: "Lifts the arm out to the side. Essential for broad shoulder width. Best targeted with lateral raises.",
        x: 50, y: 20,
      },
      {
        name: "Posterior Deltoid (Rear)",
        description: "Pulls the arm backward. Critical for posture and shoulder health. Targeted with face pulls.",
        x: 80, y: 50,
      }
    ],
    workouts: ["Overhead Press", "Lateral Raises", "Front Raises", "Face Pulls"],
    tips: [
      "Don't shrug your traps during lateral raises",
      "Ensure rear delts get equal volume to prevent injury",
      "Keep elbows slightly bent during raises"
    ],
    cameraPosition: [0, 1.2, 1.4],
    cameraTarget: [0, 1.0, 0],
  },

  abs: {
    id: "abs",
    label: "Abs",
    description: "The core stabilizes the torso and supports balance, posture, and overall movement quality.",
    imageUrl: "/abs.png",
    subMuscles: [
      {
        name: "Rectus Abdominis (Upper)",
        description: "The visible 'six-pack' muscles responsible for flexing the lumbar spine.",
        x: 50, y: 25,
      },
      {
        name: "External Obliques",
        description: "Located on the sides of the abdomen. Responsible for trunk rotation and lateral flexion.",
        x: 25, y: 45,
      },
      {
        name: "Transverse Abdominis",
        description: "The deep core muscle acting as a natural weight belt to stabilize the pelvis and spine.",
        x: 75, y: 45,
      },
      {
        name: "Rectus Abdominis (Lower)",
        description: "The lower portion of the abdominal wall. Heavily engaged during leg raising movements.",
        x: 50, y: 65,
      }
    ],
    workouts: ["Plank", "Cable Crunches", "Hanging Leg Raises", "Russian Twists"],
    tips: [
      "Control the torso instead of rushing reps",
      "Train stability as well as flexion",
      "Avoid excessive neck pulling during crunches"
    ],
    cameraPosition: [0, 0.45, 1.4],
    cameraTarget: [0, 0.45, 0],
  },

  legs: {
    id: "legs",
    label: "Legs",
    description: "The legs generate power, mobility, balance, and foundational strength for the body.",
    imageUrl: "/legs.jpg",
    subMuscles: [
      {
        name: "Gluteus Maximus",
        description: "The largest muscle in the body, responsible for hip extension and explosive power.",
        x: 30, y: 15,
      },
      {
        name: "Quadriceps",
        description: "A group of four muscles on the front of the thigh that extend the knee.",
        x: 50, y: 40,
      },
      {
        name: "Hamstrings",
        description: "Located on the back of the thigh, these muscles bend the knee and assist in hip extension.",
        x: 75, y: 45,
      },
      {
        name: "Gastrocnemius (Calves)",
        description: "The visible calf muscle responsible for plantar flexion (pointing the toes).",
        x: 50, y: 80,
      }
    ],
    workouts: ["Barbell Squats", "Romanian Deadlifts", "Leg Press", "Calf Raises"],
    tips: [
      "Focus on knee and hip alignment",
      "Control the lowering phase",
      "Do not sacrifice form for load"
    ],
    cameraPosition: [0, -0.7, 1.9],
    cameraTarget: [0, -0.95, 0],
  },

  back: {
    id: "back",
    label: "Back",
    description: "The back supports posture, pulling strength, and upper-body stability.",
    imageUrl: "/back.png",
    subMuscles: [
      {
        name: "Trapezius",
        description: "Spans the neck and mid-back. Controls scapular elevation, depression, and retraction.",
        x: 50, y: 20,
      },
      {
        name: "Latissimus Dorsi",
        description: "The large 'V-taper' muscles on the sides of the back. Primary movers for vertical and horizontal pulls.",
        x: 25, y: 50,
      },
      {
        name: "Rhomboids",
        description: "Located underneath the mid-traps. Pulls the shoulder blades together for structural integrity.",
        x: 50, y: 45,
      },
      {
        name: "Erector Spinae (Lower Back)",
        description: "The muscles running along the spine that keep the torso upright and extend the back.",
        x: 50, y: 80,
      }
    ],
    workouts: ["Barbell Rows", "Lat Pulldowns", "Deadlifts", "Pull-Ups"],
    tips: [
      "Initiate pulls with the back, not just the arms",
      "Keep your spine neutral",
      "Do not yank the weight"
    ],
    cameraPosition: [0, 0.9, -1.8],
    cameraTarget: [0, 0.7, 0],
  },
};