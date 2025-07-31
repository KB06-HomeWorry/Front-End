<template>
  <div class="flex flex-col">
    <h3 class="text-2xl font-bold text-slate-800 mb-4">분석 결과</h3>

    <!-- 분석 대기 상태 -->
    <div
      v-if="!analysisResults.length && !isLoading"
      class="bg-slate-100 rounded-lg p-12 text-center text-slate-500"
    >
      <FileText :size="48" class="mx-auto mb-4 text-slate-400" />
      <p class="text-lg font-medium">'AI로 분석하기' 버튼을 눌러주세요.</p>
      <p class="text-sm mt-2">계약서의 위험 요소를 검토합니다.</p>
    </div>

    <!-- 로딩 상태 -->
    <div
      v-if="isLoading"
      class="bg-slate-100 rounded-lg p-12 text-center text-slate-600"
    >
      <Loader :size="48" class="mb-4 mx-auto animate-spin text-blue-600" />
      <p class="font-semibold text-lg">
        AI가 {{ imagePreviews.length }}개 계약서를 정밀 분석하고 있습니다.
      </p>
      <p class="text-sm mt-2">잠시만 기다려주세요.</p>
    </div>

    <!-- 분석 결과 표시 -->
    <div v-if="analysisResults.length > 0" class="space-y-6">
      <!-- 전체 요약 -->
      <div
        :class="[
          'p-4 rounded-lg transition-all',
          totalRiskySectionsCount > 0
            ? 'bg-red-100 border border-red-200'
            : 'bg-green-100 border border-green-200',
        ]"
      >
        <div class="flex items-center">
          <AlertCircle
            v-if="totalRiskySectionsCount > 0"
            :size="24"
            class="mr-3 text-red-600 flex-shrink-0"
          />
          <CheckCircle
            v-else
            :size="24"
            class="mr-3 text-green-600 flex-shrink-0"
          />
          <div>
            <h4 class="font-bold text-lg">
              {{
                totalRiskySectionsCount > 0
                  ? `총 ${totalRiskySectionsCount}개의 잠재적 위험 조항이 발견되었습니다.`
                  : "특별한 위험 요소가 발견되지 않았습니다."
              }}
            </h4>
            <p class="text-sm">
              {{
                totalRiskySectionsCount > 0
                  ? "붉게 표시된 구역을 클릭하여 상세 내용을 확인하고, 전문가와 검토해보세요."
                  : "모든 계약서가 일반적인 양식과 일치합니다. 하지만 최종 결정 전 전체 내용을 꼼꼼히 확인하세요."
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- 각 페이지별 분석 결과 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(pageResults, pageIndex) in analysisResults"
          :key="pageIndex"
          class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm"
        >
          <div class="relative">
            <!-- 페이지 이미지 -->
            <div class="relative aspect-[3/4] bg-slate-100">
              <img
                :src="imagePreviews[pageIndex]"
                :alt="`계약서 ${pageIndex + 1}페이지`"
                class="w-full h-full object-contain opacity-40"
              />

              <!-- 위험 구역 오버레이 -->
              <div
                class="absolute top-0 left-0 w-full h-full grid grid-cols-2 grid-rows-3"
              >
                <div
                  v-for="(result, sectionIndex) in pageResults"
                  :key="sectionIndex"
                  @click="handleSectionClick(result)"
                  :class="[
                    'border border-dashed transition-all duration-500',
                    result.isRisky
                      ? 'bg-red-500/40 border-red-600 cursor-pointer hover:bg-red-500/60'
                      : 'bg-green-500/10 border-green-500/0',
                  ]"
                >
                  <div
                    v-if="result.isRisky"
                    class="flex items-center justify-center h-full w-full"
                  >
                    <AlertCircle :size="24" class="text-white animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 페이지 번호 -->
            <div
              class="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium"
            >
              {{ pageIndex + 1 }}페이지
            </div>
          </div>

          <!-- 페이지별 요약 -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-slate-800">
                페이지 {{ pageIndex + 1 }}
              </h4>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  pageRiskCount(pageResults) > 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700',
                ]"
              >
                {{
                  pageRiskCount(pageResults) > 0
                    ? `${pageRiskCount(pageResults)}개 위험`
                    : "안전"
                }}
              </span>
            </div>
            <p class="text-sm text-slate-600">
              {{
                pageRiskCount(pageResults) > 0
                  ? "위험 조항이 발견되었습니다."
                  : "특별한 위험 요소가 발견되지 않았습니다."
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { AlertCircle, CheckCircle, Loader, FileText } from "lucide-vue-next";

export default {
  name: "AiAnalysisResult",
  components: {
    AlertCircle,
    CheckCircle,
    Loader,
    FileText,
  },
  props: {
    imagePreviews: {
      type: Array,
      default: () => [],
    },
    analysisResults: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selectSection"],
  setup(props, { emit }) {
    // 전체 위험 구역 개수 계산
    const totalRiskySectionsCount = computed(() => {
      if (!props.analysisResults.length) return 0;
      return props.analysisResults.reduce((total, pageResults) => {
        return total + pageResults.filter((r) => r.isRisky).length;
      }, 0);
    });

    // 페이지별 위험 구역 개수 계산
    const pageRiskCount = (pageResults) => {
      return pageResults.filter((r) => r.isRisky).length;
    };

    // 섹션 클릭 핸들러
    const handleSectionClick = (result) => {
      emit("selectSection", result);
    };

    return {
      totalRiskySectionsCount,
      pageRiskCount,
      handleSectionClick,
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
</style>
