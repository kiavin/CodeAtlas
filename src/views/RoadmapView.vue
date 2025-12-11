<script setup>
import { ref, computed } from "vue";
import { useRoadmapStore } from "@/stores/useRoadmapStore";
import BaseCard from "@/components/ui/BaseCard.vue";
import {
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-vue-next";

const store = useRoadmapStore();
const newTask = ref("");

// Computed properties to filter tasks by status
const todoTasks = computed(() =>
  store.tasks.filter((t) => t.status === "todo")
);
const inProgressTasks = computed(() =>
  store.tasks.filter((t) => t.status === "in-progress")
);
const doneTasks = computed(() =>
  store.tasks.filter((t) => t.status === "done")
);

const addNewTask = () => {
  if (!newTask.value.trim()) return;
  store.addTask(newTask.value);
  newTask.value = "";
};

// Helper to define column styles
const columns = [
  {
    id: "todo",
    title: "To Do",
    icon: AlertCircle,
    color: "text-gray-500",
    bg: "bg-gray-100 dark:bg-slate-800",
    list: todoTasks,
  },
  {
    id: "in-progress",
    title: "In Progress",
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-slate-800/50",
    list: inProgressTasks,
  },
  {
    id: "done",
    title: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-slate-800/50",
    list: doneTasks,
  },
];

const getBorderColor = (status) => {
  if (status === "todo") return "border-l-gray-400";
  if (status === "in-progress") return "border-l-blue-500";
  if (status === "done") return "border-l-green-500";
  return "border-l-gray-200";
};
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-4">Roadmap Planner</h1>
      <div class="flex gap-2 max-w-2xl">
        <input
          v-model="newTask"
          @keyup.enter="addNewTask"
          type="text"
          placeholder="What do you want to learn next? (e.g., 'Master Docker Compose')"
          class="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
        />
        <button
          @click="addNewTask"
          class="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus class="w-5 h-5" /> Add
        </button>
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-full overflow-x-auto pb-4"
    >
      <div
        v-for="col in columns"
        :key="col.id"
        class="rounded-xl p-4 min-h-[500px]"
        :class="col.bg"
      >
        <div
          class="flex items-center justify-between mb-4 pb-2 border-b dark:border-slate-700"
        >
          <div class="flex items-center gap-2">
            <component :is="col.icon" :class="`w-5 h-5 ${col.color}`" />
            <h3 class="font-bold text-gray-700 dark:text-gray-200">
              {{ col.title }}
            </h3>
          </div>
          <span
            class="text-xs font-mono bg-white dark:bg-slate-700 px-2 py-1 rounded-full text-gray-500 dark:text-gray-300"
          >
            {{ col.list.value.length }}
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="task in col.list.value"
            :key="task.id"
            class="group bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-slate-600 border-l-4 transition-all"
            :class="getBorderColor(task.status)"
          >
            <div class="flex justify-between items-start mb-2">
              <span
                class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug"
              >
                {{ task.title }}
              </span>
              <button
                @click="store.removeTask(task.id)"
                class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <div class="flex items-center justify-between mt-3">
              <span
                class="text-[10px] uppercase tracking-wider font-bold text-gray-400"
              >
                {{ task.week }}
              </span>

              <div class="flex gap-1">
                <button
                  v-if="task.status !== 'todo'"
                  @click="
                    store.updateStatus(
                      task.id,
                      task.status === 'done' ? 'in-progress' : 'todo'
                    )
                  "
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500"
                  title="Move Back"
                >
                  <ArrowLeft class="w-4 h-4" />
                </button>

                <button
                  v-if="task.status !== 'done'"
                  @click="
                    store.updateStatus(
                      task.id,
                      task.status === 'todo' ? 'in-progress' : 'done'
                    )
                  "
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-primary"
                  title="Move Forward"
                >
                  <ArrowRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="col.list.value.length === 0"
            class="text-center py-8 opacity-50"
          >
            <p class="text-sm text-gray-500">No tasks</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
