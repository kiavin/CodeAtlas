<script setup>
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
import { User, Bell, Menu } from 'lucide-vue-next';
</script>

<template>
  <header class="bg-white dark:bg-slate-800 border-b dark:border-slate-700 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
    <div class="flex items-center gap-4">
      <button class="md:hidden p-2 text-gray-600 dark:text-gray-300">
        <Menu class="w-6 h-6" />
      </button>
      <h2 class="md:hidden font-bold text-lg text-gray-800 dark:text-white">DevOpsTracker</h2>
    </div>

    <div class="flex items-center gap-3 ml-auto">
      <ThemeToggle />

      <div class="h-6 w-px bg-gray-200 dark:bg-slate-600 mx-1"></div>

      <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 relative">
        <Bell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
      </button>

      <button class="flex items-center gap-2 pl-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
        <div class="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
          ME
        </div>
      </button>
    </div>
  </header>
</template>