<template>
  <div class="ocr-container">
    <div class="ocr-card">
      <div class="ocr-labe bodyMedium18px">계약서 이미지 업로드</div>
      <input
        type="file"
        @change="handleFileChange"
        accept="image/*"
        hidden
        ref="fileInput"
      />
      <BtnMedSlim
        text="이미지 선택"
        class="ocr-upload-btn"
        color="#ffffff"
        @click="openFileDialog"
      />
      <div v-if="ocrLoading" class="ocr-loading">
        <span class="loader"></span>
        <span class="loading-text bodyMedium16px">OCR 처리 중...</span>
      </div>
      <div v-if="ocrText" class="ocr-result">
        <div class="bodyMedium18px">추출된 텍스트</div>
        <pre class="ocr-pre bodyMedium16px">{{ ocrText }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createWorker } from 'tesseract.js';
import BtnMedSlim from '@/components/button/BtnMedSlim.vue';

// OCR 결과 텍스트
const ocrText = ref('');
// OCR 처리 중 여부
const ocrLoading = ref(false);
// input file DOM에 접근하기 위한 ref
const fileInput = ref(null);
const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.value = ''; // 같은 파일 재선택 허용
    fileInput.value.click();
  }
};

/*
이미지 전처리 함수 (흑백 변환 + 리사이즈)
@param {File} file - 업로드된 이미지 파일
@param {number} maxWidth - 리사이즈 최대 가로 크기(px)
@returns {Promise<Blob>} - 전처리된 이미지 Blob
*/
async function preprocessImage(file, maxWidth = 2000) {
  return new Promise((resolve) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        // 원본 이미지가 maxWidth보다 크면 비율 유지해서 리사이즈
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 흑백(그레이스케일) 변환
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          // R,G,B 평균값을 구해서 각각 R,G,B에 할당 (흑백)
          const avg =
            (imageData.data[i] +
              imageData.data[i + 1] +
              imageData.data[i + 2]) /
            3;
          imageData.data[i] =
            imageData.data[i + 1] =
            imageData.data[i + 2] =
              avg;
        }
        ctx.putImageData(imageData, 0, 0);

        // canvas 이미지를 PNG Blob으로 변환해서 반환
        canvas.toBlob(resolve, 'image/png');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file); // File → DataURL 변환 후 로딩
  });
}

// 파일 선택 시 OCR 처리 함수
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  ocrText.value = '';
  ocrLoading.value = true;

  try {
    // 1. 이미지 전처리 (흑백 변환 + 리사이즈)
    const processedBlob = await preprocessImage(file);
    // 2. Tesseract.js 워커 생성 (한국어 전용)
    const worker = await createWorker('kor');
    // 3. OCR 인식 방식 설정 (여러 줄 텍스트 문서)
    await worker.setParameters({
      tessedit_pageseg_mode: 6,
    });
    // 4. 전처리된 이미지로 OCR 수행
    const { data } = await worker.recognize(processedBlob);
    ocrText.value = data.text; // 결과 저장
    // 5. 워커 종료(리소스 해제)
    await worker.terminate();
  } catch (err) {
    ocrText.value = 'OCR 처리 중 오류가 발생했습니다.'; // 오류 메시지
    console.error(err);
  } finally {
    ocrLoading.value = false; // 로딩 해제
  }
};
</script>

<style scoped>
.ocr-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ocr-card {
  padding: 40px 32px 32px 32px;
  min-width: 320px;
  max-width: 600px;
  width: 100%;
}

.ocr-upload-btn {
  margin-top: 10px;
}

.ocr-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  color: #2563eb;
}

.loader {
  width: 18px;
  height: 18px;
  border: 3px solid #e0e7ef;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.ocr-result {
  margin-top: 28px;
}

.ocr-pre {
  white-space: pre-wrap;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 18px;
  margin-top: 12px;
  max-height: 380px;
  overflow: auto;
}
</style>
