<script setup>
import { ref, computed, nextTick } from "vue";
import draggable from "vuedraggable";
import { useRoadmapStore } from "@/stores/useRoadmapStore";
import { Plus, Trash2, GripVertical, Pencil, X, Check } from "lucide-vue-next";

const store = useRoadmapStore();
const newTask = ref("");

// Editing State
const editingId = ref(null);
const editTitle = ref("");
const editInputRef = ref(null); // Reference to focus input automatically

// Helper to create writable computed properties for vuedraggable
const createDraggableList = (status) => {
  return computed({
    get: () => store.tasks.filter((t) => t.status === status),
    set: (items) => {
      items.forEach((item) => {
        if (item.status !== status) {
          store.updateStatus(item.id, status);
        }
      });
    },
  });
};

const todoList = createDraggableList("todo");
const progressList = createDraggableList("in-progress");
const doneList = createDraggableList("done");

const columns = [
  {
    id: "todo",
    title: "To Do",
    list: todoList,
    bg: "bg-gray-100 dark:bg-slate-800/50",
    border: "border-t-4 border-gray-400",
  },
  {
    id: "in-progress",
    title: "In Progress",
    list: progressList,
    bg: "bg-blue-50 dark:bg-slate-800/50",
    border: "border-t-4 border-blue-500",
  },
  {
    id: "done",
    title: "Completed",
    list: doneList,
    bg: "bg-green-50 dark:bg-slate-800/50",
    border: "border-t-4 border-green-500",
  },
];

const addNewTask = () => {
  if (!newTask.value.trim()) return;
  store.addTask(newTask.value);
  newTask.value = "";
};

// --- Edit Logic ---
const startEdit = (task) => {
  editingId.value = task.id;
  editTitle.value = task.title;
  // Wait for DOM to update so input exists, then focus it
  nextTick(() => {
    if (editInputRef.value) editInputRef.value.focus();
  });
};

const saveEdit = () => {
  if (editingId.value !== null) {
    store.updateTaskTitle(editingId.value, editTitle.value);
    editingId.value = null;
    editTitle.value = "";
  }
};

const cancelEdit = () => {
  editingId.value = null;
  editTitle.value = "";
};
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="mb-6 flex gap-4">
      <input
        v-model="newTask"
        @keyup.enter="addNewTask"
        type="text"
        placeholder="Add a new task..."
        class="flex-1 max-w-lg px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        @click="addNewTask"
        class="bg-primary text-white px-6 rounded-lg font-medium hover:opacity-90"
      >
        Add
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
      <div
        v-for="col in columns"
        :key="col.id"
        class="rounded-xl p-4 min-h-[500px] flex flex-col"
        :class="col.bg"
      >
        <div
          class="flex justify-between items-center mb-4 font-bold text-gray-700 dark:text-gray-200"
          :class="col.border"
        >
          <h3 class="mt-2">{{ col.title }}</h3>
          <span
            class="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded-full"
            >{{ col.list.value.length }}</span
          >
        </div>

        <draggable
          v-model="col.list.value"
          group="tasks"
          item-key="id"
          class="flex-1 space-y-3 min-h-[100px]"
          ghost-class="opacity-50"
        >
          <template #item="{ element }">
            <div
              class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 cursor-move hover:shadow-md transition-shadow group relative"
            >
              <div class="flex items-start gap-3">
                <GripVertical
                  class="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0"
                />

                <p
                  v-if="editingId !== element.id"
                  class="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1 break-words"
                >
                  {{ element.title }}
                </p>

                <div v-else class="flex-1 flex gap-2">
                  <input
                    ref="editInputRef"
                    v-model="editTitle"
                    @keyup.enter="saveEdit"
                    @keyup.esc="cancelEdit"
                    @blur="saveEdit"
                    class="w-full text-sm p-1 border rounded bg-gray-50 dark:bg-slate-900 dark:border-slate-600 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div
                class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 pl-2"
              >
                <template v-if="editingId !== element.id">
                  <button
                    @click="startEdit(element)"
                    class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit Task"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="store.removeTask(element.id)"
                    class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </template>

                <template v-else>
                  <button
                    @mousedown.prevent="saveEdit"
                    class="text-green-500 p-1"
                  >
                    <Check class="w-4 h-4" />
                  </button>
                  <button
                    @mousedown.prevent="cancelEdit"
                    class="text-red-500 p-1"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </template>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>
