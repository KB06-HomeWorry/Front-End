<template>
  <div class="root">
    <AuthTitle title="비밀번호 재설정" />
    <!-- 기본 검증은 커스텀 로직 사용 -->
    <form class="signup-form" @submit.prevent="onSubmit" novalidate>
      <InputField
        label="새로운 비밀번호를 입력해주세요."
        placeholder="새비밀번호를 입력하세요."
        :desc="'* 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 8자리 이상'"
        type="password"
        v-model="password"
      />

      <InputField
        label="비밀번호를 한 번 더 입력해주세요."
        placeholder="비밀번호를 한 번 더 입력하세요."
        type="password"
        v-model="passwordCheck"
      />

      <div
        class="form-error bodyMedium16px"
        v-html="formError"
        aria-live="assertive"
      ></div>

      <BtnMed
        class="submit-btn"
        type="submit"
        text="비밀번호 재설정하기"
        :disabled="loading"
      />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import AuthTitle from '@/pages/auth/components/AuthTitle.vue'
import InputField from '@/components/input/InputField.vue'
import BtnMed from '@/components/button/BtnMed.vue'

const router = useRouter()
const route = useRoute()

const password = ref('')
const passwordCheck = ref('')
const formError = ref('')
const loading = ref(false)

const token = route.query.token || route.params.token || ''

/* 클라이언트 검증 -> 서버 요청 -> 후처리 */
async function onSubmit() {
  if (loading.value) return
  formError.value = ''
  loading.value = true
  // 유효성 검사

  if (!password.value.trim() || !passwordCheck.value.trim()) {
    formError.value = '새 비밀번호와 확인란을 모두 입력해주세요.'
    loading.value = false
    return
  }

  if (password.value.length < 8) {
    formError.value = '비밀번호는 8자 이상이어야 합니다.'
    loading.value = false
    return
  }

  if (password.value !== passwordCheck.value) {
    formError.value = '비밀번호가 일치하지 않습니다.'
    loading.value = false
    return
  }

  // 조합 규칙 - 영문 포함, 숫자 또는 특수 중 최소 하나, 8자 이상
  const passwordRegex =
    /^(?=.*[A-Za-z])(?:(?=.*\d)|(?=.*[!@#$%^&*()_+=\-]))[A-Za-z\d!@#$%^&*()_+=\-]{8,}$/
  if (!passwordRegex.test(password.value)) {
    formError.value =
      '영문, 숫자, 특수문자 중 2종류 이상을 조합해 8자 이상 입력하세요.'
    loading.value = false
    return
  }

  try {
    await axios.post('http://localhost:8080/member/resetpassword', {
      password: password.value,
      token
    })

    // 토큰 제거 및 인증 헤더 초기화
    localStorage.removeItem('user-token')
    delete axios.defaults.headers.common['Authorization']

    alert('비밀번호가 재설정되었습니다. 로그인 페이지로 이동합니다.')
    router.replace('/auth/login')
  } catch (err) {
    formError.value =
      err.response?.data?.message ||
      '비밀번호 재설정에 실패했습니다.<br>잠시 후 다시 시도해주세요.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.root {
  padding-top: 60px;
}

.signup-form {
  margin: 1.5rem 0;
  box-sizing: border-box;
  padding: 0 2rem;
}

.submit-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 90px;
  z-index: 100;
  transition: background 0.2s;
}

.form-error {
  color: var(--color-error);
  text-align: center;
  min-height: 22px;
  line-height: 1.2;
  letter-spacing: -0.03em;
}
</style>
