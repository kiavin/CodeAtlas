import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useSnippetsStore = defineStore("snippets", () => {
  const defaultSnippets = [
    {
      id: 1,
      title: "Nginx Reverse Proxy",
      language: "nginx",
      code: `server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}`,
      tags: ["devops", "server"],
    },
    {
      id: 2,
      title: "Docker Compose - Vue + API",
      language: "yaml",
      code: `version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root`,
      tags: ["docker", "setup"],
    },
    {
      id: 3,
      title: "Vue 3 Composition API Setup",
      language: "javascript",
      code: `<script setup>
import { ref, onMounted } from 'vue';

const data = ref(null);

onMounted(async () => {
  const res = await fetch('/api/data');
  data.value = await res.json();
});
</script>`,
      tags: ["vue", "frontend"],
    },
  ];

  const stored = localStorage.getItem("snippets_data");
  const snippets = ref(stored ? JSON.parse(stored) : defaultSnippets);

  watch(
    snippets,
    (newVal) => localStorage.setItem("snippets_data", JSON.stringify(newVal)),
    { deep: true }
  );

  const addSnippet = (snippet) => {
    snippets.value.push({ id: Date.now(), ...snippet });
  };

  const deleteSnippet = (id) => {
    snippets.value = snippets.value.filter((s) => s.id !== id);
  };

  const updateSnippet = (id, updatedFields) => {
    const index = snippets.value.findIndex(s => s.id === id);
    if (index !== -1) {
      snippets.value[index] = { 
        ...snippets.value[index], 
        ...updatedFields 
      };
    }
  };

  return { snippets, addSnippet, deleteSnippet, updateSnippet };
});
