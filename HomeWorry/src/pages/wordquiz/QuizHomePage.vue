<template>
  <div>
    <SimpleHeader title="부동산 지식 퀴즈"/>
  <div class="quiz-root">
    <LoadingAnimation v-if="isLoading" />
    <div v-else-if="loadError" class="quiz-error">{{ loadError }}</div>

    <!-- 전체 퀴즈 상태 -->
    <section class="quiz-summary" v-if="quizList.length">
      <div class="icon-container">
        <img :src="quiz" alt="퀴즈 아이콘" class="quiz-icon" />
      </div>
      <div class="summary-text">
        <div class="completed-steps bodyLight12px">
          현재 {{ completedSteps }}개 완료
        </div>
        <div class="remaining-puzzles bodyMedium18px">
          남은 퀴즈 {{ totalRemaining }}개
        </div>
        <div class="progress-bar">
          <div
            class="progress-bar-fill"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>

    <!-- 레벨별 퀴즈 -->
    <section class="quiz-levels" v-if="quizList.length">
      <div v-for="level in levels" :key="level.key" class="level-group">
        <div class="level-header">
          <div class="icon-wrapper">
            <img
              :src="levelIcons[level.key]"
              alt=""
              class="level-icon"
              draggable="false"
            />
          </div>
          <div class="level-texts">
            <div class="level-title bodyMedium16px">
              {{ level.name }} 퀴즈 맞히기
            </div>
            <div class="level-subtitle bodyLight12px">
              정답률 {{ getCorrectRate(level.key) }}% · 남은 퀴즈
              {{ getRemainingCount(level.key) }}개
            </div>
          </div>
        </div>
        <button class="btn-quiz bodyMedium16px" @click="goToLevel(level.key)">
          퀴즈 풀기
        </button>
      </div>
    </section>

    <!-- 완료한 퀴즈 -->
    <section v-if="completedSteps > 0" class="quiz-completed">
      <div class="completed-header">
        <div class="icon-wrapper completed-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#cbd5e1" />
            <path
              d="M6 12.75L10 16.75L18 8.75"
              stroke="#475569"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="completed-text bodyMedium14px">
          완료한 퀴즈 {{ completedSteps }}개
        </div>
        <button class="btn-completed" @click="goToRandomCompletedQuiz">
          &gt;
        </button>
      </div>
    </section>

    <CustomModal
      :modelValue="modalVisible"
      :message="modalMessage"
      confirmText="확인"
      @update:modelValue="modalVisible = $event"
      @confirm="modalVisible = false"
      @cancel="modalVisible = false"
    />
  </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import level1 from '@/assets/icons/level1.png';
import level2 from '@/assets/icons/level2.png';
import level3 from '@/assets/icons/level3.png';
import quiz from '@/assets/icons/quiz.png';

import CustomModal from '@/components/modal/CustomModal.vue';
import LoadingAnimation from '@/components/lottie/LoadingAnimation.vue';

const router = useRouter();
const authStore = useAuthStore();
const userId = computed(() => authStore.user?.userId || null);

const quizList = ref([]);
const userQuizStatus = ref([]);
const completedQuizzes = ref([]);
const modalVisible = ref(false);
const modalMessage = ref('');
const isLoading = ref(true);
const loadError = ref(null);

