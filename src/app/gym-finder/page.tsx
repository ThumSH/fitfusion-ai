/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, Dumbbell, Navigation } from "lucide-react";
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
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const gymMarkersRef = useRef<any[]>([]);

  const [gyms, setGyms] = useState<any[]>([]);
  const [status, setStatus] = useState("Initializing map...");
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let isUnmounted = false;

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
      service.nearbySearch({ location: center, radius: 5000, type: "gym" }, (results: any[] | null, searchStatus: string) => {
        if (isUnmounted) return;

        clearGymMarkers();

        if (searchStatus === "OK" && results) {
          const gymsWithPrices = results.map((gym) => ({
            ...gym,
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
      });
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
  }, []);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-[12px] ${
              i < full ? "text-primary" : i === full && half ? "text-primary/50" : "text-white/20"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1.5 text-[11px] font-semibold tracking-wide text-white/70">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <>
      {/* Global styles injected once */}
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

        @keyframes badge-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(185,255,102,0.0); }
          50% { box-shadow: 0 0 14px 3px rgba(185,255,102,0.15); }
        }
        .badge-glow { animation: badge-glow 3s ease-in-out infinite; }
      `}</style>

      <div className="gym-finder-root relative min-h-screen overflow-hidden pt-28 pb-14 text-white bg-background">
        <VideoBackground />

        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-125 w-225 -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-75 w-100 rounded-full bg-primary/5 blur-[120px]" />

        <div className="container-shell relative z-10 px-4 sm:px-6 max-w-7xl mx-auto">
          
          {/* ── Hero Section ── */}
<motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-black/20 px-6 py-12 text-center backdrop-blur-3xl sm:px-12"
            // 3. Softened the shadow opacity from 0.5 to 0.3 for a lighter feel
            style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
          >
            {/* Badge */}
            <div className="badge-glow mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Compass size={14} className="text-primary" strokeWidth={2.5} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Gym Finder</span>
            </div>

            <h1 className="text-5xl font-black uppercase tracking-tight sm:text-6xl md:text-7xl">
              Find Your Next{" "}
              <span className="text-primary drop-shadow-[0_0_20px_rgba(185,255,102,0.3)]">
                Training Zone
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-white/60 sm:text-base">
              Discover nearby gyms instantly and open direct navigation with one click.
            </p>

            {/* Subtle divider */}
            <div className="mx-auto mt-10 h-px w-24 bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </motion.section>

          {/* ── Map + List Grid ── */}
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            
            {/* Map */}
            <motion.section
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 sticky top-6"
            >
              <div className="map-glow-ring rounded-3xl border border-white/10 bg-black/50 p-2 shadow-2xl backdrop-blur-lg">
                <div
                  ref={mapRef}
                  className="relative h-125 w-full overflow-hidden rounded-[1.2rem] bg-[#090909] lg:h-162.5"
                >
                  {/* Subtle Corner accent lines */}
                  <div className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-primary/30 rounded-tl-md" />
                  <div className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-primary/30 rounded-tr-md" />
                  <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-primary/30 rounded-bl-md" />
                  <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-primary/30 rounded-br-md" />
                </div>
              </div>

              {/* Status / Error bar */}
              {(mapError || status) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-5 py-3.5 text-sm text-white/80 backdrop-blur-md"
                >
                  {!mapError && (
                    <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                  <span>{mapError ? `⚠ ${mapError}` : status}</span>
                </motion.div>
              )}
            </motion.section>

            {/* Gym List */}
            <motion.section
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              {/* List Header */}
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

              {/* Scrollable list */}
              <div className="gym-scroll h-162.5 space-y-4 overflow-y-auto pr-3">
                {gyms.map((gym, idx) => (
                  <motion.article
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.35 }}
                    className="gym-card flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <span className="font-mono text-xs font-bold tracking-wider text-primary/60 mb-2 block">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-lg font-bold leading-tight text-white mb-2">{gym.name}</h3>
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
                        <Navigation size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        Directions
                      </a>
                    </div>
                  </motion.article>
                ))}

                {/* Empty state */}
                {gyms.length === 0 && !status && (
                  <div className="flex h-48 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/10 bg-black/40 text-center">
                    <Dumbbell size={32} className="text-white/20" />
                    <p className="text-sm font-medium text-white/40">No gyms found in this area</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </>
  );
}