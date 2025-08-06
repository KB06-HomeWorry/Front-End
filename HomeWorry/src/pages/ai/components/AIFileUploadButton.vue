<template>
  <div class="upload-section">
    <div class="desc-flex-row">
      <FileText :size="60" class="icon-muted" />
      <span class="desc-main bodyMedium14px">
        계약서 이미지 파일을 업로드하세요.<br />(여러 장 가능)
      </span>
    </div>
    <input
      type="file"
      accept="image/*,application/pdf"
      multiple
      class="hidden"
      ref="fileInputRef"
      @change="handleImageChange"
    />
    <BtnMedSlim text="계약서 첨부하기" @click="$refs.fileInputRef.click()" />
  </div>
</template>

<script setup>
import { FileText } from 'lucide-vue-next';
import BtnMedSlim from '@/components/button/BtnMedSlim.vue';

const props = defineProps({ fileInputRef: Object });
const emit = defineEmits(['change']);
const handleImageChange = (e) => emit('change', e);
</script>

<style scoped>
.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 0 18px 0;
}
.desc-flex-row {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  gap: 16px;
}
.icon-muted {
  color: #c2c9d6;
  opacity: 0.8;
}
.desc-main {
  color: #576073;
}
</style>
