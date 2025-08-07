<template>
  <transition name="fade">
    <div v-if="selectedSection" @click="closeModal" class="modal-bg">
      <div @click.stop class="modal-card">
        <div class="modal-head" v-if="!loading">
          <AlertCircle :size="22" class="alert-icon" />
          <div>
            <div class="modal-title bodyMedium18px">
              {{ selectedSection.title }}
            </div>
            <div class="modal-page bodyLight12px" v-if="selectedSection.page">
              {{ selectedSection.page }}페이지
            </div>
          </div>
          <button class="close-btn" @click="closeModal">
            <X :size="21" />
          </button>
        </div>

        <div class="modal-section" v-if="!loading">
          <div class="mod-label bodyMedium16px">⚠️ 문제 조항</div>
          <div class="mod-content bodyMedium14px">
            {{ selectedSection.details }}
          </div>
          <div class="mod-label bodyMedium16px">💡 AI 권장 조치</div>
          <div class="mod-content blue bodyMedium14px">
            {{ selectedSection.recommendation }}
          </div>
        </div>

        <div class="modal-loading" v-else>
          <div class="spinner" />
          <div class="loading-text bodyMedium14px">AI 분석 중입니다...</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { AlertCircle, X } from 'lucide-vue-next';

const props = defineProps({
  selectedSection: Object,
  loading: Boolean,
});
const emit = defineEmits(['close']);
const closeModal = () => emit('close');
</script>

<style scoped>
.modal-bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(40, 42, 60, 0.48);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.modal-card {
  background: var(--color-white);
  border-radius: 17px;
  box-shadow: 0 6px 24px 0 rgba(80, 90, 110, 0.16);
  padding: 27px 21px;
  max-width: 320px;
  width: 100%;
  animation: fadeInUp 0.25s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.modal-head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 13px;
}

.alert-icon {
  color: var(--color-danger);
  margin-right: 4px;
}

.modal-title {
  color: #222;
}

.modal-page {
  color: #868b98;
  margin-top: 1px;
}

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  transition: color 0.15s;
}

.close-btn:hover {
  color: var(--color-primary);
}

.modal-section {
  margin-top: 6px;
}

.mod-label {
  margin-top: 18px;
  margin-bottom: 4px;
}

.mod-content {
  background: #f8fafb;
  border-radius: 7px;
  color: #32354b;
  padding: 10px 11px;
  margin-bottom: 3px;
  line-height: 1.56;
}

.mod-content.blue {
  background: #eef6ff;
  color: #1257c8;
  border: 1px solid #c7e2ff;
}

.modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
}

.spinner {
  border: 4px solid #e0e0e0;
  border-top: 4px solid var(--color-blue-deep);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--color-blue-deep);
}
</style>
