<template>
  <div>
    <SimpleHeader title="AI 계약서 분석"></SimpleHeader>
    <div class="ai-doc-page-root">
      <div class="ai-title-row">
      <div class="ai-header titleBold20px">
        계약서에 숨어 있는 위험, <br>
        AI가 찾아드립니다.
      </div>
      <img
        src="@/assets/icons/ai_title.png"
        alt="AI 분석"
        class="ai-title-img"
      />
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

          <button
            class="btn-sub-danger bodyMedium12px"
            @click="handleReset"
            type="button"
          >
            전체 삭제
          </button>
        </div>

        <!-- 썸네일 -->
        <AIUploadList
          :imagePreviews="imagePreviews"
          @removeImage="removeImage"
        />

        <!-- 버튼 그룹 -->
        <div class="btn-group-wrapper">
          <AIButtonGroup
            class="ai-button-group"
            :isLoading="isLoading"
            :totalCount="imagePreviews.length"
            @analyze="handleAnalyze"
            @reset="handleReset"
          />
        </div>

        <!-- 결과 -->
        <AIAnalysisResult
          v-if="analysisResults.length > 0"
          :imagePreviews="imagePreviews"
          :analysisResults="analysisResults"
          :isLoading="isLoading"
          @selectSection="selectSection"
        />
      </template>
      <div v-if="error" class="error-msg bodyLight12px">{{ error }}</div>
    </div>
    <AIAnalysisDetailModal
      :selectedSection="selectedSection"
      :loading="loadingRecommendation"
      @close="closeModal"
    />
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { Plus } from 'lucide-vue-next';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
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
} = useFileUpload();

const analysisResults = ref([]);
const isLoading = ref(false);
const selectedSection = ref(null);
const loadingRecommendation = ref(false);

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
  resetAll(fileInputRef, analysisResults, selectedSection, isLoading);
};

async function fetchTitleAndRecommendation(details) {
  try {
    const res = await axios.post('http://localhost:8080/ai/analysis', {
      details,
    });
    console.log('서버 응답:', res.data);

    // 서버가 이미 객체를 반환하므로 바로 반환
    return res.data;
  } catch (e) {
    console.error('AI 분석 요청 실패:', e);
    return {
      title: '분석 실패',
      recommendation: '권장 조치를 불러올 수 없습니다.',
    };
  }
}

const selectSection = async (result, pageIndex) => {
  if (!result.isRisky) return;

  selectedSection.value = {
    ...result,
    details: result.text,
    page: pageIndex + 1,
    title: '분석 중...',
    recommendation: '잠시만 기다려주세요.',
  };

  loadingRecommendation.value = true;

  const { title, recommendation } = await fetchTitleAndRecommendation(
    result.text
  );

  selectedSection.value.title = title;
  selectedSection.value.recommendation = recommendation;

  loadingRecommendation.value = false;
};

const closeModal = () => {
  selectedSection.value = null;
};
</script>

<style scoped>
.ai-doc-page-root{
  margin: 2rem;
}

.ai-header {
  color: var(--color-primary);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.ai-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-title-img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  flex-shrink: 0;
  padding-right: 6px;
}

.main-card {
  max-width: 359px;
  width: 100%;
  background: rgba(17, 31, 92, 0.05);
  border-radius: 12px;
  padding: 18px;
  margin-top: 24px;
  margin-bottom: 32px;
}

.uploaded-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-mediumgray);
}

.uploaded-bar-left {
  color: var(--color-primary);
}

.text-blue {
  color: var(--color-blue-deep);
}

.btn-sub-danger {
  background: #ffe8e6;
  color: var(--color-error);
  border: 1px solid #ffd2d2;
  border-radius: 10px;
  padding: 8px;
  height: 30px;
  box-shadow: none;
  transition: background 0.1s;
  cursor: pointer;
  line-height: 14px;
  letter-spacing: -0.03em;
}

.btn-sub-danger:hover {
  background: #ffd8d3;
}

.hidden {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  pointer-events: none;
  z-index: -1;
}

.btn-group-wrapper {
  padding-top: 20px;
}

.error-msg {
  color: var(--color-error);
  margin-top: 13px;
  text-align: center;
}
</style>
