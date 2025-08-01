export function getMockResults(pageIdx) {
  return [
    {
      isRisky: Math.random() > 0.5,
      title: '특약 사항 누락',
      details: `"계약 만료 시 임차인은 원상복구 의무를 진다." 라는 조항 외 구체적인 범위 명시 없음.`,
      recommendation: `원상복구의 구체적인 범위(예: 못 자국, 벽지 등)를 특약에 명시하여 분쟁의 소지를 줄이세요.`,
      page: pageIdx + 1,
    },
    {
      isRisky: false,
      title: '임대차 기간',
      details: '정상',
      recommendation: '정상',
      page: pageIdx + 1,
    },
    {
      isRisky: Math.random() > 0.5,
      title: '보증금 반환 조건',
      details: `"새로운 임차인이 구해지는 경우 보증금을 반환한다."는 독소 조항 포함.`,
      recommendation: `해당 조항은 임차인에게 매우 불리합니다. '계약 만료일 익일까지' 보증금을 반환한다는 내용으로 수정을 강력히 요구하세요.`,
      page: pageIdx + 1,
    },
    {
      isRisky: false,
      title: '임대인 정보',
      details: '정상',
      recommendation: '정상',
      page: pageIdx + 1,
    },
    {
      isRisky: Math.random() > 0.5,
      title: '수선유지 의무 불명확',
      details: `"주요 설비의 노후 및 불량으로 인한 수선은 임대인이 부담한다."고만 명시되어 '주요 설비'의 범위가 모호함.`,
      recommendation: `보일러, 수도, 전기 등 주요 설비의 종류를 구체적으로 명시하고, 임차인의 고의/과실이 아닌 경우 임대인이 수리 책임을 지도록 명확히 하세요.`,
      page: pageIdx + 1,
    },
    {
      isRisky: false,
      title: '계약 해지 조건',
      details: '정상',
      recommendation: '정상',
      page: pageIdx + 1,
    },
  ];
}
