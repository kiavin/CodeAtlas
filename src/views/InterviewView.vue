<script setup>
import { ref, computed } from "vue";
import { useInterviewStore } from "@/stores/useInterviewStore";
import BaseCard from "@/components/ui/BaseCard.vue";
import { RefreshCw, Check, BrainCircuit } from "lucide-vue-next";

const store = useInterviewStore();
const isFlipped = ref(false);
const currentIndex = ref(0);

// Get the stack of cards currently due for review
const sessionCards = computed(() => store.dueCards);
const currentCard = computed(() => sessionCards.value[currentIndex.value]);

// Logic
const flipCard = () => {
  isFlipped.value = !isFlipped.value;
};

const submitResult = (difficulty) => {
  if (!currentCard.value) return;

  store.handleResult(currentCard.value.id, difficulty);

  // Move to next card
  isFlipped.value = false;
  // If we just finished the last card, the array will shrink reactively,
  // so we actually keep index 0 unless the list is empty.
  if (currentIndex.value >= sessionCards.value.length) {
    currentIndex.value = 0;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold flex items-center justify-center gap-2">
        <BrainCircuit class="w-8 h-8 text-primary" /> Interview Prep
      </h1>
      <p class="text-gray-500 mt-2">
        {{ sessionCards.length }} cards due for review today.
      </p>
    </div>

    <div
      v-if="currentCard"
      class="flex-1 flex flex-col items-center justify-center"
    >
      <div
        class="group w-full max-w-lg h-80 perspective-1000 cursor-pointer"
        @click="flipCard"
      >
        <div
          class="relative w-full h-full duration-500 preserve-3d transition-transform"
          :class="{ 'rotate-y-180': isFlipped }"
        >
          <div class="absolute w-full h-full backface-hidden">
            <BaseCard
              class="h-full flex flex-col items-center justify-center text-center p-8 border-b-4 border-b-blue-500 hover:shadow-lg"
            >
              <span
                class="text-xs uppercase font-bold text-gray-400 mb-4 tracking-widest"
              >
                {{ currentCard.topic }} Question
              </span>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                {{ currentCard.question }}
              </h3>
              <p class="text-sm text-gray-400 mt-8 animate-bounce">
                Click to reveal answer
              </p>
            </BaseCard>
          </div>

          <div class="absolute w-full h-full backface-hidden rotate-y-180">
            <BaseCard
              class="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900 text-white border-b-4 border-b-green-500"
            >
              <span
                class="text-xs uppercase font-bold text-gray-400 mb-4 tracking-widest"
              >
                Answer
              </span>
              <p class="text-lg leading-relaxed">
                {{ currentCard.answer }}
              </p>
            </BaseCard>
          </div>
        </div>
      </div>

      <div
        class="flex gap-4 mt-8 transition-opacity duration-300"
        :class="isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      >
        <button
          @click.stop="submitResult('hard')"
          class="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-6 py-3 rounded-lg font-bold hover:bg-red-200"
        >
          Hard (12h)
        </button>
        <button
          @click.stop="submitResult('medium')"
          class="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 px-6 py-3 rounded-lg font-bold hover:bg-yellow-200"
        >
          Medium (2d)
        </button>
        <button
          @click.stop="submitResult('easy')"
          class="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-6 py-3 rounded-lg font-bold hover:bg-green-200"
        >
          Easy (5d)
        </button>
      </div>
    </div>

    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center text-center"
    >
      <div
        class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600"
      >
        <Check class="w-10 h-10" />
      </div>
      <h2 class="text-2xl font-bold mb-2">All Caught Up!</h2>
      <p class="text-gray-500 max-w-md">
        You've reviewed all your pending cards. Good job! Active recall is the
        fastest way to learn.
      </p>
      <button
        @click="store.resetProgress"
        class="mt-8 text-primary hover:underline flex items-center gap-2"
      >
        <RefreshCw class="w-4 h-4" /> Review All Anyway
      </button>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.backface-hidden {
  backface-visibility: hidden;
}
</style>
