<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
      <div
        class="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <button
          class="close-btn"
          aria-label="닫기"
          type="button"
          @click="handleClose"
        >
          &times;
        </button>

        <h3 id="modalTitle" class="modal-title bodyMedium16px">
          중개사무소 선택
        </h3>
        <ul class="agent-list bodyMedium12px">
          <li
            v-for="(agent, index) in agents"
            :key="index"
            class="agent-item"
            @click="handleSelect(agent)"
          >
            <p class="agent-name">{{ agent.officeName }}</p>
            <p class="agent-info">
              {{ agent.address }} / {{ agent.licenseNumber }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  agents: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'select', 'cancel']);

// 모달 닫기
function handleClose() {
  emit('update:modelValue', false);
  emit('cancel');
}

// 특정 항목 선택
function handleSelect(agent) {
  emit('select', agent);
  emit('update:modelValue', false);
}

// ESC 키 눌렀을 때 모달 닫기
const handleEscapeKey = (e) => {
  if (e.key === 'Escape') handleClose();
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
  width: 360px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.modal-title {
  margin: 0 0 16px 0;
  text-align: center;
}

.agent-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  max-height: 300px;
  overflow-y: auto;
}

.agent-item {
  padding: 12px;
  border: 1px solid var(--color-light, #f0f0f0);
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: var(--transition, all 0.2s ease);
}

.agent-item:hover {
  background-color: var(--color-light, #f8f9fa);
  border-color: var(--color-primary, #007bff);
}

.agent-item:last-child {
  margin-bottom: 0;
}

.agent-name {
  margin: 0 0 4px 0;
  color: var(--color-black, #000);
}

.agent-info {
  margin: 0;
  color: var(--color-gray, #666);
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
  transition: var(--transition, all 0.2s ease);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.cancel-btn {
  background-color: var(--color-light, #f0f0f0);
  color: var(--color-black, #000);
}

.cancel-btn:hover {
  background-color: var(--color-gray, #e0e0e0);
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
  color: var(--color-black, #000);
  padding: 0;
  user-select: none;
}

.close-btn:hover {
  color: var(--color-primary, #007bff);
}
</style>
