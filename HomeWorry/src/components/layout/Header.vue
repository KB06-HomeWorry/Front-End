<template>
  <header class="header">
    <div class="left">
      <SimpleHeader v-if="!isHomePage && !isAgentPage" />
      <h1 :class="isHomePage ? 'titleBold24px' : 'bodyMedium20px'">
        <template v-if="isAnalysisPage">계약서 분석</template>
        <template v-else>
          {{ showChecklistTitle ? `${type} 계약 체크리스트` : "집걱정단" }}
        </template>
      </h1>
    </div>

    <!-- 초기화 버튼: /checklist일 때만 -->
    <div class="right" v-if="isChecklistPage && !isChecklistStagePage">
      <button
        class="action-btn titleBold12px"
        @click="isConfirmModalVisible = true"
      >
        초기화
      </button>
    </div>

    <!-- 설명 버튼: /analysis일 때만 -->
    <div class="right" v-if="isAnalysisPage">
      <button
        class="action-btn titleBold12px"
        @click="isInfoModalVisible = true"
      >
        설명
      </button>
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
  </header>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useChecklistStore } from "@/stores/checklist";
import CustomModal from "@/components/modal/CustomModal.vue";
import SimpleHeader from "@/components/layout/SimpleHeader.vue";

const route = useRoute();
const checklistStore = useChecklistStore();

const isChecklistPage = computed(() => route.path.startsWith("/checklist"));
const isChecklistStagePage = computed(() =>
  route.path.startsWith("/checklist-stage")
);

const showChecklistTitle = computed(
  () => isChecklistPage.value || isChecklistStagePage.value
);
const type = computed(() => route.query.type || "");

const isConfirmModalVisible = ref(false);
const isAlertModalVisible = ref(false);

const resetChecklist = () => {
  checklistStore.resetChecklist();
  isConfirmModalVisible.value = false;
  isAlertModalVisible.value = true;
};

const isInfoModalVisible = ref(false);
const isAnalysisPage = computed(() => route.path.startsWith("/analysis"));
const isHomePage = computed(() => route.path === "/");
const isAgentPage = computed(() => route.path.startsWith("/agency/list"));
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
  width: 100%;
  margin: 0 auto;
  border-bottom: 0.5px solid var(--color-light);
  padding: 0 16px;
}

.left {
  display: flex;
  align-items: center; /* 세로 가운데 정렬 */
}

.header {
  padding: 0 8px; /* 왼쪽 공간을 줄임 */
}

.left h1 {
  white-space: nowrap;
  margin-top: 5px;
  margin-left: 4px; /* 현재 0 또는 8px 대신 4px 정도로 줄임 */
}

.action-btn {
  border-radius: 12px;
  width: 58px;
  height: 24px;
  line-height: 24px;
  padding: 0;
  border: none;
  color: var(--color-white);
  background-color: var(--color-primary);
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
