<template>
  <div class="mypage-container">
    <!-- 프로필 영역 -->
    <div class="profile-box">
      <img class="profile-img" :src="user.profileImg" alt="프로필" />
      <div class="profile-info">
        <div class="profile-name titleBold20px">{{ user.name }}</div>
        <div class="profile-email bodyMedium14px"><span class="emoji">📧</span>{{ user.email }}</div>
        <div class="profile-phone bodyMedium14px">
          <span class="emoji">📞</span>{{ formatPhone(user.phone) }}
        </div>
      </div>
    </div>

    <div class="mypage-menu-list">
      <MyMenu
        v-for="menu in menuList"
        :key="menu.label"
        :icon="typeof menu.icon === 'function' ? menu.icon() : menu.icon"
        :label="menu.label"
        :isDelete="menu.isDelete"
        @click="menu.onClick"
        @mouseenter="menu.isDelete && onDeleteMouseEnter()"
        @mouseleave="menu.isDelete && onDeleteMouseLeave()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import MyMenu from '@/pages/mypage/components/MyMenu.vue'
import noticeIcon from '@/assets/icons/my_notice.png'
import privacyIcon from '@/assets/icons/my_privacy.png'
import changepwIcon from '@/assets/icons/my_change_password.png'
import deleteLight from '@/assets/icons/my_deleteaccount_light.png'
import deleteDark from '@/assets/icons/my_deleteaccount_dark.png'

// json-server로 테스트하였음. 백엔드 연결시 서버 포트&URI 수정 요망
const user = ref({
  profileImg: 'https://via.placeholder.com/84x84.png?text=User',
  name: '',
  email: '',
  phone: ''
})
onMounted(async () => {
  try {
    // const res = await axios.get('http://localhost:8080/api/users')
    // const users = res.data.data
    const res = await axios.get('http://localhost:3000/users')
    const data = res.data[0]
    user.value = {
      ...user.value,
      name: data.name,
      email: data.email,
      phone: data.phone
    }
  } catch (err) {
    alert('유저 정보를 불러올 수 없습니다.')
    console.error(err)
  }
})

const isDeleteHover = ref(false)
const onDeleteMouseEnter = () => { isDeleteHover.value = true }
const onDeleteMouseLeave = () => { isDeleteHover.value = false }

const router = useRouter();
const loading = ref(false)

const goToNotice = () => router.push('/notice')
const goToPrivacy = () => router.push('/my/privacy')
const goToChangePw = () => router.push('/auth/change-password')

// 회원탈퇴 처리
const handleDeleteClick = async () => {
  if (loading.value) return
  loading.value = true
  const ok = confirm('정말로 회원을 탈퇴하시겠습니까?\n탈퇴 시 모든 정보가 삭제됩니다.')
  if (!ok) {
    loading.value = false
    return
  }

  try {
    await axios.post('http://localhost:8080/api/member/withdraw')
    alert('회원탈퇴가 완료되었습니다.')
    router.replace('/auth/login')
  } catch (err) {
    alert(
      err.response?.data?.message ||
      '회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'
    )
  } finally {
    loading.value = false
  }
}

const menuList = computed(() => [
  { icon: noticeIcon, label: '공지사항', onClick: goToNotice },
  { icon: privacyIcon, label: '개인정보 수집 및 이용', onClick: goToPrivacy },
  { icon: changepwIcon, label: '비밀번호 변경', onClick: goToChangePw },
  {
    icon: isDeleteHover.value ? deleteDark : deleteLight,
    label: '회원탈퇴',
    onClick: handleDeleteClick,
    isDelete: true
  }
]);

// 연락처 하이픈 포맷팅 추가
function formatPhone(phone) {
  if (!phone) return '';
  const numbers = phone.replace(/[^0-9]/g, '');
  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  } else if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  } else {
    return phone;
  }
}
</script>

<style scoped>
.profile-box {
  display: flex;
  align-items: center;
  padding: 32px 0 24px 0;
  border-bottom: 1px solid var(--color-light);
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--color-primary);
  object-fit: cover;
  margin-left: 2rem;
  margin-right: 1.2rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  color: var(--color-primary);
  gap: 2px;
}

.mypage-menu-list {
  margin-top: 0;
}
</style>