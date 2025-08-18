/**
 * @file useTrustScore.js
 * @description 후기 기반 신뢰지수 계산 로직을 담은 Vue Composable
 */
export function useTrustScore() {
  const logic = {
    /**
     * 각 질문이 어떤 지표에 반영되는지 매핑
     * 배열 순서는 실제 질문 순서와 일치
     */
    questionMapping: [
      { code: 'Q1_ATTITUDE',   metric: 'professionalismScore' },   // 전문성/태도
      { code: 'Q2_ACCURACY',   metric: 'listingAccuracyScore' },   // 매물 신뢰도
      { code: 'Q3_SUGGESTION', metric: 'professionalismScore' },   // 전문성/태도
      { code: 'Q4_PRESSURE',   metric: 'professionalismScore' },   // 전문성/태도
      { code: 'Q5_FEE_INFO',   metric: 'costTransparencyScore' },  // 비용 투명성
      { code: 'Q6_CONTRACT',   metric: 'accountabilityScore' },    // 책임감
      { code: 'Q7_ISSUE',      metric: 'accountabilityScore' }     // 책임감
    ],

    /**
     * 질문별 답변 점수 [0: 긍정, 1: 보통, 2: 부정]
     */
    scores: {
      Q1_ATTITUDE:   [ +1,  0, -1 ],
      Q2_ACCURACY:   [ +3, -3, -5 ],
      Q3_SUGGESTION: [ +1,  0, -2 ],
      Q4_PRESSURE:   [ +1, -2, -4 ],
      Q5_FEE_INFO:   [ +3,  0, -5 ],
      Q6_CONTRACT:   [ +3,  0, -5 ],
      Q7_ISSUE:      [ +2,  0, -5 ]
    },

    /**
     * 지표별 중요도 가중치(합계 1)
     */
    weights: {
      listingAccuracyScore: 0.4,
      costTransparencyScore: 0.3,
      accountabilityScore: 0.2,
      professionalismScore: 0.1
    },

    /**
     * 지표별 이론적 최소/최대 점수 범위
     * 정규화(0~100) 계산에 사용.
     */
    scoreRanges: {
      listingAccuracyScore: { min: -5,  max:  3 }, // Q2
      costTransparencyScore: { min: -5,  max:  3 }, // Q5
      professionalismScore:   { min: -7,  max:  3 }, // Q1+Q3+Q4
      accountabilityScore:    { min: -10, max:  5 }  // Q6+Q7
    }
  };

  /**
   * 사용자 답변으로 신뢰지수 계산
   * @param {number[]} userAnswers - 답변 인덱스 배열
   * @param {'consultation'|'transaction'} type - 후기 종류
   * @param {string} comment - 서술형 후기
   * @param {string|number} officeId 
   * @param {string} userToken 
   * @returns {{
   *   reviewType: string,
   *   professionalismScore: number,
   *   listingAccuracyScore: number,
   *   costTransparencyScore: number,
   *   accountabilityScore: number,
   *   rawScore: number,
   *   finalTrustScore: number,
   *   userAnswers: number[],
   *   comment: string,
   *   officeId: string|number,
   *   userToken: string
   * }}
   */
  const calculate = (userAnswers, type, comment, officeId, userToken) => {
    const metricScores = {
      professionalismScore: 0,
      listingAccuracyScore: 0,
      costTransparencyScore: 0,
      accountabilityScore: 0
    };

    // 상담 5문항, 계약 7문항
    const questionCount = type === 'transaction' ? 7 : 5;

    for (let i = 0; i < questionCount; i++) {
      const mapping = logic.questionMapping[i];
      const questionCode = mapping.code;
      const metric = mapping.metric;
      const answerIndex = userAnswers[i];
      const score = logic.scores[questionCode][answerIndex];
      metricScores[metric] += score;
    }

    // 가중 합산 점수
    let rawScore = 0;
    for (const metric in logic.weights) {
      if (type === 'consultation' && metric === 'accountabilityScore') continue;
      const weight = logic.weights[metric];
      rawScore += metricScores[metric] * weight;
    }

    // 정규화용 최소/최대
    let minRawScore = 0;
    let maxRawScore = 0;
    for (const metric in logic.weights) {
      if (type === 'consultation' && metric === 'accountabilityScore') continue;
      const weight = logic.weights[metric];
      const range = logic.scoreRanges[metric];
      minRawScore += range.min * weight;
      maxRawScore += range.max * weight;
    }

    // 0~100 정규화 및 클램프
    const normalizedScore = ((rawScore - minRawScore) / (maxRawScore - minRawScore)) * 100;
    const finalTrustScore = Math.max(0, Math.min(100, Math.round(normalizedScore)));

    return {
      reviewType: type,
      ...metricScores,
      rawScore,
      finalTrustScore,
      userAnswers,
      comment,
      officeId,
      userToken
    };
  };

  return {
    calculateTrustScore: calculate
  };
}
