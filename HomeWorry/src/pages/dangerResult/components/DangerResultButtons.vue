<template>
  <div class="button-group">
    <BtnMed text="서류 분석" color="#ffffff" @click="handleClick('흰색')" />
    <BtnMed
      text="AI 계약서 분석"
      color="#ffffff"
      @click="handleClick('흰색')"
    />
    <BtnMed text="점검 다시하기" @click="checklistAgain()" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import BtnMed from "@/components/button/BtnMed.vue";
const router = useRouter();

const handleClick = (color) => {
  console.log(`Button clicked with color: ${color}`);
};

const checklistAgain = () => {
  console.log("점검 다시하기 버튼 클릭");
  router.push("/checklist");
};
</script>

<style scoped>
.button-group {
  display: inline;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin: 28px;
}
</style>
