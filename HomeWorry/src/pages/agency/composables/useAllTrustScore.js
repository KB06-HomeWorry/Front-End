/**
 * @file useAllTrustScore.js
 * @description 신뢰지수 계산 관련 모든 로직을 포함하는 Composable.
 * 개별 후기 점수 계산과 여러 후기를 종합하는 기능을 모두 제공합니다.
 */

// --- 내부 설정 (두 함수가 공유) ---
const logic = {
  questionMapping: [
    { code: 'Q1_ATTITUDE',   metric: 'professionalism_score' },
    { code: 'Q2_ACCURACY',   metric: 'listing_accuracy_score' },
    { code: 'Q3_SUGGESTION', metric: 'professionalism_score' },
    { code: 'Q4_PRESSURE',   metric: 'professionalism_score' },
    { code: 'Q5_FEE_INFO',   metric: 'cost_transparency_score' },
    { code: 'Q6_CONTRACT',   metric: 'accountability_score' },
    { code: 'Q7_ISSUE',      metric: 'accountability_score' },
  ],
  scores: {
    Q1_ATTITUDE:   [+1, 0, -1],
    Q2_ACCURACY:   [+3, -3, -5],
    Q3_SUGGESTION: [+1, 0, -2],
    Q4_PRESSURE:   [+1, -2, -4],
    Q5_FEE_INFO:   [+3, 0, -5],
    Q6_CONTRACT:   [+3, 0, -5],
    Q7_ISSUE:      [+2, 0, -5],
  },
  weights: {
    listing_accuracy_score: 0.4,
    cost_transparency_score: 0.3,
    accountability_score: 0.2,
    professionalism_score: 0.1,
  },
  scoreRanges: {
    listing_accuracy_score: { min: -5, max: 3 },
    cost_transparency_score: { min: -5, max: 3 },
    professionalism_score: { min: -7, max: 3 },
    accountability_score: { min: -10, max: 5 },
  },
};

/**
 * ⚙️ **개별 후기 1건**의 신뢰지수를 계산합니다.
 * @param {object} review - 단일 후기 객체. { answers, reviewType, comment } 포함.
 * @returns {object} 개별 후기에 대한 계산 결과가 담긴 객체
 */
export function calculateSingleReviewScore(review) {
  // ✅ [수정된 부분] review 객체에서 'answers' 키를 찾아 'userAnswers' 변수에 할당합니다.
  // 'answers'가 없으면 에러 방지를 위해 빈 배열 '[]'을 기본값으로 사용합니다.
  const { answers: userAnswers = [], reviewType, comment } = review;

  const metricScores = {
    professionalism_score: 0,
    listing_accuracy_score: 0,
    cost_transparency_score: 0,
    accountability_score: 0,
  };

  const questionCount = userAnswers.length;

  for (let i = 0; i < questionCount; i++) {
    const mapping = logic.questionMapping[i];
    const questionCode = mapping.code;
    const metric = mapping.metric;
    const answerIndex = userAnswers[i];
    const score = logic.scores[questionCode][answerIndex];
    metricScores[metric] += score;
  }

  let rawScore = 0;
  let minRawScore = 0;
  let maxRawScore = 0;

  for (const metric in logic.weights) {
    if (reviewType === 'consultation' && metric === 'accountability_score') continue;
    
    const weight = logic.weights[metric];
    const range = logic.scoreRanges[metric];
    
    rawScore += metricScores[metric] * weight;
    minRawScore += range.min * weight;
    maxRawScore += range.max * weight;
  }

  const normalizedScore = (maxRawScore - minRawScore) !== 0
    ? ((rawScore - minRawScore) / (maxRawScore - minRawScore)) * 100
    : 0;
  const finalTrustScore = Math.max(0, Math.min(100, Math.round(normalizedScore)));

  return { reviewType, metricScores, rawScore, finalTrustScore, userAnswers, comment };
}


/**
 * 👨‍💼 **여러 후기를 종합**하여 중개사무소의 최종 신뢰지수를 계산합니다.
 * @param {Array<object>} reviews - 후기 배열. 각 후기는 { answers, reviewType, createdAt } 포함.
 * @returns {object} 종합 신뢰지수와 항목별 평균 점수가 담긴 객체
 */
export function calculateAgencyScore(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      finalTrustScore: 0,
      averageMetricScores: {
        listing_accuracy_score: 0,
        cost_transparency_score: 0,
        professionalism_score: 0,
        accountability_score: 0,
      }
    };
  }

  const getTimeWeight = (reviewDate) => {
    const daysElapsed = (new Date() - new Date(reviewDate)) / (1000 * 60 * 60 * 24);
    if (daysElapsed <= 30) return 1.0;
    if (daysElapsed <= 90) return 0.7;
    if (daysElapsed <= 180) return 0.4;
    return 0.1;
  };

  const weightedScores = {};
  const totalWeights = {};

  Object.keys(logic.weights).forEach(metric => {
    weightedScores[metric] = 0;
    totalWeights[metric] = 0;
  });

  reviews.forEach(review => {
    const singleReviewResult = calculateSingleReviewScore(review);
    const timeWeight = getTimeWeight(review.createdAt);

    for (const metric in singleReviewResult.metricScores) {
      if (weightedScores.hasOwnProperty(metric)) {
        weightedScores[metric] += singleReviewResult.metricScores[metric] * timeWeight;
        totalWeights[metric] += timeWeight;
      }
    }
  });
  
  const averageMetricScores = {};
  for (const metric in weightedScores) {
    averageMetricScores[metric] = totalWeights[metric] > 0 ? weightedScores[metric] / totalWeights[metric] : 0;
  }
  
  let finalRawScore = 0;
  let finalMinRawScore = 0;
  let finalMaxRawScore = 0;

  for (const metric in logic.weights) {
      const weight = logic.weights[metric];
      const range = logic.scoreRanges[metric];
      
      finalRawScore += averageMetricScores[metric] * weight;
      finalMinRawScore += range.min * weight;
      finalMaxRawScore += range.max * weight;
  }
  
  const finalNormalizedScore = (finalMaxRawScore - finalMinRawScore) !== 0
    ? ((finalRawScore - finalMinRawScore) / (finalMaxRawScore - finalMinRawScore)) * 100
    : 0;
  const finalTrustScore = Math.max(0, Math.min(100, Math.round(finalNormalizedScore)));

  return { finalTrustScore, averageMetricScores };
}