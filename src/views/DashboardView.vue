<script setup>
import { useSkillsStore } from "@/stores/useSkillsStore";
import { useRoadmapStore } from "@/stores/useRoadmapStore";
import BaseCard from "@/components/ui/BaseCard.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import { CheckCircle, AlertCircle, BookOpen } from "lucide-vue-next";

const skillsStore = useSkillsStore();
const roadmapStore = useRoadmapStore();

const pendingTasks = roadmapStore.tasks.filter(
  (t) => t.status === "in-progress"
).length;
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, Engineer! 🚀
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          "Consistency is what transforms average into excellence."
        </p>
      </div>
      <div
        class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 font-medium"
      >
        <CheckCircle class="w-5 h-5" />
        <span>{{ skillsStore.totalProgress }}% Mastered</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard class="border-l-4 border-l-blue-500">
        <h3 class="font-semibold text-lg mb-2">Current Focus</h3>
        <p class="text-3xl font-bold">{{ pendingTasks }}</p>
        <p class="text-sm text-gray-500">Tasks in progress this week</p>
      </BaseCard>

      <BaseCard class="border-l-4 border-l-green-500">
        <h3 class="font-semibold text-lg mb-2">Total Skills</h3>
        <p class="text-3xl font-bold">
          {{
            skillsStore.categories.reduce((acc, c) => acc + c.skills.length, 0)
          }}
        </p>
        <p class="text-sm text-gray-500">Skills tracked across stack</p>
      </BaseCard>

      <BaseCard class="border-l-4 border-l-purple-500">
        <h3 class="font-semibold text-lg mb-2">Quick Action</h3>
        <router-link
          to="/roadmap"
          class="text-primary hover:underline flex items-center gap-1"
        >
          Update Roadmap <BookOpen class="w-4 h-4" />
        </router-link>
      </BaseCard>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Overall Progress</h2>
      <BaseCard>
        <div
          v-for="cat in skillsStore.categories"
          :key="cat.id"
          class="mb-4 last:mb-0"
        >
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium">{{ cat.name }}</span>
            <span class="text-sm text-gray-500">
              {{ cat.skills.filter((s) => s.mastered).length }}/{{
                cat.skills.length
              }}
            </span>
          </div>
          <ProgressBar
            :percentage="
              (cat.skills.filter((s) => s.mastered).length /
                cat.skills.length) *
              100
            "
            color="bg-indigo-500"
          />
        </div>
      </BaseCard>
    </div>
  </div>
</template>
