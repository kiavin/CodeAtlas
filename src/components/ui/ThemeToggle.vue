<script setup>
import { useDark, useToggle } from '@vueuse/core';
import { Sun, Moon } from 'lucide-vue-next';

const isDark = useDark({ selector: 'html', attribute: 'class', valueDark: 'dark', valueLight: 'light' });
const toggleDark = useToggle(isDark);
</script>

<template>
  <button @click="toggleDark()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
    <Sun v-if="isDark" class="w-5 h-5 text-yellow-400" />
    <Moon v-else class="w-5 h-5 text-gray-600" />
  </button>
</template>