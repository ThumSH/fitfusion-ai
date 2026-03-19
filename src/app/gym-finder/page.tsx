/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import VideoBackground from "../gym-finder/VideoBackground"; 

// Neon & Dark Blue Map Theme
const neonMapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#020617" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] },
  { "featureType": "poi.business", "stylers": [{ "visibility": "on" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#064e3b" }] }
];

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-javascript-api";
let googleMapsScriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript() {
  const googleObj = (window as any).google;
  if (googleObj?.maps?.places) {
    return Promise.resolve();
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      const loadedGoogle = (window as any).google;
      if (loadedGoogle?.maps?.places) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps API")), { once: true });
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps API"));
    document.head.appendChild(script);
  }).catch((error) => {
    googleMapsScriptPromise = null;
    throw error;
  });

  return googleMapsScriptPromise;
}

export default function GymFinderPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [gyms, setGyms] = useState<any[]>([]);
  const [status, setStatus] = useState("SCANNING LKR LOCATIONS...");

  useEffect(() => {
    let isUnmounted = false;

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, () => {
          if (!isUnmounted) setStatus("LOCATION ACCESS DENIED");
        });
      } else if (!isUnmounted) {
        setStatus("GEOLOCATION NOT SUPPORTED");
      }
    };

    const initMap = (position: GeolocationPosition) => {
      const googleObj = (window as any).google;
      if (!mapRef.current || !googleObj?.maps) {
        return;
      }

      setStatus("");
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const map = new googleObj.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 14,
        styles: neonMapStyles,
        disableDefaultUI: true,
      });

      // Neon Green User Location Marker
      new googleObj.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
          path: googleObj.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#b9ff66", // Matched with WhoAreWePage
          fillOpacity: 1,
          strokeWeight: 4,
          strokeColor: "#020617", 
        },
      });

      const service = new googleObj.maps.places.PlacesService(map);
      service.nearbySearch(
        { location: userLocation, radius: 5000, type: "gym" },
        (results, searchStatus) => {
          if (searchStatus === "OK" && results) {
            const gymsWithPrices = results.map(gym => ({
              ...gym,
              simulatedPrice: Math.floor(Math.random() * (18000 - 5000 + 1) + 5000)
            }));
            if (!isUnmounted) setGyms(gymsWithPrices);

            gymsWithPrices.forEach((place) => {
              new googleObj.maps.Marker({
                map: map,
                position: place.geometry?.location,
                title: place.name,
              });
            });
          }
        }
      );
    };

    loadGoogleMapsScript()
      .then(() => {
        if (!isUnmounted) getLocation();
      })
      .catch(() => {
        if (!isUnmounted) setStatus("MAP FAILED TO LOAD");
      });

    return () => {
      isUnmounted = true;
    };
  }, []);

  return (
    // Updated Main wrapper: Removed background to let global.css work
    <div className="relative min-h-screen text-white overflow-hidden selection:bg-[#b9ff66]/30 font-sans">
      
      <VideoBackground />

      {/* Added container-shell here */}
      <div className="relative z-10 p-6 md:p-12 mx-auto container-shell max-w-7xl">
        
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h1 className="text-6xl font-black italic text-[#b9ff66] uppercase tracking-tighter">
              GYM <span className="text-white">FINDER</span>
            </h1>
            <p className="text-slate-400 font-mono tracking-widest mt-2">Find best gyms around you in 5KM radius</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAP */}
          <div className="lg:col-span-7 sticky top-8">
            <div 
              ref={mapRef} 
              className="w-full h-[500px] lg:h-[650px] rounded-3xl border-2 border-[#1e293b] shadow-[0_0_50px_rgba(185,255,102,0.05)] bg-[#0f172a]"
            ></div>
          </div>

          {/* LIST */}
          <div className="lg:col-span-5 h-[650px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#b9ff66]">
            {status && (
              <div className="text-[#b9ff66] font-mono animate-pulse text-center p-10 border-2 border-dashed border-[#b9ff66]/20 rounded-2xl bg-[#0f172a]/50 backdrop-blur-md">
                {status}
              </div>
            )}
            
            {gyms.map((gym, idx) => (
              <div key={idx} className="bg-[#0f172a]/80 backdrop-blur-md border border-[#1e293b] p-6 rounded-2xl hover:border-[#b9ff66] transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <span className="text-[#b9ff66] text-xs font-black bg-[#b9ff66]/10 px-2 py-1 rounded italic">
                     {gym.rating ? `⭐ ${gym.rating}` : "NEW"}
                   </span>
                </div>

                <h3 className="font-bold text-2xl mb-1 group-hover:text-[#b9ff66] transition-colors pr-12">
                  {gym.name}
                </h3>
                <p className="text-slate-300 text-sm mb-4 line-clamp-1">{gym.vicinity}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1e293b]">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Yearly/Monthly Membership</p>
                    <p className="text-2xl font-black text-white">
                      <span className="text-[#b9ff66] mr-1">Rs.</span>
                      {gym.simulatedPrice.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Fixed the Google Maps link here */}
                  <a
                    href={`https://maps.google.com/?q=${gym.geometry?.location?.lat()},${gym.geometry?.location?.lng()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#b9ff66] text-[#020617] px-6 py-3 rounded-xl font-black uppercase text-xs tracking-tighter hover:bg-white transition-colors"
                  >
                    Start Training
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
