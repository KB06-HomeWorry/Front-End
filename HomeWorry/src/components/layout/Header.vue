<template>
  <!-- SimpleHeader일 때만 보더, H1일 때만 패딩 -->
  <header
    class="header"
    :class="{ 'with-border': showSimpleHeader, 'pad': !showSimpleHeader }"
  >
    <div class="left">
      <!-- SimpleHeader 체크리스트 / AI 분석 / 서류 분석만 -->
      <SimpleHeader v-if="showSimpleHeader" :title="simpleHeaderTitle" />

      <!-- 기본 헤더(H1) -->
      <h1 v-else :class="isHomePage || isAgentPage ? 'titleBold24px' : 'bodyMedium16px'">
        집걱정단
      </h1>
    </div>

    <!-- 초기화 버튼 /checklist (stage 제외) -->
    <div class="right" :class="rightPadClass" v-if="isChecklistPage && !isChecklistStagePage">
      <BtnMini text="초기화" @click="isConfirmModalVisible = true" />
    </div>

    <!-- 설명 버튼 /analysis -->
    <div class="right" :class="rightPadClass" v-else-if="isAnalysisPage">
      <BtnMini text="설명" @click="isInfoModalVisible = true" />
    </div>

    <!-- 홈에서만 로그인/로그아웃 노출 -->
    <div class="right" :class="rightPadClass" v-else>
      <template v-if="isHomePage">
        <template v-if="!isLoggedIn">
          <BtnTiny text="로그인/회원가입" @click="goToLogin" />
        </template>
        <template v-else>
          <BtnMini text="로그아웃" @click="handleLogout" />
        </template>
      </template>
    </div>

    <!-- 모달들 -->
    <CustomModal
      v-model="isConfirmModalVisible"
      :message="`현재 단계 체크리스트를 초기화할까요? 지금까지의 답변이 모두 삭제됩니다.`"
      confirmText="초기화"
      cancelText="취소"
      @confirm="resetChecklist"
    />
    <CustomModal
      v-model="isAlertModalVisible"
      :message="`체크리스트가 초기화되었어요.😊\n다시 시작해볼까요?`"
      confirmText="확인"
      @confirm="isAlertModalVisible = false"
    />
    <CustomModal
      v-model="isInfoModalVisible"
      :message="`상단 단계 버튼을 눌러 원하는 항목으로 바로 이동할 수 있어요🧭`"
      confirmText="확인"
      @confirm="isInfoModalVisible = false"
    />
    <CustomModal
      v-model="isLogoutAlertVisible"
      :message="`로그아웃 되었습니다.`"
      confirmText="확인"
      @confirm="onLogoutAlertConfirm"
    />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChecklistStore } from '@/stores/checklist'
import { useAuthStore } from '@/stores/auth'
import CustomModal from '@/components/modal/CustomModal.vue'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import BtnTiny from '@/components/button/BtnTiny.vue'
import BtnMini from '@/components/button/BtnMini.vue'

const route = useRoute()
const router = useRouter()
const checklistStore = useChecklistStore()
const authStore = useAuthStore()

const isLoggedIn = computed(() => !!authStore.user)

const isChecklistPage = computed(() => route.path.startsWith('/checklist'))
const isChecklistStagePage = computed(() => route.path.startsWith('/checklist-stage'))
const isAIPage = computed(() => route.path.startsWith('/ai'))
const isAnalysisPage = computed(() => route.path.startsWith('/analysis'))
const isHomePage = computed(() => route.path === '/')
const isAgentPage = computed(() => route.path.startsWith('/agency/list'))

const showSimpleHeader = computed(
  () => isChecklistPage.value || isChecklistStagePage.value || isAIPage.value || isAnalysisPage.value
)

const type = computed(() => route.query.type || '')
const simpleHeaderTitle = computed(() => {
  if (isChecklistPage.value || isChecklistStagePage.value) return `${type.value} 계약 체크리스트`
  if (isAIPage.value) return 'AI 계약서 분석'
  if (isAnalysisPage.value) return '서류 분석'
  return '집걱정단'
})

/* SimpleHeader일 때만 오른쪽에 여백 추가 */
const rightPadClass = computed(() => ({ 'right-pad': showSimpleHeader.value }))

// 모달
const isConfirmModalVisible = ref(false)
const isAlertModalVisible = ref(false)
const isLogoutAlertVisible = ref(false)
const isInfoModalVisible = ref(false)
const resetChecklist = () => { checklistStore.resetChecklist(); isConfirmModalVisible.value = false; isAlertModalVisible.value = true }
const goToLogin = () => router.push('/auth/login')
const handleLogout = async () => { await authStore.logout(); isLogoutAlertVisible.value = true }
const onLogoutAlertConfirm = () => { isLogoutAlertVisible.value = false; router.push('/') }
</script>

<style>
:root {
  --header-side-gap: 16px;
}
</style>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 60px;
  background-color: var(--color-white);
  z-index: 100;
  max-width: 393px;
  width: 393px;
  margin: 0 auto;
  padding: 0;
}

.header.pad {
  padding: 0 var(--header-side-gap, 16px);
}

/* SimpleHeader일 때만 하단 보더 */
.header.with-border {
  border-bottom: 0.5px solid var(--color-light);
}

.left {
  display: flex;
  align-items: center;
  color: var(--color-primary);
  height: 100%;
  line-height: 60px;
}

.left h1 {
  white-space: nowrap;
  margin-top: 5px;
  margin-left: 4px;
}

.right {
  display: flex;
  align-items: center;
}

/* SimpleHeader일 때 오른쪽 패딩 추가(버튼 붙는 쪽) */
.right.right-pad {
  padding-right: var(--header-side-gap, 16px);
}
</style>
