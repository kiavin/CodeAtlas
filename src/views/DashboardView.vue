<script setup>
import { computed } from "vue";
import { useSkillsStore } from "@/stores/useSkillsStore";
import { useRoadmapStore } from "@/stores/useRoadmapStore";
import BaseCard from "@/components/ui/BaseCard.vue";
import ContributionGraph from "@/components/ui/ContributionGraph.vue"; // Import it

// Chart.js Imports
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "vue-chartjs";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const skillsStore = useSkillsStore();
const roadmapStore = useRoadmapStore();

// Prepare Data for Radar Chart
const chartData = computed(() => {
  const labels = skillsStore.categories.map((c) => c.name.split(" ")[0]); // "Frontend", "Backend", etc.
  const dataPoints = skillsStore.categories.map((c) => {
    const total = c.skills.length;
    const mastered = c.skills.filter((s) => s.mastered).length;
    return total === 0 ? 0 : Math.round((mastered / total) * 100);
  });

  return {
    labels,
    datasets: [
      {
        label: "Skill Proficiency (%)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#3b82f6",
        data: dataPoints,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { color: "rgba(100, 100, 100, 0.1)" },
      grid: { color: "rgba(100, 100, 100, 0.1)" },
      pointLabels: { font: { size: 12 } },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <BaseCard class="border-l-4 border-l-blue-500">
      <h3 class="text-gray-500 text-sm font-medium">Active Tasks</h3>
      <p class="text-3xl font-bold mt-1">
        {{
          roadmapStore.tasks.filter((t) => t.status === "in-progress").length
        }}
      </p>
    </BaseCard>

    <BaseCard class="border-l-4 border-l-green-500">
      <h3 class="text-gray-500 text-sm font-medium">Skills Mastered</h3>
      <p class="text-3xl font-bold mt-1">{{ skillsStore.totalMastered }}</p>
    </BaseCard>

    <BaseCard class="border-l-4 border-l-purple-500">
      <h3 class="text-gray-500 text-sm font-medium">Total XP</h3>
      <p class="text-3xl font-bold mt-1">Level Up!</p>
    </BaseCard>

    <div class="md:col-span-2 min-h-[400px]">
      <BaseCard class="h-full flex flex-col">
        <h3 class="font-bold text-lg mb-4">Developer Profile Shape</h3>
        <div class="flex-1 relative">
          <Radar :data="chartData" :options="chartOptions" />
        </div>
      </BaseCard>
    </div>

    <BaseCard class="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <h3 class="font-bold text-lg mb-2">Daily Tip</h3>
      <p class="text-gray-300 italic">
        "First, solve the problem. Then, write the code."
      </p>
      <div class="mt-4 text-sm text-gray-400">- John Johnson</div>
    </BaseCard>
  </div>
  <div class="space-y-6">
    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm"
    >
      <h3 class="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
        Coding Consistency
      </h3>
      <ContributionGraph />
    </div>
  </div>
</template>
