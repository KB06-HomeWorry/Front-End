<template>
  <div class="modal-backdrop" @click.self="onClose">
    <div class="result-modal">
      <img
        class="result-img"
        :src="result === 'correct' ? correctImg : wrongImg"
        :alt="result === 'correct' ? '정답' : '오답'"
      />
      <button class="close-btn" @click="onClose">×</button>
      <div class="modal-card">
        <div class="modal-card-content bodyMedium12px">
          {{ explanation }}
          <img class="hint-icon" v-if="hintIcon" :src="hintIcon" alt="hint" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 이미지 import
import correctImgUrl from "@/assets/icons/quiz_correct_text.png";
import wrongImgUrl from "@/assets/icons/quiz_wrong_text.png";
import hintIconUrl from "@/assets/icons/quiz_lightbulb.png";

const props = defineProps({
  result: { type: String, required: true }, // 'correct' or 'wrong'
  explanation: { type: String, required: true },
  correctImg: { type: String, default: correctImgUrl },
  wrongImg: { type: String, default: wrongImgUrl },
  hintIcon: { type: String, default: hintIconUrl },
});
const emit = defineEmits(["close"]);
function onClose() {
  emit("close");
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 99;
  left: 0;
  right: 0;
  top: 0;
  bottom: 70px;
  /* width와 margin으로 중앙에 */
  width: 393px;
  height: auto;
  background: rgba(0, 0, 0, 0.22);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-modal {
  width: 330px;
  height: 300px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0;
  justify-content: flex-end;
  overflow: visible;
}

.result-img {
  position: absolute;
  top: 32px;
  left: 50%;
  width: 230px;
  height: 230px;
  object-fit: contain;
  display: block;
  z-index: 0;
  transform: translateX(-50%);
  pointer-events: none;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 18px;
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  font-size: 26px;
  z-index: 4;
}

.modal-card {
  width: 300px;
  min-height: 140px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  margin: 170px auto 32px auto;
  display: flex;
  flex-direction: column;
  align-items: center; /* <-- 중앙정렬! */
  justify-content: center;
  padding: 16px 16px 18px 16px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
}

.modal-card-content {
  color: var(--color-primary);
  line-height: 1.2;
  word-break: keep-all;
  position: relative;
  padding-bottom: 6px;
}

.hint-icon {
  width: 28px;
  height: 28px;
  position: absolute;
  right: -8px;
  bottom: -20px;
}
</style>
