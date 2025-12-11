<script setup>
import { RouterView, RouterLink, useRoute } from "vue-router";
import { LayoutDashboard, CheckSquare, Map, Settings } from "lucide-vue-next";
import ThemeToggle from "@/components/ui/ThemeToggle.vue";

const route = useRoute();
const links = [
  { path: "/", name: "Dashboard", icon: LayoutDashboard },
  { path: "/checklist", name: "Skills", icon: CheckSquare },
  { path: "/roadmap", name: "Roadmap", icon: Map },
  { path: "/settings", name: "Settings", icon: Settings },
];
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row"
  >
    <nav
      class="md:w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex-shrink-0"
    >
      <div class="p-6 flex items-center justify-between md:block">
        <h1
          class="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
        >
          DevOpsTracker
        </h1>
        <div class="md:hidden"><ThemeToggle /></div>
      </div>

      <div
        class="flex md:flex-col overflow-x-auto md:overflow-visible px-4 md:px-6 gap-2 pb-4"
      >
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
      </div>

      <div class="hidden md:block absolute bottom-6 left-6">
        <ThemeToggle />
      </div>
    </nav>

    <main class="flex-1 p-4 md:p-8 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
