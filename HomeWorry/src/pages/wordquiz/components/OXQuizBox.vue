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
      <OXBtn :imgSrc="quizRightIcon" @click="() => emit('submit', 'o')" />
      <OXBtn :imgSrc="quizWrongIcon" @click="() => emit('submit', 'x')" />
    </div>
  </div>
</template>

<script setup>
import QuizHeader from '@/pages/wordquiz/components/QuizHeader.vue';
import OXBtn from '@/pages/wordquiz/components/OXBtn.vue';
import quizRightIcon from '@/assets/icons/quiz_correct.png';
import quizWrongIcon from '@/assets/icons/quiz_wrong.png';

const props = defineProps({
  question: { type: String, required: true },
  level: { type: String, required: true },
  number: { type: [String, Number], required: true },
});
const emit = defineEmits(['select']);

function onOXSelect(userAnswer) {
  // 여기서 정답 체크, 모달 show 등 진행!
  answerResult.value =
    userAnswer === currentQuiz.value.correctAnswer ? 'correct' : 'wrong';
  showModal.value = true;
}
</script>

<style scoped>
.quiz-card {
  width: 393px;
  background: var(--color-primary-10);
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
