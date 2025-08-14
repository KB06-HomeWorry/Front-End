<template>
  <div class="login-page">
    <img class="login-logo-img" :src="loginLogo" alt="로그인 로고" />

    <form @submit.prevent="onLogin" class="login-form">
      <!-- 이메일 -->
      <InputSimple
        v-model="username"
        type="text"
        placeholder="이메일을 입력하세요."
        autocomplete="username"
      />

      <!-- 비밀번호 -->
      <div class="password-wrapper">
        <InputSimple
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="비밀번호를 입력하세요."
          autocomplete="current-password"
        />
        <button
          class="showPassword-btn"
          type="button"
          @click.stop="toggleShowPassword"
          :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'"
        >
          <img
            :src="showPassword ? eyeOpen : eyeClosed"
            class="showPassword-icon"
            :alt="showPassword ? '비밀번호 표시 중' : '비밀번호 숨김 중'"
          />
        </button>
      </div>

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

    <CustomModal
      v-model="isAlertVisible"
      :message="alertMessage"
      confirmText="확인"
      @confirm="handleAlertConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import InputSimple from "@/components/input/InputSimple.vue";
import BtnMed from "@/components/button/BtnMed.vue";
import CustomModal from "@/components/modal/CustomModal.vue";
import { useAuthStore } from "@/stores/auth";
import { useChecklistStore } from "@/stores/checklist";
import loginLogo from "@/assets/icons/login_logo.png";

// 아이콘 이름을 의미대로 명확히
import eyeOpen from "@/assets/icons/pw_show_eye.png";   // 표시(열린 눈)
import eyeClosed from "@/assets/icons/pw_hide_eye.png"; // 숨김(가린 눈)

const authStore = useAuthStore();
const checklistStore = useChecklistStore();

const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const isAlertVisible = ref(false);
const alertMessage = ref("");
let loginSuccess = false;
let autoRedirectTimer = null;

async function onLogin() {
  if (!username.value || !password.value) {
    alertMessage.value = "아이디와 비밀번호를 모두 입력해주세요.";
    isAlertVisible.value = true;
    loginSuccess = false;
    return;
  }
  try {
    const response = await axios.post("/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    const token = response.data.token;
    const userData = response.data.user;

    if (token && userData) {
      authStore.login(userData, token);
      checklistStore.checklistData.userId = userData.userId;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alertMessage.value = "로그인에 성공했습니다!";
      isAlertVisible.value = true;
      loginSuccess = true;

      if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
      autoRedirectTimer = setTimeout(() => {
        isAlertVisible.value = false;
        const redirectPath = route.query.redirect || "/";
        router.push(redirectPath);
      }, 1000);
    } else {
      alertMessage.value = "로그인 정보가 올바르지 않습니다.";
      isAlertVisible.value = true;
      loginSuccess = false;
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "로그인에 실패했습니다.\n아이디나 비밀번호를 확인해주세요.";
    alertMessage.value = errorMessage;
    isAlertVisible.value = true;
    loginSuccess = false;
  }
}

function handleAlertConfirm() {
  isAlertVisible.value = false;
  if (loginSuccess) {
    if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
    const redirectPath = route.query.redirect || "/";
    router.push(redirectPath);
  }
}

function onSignup() {
  router.push("/auth/signup-agreement");
}

function onResetPw() {
  router.push("/auth/reset-password");
}

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.login-page {
  margin: 2rem;
  padding-top: 30px;
}

.login-logo-img {
  display: block;
  width: 180px;
  height: 180px;
  object-fit: cover;
  margin: 6rem auto 2.5rem auto;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.password-wrapper {
  display: flex;
  position: relative;
  align-items: center;
}

.showPassword-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}

.showPassword-icon {
  position: absolute;
  right: 13px;
  top: 13px;
  width: 24px;
  height: 24px;
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
