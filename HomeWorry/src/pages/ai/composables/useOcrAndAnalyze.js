import { ref } from 'vue';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import axios from 'axios';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export function useOcrAndAnalyze() {
  let ocrWorker = null;

  async function getOcrWorker() {
    if (!ocrWorker) {
      ocrWorker = await createWorker('kor');
      await ocrWorker.setParameters({ tessedit_pageseg_mode: 6 });
    }
    return ocrWorker;
  }

  function isImageFile(file) {
    return file.type.startsWith('image/');
  }
  function isPdfFile(file) {
    return file.type === 'application/pdf';
  }

  async function pdfToImages(file) {
    const result = [];
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
      result.push({
        file: new File([blob], `${file.name}_page${pageNum}.png`, {
          type: 'image/png',
        }),
        url: URL.createObjectURL(blob),
      });
    }
    return result;
  }

  async function preprocessImage(file, maxWidth = 2000) {
    return new Promise((resolve) => {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // 흑백
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
          canvas.toBlob(resolve, 'image/png');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function analyzeImages(
    images,
    imagePreviews,
    setError,
    setAnalysisResults,
    setIsLoading
  ) {
    if (images.length === 0) {
      setError('먼저 분석할 계약서 이미지 또는 PDF 파일을 업로드해주세요.');
      return;
    }
    setIsLoading(true);
    setAnalysisResults([]);
    setError('');

    let allTextLines = [];
    try {
      const worker = await getOcrWorker();

      for (const file of images) {
        let blobs = [];
        if (isPdfFile(file)) {
          // images 배열에는 PNG만 있으므로 거의 실행 안됨
        } else {
          const processedBlob = await preprocessImage(file);
          blobs = [processedBlob];
        }
        for (let i = 0; i < blobs.length; i++) {
          const { data } = await worker.recognize(blobs[i]);
          const pageLines = data.text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line);
          allTextLines = allTextLines.concat(pageLines);
        }
      }

      // 텍스트 범위 추출
      const startIndex = allTextLines.findIndex((line) =>
        line.includes('특약사항')
      );
      const endIndex = allTextLines.findIndex((line) =>
        line.startsWith('본 계약을 증명하기 위하여')
      );
      let filteredLines;
      if (startIndex >= 0) {
        filteredLines =
          endIndex > startIndex
            ? allTextLines.slice(startIndex + 1, endIndex)
            : allTextLines.slice(startIndex + 1);
      } else {
        filteredLines =
          endIndex >= 0 ? allTextLines.slice(0, endIndex) : allTextLines;
      }

      const response = await axios.post('http://localhost:8000/predict', {
        texts: filteredLines,
      });
      const result = response.data;

      function cleanText(raw) {
        let result = raw.replace(/(\d+)(?!(년|개월|일))/g, '');
        result = result.replace(/[^\uAC00-\uD7A30-9년개월일\s]/g, '');
        result = result.replace(/\s+/g, ' ').trim();
        return result;
      }

      const convertedResults = (result.predictions || []).map((item) => ({
        ...item,
        text: cleanText(item.text),
        isRisky: item.result === '사기',
      }));

      const pageCount = imagePreviews.length;
      const perPage = Math.ceil(convertedResults.length / pageCount);

      const pageResults = [];
      for (let i = 0; i < pageCount; i++) {
        const start = i * perPage;
        const end = start + perPage;
        pageResults.push(convertedResults.slice(start, end));
      }
      setAnalysisResults(pageResults);
    } catch (err) {
      console.error(err);
      setError('AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isImageFile,
    isPdfFile,
    pdfToImages,
    preprocessImage,
    analyzeImages,
  };
}
