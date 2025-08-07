<template>
  <div class="quiz-root">
    <LoadingAnimation v-if="isLoading" />
    <div v-else-if="loadError" class="quiz-error">{{ loadError }}</div>
    <template v-else>
      <OXQuizBox
        v-if="currentQuiz && currentQuiz.type === 'ox'"
        :question="currentQuiz.question"
        :level="currentQuiz.level"
        :number="currentQuiz.number"
        @submit="onSubmit"
      />
      <SelectQuizBox
        v-else-if="currentQuiz && currentQuiz.type === 'select'"
        :question="currentQuiz.question"
        :choices="currentQuiz.choices"
        :level="currentQuiz.level"
        :number="currentQuiz.number"
        @submit="onSubmit"
      />
      <div v-else class="quiz-error">해당 문제를 찾을 수 없습니다.</div>
      <AnswerModal
        v-if="showModal"
        :result="answerResult"
        :explanation="currentQuiz?.explanation || ''"
        @close="handleModalClose"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

import OXQuizBox from "@/pages/wordquiz/components/OXQuizBox.vue";
import SelectQuizBox from "@/pages/wordquiz/components/SelectQuizBox.vue";
import AnswerModal from "@/pages/wordquiz/components/AnswerModal.vue";

import LoadingAnimation from "@/components/lottie/LoadingAnimation.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const quizList = ref([]);

const isLoading = ref(true);
const loadError = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get("http://54.66.153.95:8080/api/quiz/getQuiz");
    quizList.value = res.data;
    isLoading.value = false;
  } catch (err) {
    loadError.value = "퀴즈를 불러오지 못했습니다.";
    isLoading.value = false;
    console.error(err);
  }
});

const currentNumber = computed(() => Number(route.params.number));
const currentQuiz = computed(() =>
  quizList.value.find((q) => q.number === currentNumber.value)
);

const showModal = ref(false);
const answerResult = ref(""); // 'correct' or 'wrong'

const userId = computed(() => authStore.user?.userId || null);

async function onSubmit(answer) {
  answerResult.value =
    answer === currentQuiz.value.correctAnswer ? "correct" : "wrong";
  showModal.value = true;

  // 정답 제출 요청
  try {
    await axios.post("http://54.66.153.95:8080/api/quiz/user/submit", {
      userId: userId.value,
      quizId: currentQuiz.value.number,
      answer,
      correct: answer === currentQuiz.value.correctAnswer,
    });
  } catch (e) {
    alert("정답 제출에 실패했습니다.");
    console.error(e);
  }
}

// 모달 닫기 핸들러
function handleModalClose() {
  showModal.value = false;
  if (answerResult.value === "correct") {
    // 정답일 때만 /quiz로 이동
    router.push("/quiz");
  }
}
</script>

<style scoped>
.quiz-root {
  width: 100%;
  margin: 7rem 0rem;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.quiz-error {
  text-align: center;
  margin-top: 5rem;
  color: var(--color-primary);
}
</style>
