import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useActivityStore = defineStore("activity", () => {
  // Data Structure: { "2023-10-05": 5, "2023-10-06": 1 }
  const stored = localStorage.getItem("activity_data");
  const activities = ref(stored ? JSON.parse(stored) : {});

  watch(
    activities,
    (newVal) => localStorage.setItem("activity_data", JSON.stringify(newVal)),
    { deep: true }
  );

  // --- Actions ---

  const logActivity = () => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    if (activities.value[today]) {
      activities.value[today]++;
    } else {
      activities.value[today] = 1;
    }
  };

  const getActivityLevel = (date) => {
    const count = activities.value[date] || 0;
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  return { activities, logActivity, getActivityLevel };
});
