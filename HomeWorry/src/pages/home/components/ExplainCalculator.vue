<template>
  <div class="explain-card">
    <div class="explain-sample bodyMedium12px">
      <div class="icon-wrapper">
        <img :src="iconSrc" alt="계산기 아이콘" />
      </div>
      <div class="sample-text">
        <p>거래(매매, 전세, 월세)와 물건 종류(주택, 오피스텔, 기타)를 선택한 뒤, 보증금 및 월세를 입력하면
        중개수수료의 <b>법정 최대 한도</b>를 계산합니다.</p>
      </div>
    </div>

    <!-- 주의 사항 -->
    <div class="caution-box">
      <ul class="caution-list bodyLight12px">
        <li>실제 청구액은 당사자 <b>협의</b>에 따라 달라질 수 있습니다.</li>
        <li>지자체 <b>조례</b>에 따라 상한·요율이 다를 수 있습니다.</li>
        <li>법정 상한을 <b>초과</b>한 금액은 청구/지급할 수 없습니다.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const iconSrc = '/src/assets/icons/ex_calculator.png'; 
</script>

<style scoped>
.explain-card {
  width: 393px;
  background: var(--color-primary-10);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-left: -32px;
  margin-bottom: 28px;
  box-sizing: border-box;
  padding: 8px 18px;
}

.explain-sample {
  display: flex;
  align-items: flex-start;
  padding: 12px 12px 2px 12px;
  gap: 12px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  background: var(--color-white);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-left: 8px;
}

.icon-wrapper img {
  width: 40px;
  height: 32px;
  object-fit: contain;
  margin-left: 2px;
}

.sample-text p {
  margin-top: 4px;
  color: var(--color-primary);
  letter-spacing: -0.03em;
  line-height: 17px;
}

/* 주의 사항 */
.caution-box {
  padding: 16px 12px 12px 12px;
  color: var(--color-darkgray);
}

.caution-list {
  list-style: none;
  padding-left: 0.5rem;
  margin: 0;
  line-height: 14px;
  letter-spacing: -0.03em;
}

.caution-list li {
  position: relative;
  padding-left: 8px;
}

.caution-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-darkgray);
}
</style>
