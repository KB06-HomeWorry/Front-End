<template>
  <div>
    <AuthTitle title="개인정보 동의" />
    <div class="agreement-content bodyLight16px">
      <p>
        [여기에 개인정보 수집 및 이용 동의 내용이 들어갈 예정...]
        <br /><br />
        본인은 개인정보 보호법 등 관련 법령에 따라 개인정보를 수집·이용하는 것에 동의합니다... 어쩌고...
      </p>
      <label class="agree-check">
        <input type="checkbox" v-model="agreed" />
        <span class="checkmark"></span>
        개인정보 수집 및 이용에 동의합니다.
      </label>
    </div>
    <BtnMed
    class="bottom-btn"
    :class="{ 'btn-disabled': !agreed }"
    text="확인"
    :disabled="!agreed"
    @click="goNext"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthTitle from '@/pages/auth/components/AuthTitle.vue'
import BtnMed from '@/components/button/BtnMed.vue' 

const agreed = ref(false)
const router = useRouter()
const goNext = () => {
    if (!agreed.value) return
    router.push('/auth/signup-form')
}

</script>

<style scoped>
.agreement-content {
  margin: 2rem;
}

.agreement-content p {
  margin-bottom: 40px;
}

/* 확인버튼 일단 하단에서 90px 고정시켜두었음. 상단의 Title도 위에서 90px위치에 고정되어 있음 */
.bottom-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 90px;
  z-index: 100;
  transition: background 0.2s;    
}

.bottom-btn.btn-disabled {
  background-color: var(--color-mediumgray) !important;
  color: var(--color-white) !important;
  cursor: not-allowed;
}
</style>
