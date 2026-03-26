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
import { Bar, Bubble, Line, PolarArea } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
);

export type WorkoutEvidenceMetric = {
  label: string;
  value: string;
  score: number;
};

export type WorkoutEvidenceProfile = {
  name: string;
  physical: number;
  mental: number;
  sleep: number;
  cognition: number;
};

type WorkoutEvidenceChartsProps = {
  mentalMetrics: WorkoutEvidenceMetric[];
  physicalMetrics: WorkoutEvidenceMetric[];
  profiles: WorkoutEvidenceProfile[];
};

const baseChartLegend = {
  labels: { color: "rgba(255,255,255,0.75)" },
};

const gridColor = "rgba(255,255,255,0.08)";

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { color: gridColor },
      ticks: { color: "rgba(255,255,255,0.7)" },
    },
    y: {
      min: 0,
      max: 45,
      grid: { color: gridColor },
      ticks: {
        color: "rgba(255,255,255,0.7)",
        callback: (value: string | number) => `${value}%`,
      },
    },
  },
  plugins: {
    legend: baseChartLegend,
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.9)",
      borderColor: "rgba(185,255,102,0.4)",
      borderWidth: 1,
    },
  },
};

const groupedBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "rgba(255,255,255,0.75)" },
    },
    y: {
      min: 0,
      max: 100,
      grid: { color: gridColor },
      ticks: { color: "rgba(255,255,255,0.7)" },
    },
  },
  plugins: {
    legend: baseChartLegend,
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.9)",
      borderColor: "rgba(185,255,102,0.4)",
      borderWidth: 1,
    },
  },
};

const polarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      min: 0,
      max: 100,
      grid: { color: gridColor },
      ticks: { display: false },
      pointLabels: { color: "rgba(255,255,255,0.75)" },
    },
  },
  plugins: {
    legend: { display: false },
  },
};

const bubbleOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      min: 40,
      max: 100,
      title: { display: true, text: "Effect Signal", color: "rgba(255,255,255,0.75)" },
      grid: { color: gridColor },
      ticks: { color: "rgba(255,255,255,0.7)" },
    },
    y: {
      min: 35,
      max: 100,
      title: { display: true, text: "Evidence Consistency", color: "rgba(255,255,255,0.75)" },
      grid: { color: gridColor },
      ticks: { color: "rgba(255,255,255,0.7)" },
    },
  },
  plugins: {
    legend: baseChartLegend,
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.9)",
      borderColor: "rgba(185,255,102,0.4)",
      borderWidth: 1,
    },
  },
};

export default function WorkoutEvidenceCharts({
  mentalMetrics,
  physicalMetrics,
  profiles,
}: WorkoutEvidenceChartsProps) {
  const stepsDoseResponseData = {
    labels: ["2000", "4000", "7000", "10000", "12000"],
    datasets: [
      {
        label: "CVD Incidence Risk Reduction",
        data: [0, 10, 25, 32, 39],
        borderColor: "rgba(120,225,255,0.95)",
        backgroundColor: "rgba(120,225,255,0.2)",
        fill: true,
        tension: 0.35,
      },
      {
        label: "Depression Risk Reduction",
        data: [0, 6, 31, 35, 38],
        borderColor: "rgba(185,255,102,0.95)",
        backgroundColor: "rgba(185,255,102,0.15)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const groupedBarData = {
    labels: ["Depression", "Anxiety", "Cardio Risk", "Blood Pressure"],
    datasets: [
      {
        label: "Mental Domain",
        data: [mentalMetrics[0]?.score ?? 0, mentalMetrics[1]?.score ?? 0, 62, 52],
        borderRadius: 10,
        backgroundColor: "rgba(185,255,102,0.75)",
      },
      {
        label: "Physical Domain",
        data: [68, 64, physicalMetrics[1]?.score ?? 0, physicalMetrics[3]?.score ?? 0],
        borderRadius: 10,
        backgroundColor: "rgba(120,225,255,0.75)",
      },
    ],
  };

  const profileAverage = profiles.reduce(
    (acc, p) => {
      acc.physical += p.physical;
      acc.mental += p.mental;
      acc.sleep += p.sleep;
      acc.cognition += p.cognition;
      return acc;
    },
    { physical: 0, mental: 0, sleep: 0, cognition: 0 }
  );

  const profileCount = Math.max(profiles.length, 1);
  const polarData = {
    labels: ["Physical", "Mental", "Sleep", "Cognition"],
    datasets: [
      {
        label: "Evidence Domain Strength",
        data: [
          Math.round(profileAverage.physical / profileCount),
          Math.round(profileAverage.mental / profileCount),
          Math.round(profileAverage.sleep / profileCount),
          Math.round(profileAverage.cognition / profileCount),
        ],
        backgroundColor: ["rgba(120,225,255,0.75)", "rgba(185,255,102,0.75)", "rgba(255,184,107,0.72)", "rgba(184,184,255,0.72)"],
        borderColor: "rgba(0,0,0,0)",
      },
    ],
  };

  const interventionBubbleData = {
    datasets: [
      {
        label: "Cardio / Mixed Aerobic",
        data: [
          { x: 88, y: 82, r: 14 },
          { x: 84, y: 78, r: 12 },
        ],
        backgroundColor: "rgba(120,225,255,0.7)",
      },
      {
        label: "Strength / Resistance",
        data: [
          { x: 74, y: 72, r: 11 },
          { x: 70, y: 66, r: 10 },
        ],
        backgroundColor: "rgba(185,255,102,0.72)",
      },
      {
        label: "Mind-Body Modalities",
        data: [
          { x: 80, y: 76, r: 12 },
          { x: 72, y: 64, r: 9 },
        ],
        backgroundColor: "rgba(255,184,107,0.72)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Dose-Response Curve</p>
        <div className="h-76">
          <Line data={stepsDoseResponseData} options={lineOptions} />
        </div>
        <div className="mt-3 space-y-1.5">
          <p className="text-[11px] text-white/65">
            7000 vs 2000 steps/day linked with about <span className="text-[#dff8be]">25% lower CVD incidence risk</span>.
          </p>
          <p className="text-[11px] text-white/65">
            12000 vs 2000 steps/day linked with about <span className="text-[#dff8be]">39% lower CVD incidence risk</span>.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Domain Comparison (Grouped)</p>
        <div className="h-76">
          <Bar data={groupedBarData} options={groupedBarOptions} />
        </div>
        <div className="mt-3 space-y-1.5">
          {mentalMetrics.slice(0, 2).map((item) => (
            <p key={item.label} className="text-[11px] text-white/65">
              {item.label}: <span className="text-[#dff8be]">{item.value}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Impact Wheel (Polar)</p>
        <div className="h-76">
          <PolarArea data={polarData} options={polarOptions} />
        </div>
        <div className="mt-3 space-y-1.5">
          <p className="text-[11px] text-white/65">
            Domain scores summarize physical, mental, sleep, and cognition impact balance from recent reviews.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Intervention Bubble Map</p>
        <div className="h-76">
          <Bubble data={interventionBubbleData} options={bubbleOptions} />
        </div>
        <div className="mt-3 space-y-1.5">
          {physicalMetrics.slice(0, 2).map((item) => (
            <p key={item.label} className="text-[11px] text-white/65">
              {item.label}: <span className="text-[#dff8be]">{item.value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
