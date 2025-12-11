<script setup>
import { computed } from "vue";
import { useActivityStore } from "@/stores/useActivityStore";

const store = useActivityStore();

// Generate last 365 days
const weeks = computed(() => {
  const data = [];
  const today = new Date();

  // Start from 52 weeks ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);

  // Adjust start date to be a Sunday to align grid nicely
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  let current = new Date(startDate);

  // Create 53 columns (weeks)
  for (let w = 0; w < 53; w++) {
    const week = [];
    // Create 7 rows (days)
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split("T")[0];
      week.push({
        date: dateStr,
        level: store.getActivityLevel(dateStr),
        count: store.activities[dateStr] || 0,
      });
      current.setDate(current.getDate() + 1);
    }
    data.push(week);
  }
  return data;
});

const getColor = (level) => {
  switch (level) {
    case 0:
      return "bg-gray-100 dark:bg-slate-800";
    case 1:
      return "bg-green-200 dark:bg-green-900/40";
    case 2:
      return "bg-green-300 dark:bg-green-800/60";
    case 3:
      return "bg-green-400 dark:bg-green-600";
    case 4:
      return "bg-green-500 dark:bg-green-500";
    default:
      return "bg-gray-100 dark:bg-slate-800";
  }
};
</script>

<template>
  <div class="w-full overflow-x-auto pb-2">
    <div class="flex gap-1 min-w-max">
      <div v-for="(week, i) in weeks" :key="i" class="flex flex-col gap-1">
        <div
          v-for="day in week"
          :key="day.date"
          class="w-3 h-3 rounded-sm transition-colors duration-300 relative group"
          :class="getColor(day.level)"
        >
          <div
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg"
          >
            {{ day.count }} contributions on {{ day.date }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
      <span>Less</span>
      <div class="w-3 h-3 bg-gray-100 dark:bg-slate-800 rounded-sm"></div>
      <div class="w-3 h-3 bg-green-200 dark:bg-green-900/40 rounded-sm"></div>
      <div class="w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm"></div>
      <div class="w-3 h-3 bg-green-500 dark:bg-green-500 rounded-sm"></div>
      <span>More</span>
    </div>
  </div>
</template>
