import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useSkillsStore = defineStore('skills', () => {
  // Seed Data based on your profile + Recommended Missing Skills
  const defaultCategories = [
    {
      id: 'frontend',
      name: 'Frontend Development',
      skills: [
        { id: 1, name: 'HTML5', mastered: true },
        { id: 2, name: 'CSS3', mastered: true },
        { id: 3, name: 'JavaScript (ES6+)', mastered: true },
        { id: 4, name: 'Vue 3 (Composition API)', mastered: true },
        { id: 5, name: 'TailwindCSS', mastered: true },
        { id: 6, name: 'Bootstrap', mastered: true },
        { id: 7, name: 'TypeScript', mastered: false }, // Recommended
        { id: 8, name: 'Vite/Webpack', mastered: false }, // Recommended
      ]
    },
    {
      id: 'backend',
      name: 'Backend Development',
      skills: [
        { id: 9, name: 'PHP', mastered: true },
        { id: 10, name: 'Yii2 Framework', mastered: true },
        { id: 11, name: 'SQL (Basic)', mastered: true },
        { id: 12, name: 'Node.js', mastered: false }, // Recommended
        { id: 13, name: 'Redis / Caching', mastered: false }, // Recommended
        { id: 14, name: 'API Design (REST/GraphQL)', mastered: false }, // Recommended
      ]
    },
    {
      id: 'devops',
      name: 'DevOps & Infrastructure',
      skills: [
        { id: 15, name: 'Git', mastered: true },
        { id: 16, name: 'Linux Command Line', mastered: true },
        { id: 17, name: 'Docker', mastered: true },
        { id: 18, name: 'Jenkins', mastered: true },
        { id: 19, name: 'Nginx', mastered: true },
        { id: 20, name: 'Virtual Machines (VMs)', mastered: true },
        { id: 21, name: 'Kubernetes', mastered: false }, // Recommended
        { id: 22, name: 'AWS/Azure/GCP', mastered: false }, // Recommended
        { id: 23, name: 'Terraform (IaC)', mastered: false }, // Recommended
      ]
    },
    {
      id: 'tools',
      name: 'Tools & Testing',
      skills: [
        { id: 24, name: 'Postman/Thunderclient', mastered: true },
        { id: 25, name: 'Unit Testing (Vitest/PHPUnit)', mastered: false }, // Recommended
      ]
    }
  ];

  // Load from LocalStorage or use default
  const stored = localStorage.getItem('skills_data');
  const categories = ref(stored ? JSON.parse(stored) : defaultCategories);

  // Persistence Watcher
  watch(categories, (newVal) => {
    localStorage.setItem('skills_data', JSON.stringify(newVal));
  }, { deep: true });

  // Actions
  const toggleSkill = (catId, skillId) => {
    const cat = categories.value.find(c => c.id === catId);
    const skill = cat.skills.find(s => s.id === skillId);
    if (skill) skill.mastered = !skill.mastered;
  };

  const addSkill = (catId, skillName) => {
    const cat = categories.value.find(c => c.id === catId);
    if (cat) {
      cat.skills.push({
        id: Date.now(),
        name: skillName,
        mastered: false
      });
    }
  };

  // Getters
  const totalProgress = computed(() => {
    let total = 0;
    let mastered = 0;
    categories.value.forEach(cat => {
      total += cat.skills.length;
      mastered += cat.skills.filter(s => s.mastered).length;
    });
    return total === 0 ? 0 : Math.round((mastered / total) * 100);
  });

  return { categories, toggleSkill, addSkill, totalProgress };
});