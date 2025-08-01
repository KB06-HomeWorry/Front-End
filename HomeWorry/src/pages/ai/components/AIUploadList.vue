<template>
  <div class="img-list">
    <div
      v-for="(preview, idx) in imagePreviews"
      :key="idx"
      class="img-thumb-box"
    >
      <img :src="preview" class="img-thumb" />
      <button class="remove-btn bodyLight10px" @click="removeImage(idx)">
        <X :size="13" />
      </button>
      <div class="img-thumb-label bodyLight10px">{{ idx + 1 }}페이지</div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';

const props = defineProps({ imagePreviews: Array });
const emit = defineEmits(['removeImage']);
const removeImage = (idx) => emit('removeImage', idx);
</script>

<style scoped>
.img-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  margin-bottom: 16px;
  padding-top: 12px;
}
.img-thumb-box {
  position: relative;
  width: 70px;
  flex-shrink: 0;
  border-radius: 9px;
}
.img-thumb {
  width: 70px;
  height: 94px;
  border-radius: 8px;
  object-fit: cover;
  opacity: 0.92;
}
.img-thumb-label {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(36, 38, 60, 0.83);
  color: var(--color-white);
  padding: 1px 8px;
  border-radius: 8px;
  letter-spacing: 0.03em;
}
.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--color-danger);
  color: var(--color-white);
  border-radius: 50%;
  padding: 3px 6px;
  border: none;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  opacity: 0;
  transition: opacity 0.18s;
  z-index: 2;
}
.img-thumb-box:hover .remove-btn {
  opacity: 1;
}
</style>
