<template>
<MyMenu 
  :icon="noticeIcon"
  label="공지사항"
  @click="goToNotice"
/>
</template>

<script setup>
import MyMenu from '@/pages/mypage/components/MyMenu.vue'
import noticeIcon from '@/assets/icons/my_notice.png'

</script>
<style scoped></style>