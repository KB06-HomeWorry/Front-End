<template>
  <div class="ocr-container">
    <div class="ocr-card">
      <div class="bodyMedium18px">계약서 이미지/PDF 업로드</div>
      <input
        type="file"
        @change="handleFileChange"
        accept="image/*,application/pdf"
        hidden
        ref="fileInput"
      />
      <BtnMedSlim
        text="이미지/PDF 선택"
        class="ocr-upload-btn"
        color="#ffffff"
        @click="openFileDialog"
      />
      <div v-if="ocrLoading" class="ocr-loading">
        <span class="loader"></span>
        <span class="bodyMedium16px">OCR 처리 중...</span>
      </div>
      <div v-if="ocrText" class="ocr-result">
        <div class="bodyMedium18px">추출된 텍스트</div>
        <pre class="ocr-pre bodyMedium16px">{{ ocrText }}</pre>
      </div>
    </div>
  </div>
  <div>
    <div>AI 예측 결과</div>
    <ul>
      <li v-for="(item, index) in predictionResults" :key="index">
        <strong>{{ item.result }}</strong
        >: {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { createWorker } from 'tesseract.js';
import BtnMedSlim from '@/components/button/BtnMedSlim.vue';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

import axios from 'axios';

const ocrText = ref('');
const ocrLoading = ref(false);
const fileInput = ref(null);
const predictionResults = ref([]);

// OCR 워커 재사용 (최초 1회 생성)
let worker = null;
async function getWorker() {
  if (!worker) {
    worker = await createWorker('kor');
    await worker.setParameters({ tessedit_pageseg_mode: 6 });
  }
  return worker;
}
// 컴포넌트 unmount 시 워커 종료
onUnmounted(async () => {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
});

// 파일 선택창 열기
const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
    fileInput.value.click();
  }
};

// 이미지 전처리 함수 (흑백 + 리사이즈)
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

        // 흑백 변환
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
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

// PDF를 각 페이지별 이미지(blob)로 변환
async function pdfToImageBlobs(file) {
  const reader = new FileReader();
  const pdfData = await new Promise((resolve) => {
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.readAsArrayBuffer(file);
  });
  console.log('PDF 데이터 변환 완료');
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  console.log('PDF 페이지 수:', pdf.numPages);
  const blobs = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    // console.log(`페이지 렌더링 시작: ${pageNum}`);
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    // console.log(`canvas to blob 완료: ${pageNum}`);
    blobs.push(blob);
  }
  return blobs;
}

// 파일 선택시 OCR 처리
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  ocrText.value = '';
  ocrLoading.value = true;

  try {
    let blobs = [];
    // PDF 처리
    if (file.type === 'application/pdf') {
      blobs = await pdfToImageBlobs(file);
    } else {
      // 이미지 처리
      const processedBlob = await preprocessImage(file);
      blobs = [processedBlob];
    }

    let text = '';
    const worker = await getWorker();
    for (let i = 0; i < blobs.length; i++) {
      const { data } = await worker.recognize(blobs[i]);
      text += `--- [페이지 ${i + 1}] ---\n${data.text}\n\n`;
    }
    ocrText.value = text.trim();

    // ocr 텍스트 모델로 보내고, 모델 결과값 받아오기
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);
    console.log('백엔드에 보낼 lines:', lines);

    try {
      const response = await axios.post('http://localhost:8000/predict', {
        texts: lines,
      });
      const result = response.data;
      console.log('AI 예측 결과:', result);

      predictionResults.value = result.predictions || [];
    } catch (error) {
      console.error('AI 예측 요청 실패:', error);
    }
  } catch (err) {
    ocrText.value = 'OCR 처리 중 오류가 발생했습니다.';
    console.error(err);
  } finally {
    ocrLoading.value = false;
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
