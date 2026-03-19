"use client";

import { motion } from "framer-motion";
import Image from "next/image"; 
import { Users, Cpu, Zap, Activity, Rocket, Sparkles, Instagram, MessageCircle, Mail } from "lucide-react";

// Updated import to point to the same folder
import VideoBackground from "../Why/VideoBackground"; 

// =======================================================================
// TEAM DATA ARRAY
// =======================================================================
const team = [
  { 
    name: "Thaviru De Almeida",
    bio: "UG BSc (Hons) in Information Technology Spc Cyber Security",
    imageUrl: "/thaviru.png", 
    imageFocusPosition: "center", 
    instagram: "https://www.instagram.com/iam_thaviy?igsh=dWt3bGN1YjRpcnI%3D&utm_source=qr",
    whatsApp: "94740451892",
    email: "thavirudealmeida5@gmail.com" 
  },
  { 
    name: "Sithum Hemash",
    bio: "UG BSc (Hons) in Software Engineering",
    imageUrl: "/sithum.png", 
    imageFocusPosition: "center", 
    instagram: "nadini.ai",
    whatsApp: "94771111111",
    email: "nadini@example.com" 
  },
  { 
    name: "Naveed Ahamad",
    bio: "UG BSc (Hons) in Information Technology Spc Artificail Interligence ",
    imageUrl: "/naveed.png", 
    imageFocusPosition: "center-top", 
    instagram: "https://www.instagram.com/_navee__18?igsh=MW5iMGFsMWkzNDFsNQ==",
    whatsApp: "94781981972",
    email: "naveedahamed0524@gmail.com" 
  },
  { 
    name: "Dimuth Hansaja",
    bio: "UG BSc (Hons) in Computer Science",
    imageUrl: "/hansaja.png", 
    imageFocusPosition: "center", 
    instagram: "https://www.instagram.com/hansaja_wanninayaka?igsh=MWYwejI2aTFld3VmYQ==",
    whatsApp: "94772403928",
    email: "dinuthwann@gmail.com" 
  },
  { 
    name: "Thamaru Nimsara",
    bio: "UG BSc (Hons) in Computer Science",
    imageUrl: "/thamaru.png", 
    imageFocusPosition: "center", 
    instagram: "growth_sliit",
    whatsApp: "94712821309",
    email: "thamarusamaranayake@gmail.com" 
  },
  { 
    name: "Jayavi Dias",
    bio: "Bridging the gap between complex logic and beautiful user experiences.",
    imageUrl: "/jayavi1.png", 
    imageFocusPosition: "50% 30%", 
    instagram: "https://www.instagram.com/jaiya_dish_?igsh=bmZrZnNuYzl3a3Q%3D&utm_source=qr",
    whatsApp: "94724033680",
    email: "jayavidias14@gmail.com" 
  },
];

// =======================================================================
// TEAM MEMBER COMPONENT
// =======================================================================
const TeamMember = ({ name, bio, imageUrl, imageFocusPosition, instagram, whatsApp, email }: (typeof team)[0]) => {
  const objectPositionValue = imageFocusPosition || "center"; 

  return (
    <div className="flex flex-col items-center text-center group">
      
      {/* Avatar Circle */}
      <div className="relative mb-6">
        <div className="w-40 h-40 rounded-full border border-white/10 bg-white/[0.02] p-1.5 backdrop-blur-md shadow-lg group-hover:border-[#b9ff66]/50 group-hover:shadow-[#b9ff66]/20 transition-all duration-300 overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={name} 
            width={160} 
            height={160} 
            style={{ 
              objectFit: "cover", 
              objectPosition: objectPositionValue 
            }}
            className="w-full h-full rounded-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
          />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
      <p className="text-[#b9ff66] text-xs font-bold mb-4 uppercase tracking-widest"></p>
      <p className="text-white/60 text-sm leading-relaxed max-w-[240px] mb-4">
        {bio}
      </p>

      {/* Social Media Links */}
      <div className="flex items-center gap-3">
        {/* Instagram */}
        <a 
          href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white/40 hover:text-[#b9ff66] transition-colors"
        >
          <Instagram size={18} />
        </a>
        
        {/* WhatsApp */}
        <a 
          href={`https://wa.me/${whatsApp}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white/40 hover:text-[#b9ff66] transition-colors"
        >
          <MessageCircle size={18} />
        </a>

        {/* EMAIL LINK */}
        <a 
          href={`mailto:${email}`} 
          className="text-white/40 hover:text-[#b9ff66] transition-colors"
        >
          <Mail size={18} />
        </a>
      </div>
    </div>
  );
};

// Main Page Component
export default function WhoAreWePage() {
  return (
    // Removed solid background color so the video is visible
    <div className="relative min-h-screen pt-28 pb-12 text-white overflow-hidden selection:bg-[#b9ff66]/30 font-sans">
      
      {/* 1. Added the Video Background Component right here at the base */}
      <VideoBackground />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-[#b9ff66]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* 2. Content is kept safely above the video with z-10 */}
      <div className="relative z-10 container-shell mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b9ff66]/10 text-[#b9ff66] shadow-lg shadow-[#b9ff66]/10">
            <Users size={32} />
          </div>
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#b9ff66]/30 bg-[#b9ff66]/5 text-[#b9ff66] text-sm font-bold tracking-widest uppercase">
            SLIIT Hackathon Team
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            The Architects of Change
          </h1>
          <p className="mb-16 text-lg text-white/60 leading-relaxed">
            We arent just building an app; we are building a digital coach that evolves with you. 
            From AI Meal Planning to Smart Gym Finders, were creating a seamless ecosystem for your health.
          </p>
        </motion.div>

        {/* TEAM GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 mb-20" 
        >
          {team.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </motion.div>

        {/* Vision & Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Cpu, title: "Innovate", desc: "Using advanced neural networks to solve real-world health plateaus and optimize training." },
            { icon: Zap, title: "Empower", desc: "Giving you the absolute control and data-driven tools to hack your own biology." },
            { icon: Activity, title: "Simplify", desc: "Removing the 'analysis paralysis' of daily meal prep and finding the right gym equipment." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (0.1 * i) }}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md shadow-xl hover:border-[#b9ff66]/30 transition-colors group"
            >
              <item.icon className="text-[#b9ff66] mb-5 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-xl font-bold mb-3 text-white">{item.title}</h4>
              <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Motivational Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-3xl border border-[#b9ff66]/30 bg-[#b9ff66]/5 p-8 sm:p-12 shadow-xl backdrop-blur-md text-center"
        >
          <Sparkles className="mx-auto text-[#b9ff66] mb-6" size={40} />
          <h3 className="text-2xl md:text-3xl font-medium text-white/90 leading-relaxed max-w-4xl mx-auto">
            Great things never came from comfort zones. Our team is fueled by late-night coding, 
            caffeine, and a shared mission to represent <strong className="font-semibold text-white bg-[#b9ff66]/10 px-2 py-0.5 rounded ml-1">SLIIT</strong> at the highest level of innovation.
          </h3>
        </motion.div>

      </div>
    </div>
  );
}