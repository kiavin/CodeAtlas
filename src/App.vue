<script setup>
import { RouterView } from "vue-router";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppTopbar from "@/components/layout/AppTopbar.vue";
</script>

<template>
  <div
    class="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 overflow-hidden"
  >
    <AppSidebar />

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <AppTopbar />

      <main
        class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative"
      >
        <RouterView />
      </main>
    </div>
  </div>
</template>
