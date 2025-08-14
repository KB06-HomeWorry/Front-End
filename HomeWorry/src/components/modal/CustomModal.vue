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
        <p
          id="modalDesc"
          class="modal-message bodyMedium14px"
          ref="messageRef"
          v-html="message"
        ></p>

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

  <!-- 큰 이미지 보기 -->
  <ZoomModal v-model:open="zoomOpen" :src="zoomSrc" :alt="zoomAlt" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import ZoomModal from '@/components/modal/ZoomModal.vue';

const props = defineProps({
  modelValue: Boolean,
  message: { type: String, required: true },
  confirmText: { type: String, default: '확인' },
  cancelText: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const messageRef = ref(null);

// 큰 보기 상태
const zoomOpen = ref(false);
const zoomSrc = ref('');
const zoomAlt = ref('');

// 확인/취소
const handleConfirm = () => {
  emit('update:modelValue', false);
  emit('confirm');
};
const handleCancel = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

// ESC 닫기
const handleEscapeKey = (e) => {
  if (e.key === 'Escape') handleCancel();
};
onMounted(() => window.addEventListener('keydown', handleEscapeKey));
onBeforeUnmount(() => window.removeEventListener('keydown', handleEscapeKey));

// 이미지 인터랙션 (이미지 있을 때만)
let bound = false;

function bindImageInteractions() {
  const el = messageRef.value;
  if (!el) return;

  const imgs = el.querySelectorAll('img');
  if (!imgs.length) return;

  imgs.forEach((img) => {
    img.classList.add('zoomable-img');
    img.setAttribute('decoding', 'async');
    img.setAttribute('loading', 'lazy');
  });

  if (bound) return;
  el.addEventListener('mouseover', onMouseOver);
  el.addEventListener('mouseout', onMouseOut);
  el.addEventListener('click', onClick);
  bound = true;
}

function unbindImageInteractions() {
  const el = messageRef.value;
  if (!el || !bound) return;
  el.removeEventListener('mouseover', onMouseOver);
  el.removeEventListener('mouseout', onMouseOut);
  el.removeEventListener('click', onClick);
  bound = false;
}

function isImgTarget(e) {
  const t = e.target;
  return t instanceof HTMLImageElement && messageRef.value?.contains(t);
}

function onMouseOver(e) {
  if (!isImgTarget(e)) return;
  const img = e.target;
  // 혹시 이전 설정이 남았을 경우 초기화
  img.style.transformOrigin = 'center center';
  img.classList.add('zoomable-img--hover');
}

function onMouseOut(e) {
  if (!isImgTarget(e)) return;
  const img = e.target;
  img.classList.remove('zoomable-img--hover');
  img.style.transformOrigin = 'center center';
}

function onClick(e) {
  if (!isImgTarget(e)) return;
  const img = e.target;
  zoomSrc.value = img.getAttribute('src') || '';
  zoomAlt.value = img.getAttribute('alt') || '';
  if (zoomSrc.value) zoomOpen.value = true;
}

// 모달 열릴 때 바인딩/닫히면 해제
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      requestAnimationFrame(bindImageInteractions);
    } else {
      unbindImageInteractions();
    }
  }
);

// 메시지 변경 시 재바인딩
watch(
  () => props.message,
  () => {
    if (!props.modelValue) return;
    requestAnimationFrame(() => {
      unbindImageInteractions();
      bindImageInteractions();
    });
  }
);
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

/* 이미지 확대 기본 스타일 */
.modal-message :deep(img.zoomable-img) {
  max-height: 120px;
  height: auto;
  cursor: zoom-in;
  border-radius: 8px;
  margin-top: 8px;
  transition: transform 0.15s ease;
  display: inline-block;
  transform-origin: center center !important; /* 중앙 고정 */
}

/* 호버 시: 중앙에서만 고정 확대 */
.modal-message :deep(img.zoomable-img.zoomable-img--hover) {
  transform: scale(1.35);
}
</style>
