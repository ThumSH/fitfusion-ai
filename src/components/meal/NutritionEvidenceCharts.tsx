"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Pie, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export type EvidenceMetric = {
  label: string;
  value: string;
  score: number;
  sourceTag: string;
};

export type EvidenceProfile = {
  name: string;
  performance: number;
  recovery: number;
  sleep: number;
};

type NutritionEvidenceChartsProps = {
  creatineMetrics: EvidenceMetric[];
  proteinMetrics: EvidenceMetric[];
  profiles: EvidenceProfile[];
};

const baseBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  scales: {
    x: {
      min: 0,
      max: 100,
      grid: { color: "rgba(255,255,255,0.08)" },
      ticks: { color: "rgba(255,255,255,0.6)" },
    },
    y: {
      grid: { display: false },
      ticks: { color: "rgba(255,255,255,0.75)" },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.9)",
      borderColor: "rgba(185,255,102,0.4)",
      borderWidth: 1,
    },
  },
};

export default function NutritionEvidenceCharts({
  creatineMetrics,
  proteinMetrics,
  profiles,
}: NutritionEvidenceChartsProps) {
  const creatineBarData = {
    labels: creatineMetrics.map((m) => m.label),
    datasets: [
      {
        label: "Creatine Evidence",
        data: creatineMetrics.map((m) => m.score),
        borderRadius: 10,
        backgroundColor: "rgba(185,255,102,0.72)",
      },
    ],
  };

  const proteinBarData = {
    labels: proteinMetrics.map((m) => m.label),
    datasets: [
      {
        label: "Protein Evidence",
        data: proteinMetrics.map((m) => m.score),
        borderRadius: 10,
        backgroundColor: "rgba(120,225,255,0.7)",
      },
    ],
  };

  const radarData = {
    labels: ["Performance", "Recovery", "Sleep"],
    datasets: profiles.map((p, idx) => ({
      label: p.name,
      data: [p.performance, p.recovery, p.sleep],
      fill: true,
      borderWidth: 2,
      borderColor: idx === 0 ? "rgba(185,255,102,1)" : "rgba(120,225,255,1)",
      backgroundColor: idx === 0 ? "rgba(185,255,102,0.2)" : "rgba(120,225,255,0.2)",
      pointBackgroundColor: idx === 0 ? "rgba(185,255,102,1)" : "rgba(120,225,255,1)",
      pointBorderColor: "#000",
    })),
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { display: false, stepSize: 20 },
        grid: { color: "rgba(255,255,255,0.1)" },
        angleLines: { color: "rgba(255,255,255,0.1)" },
        pointLabels: { color: "rgba(255,255,255,0.8)" },
      },
    },
    plugins: {
      legend: { labels: { color: "rgba(255,255,255,0.75)" } },
    },
  };

  const macroGoalDoughnut = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        label: "Lean Bulk Macro Split",
        data: [25, 50, 25],
        backgroundColor: ["#b9ff66", "#6ed7ff", "#ffb86b"],
        borderColor: "rgba(0,0,0,0)",
      },
    ],
  };

  const supplementPriorityPie = {
    labels: ["Protein Intake Foundation", "Creatine Consistency", "Hydration/Electrolytes"],
    datasets: [
      {
        label: "Priority Split",
        data: [45, 30, 25],
        backgroundColor: ["#b9ff66", "#79e2ff", "#ffa86d"],
        borderColor: "rgba(0,0,0,0)",
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "rgba(255,255,255,0.75)" },
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Creatine Evidence</p>
        <div className="h-[19rem]">
          <Bar data={creatineBarData} options={baseBarOptions} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Protein Evidence</p>
        <div className="h-[19rem]">
          <Bar data={proteinBarData} options={baseBarOptions} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Performance / Recovery / Sleep</p>
        <div className="h-[19rem]">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Lean Bulk Macro Ratio</p>
          <div className="h-[13rem]">
            <Doughnut data={macroGoalDoughnut} options={pieOptions} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Supplement Priority</p>
          <div className="h-[13rem]">
            <Pie data={supplementPriorityPie} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
