import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useCurriculumStore = defineStore("curriculum", () => {
  // "Ultimate Guide" Starter Pack
  const defaultResources = [
    {
      id: 1,
      title: "Vue 3 Documentation",
      type: "doc",
      url: "https://vuejs.org/guide/introduction.html",
      topic: "Frontend",
      completed: false,
      tags: ["Vue", "Official"],
    },
    {
      id: 2,
      title: "Pinia - State Management",
      type: "doc",
      url: "https://pinia.vuejs.org/",
      topic: "Frontend",
      completed: false,
      tags: ["Vue", "State"],
    },
    {
      id: 3,
      title: "Docker for Beginners",
      type: "video",
      url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      topic: "DevOps",
      completed: true,
      tags: ["Docker", "Containers"],
    },
    {
      id: 4,
      title: "PHP: The Right Way",
      type: "article",
      url: "https://phptherightway.com/",
      topic: "Backend",
      completed: false,
      tags: ["PHP", "Best Practices"],
    },
    {
      id: 5,
      title: "Tailwind Cheatsheet",
      type: "tool",
      url: "https://nerdcave.com/tailwind-cheat-sheet",
      topic: "Frontend",
      completed: true,
      tags: ["CSS", "Utility"],
    },
    {
      id: 6,
      title: "Roadmap.sh - DevOps",
      type: "course",
      url: "https://roadmap.sh/devops",
      topic: "DevOps",
      completed: false,
      tags: ["Career", "Guide"],
    },
  ];

  const stored = localStorage.getItem("curriculum_data");
  const resources = ref(stored ? JSON.parse(stored) : defaultResources);

  // Persistence
  watch(
    resources,
    (newVal) => {
      localStorage.setItem("curriculum_data", JSON.stringify(newVal));
    },
    { deep: true }
  );

  // --- Actions ---

  const addResource = (resource) => {
    resources.value.push({
      id: Date.now(),
      completed: false,
      ...resource,
    });
  };

  const removeResource = (id) => {
    resources.value = resources.value.filter((r) => r.id !== id);
  };

  const toggleComplete = (id) => {
    const item = resources.value.find((r) => r.id === id);
    if (item) item.completed = !item.completed;
  };

  // --- Getters ---

  const allTopics = computed(() => {
    const topics = new Set(resources.value.map((r) => r.topic));
    return ["All", ...Array.from(topics)];
  });

  const getStats = computed(() => {
    const total = resources.value.length;
    const done = resources.value.filter((r) => r.completed).length;
    return {
      total,
      done,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  });

  return {
    resources,
    addResource,
    removeResource,
    toggleComplete,
    allTopics,
    getStats,
  };
});
