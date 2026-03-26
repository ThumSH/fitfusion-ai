/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Compass,
  Dumbbell,
  Navigation,
  ArrowDown,
  ShieldCheck,
  TimerReset,
  Radar,
  Star,
  CheckCircle2,
  XCircle,
  Wallet,
  Users,
  Clock3,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "@/components/layout/AnimatedSection";
import VideoBackground from "./VideoBackground";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-javascript-api";
let googleMapsScriptPromise: Promise<void> | null = null;

const FALLBACK_CENTER = { lat: 6.9271, lng: 79.8612 }; // Colombo

const neonMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#060606" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#141414" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { featureType: "poi.business", stylers: [{ visibility: "on" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#121a0c" }] },
];

type GymPlace = {
  name: string;
  vicinity?: string;
  rating?: number;
  businessStatus?: string;
  simulatedPrice: number;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
};

type IconType = ComponentType<{ size?: number; className?: string }>;

type FrameworkItem = {
  icon: IconType;
  title: string;
  description: string;
  points: string[];
};

type MembershipTier = {
  title: string;
  price: string;
  bestFor: string;
  includes: string[];
};

type ChecklistSection = {
  title: string;
  icon: IconType;
  tone: "good" | "warn";
  items: string[];
};

type PeakWindow = {
  slot: string;
  crowd: number;
  label: string;
};

function loadGoogleMapsScript() {
  const googleObj = (window as any).google;
  if (googleObj?.maps?.places) return Promise.resolve();
  if (googleMapsScriptPromise) return googleMapsScriptPromise;

  googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps script.")), { once: true });
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local"));
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps script failed to load."));
    document.head.appendChild(script);
  }).catch((error) => {
    googleMapsScriptPromise = null;
    throw error;
  });

  return googleMapsScriptPromise;
}

