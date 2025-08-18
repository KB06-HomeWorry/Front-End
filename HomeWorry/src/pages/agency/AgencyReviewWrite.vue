<template>
  <div>
    <SimpleHeader :title="agency.office_name || ''" />

    <div class="page-container">
      <div v-if="!reviewType" class="initial-choice-container">
        <div class="choice-title bodyMedium20px">해당 중개사무소에서,</div>
        <BtnMedGray :text="'💬 상담만 받았어요'" @click="startReview('consultation')" />
        <BtnMedGray :text="'📃 계약까지 완료했어요'" @click="startReview('transaction')" />
      </div>

      <div v-else class="review-root">
        <!-- 상단 고정 진행바 -->
        <div class="progress-bar-fixed">
          <ProgressBar
            :percent="progressPercent"
            :label="`${completedAnswersCount} / ${total}`"
            :pointer-img="avatar"
          />
        </div>

        <div class="write-review">
          <div class="review-list">
        <!-- 질문 단계별로 하나씩 보여줌 -->
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

      <!-- 텍스트 입력란(마지막 step에서만 노출) -->
          <ReviewText
            v-if="showTextInput"
            v-model="additionalComment"
            :maxlength="300"
            :minlength="10"
          />

      <!-- 후기작성 완료 버튼(마지막 step에서만, 조건 만족 시 활성화) -->
          <BtnMedSlim
            v-if="showTextInput"
            :text="'후기 작성 완료하기'"
            :disabled="!canSubmit"
            @click="submitReview"
            style="margin: 12px 0 12px 0; width: 100%;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import ProgressBar from '@/pages/agency/components/ProgressBar.vue'
import ReviewQuestion from '@/pages/agency/components/ReviewQuestion.vue'
import ReviewText from '@/pages/agency/components/ReviewText.vue'
import BtnMedGray from '@/pages/agency/components/BtnMedGray.vue'
import BtnMedSlim from '@/components/button/BtnMedSlim.vue'

import { useTrustScore } from '@/pages/agency/composables/useTrustScore.js'
import ProgressAvatar from '@/assets/icons/progress-avatar.png'

const { calculateTrustScore } = useTrustScore()

const router = useRouter()
const route = useRoute()
const officeId = route.query.agencyId || route.params.agencyId || ''
const userToken = localStorage.getItem('user-token')

/* 중개사 기본 정보 */
const agency = ref({ office_name: '' })
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/agent/${officeId}`)
    agency.value.office_name = res.data.officeName || res.data.office_name || ''
  } catch (e) {
    console.error('중개사 정보 로드 실패:', e)
  }
})

/* 진행바 아이콘 */
const avatar = ProgressAvatar

const reviewType = ref(null)             
const additionalComment = ref('')         // 후기 자유 입력란
const answers = ref([])                  
const currentStep = ref(0)               

// 모든 질문 목록(상담만 or 거래완료에 따라 다르게 사용)
const allQuestions = [
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
  },
      // 거래 완료 시 추가 문항 (6-7)
  {
    text: '계약서 작성과 특약사항 조율 과정이 투명하게 진행됐나요?',
    choices: [
      { type: 'good', label: 'Good', emoji: '👍', text: '모든 내용을 이해할 수 있도록 꼼꼼히 안내해줬어요' },
      { type: 'soso', label: 'so-so', emoji: '😐', text: '대부분 설명해줬지만 일부는 스스로 확인했어요' },
      { type: 'bad',  label: 'Bad',  emoji: '👎', text: '설명이 부족하거나 불명확했어요' }
    ]
  },
  {
    text: '거래 과정에서 불만사항이나 문제점이 있었나요?',
    choices: [
      { type: 'good', label: 'Good', emoji: '🆗', text: '전혀 없었어요' },
      { type: 'soso', label: 'so-so', emoji: '😐', text: '약간 불편한 점이 있었어요' },
      { type: 'bad',  label: 'Bad',  emoji: '🚫', text: '불만/문제 상황이 있었어요' }
    ]
  }
]

// 리뷰타입(거래/상담)에 따라 질문 목록 결정
const activeQuestions = computed(() => {
  if (reviewType.value === 'transaction') return allQuestions
  if (reviewType.value === 'consultation') return allQuestions.slice(0, 5)
  return []
})

/* 현재 step까지 보여줄 문항 */
const visibleQuestions = computed(() =>
  activeQuestions.value.slice(0, Math.min(currentStep.value + 1, activeQuestions.value.length))
)

/* 마지막 단계 여부(텍스트 입력 노출) */
const showTextInput = computed(() => currentStep.value === activeQuestions.value.length)

/* 총 단계 수 = 객관식 문항 수 + 텍스트 1 */
const total = computed(() => activeQuestions.value.length + 1)

/* 완료 개수 계산 */
const completedAnswersCount = computed(() => {
  if (showTextInput.value && additionalComment.value.length >= 10) return total.value
  return answers.value.filter(ans => ans !== null).length
})

/* 진행률 계산 */
const progressPercent = computed(() => {
  if (total.value === 0) return 0
  if (showTextInput.value && additionalComment.value.length >= 10) return 100
  return (completedAnswersCount.value / total.value) * 100
})

const canSubmit = computed(() =>
  answers.value.length === activeQuestions.value.length &&
  answers.value.every(ans => ans !== null) &&
  additionalComment.value.length >= 10
)

function startReview(type) {
  reviewType.value = type
  answers.value = Array(activeQuestions.value.length).fill(null)
  currentStep.value = 0
  additionalComment.value = ''
}

function onSelect(idx, answerIdx) {
  answers.value[idx] = answerIdx
  if (currentStep.value < activeQuestions.value.length) {
    currentStep.value++
    nextTick(() => {
      const lastQ = document.querySelector('.review-list > div:last-child')
      if (lastQ) lastQ.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
}

/* 제출: 점수 계산 후 서버 전송 */
async function submitReview() {
  const reviewData = calculateTrustScore(
    answers.value,
    reviewType.value,
    additionalComment.value,
    officeId,
    userToken
  )

  try {
    await axios.post('http://localhost:8080/agent/reviews', reviewData)
    alert('리뷰가 등록되었습니다.')
    router.push(`/agency/${officeId}`)
  } catch (error) {
    console.error('리뷰 작성 실패:', error)
    const errorMessage = error.response?.data?.message || '리뷰 등록 중 오류가 발생했습니다.'
    alert(errorMessage)
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
}

/* 초기 선택 화면 */
.initial-choice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  padding: 2rem;
  gap: 32px;
}
.choice-title {
  margin: 1.5rem 0 0.5rem 0;
  color: var(--color-primary);
}

.review-root {
  flex: 1 1 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-top: 16px;
}

.progress-bar-fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 40px;
  z-index: 100;
  background: #fff;
  padding: 18px 2rem 8px 2rem;
  max-width: 393px;
  margin: 0 auto;
}

.write-review {
  overflow-y: auto;
  margin: 0 2rem;
  padding-top: 64px;
}
.write-review::-webkit-scrollbar { display: none; }

.review-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
