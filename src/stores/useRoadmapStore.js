import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useRoadmapStore = defineStore("roadmap", () => {
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
    { id: 3, title: "Refactor Legacy Code", status: "done", week: "previous" },
  ];

  const stored = localStorage.getItem("roadmap_data");
  const tasks = ref(stored ? JSON.parse(stored) : defaultTasks);

  watch(
    tasks,
    (newVal) => localStorage.setItem("roadmap_data", JSON.stringify(newVal)),
    { deep: true }
  );

  const addTask = (title) => {
    tasks.value.push({
      id: Date.now(),
      title,
      status: "todo",
      week: "current",
    });
  };

  const removeTask = (id) => {
    tasks.value = tasks.value.filter((t) => t.id !== id);
  };

  const updateStatus = (id, status) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task) task.status = status;
  };

  return { tasks, addTask, removeTask, updateStatus };
});
