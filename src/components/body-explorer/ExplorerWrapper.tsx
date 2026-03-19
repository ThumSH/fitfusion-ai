"use client";

import dynamic from "next/dynamic";

// Here, it is completely safe to use ssr: false because this is a Client Component.
const BodyExplorer = dynamic(() => import("./Explorer"), {
  ssr: false,
  loading: () => (
    <div className="h-150 w-full flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-primary font-medium tracking-widest uppercase text-sm animate-pulse">Loading 3D Engine...</p>
    </div>
  ),
});

export default function ExplorerWrapper() {
  return <BodyExplorer />;
}