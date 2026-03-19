import { Facebook, Linkedin, Instagram, Globe } from "lucide-react";

export default function Footer() {
  return (
    // Background color applied to match the high-end aesthetic
    <footer className="bg-[#D4FF48] py-16 px-6 text-black">
      <div className="container-shell max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Branding/Logo section */}
        <div>
          <h1 className="text-4xl font-bold mb-4">FIT FUSHION</h1>
          <p className="text-sm font-medium">FitFusion helps beginners stay fit with AI workouts and smart meal planning.</p>
        </div>

        {/* Website Map links */}
        <div>
          <h3 className="font-semibold text-lg mb-6">ABOUT US</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="cursor-pointer hover:underline">Workout Planner</li>
            <li className="cursor-pointer hover:underline">Meal Analyzer</li>
            <li className="cursor-pointer hover:underline">Meal Planner</li>
          </ul>
        </div>

        {/* Contacts section */}
        <div>
          <h3 className="font-semibold text-lg mb-6">Contacts</h3>
          <div className="space-y-4 text-sm font-medium">
            
            <p>WWW.FIT-FUSHION.COM</p>
            <p>011 2123 456</p>
            <p>Colombo, Sri Lanka</p>
          </div>
        </div>
      </div>

      {/* Bottom section with Copyright and Social Icons */}
      <div className="container-shell max-w-7xl mx-auto mt-16 pt-8 border-t border-black/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm font-medium">© 2026 FIT FUSHION. All rights reserved</p>
        <div className="flex gap-4">
          <Facebook size={20} className="cursor-pointer" />
          <Linkedin size={20} className="cursor-pointer" />
          <Instagram size={20} className="cursor-pointer" />
          <Globe size={20} className="cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}