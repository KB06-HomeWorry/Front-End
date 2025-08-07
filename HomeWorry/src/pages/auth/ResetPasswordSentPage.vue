<template>
  <div>
    <AuthTitle title="비밀번호 찾기" />
    <div class="resetpw-sent-page">
      <div class="desc-wrap bodyMedium20px">
        <p class="desc-main">
          이메일로 <span class="point">비밀번호 재설정 링크</span>를<br />
          전송해드렸습니다.
        </p>
        <p class="desc-sub bodyLight12px">
          * 메일이 도착하지 않으면 스팸함을 확인해주세요.
        </p>
        <BtnTiny
          text="이메일 재전송"
          class="resend-btn bodyMedium12px"
          @click="onResend"
          :disabled="resendLoading"
        />
        <div v-if="resendError" class="form-error bodyMedium12px">
          {{ resendError }}
        </div>
        <div v-if="resendSuccess" class="form-success bodyMedium12px">
          {{ resendSuccess }}
        </div>
      </div>

      <div class="plane-row-between">
        <div></div>
        <img :src="mailIcon" alt="메일 발송 아이콘" class="plane-illust" />
      </div>

      <BtnMed
        class="submit-btn"
        text="로그인 화면으로 돌아가기"
        @click="goToLogin"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import AuthTitle from "@/pages/auth/components/AuthTitle.vue";
import BtnMed from "@/components/button/BtnMed.vue";
import BtnTiny from "@/components/button/BtnTiny.vue";
import mailIcon from "@/assets/icons/email_paperplane.png";

const router = useRouter();
const route = useRoute();
const email = ref(route.query.email || "");

const resendLoading = ref(false);
const resendError = ref("");
const resendSuccess = ref("");

function goToLogin() {
  router.replace("/auth/login");
}

async function onResend() {
  resendError.value = "";
  resendSuccess.value = "";
  if (resendLoading.value) return;
  if (!email.value) {
    resendError.value = "❌ 이메일 정보가 없습니다.";
    return;
  }
  resendLoading.value = true;
  try {
    await axios.get(
      `http://54.66.153.95:8080/api/member/resetpassword/${email.value}`
    );
    resendSuccess.value = "📧 이메일이 전송되었습니다!";
  } catch (err) {
    resendError.value =
      err.response?.data?.message ||
      "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    resendLoading.value = false;
  }
}

onResend();
</script>

<style scoped>
.resetpw-sent-page {
  margin: 1.5rem 0;
  box-sizing: border-box;
  padding: 0 2rem;
}

.desc-wrap {
  text-align: left;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.desc-main {
  line-height: 1.5;
}

.point {
  color: var(--color-error);
}

.desc-sub {
  color: var(--color-mediumgray);
  margin-bottom: 2rem;
}

.plane-row-between {
  display: flex;
  align-items: center;
  height: 20rem;
}

.plane-illust {
  width: 90px;
  height: auto;
  margin-left: 65%;
  display: block;
  align-self: center;
}

.submit-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 90px;
  z-index: 100;
  transition: background 0.2s;
}

.resend-btn {
  margin-top: 0.5rem;
  cursor: pointer;
  padding: 0;
}

.form-error {
  color: var(--color-error);
  margin-top: 3px;
}

.form-success {
  color: var(--color-primary);
  margin-top: 3px;
}
</style>
