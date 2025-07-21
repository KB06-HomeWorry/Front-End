<template>
  <div class="login-page">
    <h2 class="login-title">로그인</h2>

    <form @submit.prevent="onLogin" class="login-form">
      <InputSimple
        v-model="username"
        type="text"
        placeholder="이메일을 입력하세요."
        autocomplete="username"
      />

      <InputSimple
        v-model="password"
        type="password"
        placeholder="비밀번호를 입력하세요."
        autocomplete="current-password"
      />

      <BtnMed class="login-btn" type="submit" text="로그인" />
    </form>
    <div class="login-links">
      <button class="link-btn" @click="onSignup">회원가입</button>
      <button class="link-btn" @click="onResetPw">비밀번호 찾기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import InputSimple from './components/InputSimple.vue'
import BtnMed from '@/components/button/BtnMed.vue'

const router = useRouter()
const username = ref('')
const password = ref('')

async function onLogin() {
  if (!username.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요.')
    return
  }
  try {
    const response = await axios.post('/api/auth/signin', {
      username: username.value,
      password: password.value,
    })
    const token = response.data.token
    if (token) {
      localStorage.setItem('user-token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    alert('로그인에 성공했습니다!')
    router.push('/') 
  } catch (error) {
    const errorMessage = error.response?.data?.message || '로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.'
    alert(errorMessage)
  }
}

function onSignup() {
  router.push('/auth/signup-agreement')
}
function onResetPw() {
  router.push('/auth/reset-password')
}
</script>

<style scoped>
.login-page {
  max-width: 360px;
  margin: 80px auto 0;
  padding: 1rem;
}
.login-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
}
.login-form {
  display: flex;
  flex-direction: column;
}
.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  /* margin-top: 16px; */
}
.login-links {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}
.link-btn {
  border: none;
  background: none;
  color: #3464eb;
  font-size: 15px;
  cursor: pointer;
  padding: 0 4px;
  text-decoration: underline;
}
</style>
