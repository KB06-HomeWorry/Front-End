/**
 * @file useAllTrustScore.js
 * @description 신뢰지수 계산 로직을 담은 composable.
 * 개별 후기 점수 계산과 여러 후기를 종합하는 기능을 제공.
 */

// 내부 설정
const logic = {
  questionMapping: [
    { code: 'Q1_ATTITUDE',   metric: 'professionalism_score' },
    { code: 'Q2_ACCURACY',   metric: 'listing_accuracy_score' },
    { code: 'Q3_SUGGESTION', metric: 'professionalism_score' },
    { code: 'Q4_PRESSURE',   metric: 'professionalism_score' },
    { code: 'Q5_FEE_INFO',   metric: 'cost_transparency_score' },
    { code: 'Q6_CONTRACT',   metric: 'accountability_score' },
    { code: 'Q7_ISSUE',      metric: 'accountability_score' }
  ],
  scores: {
    Q1_ATTITUDE:   [ +1,  0, -1 ],
    Q2_ACCURACY:   [ +3, -3, -5 ],
    Q3_SUGGESTION: [ +1,  0, -2 ],
    Q4_PRESSURE:   [ +1, -2, -4 ],
    Q5_FEE_INFO:   [ +3,  0, -5 ],
    Q6_CONTRACT:   [ +3,  0, -5 ],
    Q7_ISSUE:      [ +2,  0, -5 ]
  },
  weights: {
    listing_accuracy_score: 0.4,
    cost_transparency_score: 0.3,
    accountability_score: 0.2,
    professionalism_score: 0.1
  },
  scoreRanges: {
    listing_accuracy_score: { min: -5,  max: 3 },
    cost_transparency_score: { min: -5,  max: 3 },
    professionalism_score:   { min: -7,  max: 3 },
    accountability_score:    { min: -10, max: 5 }
  }
}

/**
 * 개별 후기 1건의 신뢰지수를 계산
 * @param {object} review - { answers, reviewType, comment } 포함
 * @returns {object} { reviewType, metricScores, rawScore, finalTrustScore, userAnswers, comment }
 */
export function calculateSingleReviewScore(review) {
  const { answers: userAnswers = [], reviewType, comment } = review

  const metricScores = {
    professionalism_score: 0,
    listing_accuracy_score: 0,
    cost_transparency_score: 0,
    accountability_score: 0
  }

  const questionCount = userAnswers.length
  for (let i = 0; i < questionCount; i++) {
    const mapping = logic.questionMapping[i]
    const questionCode = mapping.code
    const metric = mapping.metric
    const answerIndex = userAnswers[i]
    const score = logic.scores[questionCode][answerIndex]
    metricScores[metric] += score
  }

  let rawScore = 0
  let minRawScore = 0
  let maxRawScore = 0

  for (const metric in logic.weights) {
    if (reviewType === 'consultation' && metric === 'accountability_score') continue
    const weight = logic.weights[metric]
    const range = logic.scoreRanges[metric]
    rawScore += metricScores[metric] * weight
    minRawScore += range.min * weight
    maxRawScore += range.max * weight
  }

  const normalizedScore =
    (maxRawScore - minRawScore) !== 0
      ? ((rawScore - minRawScore) / (maxRawScore - minRawScore)) * 100
      : 0

  const finalTrustScore = Math.max(0, Math.min(100, Math.round(normalizedScore)))
  return { reviewType, metricScores, rawScore, finalTrustScore, userAnswers, comment }
}

/**
 * 여러 후기를 종합하여 최종 신뢰지수 계산
 * @param {Array<object>} reviews - 각 후기 { answers, reviewType, createdAt } 포함
 * @returns {object} { finalTrustScore, averageMetricScores }
 */
export function calculateAgencyScore(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      finalTrustScore: 0,
      averageMetricScores: {
        listing_accuracy_score: 0,
        cost_transparency_score: 0,
        professionalism_score: 0,
        accountability_score: 0
      }
    }
  }

/**
 * 시간 가중치 함수
 * 경과일 구간에 따른 고정 가중치 반환
 * - 0 ~ 30일:   1.0   (가장 신선한 후기, 최대 영향력)
 * - 31 ~ 90일:  0.7
 * - 91 ~ 180일: 0.4
 * - 181일 이상: 0.1   (아주 오래된 후기도 완전 배제는 하지 않음)
 */
const getTimeWeight = (reviewDate) => {
  const daysElapsed = (new Date() - new Date(reviewDate)) / (1000 * 60 * 60 * 24)
  if (daysElapsed <= 30) return 1.0   // 0~30일
  if (daysElapsed <= 90) return 0.7   // 31~90일
  if (daysElapsed <= 180) return 0.4  // 91~180일
  return 0.1                           // 181일~
}

  const weightedScores = {}
  const totalWeights = {}
  Object.keys(logic.weights).forEach(metric => {
    weightedScores[metric] = 0
    totalWeights[metric] = 0
  })

  reviews.forEach(review => {
    const singleReviewResult = calculateSingleReviewScore(review)
    const timeWeight = getTimeWeight(review.createdAt)

    for (const metric in singleReviewResult.metricScores) {
      if (Object.prototype.hasOwnProperty.call(weightedScores, metric)) {
        weightedScores[metric] += singleReviewResult.metricScores[metric] * timeWeight
        totalWeights[metric] += timeWeight
      }
    }
  })

  const averageMetricScores = {}
  for (const metric in weightedScores) {
    averageMetricScores[metric] =
      totalWeights[metric] > 0 ? weightedScores[metric] / totalWeights[metric] : 0
  }

  let finalRawScore = 0
  let finalMinRawScore = 0
  let finalMaxRawScore = 0

  for (const metric in logic.weights) {
    const weight = logic.weights[metric]
    const range = logic.scoreRanges[metric]
    finalRawScore    += averageMetricScores[metric] * weight
    finalMinRawScore += range.min * weight
    finalMaxRawScore += range.max * weight
  }

  const finalNormalizedScore =
    (finalMaxRawScore - finalMinRawScore) !== 0
      ? ((finalRawScore - finalMinRawScore) / (finalMaxRawScore - finalMinRawScore)) * 100
      : 0

  const finalTrustScore = Math.max(0, Math.min(100, Math.round(finalNormalizedScore)))
  return { finalTrustScore, averageMetricScores }
}
