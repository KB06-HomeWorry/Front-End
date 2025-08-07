<template>
  <section class="main-grid">
    <div class="left-column">
      <ApartBtn
        text="에이아이 계약서 분석입니당"
        :icon="homeRobot"
        @click="handleAiAnaysisClick"
      />
    </div>
    <div class="right-column">
      <ApartBtn
        text="서류 분석"
        :icon="homeDocument"
        @click="handleDocumentAnaysisClick"
      />
    </div>

    <div class="checklist-column">
      <BtnLg
        text="전·월세 체크리스트"
        :icon="checklistRent"
        @click="handleCategoryClick('전.월세 체크리스트')"
      />
      <BtnLg
        text="매매 체크리스트"
        :icon="checklistSale"
        @click="handleCategoryClick('매매 체크리스트')"
      />
    </div>

    <div class="left-column">
      <ApartBtn
        text="아파트"
        :icon="homeApartment"
        @click="handleApartmentClick"
      />
      <BtnLgShort
        text="오피스텔"
        :icon="homeOfficetel"
        @click="handleCategoryClick('오피스텔')"
      />
    </div>
    <div class="right-column">
      <BtnLgShort
        text="원·투룸"
        :icon="homeOneroom"
        @click="handleCategoryClick('원.투룸')"
      />
      <BtnLgShort
        text="빌라·주택"
        :icon="homeVilla"
        @click="handleCategoryClick('빌라.주택')"
      />
      <BtnLgShort
        text="상가·사무실"
        :icon="homeStore"
        @click="handletestClick"
      />
    </div>

    <BtnTiny text="로그인/회원가입" @click="goToLogin" />
    <BtnTiny text="중개사 - 1" @click="goToAgency1" />
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import ApartBtn from "@/pages/home/components/ApartBtn.vue";
import BtnLgShort from "@/components/button/BtnLgShort.vue";
import BtnLg from "@/components/button/BtnLg.vue";
import BtnTiny from "@/components/button/BtnTiny.vue";
import { useChecklistStore } from "@/stores/checklist";

// 이미지 import
import homeRobot from "@/assets/icons/home_robot.png";
import homeDocument from "@/assets/icons/home_document.png";
import checklistRent from "@/assets/icons/checklist_rent.png";
import checklistSale from "@/assets/icons/checklist_sale.png";
import homeApartment from "@/assets/icons/home_apartment.png";
import homeOfficetel from "@/assets/icons/home_officetel.png";
import homeOneroom from "@/assets/icons/home_oneroom.png";
import homeVilla from "@/assets/icons/home_villa.png";
import homeStore from "@/assets/icons/home_store.png";

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

    router.push({ path: "/checklist-stage", query });
  }
};
const handleAiAnaysisClick = () => {
  router.push({ path: "/ai/analysis" });
};
const handleDocumentAnaysisClick = () => {
  router.push({ path: "/analysis" });
};

function goToLogin() {
  router.replace("/auth/login");
}

function goToAgency1() {
  router.replace("/agencysample/1");
}

const handletestClick = async () => {
  const { data } = await axios.get(
    "http://54.66.153.95:8080/checklist/answers/five"
  );

  console.log("서버 응답:", data);
};
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
