<template>
  <div class="flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-5xl mx-auto">
      <!-- 헤더 -->
      <header class="text-center mb-8">
        <p class="text-lg text-slate-600">
          계약서의 숨은 위험, AI가 찾아드립니다.
        </p>
      </header>

      <main
        class="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200"
      >
        <!-- 이미지 업로드 섹션 -->
        <div
          v-if="imagePreviews.length === 0"
          class="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 text-center transition-all hover:border-blue-500 hover:bg-slate-100/50"
        >
          <FileText :size="64" class="text-slate-400 mb-4" />

          <p class="text-slate-500 mb-6">
            스캔하거나 촬영한 계약서 이미지 파일을 선택하세요. <br></br>(여러 파일 선택
            가능)
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleImageChange"
            class="hidden"
            ref="fileInputRef"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleImageChange"
            class="hidden"
            ref="additionalFileInputRef"
          />

          <BtnSm text="점검 다시하기" @click="checklistAgain()" />
          <button
            @click="$refs.fileInputRef.click()"
            class="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center"
          >
            <Upload :size="20" class="mr-2" />
            첨부 파일
          </button>
          
        </div>

        <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>

        <!-- 분석 및 결과 표시 섹션 -->
        <div v-if="imagePreviews.length > 0" class="space-y-8">
          <!-- 업로드된 이미지들 표시 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-slate-800">
                업로드된 계약서 ({{ imagePreviews.length }}개)
              </h3>
              <div class="flex space-x-2">
                <button
                  @click="$refs.additionalFileInputRef.click()"
                  class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus :size="16" class="mr-1" />
                  추가
                </button>
                <button
                  @click="handleReset"
                  class="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  전체 삭제
                </button>
              </div>
            </div>

            <!-- 이미지 그리드 -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="(preview, index) in imagePreviews"
                :key="index"
                class="relative group"
              >
                <div
                  class="aspect-[3/4] rounded-lg overflow-hidden border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    :src="preview"
                    :alt="`계약서 ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
                <button
                  @click="removeImage(index)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X :size="16" />
                </button>
                <p class="text-center text-xs text-slate-500 mt-1">
                  {{ index + 1 }}페이지
                </p>
              </div>
            </div>
          </div>

          <!-- 분석 버튼 -->
          <div class="flex justify-center">
            <button
              @click="handleAnalyze"
              :disabled="isLoading"
              class="bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed text-lg"
            >
              <template v-if="isLoading">
                <Loader :size="24" class="mr-3 animate-spin" />
                분석 중... ({{ imagePreviews.length }}개 파일)
              </template>
              <template v-else>
                <FileText :size="24" class="mr-3" />
                AI로 {{ imagePreviews.length }}개 계약서 분석하기
              </template>
            </button>
          </div>

          <!-- 분석 결과 -->
          <AiAnalysisResult
            :imagePreviews="imagePreviews"
            :analysisResults="analysisResults"
            :isLoading="isLoading"
            @selectSection="selectSection"
          />
        </div>
      </main>
    </div>

    <!-- 상세 분석 결과 모달 -->
    <transition name="fade">
      <div
        v-if="selectedSection"
        @click="closeModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      >
        <div
          @click.stop
          class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center">
              <AlertCircle :size="28" class="text-red-500 mr-3" />
              <div>
                <h3 class="text-2xl font-bold text-slate-800">
                  {{ selectedSection.title }}
                </h3>
                <p v-if="selectedSection.page" class="text-sm text-slate-500">
                  {{ selectedSection.page }}페이지
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="text-slate-400 hover:text-slate-600"
            >
              <X :size="24" />
            </button>
          </div>
          <div class="space-y-4 text-slate-600">
            <div>
              <h4 class="font-semibold text-slate-800 mb-1">⚠️ 문제 조항</h4>
              <p class="bg-slate-100 p-3 rounded-md">
                {{ selectedSection.details }}
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-slate-800 mb-1">💡 AI 권장 조치</h4>
              <p
                class="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md"
              >
                {{ selectedSection.recommendation }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import {
  Upload,
  AlertCircle,
  Loader,
  FileText,
  X,
  Plus,
} from "lucide-vue-next";
import BtnSm from "../../components/button/BtnSm.vue";
import AiAnalysisResult from "./aiAnalysisResult.vue";
export default {
  name: "AiDocumentSubmitPage",
  components: {
    Upload,
    AlertCircle,
    Loader,
    FileText,
    X,
    Plus,
    AiAnalysisResult,
  },
  setup() {
    // 상태 관리
    const images = ref([]);
    const imagePreviews = ref([]);
    const analysisResults = ref([]);
    const isLoading = ref(false);
    const error = ref("");
    const fileInputRef = ref(null);
    const additionalFileInputRef = ref(null);
    const selectedSection = ref(null);

    // 메서드
    const handleImageChange = (e) => {
      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        error.value = "이미지 파일(jpg, png 등)을 선택해주세요.";
        return;
      }

      if (imageFiles.length !== files.length) {
        error.value = "이미지 파일이 아닌 파일은 제외되었습니다.";
      } else {
        error.value = "";
      }

      // 기존 이미지에 새 이미지들 추가
      imageFiles.forEach((file) => {
        images.value.push(file);
        imagePreviews.value.push(URL.createObjectURL(file));
      });

      analysisResults.value = [];

      // 파일 input 초기화 (같은 파일을 다시 선택할 수 있도록)
      e.target.value = "";
    };

    const removeImage = (index) => {
      // 메모리 누수 방지를 위해 URL 해제
      if (imagePreviews.value[index]) {
        URL.revokeObjectURL(imagePreviews.value[index]);
      }

      images.value.splice(index, 1);
      imagePreviews.value.splice(index, 1);

      // 분석 결과도 함께 제거
      if (analysisResults.value.length > index) {
        analysisResults.value.splice(index, 1);
      }

      error.value = "";
    };

    const handleAnalyze = async () => {
      if (images.value.length === 0) {
        error.value = "먼저 분석할 계약서 이미지 파일을 업로드해주세요.";
        return;
      }
      isLoading.value = true;
      analysisResults.value = [];
      error.value = "";

      // AI 분석 시뮬레이션 (각 이미지별로 분석)
      await new Promise((resolve) =>
        setTimeout(resolve, 2500 + images.value.length * 1000)
      );

      // 각 이미지에 대한 목업 데이터 생성
      const allResults = [];
      for (let i = 0; i < images.value.length; i++) {
        const mockResults = [
          {
            isRisky: Math.random() > 0.5,
            title: "특약 사항 누락",
            details: `"계약 만료 시 임차인은 원상복구 의무를 진다." 라는 조항 외 구체적인 범위 명시 없음.`,
            recommendation: `원상복구의 구체적인 범위(예: 못 자국, 벽지 등)를 특약에 명시하여 분쟁의 소지를 줄이세요.`,
            page: i + 1,
          },
          {
            isRisky: false,
            title: "임대차 기간",
            details: "정상",
            recommendation: "정상",
            page: i + 1,
          },
          {
            isRisky: Math.random() > 0.5,
            title: "보증금 반환 조건",
            details: `"새로운 임차인이 구해지는 경우 보증금을 반환한다."는 독소 조항 포함.`,
            recommendation: `해당 조항은 임차인에게 매우 불리합니다. '계약 만료일 익일까지' 보증금을 반환한다는 내용으로 수정을 강력히 요구하세요.`,
            page: i + 1,
          },
          {
            isRisky: false,
            title: "임대인 정보",
            details: "정상",
            recommendation: "정상",
            page: i + 1,
          },
          {
            isRisky: Math.random() > 0.5,
            title: "수선유지 의무 불명확",
            details: `"주요 설비의 노후 및 불량으로 인한 수선은 임대인이 부담한다."고만 명시되어 '주요 설비'의 범위가 모호함.`,
            recommendation: `보일러, 수도, 전기 등 주요 설비의 종류를 구체적으로 명시하고, 임차인의 고의/과실이 아닌 경우 임대인이 수리 책임을 지도록 명확히 하세요.`,
            page: i + 1,
          },
          {
            isRisky: false,
            title: "계약 해지 조건",
            details: "정상",
            recommendation: "정상",
            page: i + 1,
          },
        ];
        allResults.push(mockResults);
      }
      analysisResults.value = allResults;
      isLoading.value = false;
    };

    const handleReset = () => {
      // 메모리 누수 방지를 위해 모든 URL 해제
      imagePreviews.value.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });

      images.value = [];
      imagePreviews.value = [];
      analysisResults.value = [];
      isLoading.value = false;
      error.value = "";
      selectedSection.value = null;

      // 모든 파일 input 초기화
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
      if (additionalFileInputRef.value) {
        additionalFileInputRef.value.value = "";
      }
    };

    // 위험 구역 클릭 시 상세 정보 모달 열기
    const selectSection = (result) => {
      if (result.isRisky) {
        selectedSection.value = result;
      }
    };

    // 모달 닫기
    const closeModal = () => {
      selectedSection.value = null;
    };

    // 계산된 속성
    const totalRiskySectionsCount = computed(() => {
      if (!analysisResults.value.length) return 0;
      return analysisResults.value.reduce((total, pageResults) => {
        return total + pageResults.filter((r) => r.isRisky).length;
      }, 0);
    });

    return {
      imagePreviews,
      analysisResults,
      isLoading,
      error,
      fileInputRef,
      additionalFileInputRef,
      selectedSection,
      totalRiskySectionsCount,
      handleImageChange,
      handleAnalyze,
      handleReset,
      removeImage,
      selectSection,
      closeModal,
    };
  },
};
</script>

<style scoped>
/* 로딩 스피너 애니메이션 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 모달 페이드인/아웃 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