async function fetchData() {
  isLoading.value = true;
  try {
    const [quizRes, statusRes, completedRes] = await Promise.all([
      axios.get('http://localhost:8080/api/quiz/getQuiz'),
      axios.get(`http://localhost:8080/api/quiz/user/${userId.value}`),
      axios.get(`http://localhost:8080/api/quiz/user/${userId.value}/completed`)
    ]);
    quizList.value = quizRes.data;
    userQuizStatus.value = statusRes.data;
    completedQuizzes.value = completedRes.data;
  } catch (err) {
    console.error('데이터 불러오기 실패:', err);
    loadError.value = '데이터를 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
}

watch(
  userId,
  (val) => {
    if (val) fetchData();
  },
  { immediate: true }
);

const levels = [
  { key: '초급', name: '초급' },
  { key: '중급', name: '중급' },
  { key: '고급', name: '고급' }
];

const levelIcons = {
  초급: level1,
  중급: level2,
  고급: level3
};

const quizzesByLevel = computed(() => {
  const grouped = { 초급: [], 중급: [], 고급: [] };
  quizList.value.forEach((quiz) => {
    if (grouped[quiz.level]) grouped[quiz.level].push(quiz);
  });
  return grouped;
});

function getCorrectRate(level) {
  const quizzes = quizzesByLevel.value[level] || [];
  if (quizzes.length === 0) return 0;

  const solvedQuizzes = quizzes.filter((q) =>
    userQuizStatus.value.some(
      (s) => s.quizId === q.number && s.isCorrect === true
    )
  );

  return Math.round((solvedQuizzes.length / quizzes.length) * 100);
}

function getRemainingCount(level) {
  const quizzes = quizzesByLevel.value[level] || [];
  if (quizzes.length === 0) return 0;

  const solvedCount = quizzes.filter((q) =>
    userQuizStatus.value.some((s) => s.quizId === q.number)
  ).length;

  return quizzes.length - solvedCount;
}

const totalRemaining = computed(() => {
  return (
    quizList.value.length -
    userQuizStatus.value.filter((s) => s.isSolved).length
  );
});

const completedSteps = computed(() => completedQuizzes.value.length);

const progressPercent = computed(() => {
  if (quizList.value.length === 0) return 0;
  return Math.round((completedSteps.value / quizList.value.length) * 100);
});

function showModal(message) {
  modalMessage.value = message;
  modalVisible.value = true;
}

function goToLevel(level) {
  const quizzes = quizzesByLevel.value[level] || [];
  if (quizzes.length === 0) {
    showModal('해당 레벨에 퀴즈가 없습니다.');
    return;
  }

  const incompleteQuizzes = quizzes.filter(
    (quiz) =>
      !userQuizStatus.value.some(
        (status) => status.quizId === quiz.number && status.isSolved
      )
  );

  if (incompleteQuizzes.length === 0) {
    showModal('해당 레벨의 퀴즈를 모두 완료했습니다.');
    return;
  }

  const randomQuiz =
    incompleteQuizzes[Math.floor(Math.random() * incompleteQuizzes.length)];
  router.push(`/quiz/${randomQuiz.number}`);
}

function goToRandomCompletedQuiz() {
  if (completedQuizzes.value.length === 0) {
    showModal('완료한 퀴즈가 없습니다.');
    return;
  }
  const randomQuiz =
    completedQuizzes.value[
      Math.floor(Math.random() * completedQuizzes.value.length)
    ];
  router.push(`/quiz/${randomQuiz.quizId}`);
}
</script>

<style scoped>
.quiz-root {
  max-width: 393px;
  margin: 1.5rem 2rem;
  background: #fff;
  border-radius: 20px;
  color: var(--color-primary);
}

.quiz-summary {
  width: 393px;
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 32px;
  background-color: var(--color-primary-05);
  padding: 2rem;
  margin-left: -2rem;
}

.icon-container {
  width: 58px;
  height: 58px;
}

.summary-text {
  flex-grow: 1;
}

.completed-steps {
  color: var(--color-primary);
  margin-bottom: 4px;
}

.remaining-puzzles {
  margin-bottom: 8px;
  color: var(--color-primary);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-light);
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
  border-radius: 8px;
}

.quiz-levels {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.level-group {
  border-left: 3.5px solid var(--color-primary);
  padding: 4px 8px 4px 16px;
  border-radius: 2px;
}

.level-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 12px;
  margin-left: 6px;
}

.icon-wrapper {
  width: 45px;
  height: 45px;
  background: var(--color-primary-10);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.level-icon {
  width: 80%;
  height: 80%;
  object-fit: cover;
  user-select: none;
}

.btn-quiz {
  width: 100%;
  height: 30px;
  border-radius: 12px;
  background-color: var(--color-primary-05);
  color: var(--color-primary);
  border: 1.4px solid var(--color-primary);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.btn-quiz:hover {
  background-color: var(--color-primary);
  color: #fff;
}

.quiz-completed {
  margin-top: 30px;
}

.completed-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--color-primary);
}

.completed-icon {
  background: var(--color-primary-10);
  border-radius: 50%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-completed {
  background: none;
  border: none;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.3rem;
  color: var(--color-primary);
  user-select: none;
  transition: color 0.2s ease;
}

.quiz-error {
  text-align: center;
  margin-top: 5rem;
  color: var(--color-primary);
}
</style>
