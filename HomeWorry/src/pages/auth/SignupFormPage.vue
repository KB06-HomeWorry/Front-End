<template>
  <div>
    <AuthTitle title="회원정보 입력" />
    <form class="signup-form" @submit.prevent="onSubmit">
      <!-- 이메일 -->
      <InputField
        label="이메일을 입력해주세요."
        placeholder="이메일 주소를 입력하세요."
        type="email"
        v-model="email"
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
          style="margin-bottom:4px"
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
        type="tel"
        inputmode="numeric"
        v-model="phone"
        :maxlength="13"
      />

      <!-- 버튼 하단 고정 -->
      <BtnMed class="submit-btn" type="submit" text="회원가입 완료" @click="onSubmit"/>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AuthTitle from '@/pages/auth/components/AuthTitle.vue'
import InputField from '@/pages/auth/components/InputField.vue'
import BtnMed from '@/components/button/BtnMed.vue'

const email = ref('')
const password = ref('')
const passwordCheck = ref('')
const username = ref('')
const phone = ref('')

const passwordError = ref('')

// 사용자가 입력한 값에서 숫자만 추출한 뒤, 숫자 개수에 맞게 하이픈 자동으로 들어가도록 하였음
watch(phone, (newValue) => {
  const numbers = newValue.replace(/[^0-9]/g, '');
  let formatted = '';
  if (numbers.length < 4) {
    formatted = numbers;
  } else if (numbers.length < 8) {
    formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
  
  // 입력되는 값으로 업데이트하며 표시하여줌
  phone.value = formatted;
});

function onSubmit() {
  if (!password.value || !passwordCheck.value) {
    passwordError.value = '비밀번호를 모두 입력해주세요.'
    return
  }
  if (password.value !== passwordCheck.value) {
    passwordError.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  passwordError.value = ''
  const fullPhone = `${phone1.value}-${phone2.value}-${phone3.value}`;
  alert(`회원가입 성공!\n이메일: ${email.value}\n연락처: ${fullPhone}`)

  // 가입처리 로직 추가 예정!
}
</script>

<style scoped>
.signup-form {
  margin: 2rem;
  box-sizing: border-box;
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
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 90px;
  z-index: 100;
  width: 330px;
}
</style>
