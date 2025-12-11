<script setup>
defineProps({ percentage: Number, color: { type: String, default: 'bg-primary' } })
</script>

<template>
  <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
    <div 
      class="h-2.5 rounded-full transition-all duration-500" 
      :class="color" 
      :style="{ width: percentage + '%' }">
    </div>
  </div>
</template>