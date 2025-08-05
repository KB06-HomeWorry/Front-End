<template>
  <div>
    <AuthTitle title="회원정보 입력" />
    <form class="signup-form" @submit.prevent="onSubmit">
      <!-- 이메일 -->
      <InputEmail
        v-model="email"
        label="이메일을 입력해주세요."
        :error="emailError"
        @check="checkEmailDuplicate"
      />

      <!-- 비밀번호/비밀번호 확인 -->
      <InputField
        label="비밀번호를 입력해주세요."
        :desc="'* 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 8자리 이상'"
        :error="passwordError"
      >
        <input
          class="input-box-pw bodyMedium16px"
          type="password"
          v-model="password"
          placeholder="비밀번호를 입력하세요."
          autocomplete="new-password"
          style="margin-bottom: 4px"
        />
        <input
          class="input-box-pw bodyMedium16px"
          type="password"
          v-model="passwordCheck"
          placeholder="비밀번호를 한 번 더 입력해주세요."
          autocomplete="new-password"
        />
      </InputField>

      <!-- 이름 -->
      <InputField
        label="이름을 입력해주세요."
        placeholder="이름을 입력하세요."
        v-model="username"
      />

      <!-- 연락처 -->
      <InputField
        label="연락처를 입력해주세요."
        placeholder="숫자만 입력하세요"
      >
        <input
          class="input-box-pw bodyMedium16px"
          type="tel"
          :value="phone"
          @input="onPhoneInput"
          maxlength="13"
          placeholder="연락처를 입력하세요."
        />
      </InputField>

      <BtnMed
        class="submit-btn"
        type="submit"
        text="회원가입 완료"
        :disabled="loading"
      />
    </form>

    <CustomModal
      v-model="isAlertVisible"
      :message="alertMessage"
      confirmText="확인"
      @confirm="handleAlertConfirm"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AuthTitle from '@/pages/auth/components/AuthTitle.vue';
import InputField from '@/components/input/InputField.vue';
import BtnMed from '@/components/button/BtnMed.vue';
import InputEmail from '@/pages/auth/components/InputEmail.vue';
import CustomModal from '@/components/modal/CustomModal.vue';

const router = useRouter();

const email = ref('');
const password = ref('');
const passwordCheck = ref('');
const username = ref('');
const phone = ref('');

const emailError = ref('');
const passwordError = ref('');
const formError = ref('');

const loading = ref(false);

const isAlertVisible = ref(false);
const alertMessage = ref('');
let signupSuccess = false;

async function checkEmailDuplicate() {
  const val = email.value.trim();
  if (!val) {
    emailError.value = '이메일을 입력해주세요.';
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(val)) {
    emailError.value = '올바른 이메일 형식이 아닙니다.';
    return;
  }
  emailError.value = '';
  try {
    const res = await axios.get(
      `http://localhost:8080/api/member/checkusername/${val}`
    );

    if (res.data) {
      emailError.value = '이미 사용 중인 이메일입니다.';
    } else {
      emailError.value = '';
      alertMessage.value = '사용 가능한 이메일입니다.';
      isAlertVisible.value = true;
      signupSuccess = false;
    }
  } catch {
    emailError.value = '중복 확인 중 오류가 발생했습니다.';
  }
}

// 사용자가 입력한 값에서 숫자만 추출한 뒤, 숫자 개수에 맞게 하이픈 자동으로 들어가도록 하였음
function onPhoneInput(e) {
  let numbers = e.target.value.replace(/[^0-9]/g, '');
  if (numbers.length > 11) numbers = numbers.slice(0, 11);

  let formatted = '';
  if (numbers.length < 4) {
    formatted = numbers;
  } else if (numbers.length < 8) {
    formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  }
  phone.value = formatted;
}

// 비밀번호 2종류 이상 조합 검사 함수
function isPasswordValid(pw) {
  let types = 0;
  if (/[A-Za-z]/.test(pw)) types++;
  if (/\d/.test(pw)) types++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) types++;
  return pw.length >= 8 && types >= 2;
}

// 비밀번호/확인 실시간 에러 처리
watch([password, passwordCheck], ([pw, pwCheck]) => {
  if (!pw) {
    passwordError.value = '';
    return;
  }
  if (!isPasswordValid(pw)) {
    passwordError.value =
      '비밀번호는 영문, 숫자, 특수문자 중 2종류 이상을 조합해 8자 이상이어야 합니다.';
    return;
  }
  if (pwCheck && pw !== pwCheck) {
    passwordError.value = '비밀번호가 일치하지 않습니다.';
    return;
  }
  passwordError.value = '';
});

async function onSubmit() {
  if (loading.value) return;
  loading.value = true;
  formError.value = '';

  // 유효성 검사
  if (!email.value || !password.value || !username.value || !phone.value) {
    alertMessage.value = '모든 정보를 입력해주세요.';
    isAlertVisible.value = true;
    signupSuccess = false;
    loading.value = false;
    return;
  }
  if (password.value !== passwordCheck.value) {
    passwordError.value = '비밀번호가 일치하지 않습니다.';
    return;
  }
  if (!isPasswordValid(password.value)) {
    passwordError.value =
      '비밀번호는 영문, 숫자, 특수문자 중 2종류 이상을 조합해 8자 이상이어야 합니다.';
    loading.value = false;
    return;
  }
  passwordError.value = '';

  // --- API 요청 ---
  try {
    const userData = {
      email: email.value,
      password: password.value,
      username: username.value,
      phone: phone.value.replace(/-/g, ''), // 하이픈 제거 후 전송
      userType: '중개사',
    };

    // 백엔드의 회원가입 API 엔드포인트로 POST 요청
    await axios.post('http://localhost:8080/api/member', userData);

    alertMessage.value =
      '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.';
    isAlertVisible.value = true;
    signupSuccess = true;
  } catch (error) {
    console.error('회원가입 실패:', error);
    const errorMessage =
      error.response?.data?.message ||
      '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    alertMessage.value = errorMessage;
    isAlertVisible.value = true;
    signupSuccess = false;
  } finally {
    loading.value = false;
  }
}

function handleAlertConfirm() {
  isAlertVisible.value = false;
  if (signupSuccess) {
    router.push('/auth/login');
  }
}
</script>

<style scoped>
.signup-form {
  margin: 1.5rem 1rem;
  box-sizing: border-box;
  padding: 0 1rem;
}

.input-box-pw {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: 1px solid var(--color-light);
  padding: 0 16px;
  box-sizing: border-box;
  background: var(--color-white);
  transition: border 0.2s;
}

.input-box-pw::placeholder {
  color: var(--color-mediumgray);
}

.submit-btn {
  width: 100%;
  left: auto;
  transform: none;
  bottom: auto;
  z-index: auto;
}
</style>
