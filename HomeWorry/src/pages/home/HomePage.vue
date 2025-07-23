<template>
  <section class="main-grid">
    <div class="left-column">
      <ApartBtn
        text="아파트"
        icon="/src/assets/icons/home_apartment.png"
        @click="handleApartmentClick"
      />
      <BtnLgShort
        text="오피스텔"
        icon="/src/assets/icons/home_officetel.png"
        @click="handleCategoryClick('오피스텔')"
      />
    </div>
    <div class="right-column">
      <BtnLgShort
        text="원·투룸"
        icon="/src/assets/icons/home_oneroom.png"
        @click="handleCategoryClick('원.투룸')"
      />
      <BtnLgShort
        text="빌라·주택"
        icon="/src/assets/icons/home_villa.png"
        @click="handleCategoryClick('빌라.주택')"
      />
      <BtnLgShort
        text="상가·사무실"
        icon="/src/assets/icons/home_store.png"
        @click="handleCategoryClick('상가.사무실')"
      />
    </div>

    <div class="checklist-column">
      <BtnLg
        text="전·월세 체크리스트"
        icon="/src/assets/icons/checklist_rent.png"
        @click="handleCategoryClick('전.월세 체크리스트')"
      />
      <BtnLg
        text="매매 체크리스트"
        icon="/src/assets/icons/checklist_sale.png"
        @click="handleCategoryClick('매매 체크리스트')"
      />
    </div>

    <BtnTiny text="로그인/회원가입" @click="goToLogin" />
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import ApartBtn from "@/pages/home/components/ApartBtn.vue";
import BtnLgShort from "@/components/button/BtnLgShort.vue";
import BtnLg from "@/components/button/BtnLg.vue";
import BtnTiny from "@/components/button/BtnTiny.vue";
import { useChecklistStore } from "@/stores/checklist";

const checklistStore = useChecklistStore();
const router = useRouter();
const handleApartmentClick = () => {};
const handleCategoryClick = (category) => {
  if (category === "전.월세 체크리스트" || category === "매매 체크리스트") {
    const mappedType = category === "전.월세 체크리스트" ? "전/월세" : "매매";

    console.log(mappedType);
    const query = {
      type: (checklistStore.checklistData.type = mappedType),
      stage: "계약 전",
      userId: checklistStore.checklistData.userId,
    };

    router.push({ path: "/checklist", query });
  }
};

function goToLogin() {
  router.replace("/auth/login");
}
</script>

<style scoped>
.main-grid {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  padding: 16.5px;
  column-gap: 8px;
  row-gap: 20px;
  align-items: start;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checklist-column {
  grid-column: 1 / span 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
