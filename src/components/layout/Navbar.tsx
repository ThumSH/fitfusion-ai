/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Dumbbell } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoaded, userId } = useAuth();
  const pathname = usePathname();
  const isSignedIn = Boolean(userId);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const primaryLinks = [
    { name: "Home", href: "/" },
    { name: "Workout Planner", href: "/workout-planner" },
    { name: "Meal Planner", href: "/meal-planner" },
    { name: "Gym Finder", href: "/gym-finder" },
  ];

  const secondaryLinks = [
    { name: "My History", href: "/my-history" },
  ];
  const aboutLink = { name: "About Us", href: "/Why" };

  const allMobileLinks = [...primaryLinks, ...secondaryLinks];
  const desktopLinks = [...primaryLinks, ...secondaryLinks];
  const isAboutActive = pathname.startsWith(aboutLink.href);

  const linkClass = (href: string) => {
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
      isActive ? "bg-primary/15 text-primary" : "text-white/75 hover:text-white"
    }`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-90 w-full transition-all duration-300 ${
        isScrolled ? "bg-black/70 py-3 backdrop-blur-md" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
        <div
          className={`relative flex items-center justify-between rounded-2xl px-3 sm:px-4 lg:px-5 ${
            isScrolled ? "border border-white/10 bg-black/80 shadow-lg shadow-black/30" : "bg-black/35"
          }`}
        >
          <Link href="/" className="group flex h-14 shrink-0 items-center gap-2">
            <Dumbbell className="text-primary transition-transform duration-300 group-hover:-rotate-45" size={28} />
            <span className="whitespace-nowrap text-xl font-bold tracking-wider text-white uppercase lg:text-2xl">
              Fit<span className="text-primary">Fusion</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 pl-6 lg:flex xl:hidden">
            {primaryLinks.map((link) => (
              <Link key={link.name} href={link.href} className={linkClass(link.href)}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 xl:flex">
            {desktopLinks.map((link) => (
              <Link key={link.name} href={link.href} className={linkClass(link.href)}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center justify-end gap-2 lg:ml-auto lg:flex">
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <button
                  type="button"
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white/85 uppercase transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Sign In
                </button>
              </SignInButton>
            )}

            {isLoaded && !isSignedIn && (
              <SignUpButton mode="modal" fallbackRedirectUrl="/">
                <button
                  type="button"
                  className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold tracking-widest text-black uppercase transition hover:brightness-110"
                >
                  Create Account
                </button>
              </SignUpButton>
            )}

            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/45 py-0.5 pr-2 pl-0.5">
                <UserButton />
                <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">My Account</span>
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden rounded-full p-[1.5px] transition-all duration-300"
            >
              <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#b9ff66_0%,transparent_20%,#b9ff66_50%,transparent_70%,#b9ff66_100%)] opacity-100" />
              <Link
                href={aboutLink.href}
                className={`relative z-10 flex items-center justify-center rounded-full bg-[#0a0a0a] px-5 py-2 text-[10px] font-bold tracking-[0.11em] uppercase transition-all duration-300 ${
                  isAboutActive ? "bg-primary text-black" : "text-white hover:bg-primary hover:text-black"
                }`}
              >
                About Us
              </Link>
            </motion.div>
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              className="rounded-full border border-white/15 bg-black/40 p-2 text-white transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden border-b border-white/10 bg-black/95 backdrop-blur-md transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-130 py-4" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-350 flex-col gap-2 px-4 sm:px-6">
          {allMobileLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${linkClass(link.href)} border border-transparent text-base hover:border-white/10`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href={aboutLink.href}
            className={`mt-1 inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-bold tracking-[0.12em] uppercase transition-all ${
              isAboutActive
                ? "border-primary/65 bg-primary/20 text-primary shadow-[0_0_20px_rgba(185,255,102,0.32)]"
                : "border-primary/35 bg-primary/10 text-[#dff8be] shadow-[0_0_16px_rgba(185,255,102,0.24)]"
            }`}
          >
            About Us
          </Link>

          {isLoaded && !isSignedIn && (
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <button
                  type="button"
                  className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/90 uppercase"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/">
                <button
                  type="button"
                  className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-black uppercase"
                >
                  Create Account
                </button>
              </SignUpButton>
            </div>
          )}

          {isLoaded && isSignedIn && (
            <div className="mt-2 flex items-center justify-center rounded-full border border-white/20 bg-black/40 py-2">
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