export default function GymFinderPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const finderSectionRef = useRef<HTMLElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const gymMarkersRef = useRef<any[]>([]);

  const [gyms, setGyms] = useState<GymPlace[]>([]);
  const [status, setStatus] = useState("Map will initialize when the finder section is visible.");
  const [mapError, setMapError] = useState<string | null>(null);
  const [shouldInitMap, setShouldInitMap] = useState(false);

  const highlights = [
    {
      icon: Radar,
      title: "Nearby Discovery",
      description: "Find gyms in a 5KM radius around your live location.",
    },
    {
      icon: Navigation,
      title: "One-Tap Directions",
      description: "Open route navigation directly in Google Maps.",
    },
    {
      icon: ShieldCheck,
      title: "Clean Overview",
      description: "View ratings, location, and estimated monthly pricing fast.",
    },
  ];

  const framework: FrameworkItem[] = [
    {
      icon: MapPin,
      title: "Location Practicality",
      description: "A gym close to your routine beats a perfect gym far away.",
      points: [
        "Pick within realistic travel time from home/work.",
        "Prioritize routes you can repeat during busy days.",
      ],
    },
    {
      icon: Dumbbell,
      title: "Equipment Coverage",
      description: "Progress needs enough options across push/pull/legs.",
      points: [
        "Check free weights, cable stations, and squat racks.",
        "Confirm backup options when stations are occupied.",
      ],
    },
    {
      icon: Users,
      title: "Crowd Flow",
      description: "Capacity and timing heavily influence workout quality.",
      points: [
        "Visit at your real training hour before signing.",
        "Observe wait times around core equipment.",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Safety + Coaching",
      description: "Form feedback and floor standards reduce injury risk.",
      points: [
        "Look for attentive floor staff or coach access.",
        "Check cleanliness, ventilation, and maintenance.",
      ],
    },
  ];

  const membershipTiers: MembershipTier[] = [
    {
      title: "Starter Tier",
      price: "Rs. 5,000 - 8,000",
      bestFor: "Beginners building consistency",
      includes: ["General floor access", "Basic cardio + strength", "No premium classes"],
    },
    {
      title: "Progress Tier",
      price: "Rs. 8,000 - 13,000",
      bestFor: "Most regular lifters",
      includes: ["Broader equipment range", "Better capacity", "Group class options"],
    },
    {
      title: "Premium Tier",
      price: "Rs. 13,000 - 18,000+",
      bestFor: "High-frequency training + extras",
      includes: ["Lower crowd ratio", "Coaching perks", "Recovery amenities"],
    },
  ];

  const checklist: ChecklistSection[] = [
    {
      title: "Must-Have Checks",
      icon: CheckCircle2,
      tone: "good",
      items: ["Usable squat/bench setup", "Ventilation and hygiene quality", "Stable opening hours"],
    },
    {
      title: "Strong Positives",
      icon: BadgeCheck,
      tone: "good",
      items: ["Coach availability", "Reasonable cancellation policy", "Crowd management during peak"],
    },
    {
      title: "Red Flags",
      icon: XCircle,
      tone: "warn",
      items: ["Poor maintenance", "Hidden fees in contract", "Long waits for basic equipment"],
    },
  ];

  const peakWindows: PeakWindow[] = [
    { slot: "06:00 - 08:00", crowd: 82, label: "High" },
    { slot: "10:00 - 13:00", crowd: 40, label: "Low" },
    { slot: "17:00 - 20:00", crowd: 94, label: "Very High" },
    { slot: "20:00 - 22:00", crowd: 58, label: "Moderate" },
  ];

  useEffect(() => {
    const target = finderSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setShouldInitMap(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldInitMap) return;
    let isUnmounted = false;
    setStatus("Initializing map...");

    const clearGymMarkers = () => {
      gymMarkersRef.current.forEach((marker) => marker.setMap(null));
      gymMarkersRef.current = [];
    };

    const searchGyms = (center: { lat: number; lng: number }) => {
      const googleObj = (window as any).google;
      const map = mapInstanceRef.current;
      if (!googleObj?.maps?.places || !map) return;

      setStatus("Finding gyms near you...");

      const service = new googleObj.maps.places.PlacesService(map);
      service.nearbySearch(
        { location: center, radius: 5000, type: "gym" },
        (results: any[] | null, searchStatus: string) => {
          if (isUnmounted) return;

          clearGymMarkers();

          if (searchStatus === "OK" && results) {
            const gymsWithPrices: GymPlace[] = results
              .filter((gym) => gym?.business_status !== "CLOSED_PERMANENTLY")
              .map((gym) => ({
                name: gym.name,
                vicinity: gym.vicinity,
                rating: typeof gym.rating === "number" ? gym.rating : undefined,
                businessStatus: gym.business_status,
                geometry: gym.geometry,
                simulatedPrice: Math.floor(Math.random() * (18000 - 5000 + 1) + 5000),
              }));

            setGyms(gymsWithPrices);
            setStatus("");

            gymsWithPrices.forEach((place) => {
              const marker = new googleObj.maps.Marker({
                map,
                position: place.geometry?.location,
                title: place.name,
              });
              gymMarkersRef.current.push(marker);
            });
          } else {
            setGyms([]);
            setStatus("No gyms found within 5KM.");
          }
        }
      );
    };

    const initMap = (center: { lat: number; lng: number }) => {
      const googleObj = (window as any).google;
      if (!mapRef.current || !googleObj?.maps) {
        setMapError("Map container failed to initialize.");
        return;
      }

      const map = new googleObj.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        styles: neonMapStyles,
        disableDefaultUI: true,
      });
      mapInstanceRef.current = map;

      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
      userMarkerRef.current = new googleObj.maps.Marker({
        position: center,
        map,
        icon: {
          path: googleObj.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#b9ff66",
          fillOpacity: 1,
          strokeWeight: 4,
          strokeColor: "#050505",
        },
      });

      searchGyms(center);
    };

    (window as any).gm_authFailure = () => {
      if (!isUnmounted) {
        setMapError("Google Maps authentication failed. Check API key restrictions and billing.");
        setStatus("");
      }
    };

    loadGoogleMapsScript()
      .then(() => {
        if (isUnmounted) return;
        initMap(FALLBACK_CENTER);

        if (!navigator.geolocation) {
          setStatus("Geolocation not supported. Showing fallback location.");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (isUnmounted || !mapInstanceRef.current) return;
            const current = { lat: position.coords.latitude, lng: position.coords.longitude };
            mapInstanceRef.current.setCenter(current);
            mapInstanceRef.current.setZoom(14);
            if (userMarkerRef.current) userMarkerRef.current.setPosition(current);
            searchGyms(current);
          },
          () => {
            if (!isUnmounted) setStatus("Location permission denied. Showing fallback location.");
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
        );
      })
      .catch((error: Error) => {
        if (!isUnmounted) {
          setMapError(error.message || "Failed to load map.");
          setStatus("");
        }
      });

    return () => {
      isUnmounted = true;
      delete (window as any).gm_authFailure;
    };
  }, [shouldInitMap]);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < full ? "text-primary fill-primary" : "text-white/20"}
          />
        ))}
        <span className="ml-1.5 text-[11px] font-semibold tracking-wide text-white/70">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .gym-finder-root {
          font-family: 'DM Sans', sans-serif;
        }
        .gym-finder-root h1,
        .gym-finder-root h2 {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
        }

        .gym-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .gym-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(185, 255, 102, 0.05);
          border-color: rgba(185, 255, 102, 0.3);
        }

        .map-glow-ring {
          box-shadow: 0 0 0 1px rgba(185,255,102,0.1), 0 0 40px rgba(185,255,102,0.05) inset;
        }

        .gym-scroll::-webkit-scrollbar { width: 4px; }
        .gym-scroll::-webkit-scrollbar-track { background: transparent; }
        .gym-scroll::-webkit-scrollbar-thumb {
          background: rgba(185, 255, 102, 0.4);
          border-radius: 4px;
        }
        .gym-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(185, 255, 102, 0.8);
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        .pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }
      `}</style>

      <div className="gym-finder-root relative bg-black text-white">
        <section className="relative min-h-[92vh] overflow-hidden">
          <VideoBackground />
          <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-125 w-225 -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />

          <div className="container-shell relative z-10 grid min-h-[92vh] items-center gap-10 pt-28 pb-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                <Compass size={14} className="text-primary" strokeWidth={2.5} />
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Gym Finder</span>
              </div>

              <h1 className="text-5xl font-black uppercase tracking-tight sm:text-6xl md:text-7xl">
                Find Your Next{" "}
                <span className="text-primary drop-shadow-[0_0_20px_rgba(185,255,102,0.3)]">Training Zone</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                Discover nearby gyms instantly, compare price/rating fast, and navigate with one tap.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#finder-sections"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#dff8be] transition hover:bg-primary/20"
                >
                  Open Gym Finder
                  <ArrowDown size={14} />
                </a>
                <a
                  href="#gym-knowledge"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/80 transition hover:border-primary/35 hover:text-white"
                >
                  Learn How To Choose
                  <ArrowDown size={14} />
                </a>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl"
              >
                <div className="mb-2 inline-flex rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary">
                  <Radar size={16} />
                </div>
                <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase">Discovery Radius</p>
                <p className="mt-1 text-sm text-white/75">Nearby search within 5KM of your live location.</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl"
              >
                <div className="mb-2 inline-flex rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary">
                  <Wallet size={16} />
                </div>
                <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase">Budget Signal</p>
                <p className="mt-1 text-sm text-white/75">Estimated monthly pricing shown on each result card.</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl sm:col-span-2 lg:col-span-1"
              >
                <div className="mb-2 inline-flex rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary">
                  <Navigation size={16} />
                </div>
                <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase">Route Ready</p>
                <p className="mt-1 text-sm text-white/75">Open external directions instantly for any gym.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="finder-sections" ref={finderSectionRef} className="relative z-10 bg-black py-16 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-4 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

          <div className="container-shell relative z-10 px-4 sm:px-6">
            <AnimatedSection delay={80}>
              <div className="mx-auto mb-8 max-w-3xl text-center">
                <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Featured Tool</p>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  Live Gym Discovery Panel
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  Map + list view is your primary action area. Compare options here before moving to the selection guide.
                </p>
              </div>
            </AnimatedSection>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <AnimatedSection key={item.title} delay={index * 80}>
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                      <div className="mb-2 inline-flex rounded-lg border border-primary/25 bg-primary/10 p-2 text-primary">
                        <Icon size={16} />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-white/60">{item.description}</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <AnimatedSection delay={120} className="lg:col-span-7">
                <section className="sticky top-6">
                  <div className="map-glow-ring rounded-3xl border border-white/10 bg-black/50 p-2 shadow-2xl backdrop-blur-lg">
                    <div
                      ref={mapRef}
                      className="relative h-125 w-full overflow-hidden rounded-[1.2rem] bg-[#090909] lg:h-162.5"
                    >
                      <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 rounded-tl-md border-l-2 border-t-2 border-primary/30" />
                      <div className="pointer-events-none absolute right-4 top-4 h-6 w-6 rounded-tr-md border-r-2 border-t-2 border-primary/30" />
                      <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 rounded-bl-md border-b-2 border-l-2 border-primary/30" />
                      <div className="pointer-events-none absolute right-4 bottom-4 h-6 w-6 rounded-br-md border-r-2 border-b-2 border-primary/30" />
                    </div>
                  </div>

                  {(mapError || status) && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-5 py-3.5 text-sm text-white/80 backdrop-blur-md"
                    >
                      {!mapError && <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      <span>{mapError ? `Warning: ${mapError}` : status}</span>
                    </motion.div>
                  )}
                </section>
              </AnimatedSection>

              <AnimatedSection delay={220} className="lg:col-span-5">
                <section>
                  <div className="mb-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Dumbbell size={20} strokeWidth={2.5} />
                      </div>
                      <h2 className="text-3xl font-black uppercase tracking-wide text-white">Nearby Gyms</h2>
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                      {gyms.length} Found
                    </span>
                  </div>

                  <div className="gym-scroll h-162.5 space-y-4 overflow-y-auto pr-3">
                    {gyms.map((gym, idx) => (
                      <motion.article
                        key={`${gym.name}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.35 }}
                        className="gym-card flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <span className="mb-2 block font-mono text-xs font-bold tracking-wider text-primary/60">
                              #{String(idx + 1).padStart(2, "0")}
                            </span>
                            <h3 className="mb-2 text-lg font-bold leading-tight text-white">{gym.name}</h3>
                            <p className="flex items-start gap-2 text-sm text-white/50">
                              <MapPin size={16} className="mt-0.5 shrink-0 text-white/40" />
                              <span className="line-clamp-2">{gym.vicinity}</span>
                            </p>
                          </div>

                          <div className="shrink-0">
                            {gym.rating ? (
                              <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-1.5">
                                {renderStars(gym.rating)}
                              </div>
                            ) : (
                              <span className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/70">
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="my-5 h-px w-full bg-linear-to-r from-white/10 via-white/5 to-transparent" />

                        <div className="flex items-end justify-between">
                          <div>
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                              Est. Monthly
                            </p>
                            <p className="font-mono text-2xl font-black leading-none text-white">
                              <span className="mr-1.5 text-sm text-primary">Rs.</span>
                              {gym.simulatedPrice.toLocaleString()}
                            </p>
                          </div>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${gym.geometry?.location?.lat()},${gym.geometry?.location?.lng()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(185,255,102,0.3)]"
                          >
                            <Navigation
                              size={14}
                              strokeWidth={2.5}
                              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                            Directions
                          </a>
                        </div>
                      </motion.article>
                    ))}

                    {gyms.length === 0 && !status && (
                      <div className="flex h-48 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/10 bg-black/40 text-center">
                        <Dumbbell size={32} className="text-white/20" />
                        <p className="text-sm font-medium text-white/40">No gyms found in this area</p>
                      </div>
                    )}
                  </div>
                </section>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={300}>
              <section id="gym-knowledge" className="pt-18 sm:pt-22">
                <div className="mb-10 text-center">
                  <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Gym Selection Playbook</p>
                  <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                    Choose The Right Gym For Real Progress
                  </h2>
                  <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-white/65">
                    Use this framework to avoid contracts that look good on paper but fail your routine.
                    Practicality, crowd flow, and coaching quality drive consistency far more than marketing extras.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <AnimatedSection delay={80} className="lg:col-span-7">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {framework.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.article
                            key={item.title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.06, duration: 0.35 }}
                            className="rounded-2xl border border-white/10 bg-black/55 p-5 backdrop-blur-xl"
                          >
                            <div className="mb-4 inline-flex rounded-xl border border-primary/25 bg-primary/10 p-2 text-primary">
                              <Icon size={18} />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-wide text-white">{item.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
                            <div className="mt-4 space-y-2">
                              {item.points.map((point) => (
                                <div key={point} className="flex items-start gap-2 text-xs leading-5 text-white/70">
                                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </motion.article>
                        );
                      })}
                    </div>
                  </AnimatedSection>

                  <AnimatedSection delay={140} className="lg:col-span-5">
                    <div className="rounded-3xl border border-white/10 bg-black/55 p-6 backdrop-blur-xl">
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl border border-primary/25 bg-primary/10 p-2 text-primary">
                            <Clock3 size={18} />
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-wide text-white">Peak Crowding</h3>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                          Typical City Pattern
                        </span>
                      </div>

                      <div className="space-y-4">
                        {peakWindows.map((window, index) => (
                          <motion.div
                            key={window.slot}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.07, duration: 0.3 }}
                            className="rounded-xl border border-white/10 bg-white/2 p-3"
                          >
                            <div className="mb-2 flex items-center justify-between text-xs">
                              <span className="font-bold tracking-wide text-white/85">{window.slot}</span>
                              <span
                                className={`font-bold uppercase tracking-[0.15em] ${
                                  window.crowd >= 85 ? "text-rose-300" : window.crowd <= 50 ? "text-emerald-300" : "text-amber-200"
                                }`}
                              >
                                {window.label}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${window.crowd}%` }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }}
                                className="h-full rounded-full bg-linear-to-r from-primary/70 to-primary"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/10 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Quick Tip</p>
                        <p className="mt-1 text-sm leading-6 text-[#ddf6bf]">
                          Book your first month trial around off-peak hours, then test one evening slot before committing.
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <AnimatedSection delay={180} className="lg:col-span-7">
                    <div className="rounded-3xl border border-white/10 bg-black/55 p-6 backdrop-blur-xl">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl border border-primary/25 bg-primary/10 p-2 text-primary">
                          <Wallet size={18} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-wide text-white">Membership Snapshot</h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {membershipTiers.map((tier, index) => (
                          <motion.article
                            key={tier.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ delay: index * 0.07, duration: 0.35 }}
                            className={`rounded-2xl border p-4 ${
                              index === 1
                                ? "border-primary/45 bg-primary/10"
                                : "border-white/10 bg-white/2"
                            }`}
                          >
                            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary/80">{tier.title}</p>
                            <p className="mt-2 font-mono text-xl font-black text-white">{tier.price}</p>
                            <p className="mt-2 text-xs font-semibold text-white/70">{tier.bestFor}</p>
                            <div className="mt-4 space-y-2">
                              {tier.includes.map((point) => (
                                <div key={point} className="flex items-start gap-2 text-xs text-white/65">
                                  <Sparkles size={12} className="mt-0.5 shrink-0 text-primary" />
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>

                  <AnimatedSection delay={220} className="lg:col-span-5">
                    <div className="space-y-4">
                      {checklist.map((group, index) => {
                        const Icon = group.icon;
                        const toneClass =
                          group.tone === "good"
                            ? "border-emerald-400/25 bg-emerald-500/5"
                            : "border-rose-400/25 bg-rose-500/5";
                        const iconClass = group.tone === "good" ? "text-emerald-300" : "text-rose-300";
                        return (
                          <motion.article
                            key={group.title}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ delay: index * 0.08, duration: 0.35 }}
                            className={`rounded-2xl border p-5 ${toneClass}`}
                          >
                            <div className="mb-3 flex items-center gap-3">
                              <Icon size={17} className={iconClass} />
                              <h4 className="text-lg font-black uppercase tracking-wide text-white">{group.title}</h4>
                            </div>
                            <div className="space-y-2">
                              {group.items.map((item) => (
                                <p key={item} className="text-sm leading-6 text-white/75">
                                  {item}
                                </p>
                              ))}
                            </div>
                          </motion.article>
                        );
                      })}
                    </div>
                  </AnimatedSection>
                </div>

                <div className="pt-10 text-center">
                  <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-6 py-3">
                    <TimerReset className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold uppercase italic tracking-tight text-white">
                      Build your shortlist, visit in person, then commit with confidence
                    </span>
                  </div>
                </div>
              </section>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  );
}
