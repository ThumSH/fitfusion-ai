import { Facebook, Linkedin, Instagram, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-50 border-t border-primary/20 bg-black py-16 px-6 text-white">
      <div className="container-shell max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider">
            Fit<span className="text-primary">Fusion</span>
          </h1>
          <p className="text-sm font-medium text-white/70">
            FitFusion helps beginners stay fit with AI workouts and smart meal planning.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-6 uppercase tracking-wide text-primary">About Us</h3>
          <ul className="space-y-4 text-sm font-medium text-white/70">
            <li className="cursor-pointer hover:text-white transition-all">Workout Planner</li>
            <li className="cursor-pointer hover:text-white transition-all">Meal Analyzer</li>
            <li className="cursor-pointer hover:text-white transition-all">Meal Planner</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-6 uppercase tracking-wide text-primary">Contacts</h3>
          <div className="space-y-4 text-sm font-medium text-white/70">
            <p className="cursor-pointer hover:text-white transition-all">www.fitfusion.ai</p>
            <p>011 2123 456</p>
            <p>Colombo, Sri Lanka</p>
          </div>
        </div>
      </div>

      <div className="container-shell max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm font-medium text-white/60">© {new Date().getFullYear()} FitFusion AI. All rights reserved.</p>
        <div className="flex gap-4">
          <Facebook size={20} className="cursor-pointer text-white/70 hover:text-primary hover:scale-110 transition-all" />
          <Linkedin size={20} className="cursor-pointer text-white/70 hover:text-primary hover:scale-110 transition-all" />
          <Instagram size={20} className="cursor-pointer text-white/70 hover:text-primary hover:scale-110 transition-all" />
          <Globe size={20} className="cursor-pointer text-white/70 hover:text-primary hover:scale-110 transition-all" />
        </div>
      </div>
    </footer>
  );
}
