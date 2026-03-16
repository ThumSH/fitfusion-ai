import Hero from "./components/Hero";
import WorkoutGenerator from "./components/sections/WorkOut";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <Hero/>
      <WorkoutGenerator/>
    </main>
  );
}