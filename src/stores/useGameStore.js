import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useSkillsStore } from './useSkillsStore';
import { useRoadmapStore } from './useRoadmapStore';

export const useGameStore = defineStore('game', () => {
  const skillsStore = useSkillsStore();
  const roadmapStore = useRoadmapStore();

  // XP Constants
  const XP_PER_SKILL = 20;
  const XP_PER_TASK = 50;

  // Calculate Total XP dynamically
  const currentXP = computed(() => {
    const skillXP = skillsStore.totalMastered * XP_PER_SKILL;
    const taskXP = roadmapStore.totalCompleted * XP_PER_TASK;
    return skillXP + taskXP;
  });

  // Leveling System (Simple RPG logic: Level = sqrt(XP) * constant)
  // Example: 100 XP = Lvl 1, 400 XP = Lvl 2, 900 XP = Lvl 3
  const level = computed(() => Math.floor(Math.sqrt(currentXP.value) * 0.1) + 1);

  // Calculate progress to next level
  const nextLevelXP = computed(() => Math.pow((level.value + 1) / 0.1, 2));
  const currentLevelBaseXP = computed(() => Math.pow(level.value / 0.1, 2));
  
  const levelProgress = computed(() => {
    const totalNeeded = nextLevelXP.value - currentLevelBaseXP.value;
    const currentGained = currentXP.value - currentLevelBaseXP.value;
    return Math.min(100, Math.max(0, (currentGained / totalNeeded) * 100));
  });

  return { currentXP, level, levelProgress };
});