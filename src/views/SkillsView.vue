<script setup>
import { ref } from 'vue';
import { useSkillsStore } from '@/stores/useSkillsStore';
import BaseCard from '@/components/ui/BaseCard.vue';
import { Plus, Trash2 } from 'lucide-vue-next';

const store = useSkillsStore();
const newSkill = ref('');
const activeCat = ref(null);

const handleAdd = (catId) => {
  if (newSkill.value.trim()) {
    store.addSkill(catId, newSkill.value);
    newSkill.value = '';
    activeCat.value = null;
  }
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <BaseCard v-for="cat in store.categories" :key="cat.id" class="relative">
      <h3 class="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-slate-700">
        {{ cat.name }}
      </h3>
      
      <div class="space-y-3">
        <div 
          v-for="skill in cat.skills" 
          :key="skill.id" 
          class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
          @click="store.toggleSkill(cat.id, skill.id)"
        >
          <div 
            class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
            :class="skill.mastered ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'"
          >
            <svg v-if="skill.mastered" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span :class="{ 'text-gray-400 line-through': skill.mastered }">{{ skill.name }}</span>
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
          <button @click="handleAdd(cat.id)" class="text-xs bg-primary text-white px-3 rounded">Add</button>
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
</template>