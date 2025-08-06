<template>
  <div class="ai-doc-page-root">
    <div class="ai-header">
      <div class="ai-title titleBold20px">
        계약서의 숨은 위험, AI가 찾아드립니다.
      </div>
    </div>
    <div class="main-card">
      <!-- 업로드 전 -->
      <AIFileUpload
        v-if="imagePreviews.length === 0"
        :fileInputRef="fileInputRef"
        @change="handleImageChange"
      />

      <!-- 업로드 후 -->
      <template v-else>
        <div class="uploaded-bar">
          <div class="uploaded-bar-left">
            <span class="bodyMedium14px">
              업로드된 계약서
              <span class="text-blue"> {{ imagePreviews.length }}개</span>
            </span>
          </div>
          <div class="upload-btns">
            <button
              class="btn-sub bodyMedium14px"
              @click="
                additionalFileInputRef.value &&
                  additionalFileInputRef.value.click()
              "
              type="button"
            >
              <Plus :size="16" class="btn-icon" />
              추가
            </button>
            <button
              class="btn-sub-danger bodyMedium14px"
              @click="handleReset"
              type="button"
            >
              전체 삭제
            </button>
          </div>
        </div>

        <!-- 썸네일 -->
        <AIUploadList
          :imagePreviews="imagePreviews"
          @removeImage="removeImage"
        />

        <!-- 버튼 그룹 -->
        <AIButtonGroup
          :isLoading="isLoading"
          :totalCount="imagePreviews.length"
          @analyze="handleAnalyze"
          @reset="handleReset"
        />

        <!-- 결과 -->
        <AIAnalysisResult
          v-if="analysisResults.length > 0"
          :imagePreviews="imagePreviews"
          :analysisResults="analysisResults"
          :isLoading="isLoading"
          @selectSection="selectSection"
        />
      </template>
      <input
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        ref="additionalFileInputRef"
        @change="handleImageChange"
      />

      <div v-if="error" class="error-msg bodyLight12px">{{ error }}</div>
    </div>
    <AIAnalysisDetailModal
      :selectedSection="selectedSection"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';

import AIFileUpload from './components/AIFileUploadButton.vue';
import AIUploadList from './components/AIUploadList.vue';
import AIButtonGroup from './components/AIButtonGroup.vue';
import AIAnalysisResult from './components/AIAnalysisResult.vue';
import AIAnalysisDetailModal from './components/AIAnalysisDetailModal.vue';

import { useOcrAndAnalyze } from './composables/useOcrAndAnalyze';
import { useFileUpload } from './composables/useFileUpload';

const { isImageFile, isPdfFile, pdfToImages, preprocessImage, analyzeImages } =
  useOcrAndAnalyze();
const {
  images,
  imagePreviews,
  error,
  handleImageChange,
  removeImage,
  resetAll,
  fileInputRef,
  additionalFileInputRef,
} = useFileUpload();

const analysisResults = ref([]);
const isLoading = ref(false);
const selectedSection = ref(null);

const handleAnalyze = async () => {
  await analyzeImages(
    images.value,
    imagePreviews.value,
    (errMsg) => {
      error.value = errMsg;
    },
    (results) => {
      analysisResults.value = results;
    },
    (loading) => {
      isLoading.value = loading;
    }
  );
};

const handleReset = () => {
  resetAll(
    fileInputRef,
    additionalFileInputRef,
    analysisResults,
    selectedSection,
    isLoading
  );
};

const selectSection = (result, pageIndex) => {
  if (result.isRisky) {
    selectedSection.value = {
      ...result,
      details: result.text,
      page: pageIndex + 1,
      title: '',
      recommendation: '',
    };
  }
};

const closeModal = () => {
  selectedSection.value = null;
};
</script>

<style scoped>
.ai-header {
  margin: 0 auto 18px auto;
  padding: 34px 18px 0 18px;
}

.ai-title {
  color: var(--color-primary);
  letter-spacing: -0.01em;
  text-align: center;
}

.main-card {
  max-width: 360px;
  width: 100%;
  margin: 0 auto;
  background: #f7f7fa;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid #edeef2;
  margin-bottom: 32px;
}

.uploaded-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eff1f6;
  margin-bottom: 10px;
}

.uploaded-bar-left {
  color: #222;
}

.text-blue {
  color: #2956b6;
}

.upload-btns {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-sub {
  background: #f4f6fa;
  color: #2956b6;
  border: 1px solid #e0e7ef;
  border-radius: 10px;
  padding: 8px 16px 8px 13px;
  display: flex;
  align-items: center;
  height: 38px;
  line-height: 1.2;
  box-shadow: none;
  transition: background 0.16s, border 0.16s;
  cursor: pointer;
}

.btn-sub .btn-icon {
  margin-right: 7px;
}

.btn-sub:hover {
  background: #eaf1ff;
  border-color: #a5c8ff;
}

.btn-sub-danger {
  background: #ffe8e6;
  color: #d32f2f;
  border: 1px solid #ffd2d2;
  border-radius: 10px;
  padding: 8px 17px;
  height: 38px;
  box-shadow: none;
  transition: background 0.14s, border 0.14s;
  cursor: pointer;
}

.btn-sub-danger:hover {
  background: #ffd8d3;
  border-color: #ffb5b5;
}

.hidden {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  pointer-events: none;
  z-index: -1;
}

.error-msg {
  color: #e11d48;
  margin-top: 13px;
  text-align: center;
}
</style>
