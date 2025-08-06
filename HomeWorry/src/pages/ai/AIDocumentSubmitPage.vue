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
              @click="additionalFileInputRef.value.click()"
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
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              ref="additionalFileInputRef"
              @change="handleImageChange"
            />
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
import { getMockResults } from './mock/analysisMock.js';
import AIFileUpload from './components/AIFileUploadButton.vue';
import AIUploadList from './components/AIUploadList.vue';
import AIButtonGroup from './components/AIButtonGroup.vue';
import AIAnalysisResult from './components/AIAnalysisResult.vue';
import AIAnalysisDetailModal from './components/AIAnalysisDetailModal.vue';

const images = ref([]);
const imagePreviews = ref([]);
const analysisResults = ref([]);
const isLoading = ref(false);
const error = ref('');
const fileInputRef = ref(null);
const additionalFileInputRef = ref(null);
const selectedSection = ref(null);

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function isImageFile(file) {
  return file.type.startsWith('image/');
}

function isPdfFile(file) {
  return file.type === 'application/pdf';
}

async function pdfToImages(file) {
  const images = [];
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() })
    .promise;
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    images.push({
      file: new File([blob], `${file.name}_page${pageNum}.png`, {
        type: 'image/png',
      }),
      url: URL.createObjectURL(blob),
    });
  }
  return images;
}

const handleImageChange = async (e) => {
  const files = Array.from(e.target.files || []);
  const imageFiles = [];
  let hasPdf = false;
  for (const file of files) {
    if (isImageFile(file)) {
      imageFiles.push({ file, url: URL.createObjectURL(file) });
    } else if (isPdfFile(file)) {
      hasPdf = true;
      try {
        const pdfImages = await pdfToImages(file);
        imageFiles.push(...pdfImages);
      } catch {
        error.value = 'PDF 파일 처리 중 오류가 발생했습니다.';
        continue;
      }
    }
  }

  if (imageFiles.length === 0) {
    error.value = '이미지 파일(jpg, png 등) 또는 PDF를 선택해주세요.';
    return;
  }
  if (hasPdf) {
    error.value = '';
  }

  for (const img of imageFiles) {
    images.value.push(img.file);
    imagePreviews.value.push(img.url);
  }
  analysisResults.value = [];
  e.target.value = '';
};

const removeImage = (index) => {
  if (imagePreviews.value[index]) {
    URL.revokeObjectURL(imagePreviews.value[index]);
  }
  images.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
  if (analysisResults.value.length > index) {
    analysisResults.value.splice(index, 1);
  }
  error.value = '';
};

const handleAnalyze = async () => {
  if (images.value.length === 0) {
    error.value = '먼저 분석할 계약서 이미지 파일을 업로드해주세요.';
    return;
  }
  isLoading.value = true;
  analysisResults.value = [];
  error.value = '';
  await new Promise((resolve) =>
    setTimeout(resolve, 2500 + images.value.length * 1000)
  );
  const allResults = [];
  for (let i = 0; i < images.value.length; i++) {
    allResults.push(getMockResults(i));
  }
  analysisResults.value = allResults;
  analysisResults.value = allResults;
  isLoading.value = false;
};

const handleReset = () => {
  imagePreviews.value.forEach((url) => {
    if (url) URL.revokeObjectURL(url);
  });
  images.value = [];
  imagePreviews.value = [];
  analysisResults.value = [];
  isLoading.value = false;
  error.value = '';
  selectedSection.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
  if (additionalFileInputRef.value) additionalFileInputRef.value.value = '';
};

const selectSection = (result) => {
  if (result.isRisky) selectedSection.value = result;
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
  display: none;
}

.error-msg {
  color: #e11d48;
  margin-top: 13px;
  text-align: center;
}
</style>
