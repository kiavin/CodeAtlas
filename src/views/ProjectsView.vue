<script setup>
import { ref } from "vue";
import { useProjectsStore } from "@/stores/useProjectsStore";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import {
  Rocket,
  Code,
  CheckCircle,
  Plus,
  Trash2,
  Layers,
  Pencil,
} from "lucide-vue-next";

const store = useProjectsStore();
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

// Form Model
const form = ref({
  title: "",
  description: "",
  techStack: "",
  difficulty: "medium",
  status: "idea", // Track status to preserve it during edit
});

// Reset Form
const resetForm = () => {
  form.value = {
    title: "",
    description: "",
    techStack: "",
    difficulty: "medium",
    status: "idea",
  };
  isEditing.value = false;
  editingId.value = null;
};

// Open "New Project" Modal
const openNewModal = () => {
  resetForm();
  isModalOpen.value = true;
};

// Open "Edit Project" Modal
const openEditModal = (project) => {
  form.value = {
    title: project.title,
    description: project.description,
    techStack: project.techStack.join(", "), // Convert Array -> String for input
    difficulty: project.difficulty,
    status: project.status,
  };
  editingId.value = project.id;
  isEditing.value = true;
  isModalOpen.value = true;
};

// Handle Save (Create or Update)
const handleSubmit = () => {
  const payload = {
    title: form.value.title,
    description: form.value.description,
    techStack: form.value.techStack
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t),
    difficulty: form.value.difficulty,
    // We don't overwrite status here unless we add a status dropdown,
    // but for updates we usually preserve the existing status logic or update it explicitly.
  };

  if (isEditing.value && editingId.value) {
    store.updateProject(editingId.value, payload);
  } else {
    store.addProject(payload);
  }

  isModalOpen.value = false;
  resetForm();
};

const getDifficultyColor = (diff) => {
  if (diff === "hard") return "text-red-500 bg-red-50 dark:bg-red-900/20";
  if (diff === "medium")
    return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
  return "text-green-500 bg-green-50 dark:bg-green-900/20";
};
</script>

<template>
  <div class="space-y-8">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <Rocket class="w-8 h-8 text-primary" /> Project Portfolio
        </h1>
        <p class="text-gray-500 mt-1">
          Build to learn. Projects validate your skills.
        </p>
      </div>
      <button
        @click="openNewModal"
        class="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
      >
        <Plus class="w-5 h-5" /> New Project
      </button>
    </div>

    <section v-if="store.activeProjects.length > 0">
      <h2
        class="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"
      >
        <Code class="w-5 h-5" /> In Progress
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard
          v-for="project in store.activeProjects"
          :key="project.id"
          class="border-l-4 border-l-blue-500 relative group"
        >
          <div class="flex justify-between items-start mb-2 pr-8">
            <h3 class="text-xl font-bold">{{ project.title }}</h3>
            <span
              class="px-2 py-1 rounded text-xs uppercase font-bold tracking-wider"
              :class="getDifficultyColor(project.difficulty)"
            >
              {{ project.difficulty }}
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ project.description }}
          </p>

          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tech in project.techStack"
              :key="tech"
              class="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono"
            >
              {{ tech }}
            </span>
          </div>

          <div class="flex justify-end gap-3 mt-auto">
            <button
              @click="store.markCompleted(project.id)"
              class="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              <CheckCircle class="w-4 h-4" /> Ship It!
            </button>
          </div>

          <div
            class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 pl-2"
          >
            <button
              @click="openEditModal(project)"
              class="text-gray-300 hover:text-blue-500"
              title="Edit"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="store.deleteProject(project.id)"
              class="text-gray-300 hover:text-red-500"
              title="Delete"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </BaseCard>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section>
        <h2
          class="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"
        >
          <Layers class="w-5 h-5" /> Ideas Backlog
        </h2>
        <div class="space-y-4">
          <BaseCard
            v-for="project in store.ideas"
            :key="project.id"
            class="relative group opacity-80 hover:opacity-100 transition-opacity"
          >
            <div class="flex justify-between pr-14">
              <h4 class="font-bold">{{ project.title }}</h4>
              <button
                @click="project.status = 'in-progress'"
                class="text-xs bg-gray-100 dark:bg-slate-700 hover:bg-primary hover:text-white px-2 py-1 rounded transition-colors"
              >
                Start
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ project.description }}</p>

            <div
              class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="openEditModal(project)"
                class="text-gray-400 hover:text-blue-500"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                @click="store.deleteProject(project.id)"
                class="text-gray-400 hover:text-red-500"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </BaseCard>
        </div>
      </section>

      <section>
        <h2
          class="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"
        >
          <CheckCircle class="w-5 h-5" /> Shipped
        </h2>
        <div class="space-y-4">
          <BaseCard
            v-for="project in store.completedProjects"
            :key="project.id"
            class="bg-green-50/50 dark:bg-green-900/10 relative group"
          >
            <h4
              class="font-bold text-gray-800 dark:text-gray-200 line-through decoration-green-500 decoration-2"
            >
              {{ project.title }}
            </h4>
            <div class="flex gap-2 mt-2">
              <span
                v-for="tech in project.techStack.slice(0, 3)"
                :key="tech"
                class="text-xs text-green-600 dark:text-green-400"
                >#{{ tech }}</span
              >
            </div>
            <div
              class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="openEditModal(project)"
                class="text-gray-400 hover:text-blue-500"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                @click="store.deleteProject(project.id)"
                class="text-gray-400 hover:text-red-500"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </BaseCard>
        </div>
      </section>
    </div>

    <BaseModal
      :is-open="isModalOpen"
      :title="isEditing ? 'Edit Project' : 'New Project Idea'"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Project Name</label>
          <input
            v-model="form.title"
            class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="form.description"
            class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1"
            >Tech Stack (comma separated)</label
          >
          <input
            v-model="form.techStack"
            class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            placeholder="Vue, Laravel, AWS"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Difficulty</label>
          <select
            v-model="form.difficulty"
            class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          >
            <option value="easy">Easy (100 XP)</option>
            <option value="medium">Medium (250 XP)</option>
            <option value="hard">Hard (500 XP)</option>
          </select>
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-lg font-bold"
        >
          {{ isEditing ? "Save Changes" : "Create Project" }}
        </button>
      </form>
    </BaseModal>
  </div>
</template>
