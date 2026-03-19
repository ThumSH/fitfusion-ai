/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Ruler, Weight, ChevronUp, ChevronDown, Users, User, Scale } from "lucide-react";

export default function PerfectFitFusionCalculator() {
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [bmi, setBmi] = useState<number | null>(null);

  const getHealthyRange = (isMale: boolean) => {
    const factorMin = isMale ? 18.8 : 18.2;
    const factorMax = isMale ? 25.2 : 24.7;
    const min = (factorMin * (height / 100) ** 2).toFixed(1);
    const max = (factorMax * (height / 100) ** 2).toFixed(1);
    return `${min}kg - ${max}kg`;
  };

  const calculateBMI = () => {
    setBmi(null); 
    setTimeout(() => {
      const heightInMeters = height / 100;
      const score = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(score.toFixed(2)));
    }, 150);
  };

  const getStatusInfo = (val: number, isMale: boolean, userAge: number) => {
    let ageNote = "";
    if (userAge < 20) ageNote = "Focus on growth and development.";
    else if (userAge > 60) ageNote = "Maintaining bone density is vital.";
    else ageNote = isMale ? "Optimal for active metabolism." : "Focus on balanced nutrition.";

    if (val < 18.5) return { label: "Underweight", color: "#60a5fa", emoji: "💧", note: `Caloric surplus needed. ${ageNote}` };
    if (val < 25) return { label: "Normal", color: "#b9ff66", emoji: "🔥", note: `Ideal health zone. ${ageNote}` };
    if (val < 30) return { label: "Overweight", color: "#fbbf24", emoji: "⚖️", note: `Increase activity levels. ${ageNote}` };
    return { label: "Overweight+", color: "#f87171", emoji: "🚨", note: `Health optimization needed. ${ageNote}` };
  };

  const DigitalInput = ({ value, setValue, label, icon: Icon, min, max, unit }: any) => (
    <div className="relative p-5 rounded-[30px] bg-white/[0.04] border border-white/5 hover:border-[#b9ff66]/30 transition-all duration-500 shadow-lg group font-sans">
      <div className="flex justify-between items-center mb-3">
        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-[#b9ff66] transition-colors">
          <Icon size={12} /> {label}
        </span>
        <span className="text-[9px] font-bold text-white/20 uppercase">{unit}</span>
      </div>
      <div className="flex items-center justify-between">
        <input 
          type="number" value={value} 
          onChange={(e) => setValue(Number(e.target.value))}
          className="bg-transparent text-4xl font-black italic text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <div className="flex flex-col gap-1">
          <button onClick={() => setValue(Math.min(max, value + 1))} className="p-1.5 bg-white/5 rounded-lg hover:bg-[#b9ff66] hover:text-black transition-all active:scale-90"><ChevronUp size={16}/></button>
          <button onClick={() => setValue(Math.max(min, value - 1))} className="p-1.5 bg-white/5 rounded-lg hover:bg-[#b9ff66] hover:text-black transition-all active:scale-90"><ChevronDown size={16}/></button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center py-16 px-6 bg-[#010101] overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 opacity-[0.15] grayscale pointer-events-none blur-[1px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')", backgroundSize: 'cover' }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-[#b9ff66]/10 z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase leading-none">
              Body <span className="text-[#b9ff66]">Composition.</span>
            </h2>
            
            <div className="relative p-5 rounded-[30px] bg-white/[0.04] border border-white/5 hover:border-[#b9ff66]/30 transition-all duration-500 shadow-lg group">
              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-[#b9ff66] transition-colors">
                  <Users size={12} /> Gender
                </span>
                <span className="text-[9px] font-bold text-white/20 uppercase italic">Identification</span>
              </div>
              <div className="relative flex bg-black/40 p-1 rounded-2xl border border-white/5 overflow-hidden">
                <motion.div 
                  className="absolute top-1 bottom-1 rounded-xl bg-[#b9ff66]"
                  animate={{ x: gender === "male" ? "0%" : "100%" }}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  style={{ width: "calc(50% - 4px)", left: gender === "male" ? 4 : -4 }}
                />
                <button onClick={() => setGender("male")} className={`relative z-10 flex-1 py-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-colors duration-500 ${gender === "male" ? "text-black" : "text-white/30"}`}>
                  <User size={14} /> Male
                </button>
                <button onClick={() => setGender("female")} className={`relative z-10 flex-1 py-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-colors duration-500 ${gender === "female" ? "text-black" : "text-white/30"}`}>
                  <User size={14} /> Female
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DigitalInput label="Age" unit="Years" value={age} setValue={setAge} icon={Calendar} min={10} max={100} />
              <DigitalInput label="Height" unit="CM" value={height} setValue={setHeight} icon={Ruler} min={100} max={250} />
            </div>
            <DigitalInput label="Weight" unit="KG" value={weight} setValue={setWeight} icon={Weight} min={30} max={250} />

            {/* SURGE EFFECT BUTTON - NO WHITE BORDER */}
            <button 
              onClick={calculateBMI} 
              className="relative w-full bg-[#b9ff66] text-black font-black py-6 rounded-[30px] uppercase italic tracking-widest text-lg transition-all duration-300 hover:shadow-[0_0_40px_-5px_rgba(185,255,102,0.6)] hover:scale-[1.01] active:scale-[0.98] border-none outline-none overflow-hidden group"
            >
              <span className="relative z-10">Generate Report</span>
              {/* Animated Surge Layer */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 skew-y-12 transition-transform duration-500" />
            </button>
          </div>

          <div className="lg:col-span-5 flex items-stretch h-full min-h-[550px]">
            <AnimatePresence mode="wait">
              {bmi ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="w-full bg-white/[0.04] backdrop-blur-3xl rounded-[60px] p-12 flex flex-col justify-between relative shadow-2xl overflow-hidden border border-white/10"
                >
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" fill="none">
                    <motion.rect
                      x="0" y="0" width="100%" height="100%"
                      rx="60"
                      stroke={getStatusInfo(bmi, gender === 'male', age).color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </svg>

                  <div className="relative z-10">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50">Assessment Score</span>
                    <div className="flex items-center gap-4 mt-4">
                        <h3 className="text-8xl font-black italic tracking-tighter leading-none" style={{ color: getStatusInfo(bmi, gender === 'male', age).color }}>{bmi}</h3>
                        <div className="text-6xl">{getStatusInfo(bmi, gender === 'male', age).emoji}</div>
                    </div>
                    <p className="text-3xl font-black uppercase italic mt-1" style={{ color: getStatusInfo(bmi, gender === 'male', age).color }}>{getStatusInfo(bmi, gender === 'male', age).label}</p>
                  </div>

                  <div className="relative z-10 space-y-6 mt-8 pt-8 border-t border-white/5">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-base font-bold italic text-white/60 leading-relaxed">
                      {getStatusInfo(bmi, gender === 'male', age).note}
                    </motion.p>
                    
                    <div className="bg-black/40 p-6 rounded-[35px] border border-white/5 text-center">
                      <p className="text-[10px] font-black text-white/20 uppercase mb-2">Ideal Health Metrics</p>
                      <div className="flex items-center justify-center gap-3 bg-white/5 p-4 rounded-2xl">
                          <Scale size={24} style={{ color: getStatusInfo(bmi, gender === 'male', age).color }} className="opacity-50" />
                          <p className="text-3xl font-black italic text-white">{getHealthyRange(gender === 'male')}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full flex items-center justify-center bg-white/[0.01] rounded-[60px] border border-dashed border-white/10 opacity-30 italic uppercase tracking-widest text-sm text-white text-center p-10">
                    Enter your details to generate <br/> your AI Health Profile
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}