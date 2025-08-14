<template>
  <teleport to="body">
    <div v-if="open" class="zoom-modal-overlay" @click="close">
      <img :src="src" :alt="alt" class="zoom-modal-image" @click.stop />
      <button
        class="zoom-modal-close-btn"
        @click.stop="close"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, required: true },
  alt: { type: String, default: '' },
});
const emit = defineEmits(['update:open']);

const close = () => emit('update:open', false);

function handleKeydown(e) {
  if (e.key === 'Escape') {
    close();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* 주석으로 달린 부분이 Tailwind CSS에서 쓰는 클래스 이름과 동일한 역할을 하는 속성 -> <div class="">에 바로 적어주면 반영 */
/* 배경 오버레이 */
.zoom-modal-overlay {
  position: fixed; /* fixed */
  top: 0;
  right: 0;
  bottom: 0;
  left: 0; /* inset-0 */
  z-index: 9999; /* z-[9999] */
  background-color: rgba(0, 0, 0, 0.7); /* bg-black/70 */
  display: flex; /* flex */
  align-items: center; /* items-center */
  justify-content: center; /* justify-center */
}

/* 이미지 */
.zoom-modal-image {
  max-width: 90vw; /* max-w-[90vw] */
  max-height: 90vh; /* max-h-[90vh] */
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.25); /* shadow-xl */
  user-select: none; /* select-none */
}

/* 닫기 버튼 */
.zoom-modal-close-btn {
  position: absolute; /* absolute */
  top: 1rem; /* top-4 */
  right: 1rem; /* right-4 */
  color: white; /* text-white */
  background: transparent;
  border: none;
  cursor: pointer;
}

.zoom-modal-close-btn:hover {
  color: #ccc;
}
</style>
