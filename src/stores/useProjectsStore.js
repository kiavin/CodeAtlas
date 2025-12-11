import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useGameStore } from "./useGameStore";

export const useProjectsStore = defineStore("projects", () => {
  const gameStore = useGameStore();

  // Seed Data: Your Real Life Projects + Suggestions
  const defaultProjects = [
    {
      id: 1,
      title: "Wattrix - Utility Metering",
      description:
        "A virtualized utility metering platform using Vue 3 and Docker.",
      status: "in-progress", // idea, in-progress, completed
      techStack: ["Vue 3", "Docker", "Nginx", "PHP"],
      difficulty: "hard",
    },
    {
      id: 2,
      title: "DevOps Tracker App",
      description: "The application you are building right now!",
      status: "completed",
      techStack: ["Vue 3", "Pinia", "Tailwind", "LocalStorage"],
      difficulty: "medium",
    },
  ];

  const stored = localStorage.getItem("projects_data");
  const projects = ref(stored ? JSON.parse(stored) : defaultProjects);

  watch(
    projects,
    (newVal) => localStorage.setItem("projects_data", JSON.stringify(newVal)),
    { deep: true }
  );

  // --- Actions ---

  const addProject = (project) => {
    projects.value.push({
      id: Date.now(),
      status: "idea",
      ...project,
    });
  };

  const deleteProject = (id) => {
    projects.value = projects.value.filter((p) => p.id !== id);
  };

  const markCompleted = (id) => {
    const project = projects.value.find((p) => p.id === id);
    if (project && project.status !== "completed") {
      project.status = "completed";

      // Award Massive XP based on difficulty
      const xpReward =
        project.difficulty === "hard"
          ? 500
          : project.difficulty === "medium"
          ? 250
          : 100;
      // Note: In a real app, we'd call a dedicated action in gameStore,
      // but for now we assume gameStore calculates based on completed tasks.
      // We can manually trigger an alert or toast here.
      alert(`🎉 Project Completed! +${xpReward} XP Earned!`);
    }
  };

  // --- Getters ---

  const activeProjects = computed(() =>
    projects.value.filter((p) => p.status === "in-progress")
  );
  const completedProjects = computed(() =>
    projects.value.filter((p) => p.status === "completed")
  );
  const ideas = computed(() =>
    projects.value.filter((p) => p.status === "idea")
  );

  const updateProject = (id, updatedFields) => {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      // Merge existing project with new fields
      projects.value[index] = {
        ...projects.value[index],
        ...updatedFields,
      };
    }
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    markCompleted,
    activeProjects,
    completedProjects,
    ideas,
  };
});
