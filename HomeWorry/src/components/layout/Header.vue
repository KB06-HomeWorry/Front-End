<template>
  <header class="header">
    <div class="left">
      <SimpleHeader
        v-if="!isHomePage && !isAgentPage"
        :title="
          isEstateEasePage
            ? '부동산 용어 해석'
            : isAIPage
            ? 'AI 계약서 분석'
            : isAnalysisPage
            ? '서류 분석'
            : showChecklistTitle
            ? `${type} 계약 체크리스트`
            : isQuizPage
            ? '부동산 용어 퀴즈'
            : '집걱정단'
        "
      />
      <h1
        v-else
        :class="isHomePage || isAgentPage ? 'titleBold24px' : 'bodyMedium16px'"
      >
        <template v-if="isEstateEasePage">부동산 용어 해석</template>
        <template v-else-if="isAIPage">AI 계약서 분석</template>
        <template v-else-if="isAnalysisPage">서류 분석</template>
        <template v-else>
          {{ showChecklistTitle ? `${type} 계약 체크리스트` : '집걱정단' }}
        </template>
      </h1>
    </div>

    <!-- 초기화 버튼 /checklist일 때만 -->
    <div class="right" v-if="isChecklistPage && !isChecklistStagePage">
      <BtnMini text="초기화" @click="isConfirmModalVisible = true" />
    </div>

    <!-- 설명 버튼 /analysis일 때만 -->
    <div class="right" v-else-if="isAnalysisPage">
      <BtnMini text="설명" @click="isInfoModalVisible = true" />
    </div>

    <!-- 로그인/회원가입 또는 로그아웃 버튼 -->
    <div class="right" v-else>
      <template v-if="isHomePage">
        <template v-if="!isLoggedIn">
          <BtnTiny text="로그인/회원가입" @click="goToLogin" />
        </template>
        <template v-else>
          <BtnMini text="로그아웃" @click="handleLogout" />
        </template>
      </template>
    </div>

    <!-- 초기화 확인용 모달 -->
    <CustomModal
      v-model="isConfirmModalVisible"
      :message="`현재 단계 체크리스트를 초기화할까요? 지금까지의 답변이 모두 삭제됩니다.`"
      confirmText="초기화"
      cancelText="취소"
      @confirm="resetChecklist"
    />

    <!-- 초기화 알림용 모달 -->
    <CustomModal
      v-model="isAlertModalVisible"
      :message="`체크리스트가 초기화되었어요.😊\n다시 시작해볼까요?`"
      confirmText="확인"
      @confirm="isAlertModalVisible = false"
    />

    <!-- 설명용 모달 -->
    <CustomModal
      v-model="isInfoModalVisible"
      :message="`상단 단계 버튼을 눌러 원하는 항목으로 바로 이동할 수 있어요🧭`"
      confirmText="확인"
      @confirm="isInfoModalVisible = false"
    />

    <!-- 로그아웃 알림용 모달 -->
    <CustomModal
      v-model="isLogoutAlertVisible"
      :message="`로그아웃 되었습니다.`"
      confirmText="확인"
      @confirm="onLogoutAlertConfirm"
    />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChecklistStore } from '@/stores/checklist';
import { useAuthStore } from '@/stores/auth';
import CustomModal from '@/components/modal/CustomModal.vue';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import BtnTiny from '@/components/button/BtnTiny.vue';
import BtnMini from '@/components/button/BtnMini.vue';

const route = useRoute();
const router = useRouter();
const checklistStore = useChecklistStore();
const authStore = useAuthStore();

const isLoggedIn = computed(() => !!authStore.user);

const isChecklistPage = computed(() => route.path.startsWith('/checklist'));
const isChecklistStagePage = computed(() =>
  route.path.startsWith('/checklist-stage')
);

const showChecklistTitle = computed(
  () => isChecklistPage.value || isChecklistStagePage.value
);
const type = computed(() => route.query.type || '');

const isConfirmModalVisible = ref(false);
const isAlertModalVisible = ref(false);
const isLogoutAlertVisible = ref(false);

const resetChecklist = () => {
  checklistStore.resetChecklist();
  isConfirmModalVisible.value = false;
  isAlertModalVisible.value = true;
};

const isInfoModalVisible = ref(false);
const isAIPage = computed(() => route.path.startsWith('/ai'));
const isEstateEasePage = computed(() =>
  route.path.startsWith('/ai/estate-ease')
);
const isAnalysisPage = computed(() => route.path.startsWith('/analysis'));
const isHomePage = computed(() => route.path === '/');
const isAgentPage = computed(() => route.path.startsWith('/agency/list'));
const isQuizPage = computed(() => route.path.startsWith('/quiz'));

const goToLogin = () => {
  router.push('/auth/login');
};

const handleLogout = async () => {
  await authStore.logout();
  isLogoutAlertVisible.value = true;
};

const onLogoutAlertConfirm = () => {
  isLogoutAlertVisible.value = false;
  router.push('/');
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--color-white);
  z-index: 100;
  max-width: 393px;
  width: 393px;
  margin: 0 auto;
  padding: 0;
}

.header.pad {
  padding: 0 16px;
}

.left {
  display: flex;
  align-items: center;
  color: var(--color-primary);
  height: 100%;
  line-height: 60px;
}

.header {
  padding: 0 16px;
}

.left h1 {
  white-space: nowrap;
  margin-top: 5px;
  margin-left: 4px;
}
</style>
