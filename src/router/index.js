import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import SkillsView from "../views/SkillsView.vue";
import RoadmapView from "../views/RoadmapView.vue"; // (Assume created similar to others)
import SettingsView from "../views/SettingsView.vue";
import CurriculumView from "../views/CurriculumView.vue";
import InterviewView from "../views/InterviewView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import SnippetsView from '../views/SnippetsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: DashboardView },
    { path: "/checklist", component: SkillsView },
    { path: "/roadmap", component: RoadmapView }, // You'd create this file
    { path: "/settings", component: SettingsView },
    { path: "/curriculum", component: CurriculumView },
    { path: "/interview", component: InterviewView },
    { path: "/projects", component: ProjectsView },
    {path: '/snippets', component: SnippetsView},
  ],
});

export default router;
