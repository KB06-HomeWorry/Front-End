<template>
  <div class="review-root">
    <div class="progress-bar-container">
      <ProgressBar
        :percent="progressPercent"
        :label="`${completedAnswersCount} / ${total}`"
        :pointer-img="avatar"
      />
    </div>
    <div class="write-review">
      <div class="review-list">
        <ReviewQuestion
          v-for="(q, idx) in visibleQuestions"
          :key="idx"
          :index="idx"
          :question="q.text"
          :choices="q.choices"
          v-model="answers[idx]"
          @update:modelValue="onSelect(idx, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import ProgressBar from '@/pages/agency/components/ProgressBar.vue'
import ReviewQuestion from '@/pages/agency/components/ReviewQuestion.vue'
import ProgressAvatar from '@/assets/icons/progress-avatar.png'

const avatar = ProgressAvatar

const questions = [
  {
    text: '중개사의 태도는 어땠나요?',
    choices: [
      { type: 'good', label: 'Good', emoji: '😊', text: '매우 친절하고 신뢰감이 느껴졌어요' },
      { type: 'soso', label: 'so-so', emoji: '😐', text: '보통이었어요' },
      { type: 'bad',  label: 'Bad',  emoji: '😕', text: '불친절하거나 불쾌했어요' }
    ]
  },
  {
    text: '요청한 매물을 실제로 볼 수 있었고, 사이트(앱) 설명과도 일치했나요?',
    choices: [
      { type: 'good', label: 'Good', emoji: '👀', text: '실제로 매물을 확인했고 설명과 동일했어요' },
      { type: 'soso', label: 'so-so', emoji: '🤔', text: '매물을 직접 봤지만 설명과 일부만 일치했어요' },
      { type: 'bad',  label: 'Bad',  emoji: '❌', text: '매물을 못봤거나 설명과 다른 부분이 많았어요' }
    ]
  },
  {
    text: '중개사가 추가로 제안한 매물이 내 조건에 잘 맞았나요?',
    choices: [
      { type: 'good', label: 'Good', emoji: '👍', text: '제 조건에 꼭 맞는 매물을 추천해줬어요' },
      { type: 'soso', label: 'so-so', emoji: '🆗', text: '대체로 비슷한 매물이었어요' },
      { type: 'bad',  label: 'Bad',  emoji: '👎', text: '조건 안 맞는 매물만 보여줬어요' }
    ]
  },
  {
    text: '계약을 서두르거나 부담을 준 느낌이 있었나요?',
    choices: [
      { type: 'good', label: 'Good', emoji: '🙆‍♀️', text: '충분히 고민할 시간을 주었어요' },
      { type: 'soso', label: 'so-so', emoji: '🤨', text: '조금 서두르는 느낌이 있었어요' },
      { type: 'bad',  label: 'Bad',  emoji: '😣', text: '부담스럽게 계약을 권유했어요' }
    ]
  },
  {
    text: '중개사가 중개비 등 중요한 정보를 명확하게 안내해줬나요?',
    choices: [
      { type: 'good', label: 'Good', emoji: '💡', text: '처음부터 명확하게 설명해줬어요' },
      { type: 'soso', label: 'so-so', emoji: '😶', text: '물어보니 알려줬어요' },
      { type: 'bad',  label: 'Bad',  emoji: '🤔', text: '설명이 부족하거나 혼란스러웠어요' }
    ]
  }
]

const answers = ref(Array(questions.length).fill(null))
const currentStep = ref(0)
const visibleQuestions = computed(() => questions.slice(0, currentStep.value + 1))

// 답변 완료 질문 개수 계산
const completedAnswersCount = computed(() => {
  return answers.value.filter(ans => ans !== null).length
});

// 답변 완료 개수 기준으로 진행률 재계산
const progressPercent = computed(
  () => (completedAnswersCount.value / questions.length) * 100
);
const step = computed(() => currentStep.value)
const total = computed(() => questions.length)

function onSelect(idx, answerIdx) {
  answers.value[idx] = answerIdx;

  if (currentStep.value < questions.length - 1) {
    currentStep.value++;
    nextTick(() => {
      const lastQ = document.querySelector('.review-list > div:last-child');
      if (lastQ) lastQ.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  } else {
    console.log('설문 완료!', answers.value);
    // 여기에 '제출하기' 버튼
  }
}
</script>

<style scoped>
.review-root {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.progress-bar-container {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  padding: 18px 2rem 8px 2rem;
}

.write-review {
  flex: 1 1 0;
  min-height: 0; 
  overflow-y: auto;
  margin: 0 2rem;
  padding-top: 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.write-review::-webkit-scrollbar { display: none; }

.review-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
