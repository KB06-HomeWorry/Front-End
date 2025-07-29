<template>
  <!-- 도움말 버튼 -->
  <button class="help-icon" @click="openModal">?</button>

  <!-- 도움말 모달 -->
  <CustomModal
    v-model="showModal"
    :message="modalMessage"
    confirmText="확인"
    @confirm="showModal = false"
  />
</template>

<script setup>
import CustomModal from "@/components/modal/CustomModal.vue";
import { ref, watch, defineProps } from "vue";

/**
 * 부모 컴포넌트에서 message를 prop으로 전달받음
 */
const props = defineProps({
  message: {
    type: String,
    default: "도움말 메시지가 없습니다.",
  },
});

const showModal = ref(false);
const modalMessage = ref(props.message);

// 메시지가 부모에서 변경되면 모달 메시지도 자동 갱신
watch(
  () => props.message,
  (newMessage) => {
    modalMessage.value = newMessage;
  }
);

function openModal() {
  showModal.value = true;
}
</script>

<style scoped>
.help-icon {
  background-color: #eee;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
