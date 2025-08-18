<template>
  <div class="root">
    <AuthTitle title="비밀번호 찾기" />
    <form class="signup-form" @submit.prevent="onSubmit" novalidate>

      <!-- 이름 입력 -->
      <InputField
        label="이름을 입력해주세요."
        placeholder="이름을 입력하세요."
        v-model="username"
      />

      <!-- 이메일 입력 -->
      <InputField
        label="이메일을 입력해주세요."
        placeholder="이메일 주소를 입력하세요."
        type="email"
        v-model="email"
      />

      <!-- 에러 메시지 -->
      <div
        class="form-error bodyMedium16px"
        v-html="formError"
        aria-live="assertive"
      ></div>

      <!-- 제출 버튼 -->
      <BtnMed
        class="submit-btn"
        type="submit"
        text="확인"
        :disabled="loading"
      />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AuthTitle from '@/pages/auth/components/AuthTitle.vue'
import InputField from '@/components/input/InputField.vue'
import BtnMed from '@/components/button/BtnMed.vue'

const router = useRouter()

// 폼 상태
const email = ref('')
const username = ref('')
const formError = ref('')
const loading = ref(false)

// 제출 처리 값 검증 -> 서버 확인 -> 라우팅
async function onSubmit() {
  if (loading.value) return
  formError.value = ''
  loading.value = true

  if (!username.value.trim() || !email.value.trim()) {
    formError.value = '이름과 이메일을 모두 입력해주세요.'
    loading.value = false
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    formError.value = '올바른 이메일 주소를 입력해주세요.'
    loading.value = false
    return
  }

  try {
    const res = await axios.get('http://localhost:8080/member/checkNameAndEmail', {
      params: {
        email: email.value.trim(),
        name: username.value.trim(),
      },
    })

    if (res.data) {
      router.push({
        path: '/auth/reset-password/sent',
        query: { email: email.value.trim() },
      })
    } else {
      formError.value = '일치하는 회원 정보가 없습니다.'
    }
  } catch (err) {
    formError.value =
      err.response?.data?.message ||
      '서버 오류가 발생했습니다.<br>잠시 후 다시 시도해주세요.'
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
