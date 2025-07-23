<template>
  <div class="login-page">
    <img
      class="login-logo-img"
      src="@/assets/icons/login_logo.png"
      alt="로그인 로고"
    />
    <!-- <h2 class="login-title titleBold32px">로그인</h2> -->

    <form @submit.prevent="onLogin" class="login-form">
      <!-- 이메일 -->
      <InputSimple
        v-model="username"
        type="text"
        placeholder="이메일을 입력하세요."
        autocomplete="username"
      />

      <!-- 비밀번호 -->
      <InputSimple
        v-model="password"
        type="password"
        placeholder="비밀번호를 입력하세요."
        autocomplete="current-password"
      />

      <BtnMed class="login-btn" type="submit" text="로그인" />
    </form>
    <div class="login-links bodyMedium16px">
      <button class="link-btn bodyMedium14px" @click="onSignup">
        회원가입하기
      </button>
      <button class="link-btn bodyMedium14px" @click="onResetPw">
        비밀번호찾기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import InputSimple from "./components/InputSimple.vue";
import BtnMed from "@/components/button/BtnMed.vue";
import { useChecklistStore } from "@/stores/checklist";

const router = useRouter();
const username = ref("");
const password = ref("");
const checklistStore = useChecklistStore();

async function onLogin() {
  if (!username.value || !password.value) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }
  try {
    const response = await axios.post("/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    const token = response.data.token;
    if (token) {
      localStorage.setItem("user-token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    console.log("로그인 성공:", response.data);
    checklistStore.checklistData.userId = response.data.user.userId;
    console.log("사용자 ID:", checklistStore.checklistData.userId);

    alert("로그인에 성공했습니다!");
    router.push("/");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.";
    alert(errorMessage);
  }
}

function onSignup() {
  router.push("/auth/signup-agreement");
}

function onResetPw() {
  router.push("/auth/reset-password");
}
</script>

<style scoped>
.login-page {
  margin: 2rem;
}

.login-logo-img {
  display: block;
  width: 180px;
  height: 180px;
  object-fit: cover;
  margin: 6rem auto 2.5rem auto;
}
/* 
.login-title {
  color: var(--color-primary);
  margin: 32px;
  text-align: center;
} */

.login-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
}

.login-links {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 52px;
}

.link-btn {
  color: var(--color-mediumgray);
  cursor: pointer;
  padding: 0 4px;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
