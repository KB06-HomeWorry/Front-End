<template>
  <div class="quiz-info-bar">
    <img class="quiz-info-img" :src="homeQuizIcon" alt="퀴즈 아이콘" />
    <span class="quiz-info-level titleBold14px">{{ level }}</span>
    <span class="quiz-info-divider bodyMedium14px">-</span>
    <span class="quiz-info-number bodyMedium14px">문제 {{ number }}번</span>
  </div>
</template>

<script setup>
import homeQuizIcon from "@/assets/icons/home_quiz.png";
const props = defineProps({
  // imgSrc: { type: String, required: true },
  level: { type: String, required: true }, // "초급" | "중급" | "고급"
  number: { type: [String, Number], required: true },
});
</script>

<style scoped>
.quiz-info-bar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px; /* 이미지와 텍스트 사이 여백 */
  background: var(--color-white);
  padding: 0 20px;
}

.quiz-info-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  margin-right: 4px;
}

.quiz-info-level {
  color: var(--color-primary);
}

.quiz-info-divider {
  color: var(--color-primary);
  margin: 0 3px;
}

.quiz-info-number {
  color: var(--color-primary);
}
</style>
