import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import SkillsView from "../views/SkillsView.vue";
import RoadmapView from "../views/RoadmapView.vue"; // (Assume created similar to others)
import SettingsView from "../views/SettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: DashboardView },
    { path: "/checklist", component: SkillsView },
    { path: "/roadmap", component: RoadmapView }, // You'd create this file
    { path: "/settings", component: SettingsView },
  ],
});

export default router;
