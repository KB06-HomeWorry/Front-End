<template>
  <div class="upload-section">
    <!-- 원형 아이콘 -->
    <div class="icon-circle-bg">
      <img
        src="@/assets/icons/upload_document.png"
        alt="업로드 아이콘"
        class="icon-upload"
      />
    </div>
    <div class="desc-main bodyLight12px">
      계약서 이미지 파일을 모두 업로드해주세요.
    </div>
    <input
      type="file"
      accept="image/*,application/pdf"
      multiple
      class="hidden"
      ref="fileInputRef"
      @change="handleImageChange"
    />

    <BtnMedSlim
      text="계약서 첨부하기"
      @click="$refs.fileInputRef.click()"
      class="btn-upload"
    />
   </div>
</template>

<script setup>
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
  padding: 16px 0;
}

.icon-circle-bg {
  width: 148px;
  height: 148px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  margin: 0 auto 18px auto;
}
.icon-upload {
  width: 92px;
  height: 92px;
  object-fit: contain;
  display: block;
}

.desc-main {
  color: var(--color-darkgray);
  text-align: center;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
}
.hidden {
  display: none;
}

.btn-upload {
  width: 95%;
}
</style>
