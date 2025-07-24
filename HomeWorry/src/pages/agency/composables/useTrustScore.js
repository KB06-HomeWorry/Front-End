/**
 * @file useTrustScore.js
 * @description 중개사무소 후기 기반의 신뢰지수 계산 로직을 담당하는 Vue Composable.
 * UI 로직과 비즈니스 로직(점수 계산)을 분리하여 코드의 재사용성과 유지보수성을 높입니다.
 * * [계산 프로세스]
 * 1. 사용자의 답변을 각 핵심 지표(매물 신뢰도, 비용 투명성 등)의 점수로 변환합니다.
 * 2. 각 지표별 점수에 중요도 가중치를 곱하여 가중 합산 점수(Raw Score)를 구합니다.
 * 3. 이 점수를 0~100점 척도로 정규화(Normalization)하여 최종 신뢰지수를 산출합니다.
 */
export function useTrustScore() {
  
  /**
   * @constant {object} logic
   * @description 신뢰지수 계산에 필요한 모든 규칙과 데이터를 정의한 설정 객체
   */
  const logic = {
    /**
     * @property {Array} questionMapping - 각 질문(ID)이 어떤 핵심 지표에 해당하는지를 매핑합니다.
     * 배열의 순서는 실제 질문 순서와 일치해야 합니다.
     */
    questionMapping: [
      { code: 'Q1_ATTITUDE',   metric: 'professionalism_score' },   // 1번 질문 -> 전문성/태도
      { code: 'Q2_ACCURACY',   metric: 'listing_accuracy_score' },  // 2번 질문 -> 매물 신뢰도
      { code: 'Q3_SUGGESTION', metric: 'professionalism_score' },   // 3번 질문 -> 전문성/태도
      { code: 'Q4_PRESSURE',   metric: 'professionalism_score' },   // 4번 질문 -> 전문성/태도
      { code: 'Q5_FEE_INFO',   metric: 'cost_transparency_score' }, // 5번 질문 -> 비용 투명성
      { code: 'Q6_CONTRACT',   metric: 'accountability_score' },    // 6번 질문 -> 책임감
      { code: 'Q7_ISSUE',      metric: 'accountability_score' },    // 7번 질문 -> 책임감
    ],

    /**
     * @property {object} scores - 각 질문의 답변(긍정/보통/부정)에 부여되는 원시 점수입니다.
     * 배열의 인덱스는 [0: 긍정, 1: 보통, 2: 부정] 순서에 해당합니다.
     */
    scores: {
      Q1_ATTITUDE:   [+1, 0, -1], // 태도
      Q2_ACCURACY:   [+3, -3, -5], // 매물 정확성 (보통 답변이 부정적 점수)
      Q3_SUGGESTION: [+1, 0, -2], // 추가 제안
      Q4_PRESSURE:   [+1, -2, -4], // 계약 압박
      Q5_FEE_INFO:   [+3, 0, -5], // 비용 안내
      Q6_CONTRACT:   [+3, 0, -5], // 계약 조율 (계약 고객 전용)
      Q7_ISSUE:      [+2, 0, -5], // 문제 여부 (계약 고객 전용, '보통' 답변 없음 -> 0점으로 처리)
    },

    /**
     * @property {object} weights - 4대 핵심 지표별 중요도 가중치입니다. 총합은 1 (100%)이 됩니다.
     * 이 가중치는 최종 신뢰지수에서 각 지표가 차지하는 영향력을 결정합니다.
     */
    weights: {
      listing_accuracy_score: 0.4,  // 40%
      cost_transparency_score: 0.3, // 30%
      accountability_score: 0.2,    // 20%
      professionalism_score: 0.1,   // 10%
    },

    /**
     * @property {object} scoreRanges - 각 지표별로 획득 가능한 이론적인 최소/최대 점수 범위입니다.
     * 이 값은 최종 점수를 0-100점으로 정규화(Normalization)하는 데 사용됩니다.
     * 계산법: 해당 지표에 속한 모든 질문에 대해 (최선 답변 점수의 합)과 (최악 답변 점수의 합)을 계산.
     */
    scoreRanges: {
      // Q2 질문 하나만 해당. min: -5, max: +3
      listing_accuracy_score: { min: -5, max: 3 },
      // Q5 질문 하나만 해당. min: -5, max: +3
      cost_transparency_score: { min: -5, max: 3 },
      // Q1, Q3, Q4 질문 합산. min: (-1 + -2 + -4) = -7, max: (+1 + +1 + +1) = 3
      professionalism_score: { min: -7, max: 3 },
      // Q6, Q7 질문 합산. min: (-5 + -5) = -10, max: (+3 + +2) = 5
      accountability_score: { min: -10, max: 5 },
    }
  };

  /**
   * 사용자의 답변을 기반으로 최종 신뢰지수를 계산하는 메인 함수
   * @param {number[]} userAnswers - 사용자가 선택한 답변의 인덱스 배열 (e.g., [0, 1, 2, ...])
   * @param {'consultation' | 'transaction'} type - 후기 종류 ('상담만' 또는 '계약까지')
   * @param {string} comment - 사용자가 작성한 서술형 후기
   * @returns {{
   * reviewType: string,
   * metricScores: object,
   * rawScore: number,
   * finalTrustScore: number,
   * userAnswers: number[],
   * comment: string
   * }} 계산 결과가 담긴 객체
   */
  const calculate = (userAnswers, type, comment) => {
    // 1. 후기 1건의 '지표별 점수' 계산 (Metric Score Calculation)
    // 각 지표(professionalism, listing_accuracy 등)의 점수를 0으로 초기화합니다.
    const metricScores = {
      professionalism_score: 0,
      listing_accuracy_score: 0,
      cost_transparency_score: 0,
      accountability_score: 0,
    };

    // 후기 종류에 따라 답변 개수가 달라집니다 (상담: 5개, 계약: 7개)
    const questionCount = type === 'transaction' ? 7 : 5;

    // 각 질문에 대한 답변 점수를 해당하는 지표에 누적합니다.
    for (let i = 0; i < questionCount; i++) {
      const mapping = logic.questionMapping[i];    // 질문 코드와 지표 정보 가져오기
      const questionCode = mapping.code;           // e.g., 'Q1_ATTITUDE'
      const metric = mapping.metric;               // e.g., 'professionalism_score'
      const answerIndex = userAnswers[i];          // 사용자의 답변 인덱스 (0, 1, or 2)
      const score = logic.scores[questionCode][answerIndex]; // 답변에 해당하는 점수
      metricScores[metric] += score;               // 해당 지표 점수에 누적
    }

    // 2. '가중치 적용 합산 점수' 계산 (Weighted Raw Score)
    // 각 지표 점수에 중요도 가중치를 곱하여 모두 더합니다.
    let rawScore = 0;
    for (const metric in logic.weights) {
      // '상담만' 후기인 경우, '책임감(accountability)' 지표는 계약과 관련된 것이므로 계산에서 제외합니다.
      if (type === 'consultation' && metric === 'accountability_score') continue;
      
      const weight = logic.weights[metric]; // 해당 지표의 가중치 (e.g., 0.4)
      rawScore += metricScores[metric] * weight;
    }
    
    // 3. 0-100점 변환을 위한 '이론적인 최소/최대 점수 범위' 계산
    // 현재 후기 타입에서 나올 수 있는 가중 합산 점수의 이론적인 최소값과 최대값을 구합니다.
    let minRawScore = 0;
    let maxRawScore = 0;
    for (const metric in logic.weights) {
      // 역시 '상담만' 후기에서는 '책임감' 지표를 제외합니다.
      if (type === 'consultation' && metric === 'accountability_score') continue;
      
      const weight = logic.weights[metric];
      const range = logic.scoreRanges[metric]; // 해당 지표의 최소/최대 점수 범위
      minRawScore += range.min * weight; // 최소 점수에 가중치를 곱해 누적
      maxRawScore += range.max * weight; // 최대 점수에 가중치를 곱해 누적
    }
    
    // 4. 최종 점수 '정규화' (Normalization)
    // 계산 공식: (현재값 - 최소값) / (최대값 - 최소값) * 100
    // 이 공식을 통해 어떤 범위의 점수든 0~100 사이의 값으로 변환할 수 있습니다.
    const normalizedScore = ((rawScore - minRawScore) / (maxRawScore - minRawScore)) * 100;
    
    // 5. 최종 점수 0~100 사이로 '보정' (Clamping)
    // 아주 드문 경우(e.g., minRawScore와 maxRawScore가 같을 때)에 0 미만 또는 100 초과 값이 나올 수 있으므로,
    // Math.max와 Math.min을 사용해 결과를 항상 0과 100 사이로 강제합니다.
    const finalTrustScore = Math.max(0, Math.min(100, Math.round(normalizedScore)));

    // 최종적으로 계산된 모든 정보를 객체로 묶어 반환합니다.
    return {
      reviewType: type,          // 후기 종류
      metricScores,              // 4대 지표별 점수
      rawScore,                  // 가중치만 적용된 원시 점수
      finalTrustScore,           // 0-100으로 정규화된 최종 신뢰지수
      userAnswers,               // 사용자가 선택한 답변 원본
      comment                    // 서술형 후기
    };
  };
  
  // 외부에서 `calculate` 함수를 `calculateTrustScore` 라는 이름으로 사용할 수 있도록 반환합니다.
  return {
    calculateTrustScore: calculate
  };
}