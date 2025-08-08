<template>
  <div class="analysis-result-wrapper" v-if="analysisResults.length > 0">
    <!-- 전체 요약 카드 -->
    <div
      :class="['summary-card', totalRiskySectionsCount > 0 ? 'danger' : 'safe']"
    >
      <div class="summary-icon">
        <AlertCircle
          v-if="totalRiskySectionsCount > 0"
          :size="26"
          class="danger-icon"
        />
        <CheckCircle v-else :size="26" class="safe-icon" />
      </div>
      <div class="summary-text">
        <div class="summary-title bodyMedium12px">
          {{
            totalRiskySectionsCount > 0
              ? `총 ${totalRiskySectionsCount}개의 잠재적 위험 조항이 발견되었습니다.`
              : '특별한 위험 요소가 발견되지 않았습니다.'
          }}
        </div>
        <div class="summary-desc bodyLight12px">
          {{
            totalRiskySectionsCount > 0
              ? '붉게 표시된 구역을 클릭해 상세 내용을 확인하고 전문가와 검토하세요.'
              : '모든 계약서가 일반 양식과 일치합니다. 최종 판단은 반드시 본인이 꼼꼼히 확인하세요.'
          }}
        </div>
      </div>
    </div>

    <!-- 각 페이지별 카드 -->
    <div class="page-list">
      <div
        v-for="(pageResults, pageIndex) in analysisResults"
        :key="pageIndex"
        class="page-card"
      >
        <div class="page-thumb-area bodyLight10px">
          <img
            :src="imagePreviews[pageIndex]"
            :alt="`${pageIndex + 1}페이지`"
            class="page-thumb"
          />
          <div class="page-badge">{{ pageIndex + 1 }}페이지</div>
          <!-- 위험영역 하이라이트 표시 -->
          <div class="danger-zones">
            <div
              v-for="(result, sectionIndex) in pageResults"
              :key="sectionIndex"
              @click="handleSectionClick(result, pageIndex)"
              :class="[
                'zone-mark',
                result.isRisky ? 'danger-zone' : 'safe-zone',
              ]"
              :style="{
                top: `${10 + sectionIndex * 16}%`,
                left: '10%',
                width: '80%',
                height: '12%',
              }"
            >
              <AlertCircle
                v-if="result.isRisky"
                :size="18"
                class="zone-alert"
              />
            </div>
          </div>
        </div>
        <div class="page-info">
          <div class="info-head">
            <span class="page-title bodyMedium14px"
              >페이지 {{ pageIndex + 1 }}</span
            >
            <span
              :class="[
                'risk-badge',
                pageRiskCount(pageResults) > 0 ? 'danger' : 'safe',
                'bodyMedium12px',
              ]"
            >
              {{
                pageRiskCount(pageResults) > 0
                  ? `${pageRiskCount(pageResults)}개 위험`
                  : '안전'
              }}
            </span>
          </div>
          <div class="info-desc bodyMedium12px">
            {{
              pageRiskCount(pageResults) > 0
                ? '위험 조항이 발견되었습니다.'
                : '특별한 위험 요소가 없습니다.'
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { AlertCircle, CheckCircle } from 'lucide-vue-next';
const props = defineProps({
  imagePreviews: { type: Array, default: () => [] },
  analysisResults: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
});
const emit = defineEmits(['selectSection']);

const totalRiskySectionsCount = computed(() =>
  props.analysisResults.reduce(
    (total, pageResults) => total + pageResults.filter((r) => r.isRisky).length,
    0
  )
);
const pageRiskCount = (pageResults) =>
  pageResults.filter((r) => r.isRisky).length;

const handleSectionClick = (result, pageIndex) => {
  emit('selectSection', result, pageIndex);
};
</script>

<style scoped>
.analysis-result-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}
.summary-card {
  display: flex;
  align-items: flex-start;
  padding: 18px 18px 16px 18px;
  border-radius: 16px;
  box-shadow: 0 2px 10px 0 rgba(220, 80, 80, 0.06);
  gap: 16px;
  border: 1px solid #f2f2f2;
}
.summary-card.danger {
  background: #fff3f3;
  border-color: #ffb6b6;
}
.summary-card.safe {
  background: #f5fdf6;
  border-color: #a6e8b6;
}
.summary-icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.danger-icon {
  color: var(--color-danger);
}
.safe-icon {
  color: #22c55e;
}
.summary-text {
  flex: 1;
}
.summary-title {
  margin-bottom: 2px;
}
.summary-desc {
  color: #7a7a7a;
}
.page-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-card {
  background: var(--color-white);
  border-radius: 13px;
  border: 1px solid #f1f2f4;
  overflow: hidden;
  display: flex;
  gap: 16px;
  align-items: stretch;
  min-height: 110px;
}
.page-thumb-area {
  position: relative;
  width: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
}

.page-thumb {
  width: 70px;
  height: 94px;
  border-radius: 8px;
  object-fit: cover;
  opacity: 0.92;
}
.page-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(36, 38, 60, 0.83);
  color: var(--color-white);
  padding: 1px 8px;
  border-radius: 8px;
  letter-spacing: 0.03em;
  margin-left: 4px;
}
.danger-zones {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.zone-mark {
  position: absolute;
  left: 12%;
  width: 76%;
  height: 12%;
  border-radius: 7px;
  border: 1px dashed var(--color-danger);
  box-sizing: border-box;
  background: rgba(239, 68, 68, 0.11);
  pointer-events: auto;
  cursor: pointer;
  transition: background 0.17s, border 0.17s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.zone-mark.safe-zone {
  opacity: 0;
}
.zone-mark:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: #b91c1c;
}
.zone-alert {
  color: #fff;
  filter: drop-shadow(0 0 3px #ef4444cc);
  animation: pulse 1.2s infinite alternate;
}
@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.13);
  }
}
.page-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 0;
}
.page-title {
  color: #23262f;
}
.risk-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  line-height: 1;
  padding: 0 13px;
  border-radius: 14px;
  min-width: 54px;
}
.info-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
  padding-right: 16px;
}
.risk-badge.danger {
  background: #ffe4e4;
  color: #d32f2f;
  border: 1px solid #fca5a5;
}
.risk-badge.safe {
  background: #e7f9ee;
  color: #18ad55;
  border: 1.2px solid #86efac;
}
.info-desc {
  color: #6b7280;
  margin-top: 1px;
}
</style>
