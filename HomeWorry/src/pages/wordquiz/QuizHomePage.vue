<template>
  <div class="quiz-main-area">
    <div class="quiz-grid">
      <template v-for="(row, rowIdx) in quizRows" :key="rowIdx">
        <div class="quiz-row ">
          <template v-for="(cell, colIdx) in row" :key="colIdx">
            <div class="quiz-cell-wrap">
              <!-- 가로 점선 -->
              <div
                v-if="cell.rightLine"
                class="quiz-dash-horizontal"
              ></div>
              <!-- 세로 점선 -->
              <div
                v-if="cell.downLine"
                class="quiz-dash-vertical"
              ></div>
              <router-link
                class="quiz-cell titleBold16px"
                :to="'/quiz/' + cell.number"
              >
                {{ cell.number }}
              </router-link>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const rowCount = 20;
const colCount = 5;

function createQuizRows() {
  const rows = [];
  for (let r = 0; r < rowCount; r++) {
    const row = [];
    for (let c = 0; c < colCount; c++) {
      let number;
      if (r % 2 === 0) {
        // 홀수줄은 정방향
        number = r * colCount + c + 1;
      } else {
        // 짝수줄은 역방향
        number = (r + 1) * colCount - c;
      }
      // 가로 점선은 현재 row에서 마지막 칸이 아니면 true
      const rightLine = c < colCount - 1;
      // 세로 점선은 홀수줄 마지막칸 or 짝수줄 첫번째칸
      const downLine = (r < rowCount - 1) &&
        ((r % 2 === 0 && c === colCount - 1) || (r % 2 === 1 && c === 0));
      row.push({ number, rightLine, downLine });
    }
    rows.push(row);
  }
  return rows;
}
const quizRows = createQuizRows();
</script>

<style scoped>
.quiz-main-area {
  min-height: 100vh;
  background: var(--color-white);
  box-sizing: border-box;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.quiz-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  width: max-content;
  margin: 0 auto;
}
.quiz-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 14px;
}
.quiz-cell-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  background: none;
}
.quiz-cell {
  width: 50px;
  height: 50px;
  line-height: 50px;
  background: rgba(17, 31, 92, 0.05);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  position: relative;
  z-index: 2;
  margin: 0 auto;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: box-shadow 0.16s;
  user-select: none;
}
.quiz-cell:hover {
  color: var(--color-primary);
  background: rgba(17, 31, 92, 0.2);
}

/* 가로 점선: 오른쪽 */
.quiz-dash-horizontal {
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 0;
  border-top: 3px dashed var(--color-primary);
  z-index: 1;
  pointer-events: none;
}

/* 세로 점선: 아래 */
.quiz-dash-vertical {
  position: absolute;
  bottom: -19px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 19px;
  border-left: 3px dashed var(--color-primary);
  z-index: 1;
  pointer-events: none;
}
</style>
