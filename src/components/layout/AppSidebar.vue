<script setup>
import { RouterLink, useRoute } from "vue-router";
import {
  LayoutDashboard,
  CheckSquare,
  Map,
  Settings,
  GraduationCap,
  Archive,
  BrainCircuit,
  Rocket,
  Code,
} from "lucide-vue-next";
import { useGameStore } from "@/stores/useGameStore";
import ProgressBar from "@/components/ui/ProgressBar.vue";

const route = useRoute();
const gameStore = useGameStore();

const links = [
  { path: "/", name: "Dashboard", icon: LayoutDashboard },
  { path: "/checklist", name: "Skills", icon: CheckSquare },
  { path: "/roadmap", name: "Roadmap", icon: Map },
  { path: "/curriculum", name: "Curriculum", icon: GraduationCap }, // Added placeholder
  { path: "/resources", name: "Resources", icon: Archive }, // Added placeholder
  { path: "/snippets", name: "Snippets", icon: Code },
  { path: "/interview", name: "Interview Prep", icon: BrainCircuit },
  { path: "/projects", name: "Projects", icon: Rocket },
  { path: "/settings", name: "Settings", icon: Settings },
];
</script>

<template>
  <aside
    class="w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex-shrink-0 flex flex-col h-screen sticky top-0 hidden md:flex"
  >
    <div class="p-6">
      <h1
        class="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
      >
        DevOpsTracker
      </h1>
    </div>

    <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
      <RouterLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
        :class="
          route.path === link.path
            ? 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400'
            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-700/50'
        "
      >
        <component :is="link.icon" class="w-5 h-5" />
        {{ link.name }}
      </RouterLink>
    </nav>

    <div class="p-4 mt-auto border-t dark:border-slate-700">
      <div
        class="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700"
      >
        <div class="flex justify-between items-end mb-2">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider"
            >Level {{ gameStore.level }}</span
          >
          <span class="text-xs font-mono text-primary"
            >{{ Math.floor(gameStore.currentXP) }} XP</span
          >
        </div>
        <ProgressBar
          :percentage="gameStore.levelProgress"
          color="bg-yellow-500"
        />
      </div>
    </div>
  </aside>
</template>
