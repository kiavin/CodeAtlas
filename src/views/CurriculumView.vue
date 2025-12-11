<script setup>
import { ref, computed } from "vue";
import { useCurriculumStore } from "@/stores/useCurriculumStore";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import {
  BookOpen,
  Video,
  FileText,
  Wrench,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2,
  GraduationCap,
  Filter,
} from "lucide-vue-next";

const store = useCurriculumStore();

// UI State
const activeFilter = ref("All");
const isModalOpen = ref(false);
const searchQuery = ref("");

// Form State
const newForm = ref({
  title: "",
  url: "",
  topic: "Frontend", // Default
  type: "doc",
  tags: "",
});

// Helper: Icons based on type
const getTypeIcon = (type) => {
  switch (type) {
    case "video":
      return Video;
    case "course":
      return GraduationCap;
    case "tool":
      return Wrench;
    default:
      return FileText;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "video":
      return "text-red-500 bg-red-50 dark:bg-red-900/20";
    case "course":
      return "text-purple-500 bg-purple-50 dark:bg-purple-900/20";
    case "tool":
      return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
    default:
      return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
  }
};

// Filter Logic
const filteredResources = computed(() => {
  return store.resources.filter((r) => {
    const matchesTopic =
      activeFilter.value === "All" || r.topic === activeFilter.value;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    return matchesTopic && matchesSearch;
  });
});

const handleSubmit = () => {
  if (!newForm.value.title || !newForm.value.url) return;

  store.addResource({
    title: newForm.value.title,
    url: newForm.value.url,
    type: newForm.value.type,
    topic: newForm.value.topic,
    tags: newForm.value.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t),
  });

  // Reset
  newForm.value = {
    title: "",
    url: "",
    topic: "Frontend",
    type: "doc",
    tags: "",
  };
  isModalOpen.value = false;
};
</script>

<template>
  <div class="h-full flex flex-col md:flex-row gap-6">
    <div class="hidden md:block w-64 flex-shrink-0 space-y-6">
      <BaseCard>
        <h3 class="font-bold mb-4 flex items-center gap-2">
          <Filter class="w-4 h-4" /> Topics
        </h3>
        <div class="space-y-1">
          <button
            v-for="topic in store.allTopics"
            :key="topic"
            @click="activeFilter = topic"
            class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center"
            :class="
              activeFilter === topic
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100 dark:hover:bg-slate-700'
            "
          >
            {{ topic }}
            <span v-if="topic !== 'All'" class="text-xs opacity-70">
              {{ store.resources.filter((r) => r.topic === topic).length }}
            </span>
          </button>
        </div>
      </BaseCard>

      <BaseCard
        class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
      >
        <h3 class="font-bold mb-2">Learning Stats</h3>
        <div class="flex items-end gap-2">
          <span class="text-4xl font-bold">{{ store.getStats.percent }}%</span>
          <span class="text-sm opacity-80 mb-1">Resources Completed</span>
        </div>
        <div class="w-full bg-black/20 rounded-full h-1.5 mt-2">
          <div
            class="bg-white h-1.5 rounded-full"
            :style="{ width: store.getStats.percent + '%' }"
          ></div>
        </div>
      </BaseCard>
    </div>

    <div class="flex-1">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <div>
          <h1 class="text-2xl font-bold">Study Curriculum</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Organize your tutorials, docs, and courses.
          </p>
        </div>

        <div class="flex gap-2 w-full sm:w-auto">
          <select
            v-model="activeFilter"
            class="md:hidden flex-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg px-3 py-2"
          >
            <option
              v-for="topic in store.allTopics"
              :key="topic"
              :value="topic"
            >
              {{ topic }}
            </option>
          </select>

          <button
            @click="isModalOpen = true"
            class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            <Plus class="w-4 h-4" /> Add Resource
          </button>
        </div>
      </div>

      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search resources..."
          class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="resource in filteredResources"
          :key="resource.id"
          class="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all flex gap-4"
          :class="{ 'opacity-60': resource.completed }"
        >
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="getTypeColor(resource.type)"
          >
            <component :is="getTypeIcon(resource.type)" class="w-6 h-6" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h4
                class="font-bold text-gray-900 dark:text-white truncate pr-2"
                :class="{ 'line-through text-gray-400': resource.completed }"
              >
                {{ resource.title }}
              </h4>
              <button
                @click="store.removeResource(resource.id)"
                class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <div class="flex flex-wrap gap-2 mt-2 mb-3">
              <span
                class="text-xs font-mono bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
              >
                {{ resource.topic }}
              </span>
              <span
                v-for="tag in resource.tags"
                :key="tag"
                class="text-xs text-gray-500 border border-gray-200 dark:border-slate-700 px-2 py-0.5 rounded"
              >
                #{{ tag }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <a
                :href="resource.url"
                target="_blank"
                class="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                Open Link <ExternalLink class="w-3 h-3" />
              </a>
              <button
                @click="store.toggleComplete(resource.id)"
                class="text-sm flex items-center gap-1 transition-colors"
                :class="
                  resource.completed
                    ? 'text-green-500 font-bold'
                    : 'text-gray-400 hover:text-gray-600'
                "
              >
                <component
                  :is="resource.completed ? CheckCircle : 'div'"
                  class="w-4 h-4 border rounded-full"
                  :class="{
                    'border-none': resource.completed,
                    'border-current w-3.5 h-3.5': !resource.completed,
                  }"
                />
                {{ resource.completed ? "Completed" : "Mark as Done" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="filteredResources.length === 0"
        class="text-center py-12 text-gray-500"
      >
        <div
          class="bg-gray-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <BookOpen class="w-8 h-8 text-gray-400" />
        </div>
        <p>No resources found for this filter.</p>
        <button
          @click="activeFilter = 'All'"
          class="text-primary hover:underline mt-2"
        >
          Clear filters
        </button>
      </div>
    </div>

    <BaseModal
      :is-open="isModalOpen"
      title="Add New Resource"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input
            v-model="newForm.title"
            class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            placeholder="e.g. Vue 3 Crash Course"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">URL</label>
          <input
            v-model="newForm.url"
            class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            placeholder="https://..."
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Topic</label>
            <select
              v-model="newForm.topic"
              class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            >
              <option>Frontend</option>
              <option>Backend</option>
              <option>DevOps</option>
              <option>CS Fundamentals</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Type</label>
            <select
              v-model="newForm.type"
              class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            >
              <option value="doc">Documentation</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="course">Course</option>
              <option value="tool">Tool</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1"
            >Tags (comma separated)</label
          >
          <input
            v-model="newForm.tags"
            class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            placeholder="vue, composition api, setup"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-blue-600"
        >
          Save Resource
        </button>
      </form>
    </BaseModal>
  </div>
</template>
