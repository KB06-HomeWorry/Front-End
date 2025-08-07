import { ref } from 'vue';
import { useOcrAndAnalyze } from './useOcrAndAnalyze';

export function useFileUpload() {
  const { isImageFile, isPdfFile, pdfToImages } = useOcrAndAnalyze();
  const images = ref([]);
  const imagePreviews = ref([]);
  const error = ref('');
  const fileInputRef = ref(null);

  // 파일 업로드 및 미리보기 처리
  async function handleImageChange(e) {
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
    if (hasPdf) error.value = '';

    for (const img of imageFiles) {
      images.value.push(img.file);
      imagePreviews.value.push(img.url);
    }

    e.target.value = '';
  }

  function removeImage(index) {
    if (imagePreviews.value[index]) {
      URL.revokeObjectURL(imagePreviews.value[index]);
    }
    images.value.splice(index, 1);
    imagePreviews.value.splice(index, 1);
    error.value = '';
  }

  function resetAll(fileInputRef, analysisResults, selectedSection, isLoading) {
    imagePreviews.value.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    images.value = [];
    imagePreviews.value = [];
    if (analysisResults) analysisResults.value = [];
    if (isLoading) isLoading.value = false;
    error.value = '';
    if (selectedSection) selectedSection.value = null;
    if (fileInputRef && fileInputRef.value) fileInputRef.value.value = '';
  }

  return {
    images,
    imagePreviews,
    error,
    handleImageChange,
    removeImage,
    resetAll,
    fileInputRef,
  };
}
