<script setup>
import { X } from "lucide-vue-next";
defineProps({
  isOpen: Boolean,
  title: String,
});
defineEmits(["close"]);
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div
      @click="$emit('close')"
      class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
    ></div>

    <div
      class="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <slot></slot>
    </div>
  </div>
</template>
