<template>
  <div class="root">
    <AuthTitle class="titleBold24px" title="개인정보 수집 및 이용 " />
    <div class="agreement-content">
      <p class="agreement-head bodyMedium16px">
        📍 본 서비스는 아래와 같이 개인정보를 수집 및 &nbsp;&nbsp;이용합니다.
      </p>
      <p class="agreement-body bodyLight12px">
        &nbsp;&nbsp;&nbsp;회원 가입, 본인 확인, 서비스 제공 및 상담, 고지사항 전달 등 회원 관리와 서비스 이용을 위한 목적으로 이름, 이메일, 비밀번호, 휴대폰 번호 등 필수 정보를 수집합니다. 수집된 개인정보는 회원 탈퇴 시 즉시 파기되며, 관련 법령에 따라 일정 기간 보관이 필요한 경우에는 해당 법령이 정한 기간 동안만 보관됩니다. 개인정보 수집 및 이용에 동의하지 않으실 수 있으나, 동의하지 않을 경우 회원 가입이 제한될 수 있습니다.
      </p>
    </div>
    <BtnMed
    class="bottom-btn"
    :class="{ 'btn-disabled': !agreed }"
    text="확인"
    @click="goBack"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AuthTitle from '@/pages/auth/components/AuthTitle.vue'
import BtnMed from '@/components/button/BtnMed.vue' 

const router = useRouter()
const goBack = () => {
    router.back()
}
</script>

<style scoped>
.root{
  margin-top: 80px;
}
.agreement-content {
  margin: 2rem;
}

.agreement-content p {
  margin-bottom: 16px;
}

.agreement-body{
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  padding: 10px;
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
</style>
