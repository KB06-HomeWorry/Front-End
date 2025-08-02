<template>
  <div class="explain-card">
    <div class="explain-title">
      <div class="icon-wrapper">
        <img src="@/assets/icons/home_chatbot.png" alt="AI 아이콘" />
      </div>
      <span class="title-text bodyMedium12px">AI가 어려운 문장 또는 단어를 해석해줘요.</span>
    </div>
      <div class="explain-sample bodyMedium10px">
        <p>예시 입력 : 본 임대차계약에 따라 임차인은 전대차를 할 수 없습니다.
            <br/>→ 이 계약에 따르면, 세입자는 집을 다른 사람에게 빌려줄 수 없습니다.</p>
      </div>

    <div class="caution-box">
    <span class="caution-title bodyMedium10px">주의 사항</span>
        <ul class="caution-list bodyLight10px">
            <li>부동산 관련 문장 또는 용어가 아닌 무관한 내용을 넣으면 답을 출력하지 않습니다.</li>
            <li>전문 용어(단어)만 입력 시, 해당 단어에 대한 설명이 나옵니다.</li>
        </ul>
    </div>

  </div>
</template>

<script setup>

</script>

<style scoped>
.explain-card {
  width: 100%;
  background: rgba(17, 31, 92, 0.10);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 12px;
}

.explain-title {
  display: flex;           /* 가로 배치 */
  align-items: center;     /* 수직 가운데 정렬 */
  margin: 10px 0;
  padding: 0 10px;
  gap: 10px;               /* 아이콘과 텍스트 사이 간격 */
}

.icon-wrapper {
  width: 30px;
  height: 30px;
  background: white;        /* 흰색 원형 배경 */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;          /* 크기 축소 방지 */
  box-shadow: 0 0 4px rgba(0,0,0,0.1); /* 원하면 그림자 */
}

.icon-wrapper img {
  width: 25px;
  height: 25px;
  object-fit: contain;
}

.title-text {
  color: var(--color-primary);
  margin-right: 2px;
}

.explain-sample p{
    display: block;
    color: var(--color-primary);
    background: var(--color-white);
    margin: 0 10px;
    padding: 12px 10px;
    border-radius: 12px;
    letter-spacing: -0.03em;
    line-height: 20px;
}

.caution-box {
    padding: 6px 12px 12px 12px;
    color: var(--color-darkgray);

}


.caution-list {
  list-style: none; 
  padding-top: 2px;
  padding-left: 0.5rem;
  margin: 0;
  line-height: 12px;
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
  font-size: 0.75rem;
}
</style>
