"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  Clock, 
  ArrowRight,
  Flame,
  Activity,
  Dumbbell,
  Timer,
  Zap
} from "lucide-react";

// --- TYPES & INTERFACES ---
interface Particle {
  id: number;
  x: string;
  y: string;
  opacity: number;
  duration: number;
  delay: number;
  moveY: string;
}

interface FormDataState {
  age: string;
  weight: string;
  height: string;
  goal: string;
  experience: string;
  daysPerWeek: string;
  workoutDuration: string;
  environment: "home" | "gym"; 
}

interface WorkoutSession {
  day: number;
  title: string;
  note: string;
  warmup: string[];
  exercises: { name: string; reps: string; rest: string }[];
}

// --- PARTICLE BACKGROUND ---
const ParticleBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const newParticles: Particle[] = [...Array(25)].map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      opacity: Math.random() * 0.3,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      moveY: Math.random() * -100 - 50 + "px"
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-[#ccff00] rounded-full"
          style={{ left: p.x, top: p.y, opacity: p.opacity }}
          animate={{
            y: [0, p.moveY],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function WorkoutGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [formData, setFormData] = useState<FormDataState>({
    age: "", 
    weight: "", 
    height: "",
    goal: "Bulking (Gain Muscle Mass)",
    experience: "Beginner (0–6 months)",
    daysPerWeek: "5",
    workoutDuration: "20",
    environment: "home", 
  });

  const generateProWorkout = (): WorkoutSession[] => {
    const { age, height, weight, goal, experience, workoutDuration, daysPerWeek, environment } = formData;
    
    const isHome = environment === "home";
    const isBeginner = experience.includes("Beginner");
    const isAdvanced = experience.includes("Advanced");
    const isCutting = goal.includes("Cutting") || goal.includes("Loss") || goal.includes("Lean");
    const isStrength = goal.includes("Strength");
    
    const days = parseInt(daysPerWeek);
    const duration = parseInt(workoutDuration);

    const userAge = parseInt(age) || 25; 
    const userWeight = parseFloat(weight) || 70;
    const userHeight = parseFloat(height) || 170;
    const bmi = userWeight / Math.pow(userHeight / 100, 2);
    
    const isLowImpact = userAge >= 45 || bmi >= 28;
    const exerciseCount = duration === 20 ? 3 : duration === 30 ? 4 : duration === 45 ? 5 : 6;

    let sessionStyle = {
      label: "3 x 10-12 Reps",
      rest: "60S REST",
      note: "Control the weight. Focus on the muscle contraction."
    };

    if (isCutting) {
      sessionStyle = { 
        label: duration <= 30 ? "40s Work" : "45s Work", 
        rest: duration <= 30 ? "20S REST" : "15S REST", 
        note: `Perform each exercise for ${duration <= 30 ? '40s' : '45s'}, rest ${duration <= 30 ? '20s' : '15s'}. Complete 3-4 full rounds.` 
      };
    } else if (isStrength) {
      sessionStyle = { 
        label: isBeginner ? "3 x 8 Reps" : isAdvanced ? "5 x 3-5 Reps" : "4 x 5 Reps", 
        rest: isAdvanced ? "150S REST" : "120S REST", 
        note: "Heavy resistance. Rest long enough to stay strong." 
      };
    } else {
      sessionStyle = {
        label: isBeginner ? "3 x 10 Reps" : "4 x 8-12 Reps",
        rest: "90S REST",
        note: "Focus on time under tension and progressive overload."
      };
    }

    if (isLowImpact) {
      const restInt = parseInt(sessionStyle.rest);
      sessionStyle.rest = isNaN(restInt) ? "90S REST" : `${restInt + 30}S REST`;
      sessionStyle.note += " Adjusted for joint health.";
    } else if (userAge < 25) {
      sessionStyle.note += " Prime metabolic phase. Push the intensity!";
    }

    const db = {
      home: {
        fatBurn: isLowImpact ? ["Step Jacks", "Box Squats", "Incline Push-ups", "Slow Mountain Climbers", "Plank", "High Knee Marches"] : ["Jumping Jacks", "Bodyweight Squats", "Push-ups", "Mountain Climbers", "Plank", "Burpees"],
        push: isLowImpact ? ["Wall Push-ups", "Chair Dips", "Knee Push-ups", "Arm Circles", "Superman Holds", "Plank to Down Dog"] : ["Incline Push-ups", "Chair Dips", "Pike Push-ups", "Arm Circles", "Superman Holds", "Diamond Push-ups"],
        pull: ["Door Frame Rows", "Superman Holds", "Reverse Snow Angels", "Towel Pull-ins", "Bird-Dog", "Prone Swimmers"],
        legs: isLowImpact ? ["Assisted Lunges", "Glute Bridges", "Wall Sit", "Calf Raises", "Sumo Squats", "Step-ups"] : ["Lunges", "Glute Bridges", "Wall Sit", "Calf Raises", "Sumo Squats", "Jump Squats"],
        core: ["Bicycle Crunches", "Leg Raises", "Russian Twists", "High Knees", "Shoulder Taps", "Flutter Kicks"],
        hiit: isLowImpact ? ["Speed Squats", "Fast Punches", "Step Jacks", "Glute Kickbacks", "Brisk Marching", "Standing Crunches"] : ["Burpees", "Skater Hops", "Jump Squats", "Butt Kicks", "Mountain Climbers", "High Knees"]
      },
      gym: {
        push: isBeginner ? ["Machine Chest Press", "DB Overhead Press", "Tricep Rope Pushdowns", "Lateral Raises", "Push-ups", "Pec Deck Machine"] : ["Bench Press", "Dumbbell Flyes", "Weighted Dips", "Overhead Press", "Tricep Extensions", "Cable Crossovers"],
        pull: isBeginner ? ["Seated Rows", "Lat Pulldowns", "Face Pulls", "Bicep Curls", "Back Extensions", "Machine Shrugs"] : ["Deadlifts", "Barbell Rows", "Pullups", "Hammer Curls", "Face Pulls", "Dumbbell Pullovers"],
        legs: isLowImpact ? ["Leg Press", "Leg Extensions", "Seated Calf Raises", "Goblet Squats", "Hamstring Curls", "Hip Abductions"] : isBeginner ? ["Leg Press", "Leg Extensions", "Calf Raises", "Goblet Squats", "Hamstring Curls", "Walking Lunges"] : ["Barbell Squats", "Romanian Deadlifts", "Leg Press", "Walking Lunges", "Calf Raises", "Hip Thrusts"],
        core: ["Hanging Leg Raises", "Cable Crunches", "Ab Wheel", "Weighted Plank", "Russian Twists", "Decline Crunches"]
      }
    };

    const warmups = {
      home: isLowImpact ? ["Arm Circles - 1 min", "Torso Twists - 1 min", "High Knee Marches - 1 min"] : ["Jumping Jacks - 1 min", "Arm Circles - 1 min", "Bodyweight Squats - 1 min"],
      gym: isLowImpact ? ["Stationary Bike - 5 mins", "Dynamic Arm Swings - 1 min", "Bodyweight Squats - 1 min"] : ["Treadmill / Bike - 5 mins", "Dynamic Arm Swings - 1 min", "Bodyweight Lunges - 1 min"]
    };

    const plan: WorkoutSession[] = [];
    const activeDB = isHome ? db.home : db.gym;
    const activeWarmup = isHome ? warmups.home : warmups.gym;

    for (let i = 1; i <= days; i++) {
      let dailyMoves: string[] = [];
      let title = "";

      if (isCutting && isHome) {
        const themes = [
          { t: "Full Body Fat Burner", m: db.home.fatBurn },
          { t: "Core + Cardio Intensity", m: db.home.core },
          { t: "Upper Body Sculpt", m: db.home.push },
          { t: "Lower Body Blast", m: db.home.legs },
          { t: "HIIT Fat Melt", m: db.home.hiit },
          { t: "Core & Stability", m: db.home.core },
          { t: "Full Body Hybrid", m: db.home.fatBurn }
        ];
        const theme = themes[(i - 1) % themes.length];
        title = theme.t;
        dailyMoves = theme.m;
      } else {
        const rotation = (i - 1) % 3;
        if (rotation === 0) { title = `Push Focus`; dailyMoves = activeDB.push; }
        else if (rotation === 1) { title = `Pull Focus`; dailyMoves = activeDB.pull; }
        else { title = `Legs & Core`; dailyMoves = activeDB.legs; }
      }

      plan.push({
        day: i,
        title: title,
        note: sessionStyle.note,
        warmup: activeWarmup,
        exercises: dailyMoves.slice(0, exerciseCount).map(ex => ({
          name: ex,
          reps: sessionStyle.label,
          rest: sessionStyle.rest
        }))
      });
    }
    return plan;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowResult(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
      setTimeout(() => document.getElementById('workout-result')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name as keyof FormDataState]: e.target.value });
  };

  const selectClass = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white focus:border-[#ccff00] outline-none transition-all cursor-pointer";

  return (
    <section className="py-24 px-6 md:px-12 relative bg-black min-h-screen overflow-hidden font-sans">
      <ParticleBackground />

      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.02]">
        <div className="absolute inset-0 flex flex-col justify-around">
          <h2 className="text-[20vw] font-black text-white italic uppercase leading-none text-center">ELITE</h2>
          <h2 className="text-[20vw] font-black text-transparent italic uppercase leading-none text-center" style={{ WebkitTextStroke: '1px white' }}>PROTOCOL</h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-block bg-[#ccff00] text-black text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Fitfusion AI Lab
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
            WORKOUT <span className="text-[#ccff00]">ARCHITECT</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-[#111]/80 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">1. Personal Metrics</label>
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" name="age" placeholder="Age" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#ccff00] outline-none" onChange={handleChange} required />
                  <input type="text" name="height" placeholder="cm" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#ccff00] outline-none" onChange={handleChange} required />
                  <input type="text" name="weight" placeholder="kg" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#ccff00] outline-none" onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">2. Environment</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['home', 'gym'] as const).map((env) => (
                    <button key={env} type="button" onClick={() => setFormData({...formData, environment: env})} 
                    className={`py-4 rounded-xl border font-bold transition-all uppercase ${formData.environment === env ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-white/5 text-zinc-500 border-white/10'}`}>
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">3. Level</label>
                <select name="experience" className={selectClass} value={formData.experience} onChange={handleChange}>
                  <option className="bg-zinc-900" value="Beginner (0–6 months)">Beginner (0–6 months)</option>
                  <option className="bg-zinc-900" value="Intermediate (6 months–2 years)">Intermediate (6 months–2 years)</option>
                  <option className="bg-zinc-900" value="Advanced (2+ years)">Advanced (2+ years)</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">4. Primary Goal</label>
                <select name="goal" className={selectClass} value={formData.goal} onChange={handleChange}>
                  <option className="bg-zinc-900" value="Bulking (Gain Muscle Mass)">Bulking (Gain Muscle Mass)</option>
                  <option className="bg-zinc-900" value="Cutting (Lose Fat & Get Lean)">Cutting (Lose Fat & Get Lean)</option>
                  <option className="bg-zinc-900" value="Strength Training">Strength Training</option>
                  <option className="bg-zinc-900" value="Weight Loss">Weight Loss</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">5. Commitment: {formData.daysPerWeek} Days</label>
                <input type="range" name="daysPerWeek" min="1" max="7" value={formData.daysPerWeek} onChange={handleChange} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none accent-[#ccff00]" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">6. Session Time</label>
                <select name="workoutDuration" className={selectClass} value={formData.workoutDuration} onChange={handleChange}>
                  <option className="bg-zinc-900" value="20">20 minutes</option>
                  <option className="bg-zinc-900" value="30">30 minutes</option>
                  <option className="bg-zinc-900" value="45">45 minutes</option>
                  <option className="bg-zinc-900" value="60">60 minutes</option>
                </select>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isGenerating} 
            className="w-full bg-[#ccff00] text-black font-black text-xl py-6 rounded-2xl transition-all uppercase italic flex items-center justify-center gap-3">
              {isGenerating ? <Loader2 className="animate-spin" /> : <>INITIATE ARCHITECT <ArrowRight className="w-5 h-5"/></>}
            </motion.button>
          </form>
        </motion.div>

        {/* --- DYNAMIC WORKOUT RESULT AREA --- */}
        <AnimatePresence>
          {showResult && (
            <motion.div id="workout-result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-24 space-y-16 pb-24">
              <div className="text-center relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10"></div>
                <h3 className="inline-block bg-black px-8 text-4xl font-black text-white uppercase italic tracking-tighter">
                  Active <span className="text-[#ccff00]">Blueprints</span>
                </h3>
              </div>

              <div className="space-y-20">
                {generateProWorkout().map((session, sIdx) => (
                  <motion.div key={session.day} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: sIdx * 0.1 }} viewport={{ once: true }}
                  className="relative group">
                    
                    {/* Floating Day Indicator */}
                    <div className="absolute -left-4 md:-left-12 top-0 h-full w-1 bg-white/5 group-hover:bg-[#ccff00]/30 transition-colors hidden md:block"></div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Sidebar Info */}
                      <div className="md:w-1/4 space-y-4">
                        <div className="bg-[#ccff00] text-black w-fit px-4 py-1 font-black italic text-sm skew-x-[-12deg]">
                          DAY 0{session.day}
                        </div>
                        <h4 className="text-3xl font-black text-white leading-tight uppercase italic">{session.title}</h4>
                        <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> {formData.workoutDuration} Minute Session
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-zinc-400 text-[11px] leading-relaxed italic">{session.note}</p>
                        </div>
                      </div>

                      {/* Main Exercises Card */}
                      <div className="md:w-3/4 bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group-hover:border-[#ccff00]/20 transition-all">
                        
                        {/* Activation Bar */}
                        <div className="flex items-center gap-4 mb-8 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                            <div className="bg-orange-500/20 p-2 rounded-lg">
                              <Flame className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                              <h5 className="text-white text-xs font-black uppercase tracking-widest">Warmup</h5>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                {session.warmup.map((w, wIdx) => (
                                  <span key={wIdx} className="text-zinc-500 text-[11px] font-medium">• {w}</span>
                                ))}
                              </div>
                            </div>
                        </div>

                        {/* Exercise List */}
                        <div className="space-y-4">
                          {session.exercises.map((ex, idx) => (
                            <motion.div 
                              key={idx} 
                              whileHover={{ scale: 1.01 }}
                              className="relative flex items-center justify-between p-5 bg-gradient-to-r from-white/[0.01] to-transparent rounded-2xl border border-white/5 hover:border-[#ccff00]/40 transition-all group/item"
                            >
                              <div className="flex items-center gap-6">
                                <div className="text-[#ccff00]/20 group-hover/item:text-[#ccff00]/80 transition-colors font-black text-4xl italic">
                                  {idx + 1}
                                </div>
                                <div>
                                  <h6 className="text-white font-bold text-lg group-hover/item:text-[#ccff00] transition-colors">{ex.name}</h6>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase">
                                      <Dumbbell className="w-3 h-3" /> {ex.reps}
                                    </span>
                                    <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase">
                                      <Timer className="w-3 h-3" /> {ex.rest}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="hidden sm:block opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <Zap className="w-5 h-5 text-[#ccff00] fill-[#ccff00]" />
                              </div>

                              {/* Decorative Intensity Bar */}
                              <div 
                                className="absolute bottom-0 left-0 h-[2px] bg-[#ccff00] opacity-0 group-hover/item:opacity-100 transition-all"
                                style={{ width: `${(idx + 1) * (100 / session.exercises.length)}%` }}
                              ></div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Final Motivation CTA */}
              <div className="text-center pt-10">
                <div className="inline-flex items-center gap-3 bg-[#ccff00]/10 border border-[#ccff00]/20 px-6 py-3 rounded-full">
                  <Activity className="text-[#ccff00] w-5 h-5" />
                  <span className="text-white font-bold uppercase italic text-sm tracking-tighter">Ready to Begin the Session?</span>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}