<script setup>
import { ref, computed } from "vue";
import { useSnippetsStore } from "@/stores/useSnippetsStore";
import { useClipboard } from "@vueuse/core";
import BaseModal from "@/components/ui/BaseModal.vue";
import {
  Code,
  Copy,
  Check,
  Plus,
  Trash2,
  Search,
  Pencil,
} from "lucide-vue-next";

// Syntax Highlighting
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import nginx from "highlight.js/lib/languages/nginx";
import yaml from "highlight.js/lib/languages/yaml";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/atom-one-dark.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("nginx", nginx);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);

const store = useSnippetsStore();
const { copy, copied } = useClipboard();
const searchQuery = ref("");
const isModalOpen = ref(false);

// Edit State
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({ title: "", language: "javascript", code: "", tags: "" });

// Filter Logic
const filteredSnippets = computed(() => {
  return store.snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
  );
});

// Custom Directive for highlighting
const vHighlight = {
  mounted(el) {
    hljs.highlightElement(el);
  },
  updated(el) {
    hljs.highlightElement(el);
  },
};

// --- Actions ---

const openNewModal = () => {
  form.value = { title: "", language: "javascript", code: "", tags: "" };
  isEditing.value = false;
  editingId.value = null;
  isModalOpen.value = true;
};

const openEditModal = (snippet) => {
  form.value = {
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
    tags: snippet.tags.join(", "), // Convert Array -> String for input
  };
  isEditing.value = true;
  editingId.value = snippet.id;
  isModalOpen.value = true;
};

const handleSubmit = () => {
  const payload = {
    title: form.value.title,
    language: form.value.language,
    code: form.value.code,
    tags: form.value.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t),
  };

  if (isEditing.value && editingId.value) {
    store.updateSnippet(editingId.value, payload);
  } else {
    store.addSnippet(payload);
  }

  isModalOpen.value = false;
};

const copyCode = (code) => {
  copy(code);
};
</script>

<template>
  <div class="h-full flex flex-col">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
    >
      <div>
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <Code class="w-8 h-8 text-primary" /> Snippet Vault
        </h1>
        <p class="text-gray-500 mt-1">
          Your personal library of reusable code blocks.
        </p>
      </div>
      <button
        @click="openNewModal"
        class="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
      >
        <Plus class="w-5 h-5" /> New Snippet
      </button>
    </div>

    <div class="relative max-w-xl mb-8">
      <Search class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by title or tag (e.g. 'docker', 'regex')..."
        class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <div class="columns-1 md:columns-2 gap-6 space-y-6">
      <div
        v-for="snippet in filteredSnippets"
        :key="snippet.id"
        class="break-inside-avoid bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
      >
        <div
          class="px-4 py-3 border-b dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50"
        >
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold uppercase text-gray-500 bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded"
            >
              {{ snippet.language }}
            </span>
            <h3
              class="font-bold text-gray-800 dark:text-gray-200 truncate max-w-[150px] sm:max-w-[200px]"
            >
              {{ snippet.title }}
            </h3>
          </div>

          <div
            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              @click="openEditModal(snippet)"
              class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              title="Edit Snippet"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="store.deleteSnippet(snippet.id)"
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete Snippet"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="relative group/code">
          <pre><code v-highlight :class="`language-${snippet.language}`" class="text-sm p-4 overflow-x-auto min-h-[100px]">{{ snippet.code }}</code></pre>

          <button
            @click="copyCode(snippet.code)"
            class="absolute top-2 right-2 p-2 rounded bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 opacity-0 group-hover/code:opacity-100 transition-all border border-white/10"
          >
            <Check v-if="copied" class="w-4 h-4 text-green-400" />
            <Copy v-else class="w-4 h-4" />
          </button>
        </div>

        <div class="px-4 py-2 flex flex-wrap gap-2 bg-white dark:bg-slate-800">
          <span
            v-for="tag in snippet.tags"
            :key="tag"
            class="text-xs text-gray-500"
            >#{{ tag }}</span
          >
        </div>
      </div>
    </div>

    <BaseModal
      :is-open="isModalOpen"
      :title="isEditing ? 'Edit Snippet' : 'Save Snippet'"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input
            v-model="form.title"
            class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            placeholder="e.g. Axios Interceptor"
            required
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Language</label>
            <select
              v-model="form.language"
              class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            >
              <option value="javascript">JavaScript</option>
              <option value="nginx">Nginx</option>
              <option value="yaml">YAML</option>
              <option value="bash">Bash</option>
              <option value="css">CSS</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tags</label>
            <input
              v-model="form.tags"
              class="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
              placeholder="api, config"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Code</label>
          <textarea
            v-model="form.code"
            class="w-full h-48 font-mono text-sm border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
            placeholder="Paste code here..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-lg font-bold"
        >
          {{ isEditing ? "Save Changes" : "Save to Vault" }}
        </button>
      </form>
    </BaseModal>
  </div>
</template>
