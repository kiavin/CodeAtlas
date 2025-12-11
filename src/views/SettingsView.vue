<script setup>
import BaseCard from '@/components/ui/BaseCard.vue';
import { Download, Upload } from 'lucide-vue-next';

const exportData = () => {
  const data = {
    skills: localStorage.getItem('skills_data'),
    roadmap: localStorage.getItem('roadmap_data')
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `devops-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};

const importData = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    if(data.skills) localStorage.setItem('skills_data', data.skills);
    if(data.roadmap) localStorage.setItem('roadmap_data', data.roadmap);
    window.location.reload();
  };
  reader.readAsText(file);
};
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Settings</h1>
    <BaseCard>
      <h3 class="font-bold text-lg mb-4">Data Management</h3>
      <p class="text-sm text-gray-500 mb-6">
        Your data is stored locally in your browser. Export it to back it up or move it to another device.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <button 
          @click="exportData"
          class="flex items-center justify-center gap-2 bg-gray-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Download class="w-4 h-4" /> Export JSON
        </button>
        
        <label class="flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
          <Upload class="w-4 h-4" /> Import JSON
          <input type="file" class="hidden" accept=".json" @change="importData" />
        </label>
      </div>
    </BaseCard>
  </div>
</template>