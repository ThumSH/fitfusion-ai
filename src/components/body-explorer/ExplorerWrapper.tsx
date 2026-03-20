"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Here, it is completely safe to use ssr: false because this is a Client Component.
const BodyExplorer = dynamic(() => import("./Explorer"), {
  ssr: false,
  loading: ExplorerLoadingState,
});

function ExplorerLoadingState() {
  return (
    <div className="h-150 w-full flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-primary font-medium tracking-widest uppercase text-sm animate-pulse">Loading 3D Engine...</p>
    </div>
  );
}

export default function ExplorerWrapper() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setShouldMount(true);
        observer.disconnect();
      },
      {
        // Start loading before the user reaches the section.
        rootMargin: "300px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={rootRef}>{shouldMount ? <BodyExplorer /> : <ExplorerLoadingState />}</div>;
}
