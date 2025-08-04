<template>
  <div class="quiz-card">
    <QuizHeader :level="level" :number="number" />

    <div class="quiz-question">
      <span class="question-q bodyMedium16px">Q.</span>
      <span class="question-text bodyMedium16px">{{ question }}</span>
    </div>

    <div class="select-btn-list">
      <SelectBtn
        v-for="(choice, idx) in choices"
        :key="idx"
        :text="choice.trim()"
        @click="() => emit('submit', String(idx + 1))"
      />
    </div>
  </div>
</template>

<script setup>
import QuizHeader from '@/pages/wordquiz/components/QuizHeader.vue'
import SelectBtn from '@/pages/wordquiz/components/SelectBtn.vue'

const props = defineProps({
  question: { type: String, required: true },
  level: { type: String, required: true },
  number: { type: [String, Number], required: true },
  choices: { type: Array, required: true }
})
const emit = defineEmits(['submit']) 
</script>

<style scoped>
.quiz-card {
  width: 393px;
  background: rgba(17, 31, 92, 0.10);
  padding: 0 0 56px 0;
  margin-left: -2rem;
  margin-right: -2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.quiz-question {
  display: flex;
  align-items: flex-start;
  margin: 32px 0 20px 0;  
  padding: 0 32px;
}

.question-q {
  color: var(--color-primary);
  margin-right: 2px;
}

.question-text {
  color: var(--color-primary);
  line-height: 1;
  text-align: left;
  word-break: keep-all;
}

.select-btn-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 0 24px;
}
</style>
