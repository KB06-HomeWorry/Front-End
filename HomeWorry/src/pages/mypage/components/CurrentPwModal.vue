<template>
  <div v-if="visible" class="modal-bg">
    <div class="modal-content titleBold16px">
      <h3>비밀번호 확인</h3>
      <div class="pw-row">
        <input
          class="pw-input bodyLight12px"
          type="password"
          v-model="currentPw"
          placeholder="현재 비밀번호 입력"
          @keyup.enter="submit"
          autofocus
        />
    </div>
      <div class="modal-error" v-if="error">{{ error }}</div>
      <div class="modal-actions">
        <button class="modal-btn bodyMedium16px" @click="submit">확인</button>
        <button class="modal-btn bodyMedium16px" @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close', 'success'])

const currentPw = ref('')
const error = ref('')
const router = useRouter()

const usertoken = localStorage.getItem('user-token');

watch(() => props.visible, (val) => {
  if (val) {
    currentPw.value = ''
    error.value = ''
  }
})

async function submit() {
  if (!currentPw.value) {
    error.value = '비밀번호를 입력해주세요.'
    return
  }
  try {
    const res = await axios.post('http://localhost:8080/api/member/verify-password-check', {
      password: currentPw.value,
      token: usertoken
    })
    if (res.data) {emit('success')}
    close()
  } catch (e) {
    error.value =
      e.response?.data?.message || e.message || '비밀번호가 틀렸습니다.'
  }
}
function close() {
  emit('close')
}
</script>

<style scoped>
.modal-bg { 
  position: fixed; 
  top: 0; left: 0; 
  width: 100vw; 
  height: 100vh; 
  background: rgba(0,0,0,.3); 
  display: flex; 
  align-items: center; 
  justify-content: center;
  z-index: 2000;
}

.modal-content { 
  background: #fff; 
  border-radius: 12px; 
  padding: 28px 32px 32px 32px; 
  min-width: 280px;
  width: 280px;   /* 버튼2+gap과 동일한 폭 */
  box-sizing: border-box;
  color: var(--color-primary);
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}

.pw-input {
  width: 100%;      /* modal-content 폭 기준 */
  margin-top: 8px;
  border: 1px solid var(--color-light);
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  font-size: 16px;
}

.pw-input::placeholder {
  color: var(--color-mediumgray);  
  opacity: 1;
}

.modal-error { 
  color: #bf0000; 
  margin: 10px 0;
  text-align: center;
  min-height: 18px;
  font-size: 14px;
}

.modal-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;            /* 버튼 사이 간격 */
  justify-content: center;
  width: 100%;
}

.modal-btn {
  flex: 1 1 0;
  min-width: 0;
  padding: 8px 0;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
  transition: background 0.2s;
  cursor: pointer;
}

.modal-btn:active {
  background: var(--color-mediumgray);
}

</style>
