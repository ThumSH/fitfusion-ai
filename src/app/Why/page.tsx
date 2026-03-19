"use client";

import { motion } from "framer-motion";
import Image from "next/image"; 
import { Users, Cpu, Zap, Activity, Sparkles, Instagram, MessageCircle, Mail } from "lucide-react";

import VideoBackground from "./VideoBackground";

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
    imageUrl: "/thum.png", 
    imageFocusPosition: "center", 
    instagram: "nadini.ai",
    whatsApp: "94771111111",
    email: "h3mashed@gmail.com" 
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
    imageUrl: "/jaya.png", 
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
      
      {/* Avatar Circle - Updated for Glassmorphism */}
      <div className="relative mb-6">
        <div className="w-40 h-40 rounded-full border border-white/10 bg-black/20 p-2 backdrop-blur-2xl shadow-[0_4_30px_rgba(0,0,0,0.3)] group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(185,255,102,0.2)] transition-all duration-500 overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={name} 
            width={160} 
            height={160} 
            style={{ 
              objectFit: "cover", 
              objectPosition: objectPositionValue 
            }}
            className="w-full h-full rounded-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
          />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-white/50 text-sm leading-relaxed max-w-60 mb-5 font-light">
        {bio}
      </p>

      {/* Social Media Links */}
      <div className="flex items-center gap-4">
        {/* Instagram */}
        <a 
          href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white/40 hover:text-primary transition-colors hover:scale-110"
        >
          <Instagram size={18} />
        </a>
        
        {/* WhatsApp */}
        <a 
          href={`https://wa.me/${whatsApp}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white/40 hover:text-primary transition-colors hover:scale-110"
        >
          <MessageCircle size={18} />
        </a>

        {/* EMAIL LINK */}
        <a 
          href={`mailto:${email}`} 
          className="text-white/40 hover:text-primary transition-colors hover:scale-110"
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
    <div className="relative min-h-screen pt-28 pb-12 text-white overflow-hidden selection:bg-primary/30 bg-background font-sans">
      
      {/* Video Background */}
      <VideoBackground />

      {/* Ambient Glow Blobs to catch the glass blur */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-150 w-250 -translate-x-1/2 rounded-full bg-primary/10 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-100 w-125 rounded-full bg-primary/5 blur-[150px]" />

      <div className="relative z-10 container-shell mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(185,255,102,0.15)]">
            <Users size={28} strokeWidth={2.5} />
          </div>
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
            SLIIT Hackathon Team
          </div>
          <h1 className="mb-6 text-5xl font-black uppercase tracking-tight sm:text-6xl md:text-7xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            The Architects of <span className="text-primary drop-shadow-[0_0_20px_rgba(185,255,102,0.3)]">Change</span>
          </h1>
          <p className="mb-20 text-lg font-light text-white/60 leading-relaxed max-w-2xl mx-auto">
            We are not just building an app; we are building a digital coach that evolves with you.
            From AI meal planning to smart gym finders, we are creating a seamless ecosystem for your health.
          </p>
        </motion.div>

        {/* TEAM GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12 mb-24" 
        >
          {team.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </motion.div>

        {/* Vision & Philosophy Cards - Updated for Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
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
              className="rounded-3xl border border-white/10 bg-black/20 p-8 backdrop-blur-2xl transition-all duration-300 group hover:border-primary/30 hover:bg-black/30"
              style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
            >
              <item.icon className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300" size={32} strokeWidth={2} />
              <h4 className="text-xl font-bold mb-3 text-white tracking-wide">{item.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Motivational Banner - Updated for Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative rounded-3xl border border-primary/20 bg-black/20 p-8 sm:p-14 backdrop-blur-2xl text-center overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(185,255,102,0.06)" }}
        >
          {/* Subtle inner glow for the banner */}
          <div className="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <Sparkles className="mx-auto text-primary mb-8" size={36} strokeWidth={2} />
            <h3 className="text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-4xl mx-auto">
              Great things never came from comfort zones. Our team is fueled by late-night coding, 
              caffeine, and a shared mission to represent <strong className="font-semibold text-white bg-primary/10 border border-primary/20 px-2 py-1 rounded ml-1 tracking-widest uppercase text-sm">SLIIT</strong> at the highest level of innovation.
            </h3>
          </div>
        </motion.div>

      </div>
    </div>
  );
}