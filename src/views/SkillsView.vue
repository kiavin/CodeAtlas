<script setup>
import { ref, computed } from "vue";
import { useSkillsStore } from "@/stores/useSkillsStore";
import BaseCard from "@/components/ui/BaseCard.vue";
import { Plus, Search, Filter } from "lucide-vue-next";

const store = useSkillsStore();
const searchQuery = ref("");
const filterMode = ref("all"); // 'all', 'mastered', 'todo'
const newSkill = ref("");
const activeCat = ref(null);

// Advanced Filter Logic
const filteredCategories = computed(() => {
  // If no search and showing all, return original structure for performance
  if (!searchQuery.value && filterMode.value === "all") return store.categories;

  return store.categories
    .map((cat) => {
      // Filter skills inside the category
      const matchingSkills = cat.skills.filter((skill) => {
        const matchesText = skill.name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());
        const matchesMode =
          filterMode.value === "all"
            ? true
            : filterMode.value === "mastered"
            ? skill.mastered
            : !skill.mastered;

        return matchesText && matchesMode;
      });

      // Return category only if it has matching skills
      return { ...cat, skills: matchingSkills };
    })
    .filter((cat) => cat.skills.length > 0);
});

const handleAdd = (catId) => {
  if (newSkill.value.trim()) {
    store.addSkill(catId, newSkill.value);
    newSkill.value = "";
    activeCat.value = null;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div
      class="sticky top-0 z-10 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-4 border-b dark:border-slate-800 -mx-4 px-4 md:-mx-8 md:px-8"
    >
      <div class="max-w-4xl flex gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search skills (e.g. 'Docker', 'Vue')..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <select
          v-model="filterMode"
          class="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="all">All Skills</option>
          <option value="todo">To Learn</option>
          <option value="mastered">Mastered</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseCard
        v-for="cat in filteredCategories"
        :key="cat.id"
        class="relative"
      >
        <h3
          class="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-slate-700"
        >
          {{ cat.name }}
          <span class="text-xs text-gray-400 font-normal ml-2"
            >({{ cat.skills.length }})</span
          >
        </h3>

        <div class="space-y-3">
          <div
            v-for="skill in cat.skills"
            :key="skill.id"
            class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer group"
            @click="store.toggleSkill(cat.id, skill.id)"
          >
            <div
              class="w-5 h-5 rounded border flex items-center justify-center transition-all duration-300"
              :class="
                skill.mastered
                  ? 'bg-green-500 border-green-500 scale-110'
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-primary'
              "
            >
              <svg
                v-if="skill.mastered"
                class="w-3.5 h-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span
              :class="{
                'text-gray-400 line-through': skill.mastered,
                'text-gray-700 dark:text-gray-200': !skill.mastered,
              }"
            >
              {{ skill.name }}
            </span>
            <span
              v-if="skill.mastered"
              class="ml-auto text-xs font-bold text-yellow-500 animate-pulse"
              >+20 XP</span
            >
          </div>
        </div>

        <div class="mt-4 pt-2 border-t dark:border-slate-700">
          <div v-if="activeCat === cat.id" class="flex gap-2">
            <input
              v-model="newSkill"
              @keyup.enter="handleAdd(cat.id)"
              placeholder="Skill name..."
              class="flex-1 bg-gray-50 dark:bg-slate-900 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              autofocus
            />
            <button
              @click="handleAdd(cat.id)"
              class="text-xs bg-primary text-white px-3 rounded"
            >
              Add
            </button>
          </div>
          <button
            v-else
            @click="activeCat = cat.id"
            class="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mt-2"
          >
            <Plus class="w-4 h-4" /> Add Custom Skill
          </button>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
