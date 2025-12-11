import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useActivityStore } from "@/stores/useActivityStore";

const activityStore = useActivityStore();

export const useRoadmapStore = defineStore("roadmap", () => {
  // We keep a single list, but drag-and-drop views will filter it.
  const defaultTasks = [
    {
      id: 1,
      title: "Learn TypeScript Basics",
      status: "in-progress",
      week: "current",
    },
    {
      id: 2,
      title: "Set up Kubernetes Cluster",
      status: "todo",
      week: "current",
    },
  ];

  const stored = localStorage.getItem("roadmap_data");
  const tasks = ref(stored ? JSON.parse(stored) : defaultTasks);

  watch(
    tasks,
    (newVal) => localStorage.setItem("roadmap_data", JSON.stringify(newVal)),
    { deep: true }
  );

  const addTask = (title, status = "todo") => {
    tasks.value.push({ id: Date.now(), title, status, week: "current" });
  };

  const removeTask = (id) => {
    tasks.value = tasks.value.filter((t) => t.id !== id);
  };

  // Vital for Drag and Drop: specific function to update status
  const updateStatus = (id, newStatus) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task) task.status = newStatus;
    if (newStatus === "done") {
      activityStore.logActivity(); // <--- Add this line!
    }
  };

  const totalCompleted = computed(
    () => tasks.value.filter((t) => t.status === "done").length
  );

  const updateTaskTitle = (id, newTitle) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task && newTitle.trim()) {
      task.title = newTitle;
    }
  };

  return {
    tasks,
    addTask,
    removeTask,
    updateStatus,
    totalCompleted,
    updateTaskTitle,
  };
});
