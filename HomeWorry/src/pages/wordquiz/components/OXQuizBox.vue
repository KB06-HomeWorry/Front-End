<template>
  <div class="quiz-card">
    <!-- 상단 헤더 (이미지+초급-문제1번) -->
    <QuizHeader :level="level" :number="number" />
    <!-- 질문 -->
    <div class="quiz-question">
      <span class="question-q bodyMedium16px">Q.</span>
      <span class="question-text bodyMedium16px">{{ question }}</span>
    </div>
    <!-- OX 버튼 -->
    <div class="quiz-ox-row">
      <OXBtn imgSrc="/src/assets/icons/quiz_correct.png" @click="() => emit('select', 'O')" />
      <OXBtn imgSrc="/src/assets/icons/quiz_wrong.png" @click="() => emit('select', 'X')" />
    </div>
  </div>
</template>

<script setup>
import QuizHeader from '@/pages/wordquiz/components/QuizHeader.vue'
import OXBtn from './OXBtn.vue'

const props = defineProps({
  question: { type: String, required: true },
  level: { type: String, required: true },
  number: { type: [String, Number], required: true }
})
const emit = defineEmits(['select'])
</script>

<style scoped>
.quiz-card {
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

.quiz-ox-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 0 0 0 0;
}
</style>
