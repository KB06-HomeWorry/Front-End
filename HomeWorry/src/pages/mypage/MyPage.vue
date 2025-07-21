<template>
  <div>
    <MyMenu
      v-for="menu in menuList"
      :key="menu.label"
      :icon="menu.icon"
      :label="menu.label"
      :isDelete="menu.isDelete"
      @click="menu.onClick"
      @mouseenter="menu.isDelete && onDeleteMouseEnter()"
      @mouseleave="menu.isDelete && onDeleteMouseLeave()"
    />
  </div>
</template>

<script setup>
import MyMenu from '@/pages/mypage/components/MyMenu.vue'
import noticeIcon from '@/assets/icons/my_notice.png'
import privacyIcon from '@/assets/icons/my_privacy.png'
import changepwIcon from '@/assets/icons/my_change_password.png'
import deleteLight from '@/assets/icons/my_deleteaccount_light.png'
import deleteDark from '@/assets/icons/my_deleteaccount_dark.png'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const isDeleteHover = ref(false)
const onDeleteMouseEnter = () => { isDeleteHover.value = true }
const onDeleteMouseLeave = () => { isDeleteHover.value = false }

const router = useRouter();

const goToNotice = () => router.push('/notice')
const goToPrivacy = () => router.push('/privacy')
const goToChangePw = () => router.push('/auth/change-password')

const menuList = computed(() => [
  { icon: noticeIcon, label: '공지사항', onClick: goToNotice },
  { icon: privacyIcon, label: '개인정보 수집 및 이용', onClick: goToPrivacy },
  { icon: changepwIcon, label: '비밀번호 변경', onClick: goToChangePw },
  {
    icon: isDeleteHover.value ? deleteDark : deleteLight,
    label: '회원탈퇴',
    onClick: onDeleteClick,
    isDelete: true
  }
])

const onDeleteClick = () => {
  alert('회원탈퇴 기능 실행!');
}
</script>

<style></style>