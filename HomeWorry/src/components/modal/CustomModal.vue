<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="handleCancel">
      <div
        class="modal-container"
        role="dialog"
        aria-modal="true"
        aria-describedby="modalDesc"
      >
        <button
          class="close-btn"
          aria-label="닫기"
          type="button"
          @click="handleCancel"
        >
          &times;
        </button>
        <p id="modalDesc" class="modal-message bodyMedium14px">{{ message }}</p>
        <div class="modal-buttons">
          <button
            v-if="cancelText"
            class="modal-btn cancel-btn titleBold12px"
            @click="handleCancel"
            type="button"
          >
            {{ cancelText }}
          </button>
          <button
            class="modal-btn confirm-btn titleBold12px"
            @click="handleConfirm"
            type="button"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

// Props: 모델 값, 메시지, 버튼 텍스트
const props = defineProps({
  modelValue: Boolean,
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: '확인',
  },
  cancelText: {
    type: String,
    default: '',
  },
});

// 이벤트: 모델 값 업데이트, confirm, cancel
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

// 모달 확인 처리
const handleConfirm = () => {
  emit('update:modelValue', false);
  emit('confirm');
};

// 모달 닫기(취소) 처리
const handleCancel = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

// ESC 키 눌렀을 때 모달 닫기
const handleEscapeKey = (e) => {
  if (e.key === 'Escape') handleCancel();
};

// 컴포넌트 마운트 시 ESC 키 이벤트 등록
onMounted(() => {
  window.addEventListener('keydown', handleEscapeKey);
});

// 언마운트 시 이벤트 해제
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  position: relative;
  background-color: var(--color-white);
  padding: 24px;
  border-radius: 12px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.modal-message {
  margin-top: 12px;
  margin-bottom: 20px;
  white-space: pre-line;
  text-align: center;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-btn {
  border-radius: 12px;
  width: 58px;
  height: 24px;
  line-height: 24px;
  padding: 0;
  border: none;
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.confirm-btn {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.cancel-btn {
  background-color: var(--color-light);
  color: var(--color-black);
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: var(--color-black);
  padding: 0;
  user-select: none;
}

.close-btn:hover {
  color: var(--color-primary);
}
</style>
