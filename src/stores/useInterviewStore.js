import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useInterviewStore = defineStore("interview", () => {
  // Seed Data: 20+ Real Interview Questions
  const defaultQuestions = [
    // Vue.js
    {
      id: 1,
      question: "What is the difference between Ref and Reactive in Vue 3?",
      answer:
        "Ref is for primitives (strings, numbers) and objects. Reactive is only for objects. Ref requires .value access.",
      topic: "Vue",
      nextReview: Date.now(),
    },
    {
      id: 2,
      question: "Explain the Vue Lifecycle Hooks.",
      answer:
        "onMounted, onUpdated, onUnmounted. They allow code execution at specific stages of component existence.",
      topic: "Vue",
      nextReview: Date.now(),
    },
    {
      id: 3,
      question: "What is Prop Drilling and how do you solve it?",
      answer:
        "Passing data through many layers of components. Solved using Provide/Inject or State Management (Pinia).",
      topic: "Vue",
      nextReview: Date.now(),
    },

    // DevOps
    {
      id: 4,
      question: "Docker vs Virtual Machines: Key difference?",
      answer:
        "VMs visualize hardware (heavy OS overhead). Docker virtualizes the OS (lightweight, shares kernel).",
      topic: "DevOps",
      nextReview: Date.now(),
    },
    {
      id: 5,
      question: "What is a Multi-Stage Build in Docker?",
      answer:
        "Using multiple FROM instructions in one Dockerfile to keep the final image small (e.g., build in one stage, copy binary to alpine).",
      topic: "DevOps",
      nextReview: Date.now(),
    },
    {
      id: 6,
      question: "Explain CI vs CD.",
      answer:
        "CI (Integration) is merging code frequently with auto-tests. CD (Delivery/Deployment) is auto-releasing that code to production.",
      topic: "DevOps",
      nextReview: Date.now(),
    },

    // PHP / Backend
    {
      id: 7,
      question: "What is Dependency Injection?",
      answer:
        "Passing dependencies (objects) into a class constructor rather than creating them inside. Makes code testable.",
      topic: "Backend",
      nextReview: Date.now(),
    },
    {
      id: 8,
      question: "Explain the N+1 problem in SQL/ORMs.",
      answer:
        "Executing 1 query to fetch parent records and then N queries for each child record. Solved by Eager Loading (JOINs).",
      topic: "Backend",
      nextReview: Date.now(),
    },

    // Linux
    {
      id: 9,
      question: 'What does "chmod 755" do?',
      answer: "Owner: Read/Write/Exec. Group/Others: Read/Exec only.",
      topic: "Linux",
      nextReview: Date.now(),
    },
  ];

  const stored = localStorage.getItem("interview_data");
  const cards = ref(stored ? JSON.parse(stored) : defaultQuestions);

  watch(
    cards,
    (newVal) => localStorage.setItem("interview_data", JSON.stringify(newVal)),
    { deep: true }
  );

  // --- Actions ---

  const handleResult = (id, difficulty) => {
    // Spaced Repetition Logic
    const card = cards.value.find((c) => c.id === id);
    if (!card) return;

    const oneDay = 24 * 60 * 60 * 1000;
    let delay = 0;

    if (difficulty === "hard") delay = oneDay * 0.5; // Review in 12 hours
    if (difficulty === "medium") delay = oneDay * 2; // Review in 2 days
    if (difficulty === "easy") delay = oneDay * 5; // Review in 5 days

    card.nextReview = Date.now() + delay;
  };

  const resetProgress = () => {
    cards.value.forEach((c) => (c.nextReview = Date.now()));
  };

  // --- Getters ---

  const dueCards = computed(() => {
    return cards.value.filter((c) => c.nextReview <= Date.now());
  });

  return { cards, dueCards, handleResult, resetProgress };
});
