<template>
  <div>
    <SimpleHeader title="마이페이지" />

    <div class="mypage-container">
      <!-- 프로필 영역 -->
      <div class="profile-box">
        <img class="profile-img" :src="profileImageSrc" alt="프로필" />
        <div class="profile-info">
          <div class="profile-name titleBold20px">{{ user.name }}</div>
          <div class="profile-email bodyMedium14px">
            <span class="emoji">📧 </span>{{ user.email }}
          </div>
          <div class="profile-phone bodyMedium14px">
            <span class="emoji">📞 </span>{{ formatPhone(user.phone) }}
          </div>
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

    <CurrentPwModal
      :visible="showPwModal"
      @close="showPwModal = false"
      @success="onPwModalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import basicProfile from '@/assets/icons/ai_title.png'
import CurrentPwModal from '@/pages/mypage/components/CurrentPwModal.vue'
import MyMenu from '@/pages/mypage/components/MyMenu.vue'
import bookmarkIcon from '@/assets/icons/my_bookmark.png'
import listingbookmarkIcon from '@/assets/icons/my_listing.png'
import privacyIcon from '@/assets/icons/my_privacy.png'
import changepwIcon from '@/assets/icons/my_change_password.png'
import deleteLight from '@/assets/icons/my_deleteaccount_light.png'
import deleteDark from '@/assets/icons/my_deleteaccount_dark.png'

const user = ref({
  profileImg: '',
  name: '',
  email: '',
  phone: ''
})

const token = localStorage.getItem('user-token');

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/member/getprofile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = res.data
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

// user정보에서 프로필 이미지가 없을 시, 기본 이미지로 띄우도록 설정
const profileImageSrc = computed(() =>
  user.value.profileImg && user.value.profileImg.trim() !== ''
    ? user.value.profileImg
    : basicProfile
)

const isDeleteHover = ref(false)
const onDeleteMouseEnter = () => { isDeleteHover.value = true }
const onDeleteMouseLeave = () => { isDeleteHover.value = false }

const router = useRouter();
const loading = ref(false)
const showPwModal = ref(false)
const deleteMode = ref(false)

// 메뉴 클릭 핸들러
const goToAgencyBookmark = () => router.push('/my/agency/bookmark')
const goToListingBookmark = () => router.push('/my/listing/bookmark')
const goToPrivacy = () => router.push('/my/privacy')
const handleChangePwClick = () => {
  showPwModal.value = true
  deleteMode.value = false
}
const handleDeleteClick = () => {
  showPwModal.value = true
  deleteMode.value = true
}

// 메뉴 구성
const menuList = computed(() => [
  { icon: bookmarkIcon, label: '저장된 중개사무소 목록', onClick: goToAgencyBookmark },
  { icon: listingbookmarkIcon, label: '저장된 매물 목록', onClick: goToListingBookmark },
  { icon: privacyIcon, label: '개인정보 수집 및 이용', onClick: goToPrivacy },
  { icon: changepwIcon, label: '비밀번호 변경', onClick: handleChangePwClick },
  {
    icon: isDeleteHover.value ? deleteDark : deleteLight,
    label: '회원탈퇴', onClick: () => { showPwModal.value = true; deleteMode.value = true },
    isDelete: true
  }
]);

// 비밀번호 모달 닫기 시 deleteMode도 초기화
function onPwModalClose() {
  showPwModal.value = false
  deleteMode.value = false
}

async function onPwModalSuccess() {
  if (deleteMode.value) {
    handleDeleteClickAfterPw();
  } else {
    const pwResetToken = await axios.get(`http://localhost:8080/member/verify-password`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    router.push(`/auth/change-password/${encodeURIComponent(pwResetToken.data)}`)
  }
  deleteMode.value = false; // 상태 초기화
}

const handleDeleteClickAfterPw = async () => {
  if (loading.value) return
  loading.value = true
  const ok = confirm('정말로 회원을 탈퇴하시겠습니까?\n탈퇴 시 모든 정보가 삭제됩니다.')
  if (!ok) {
    loading.value = false
    return
  }

  try {
    await axios.delete(`http://localhost:8080/member/withdraw`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert('회원탈퇴가 완료되었습니다.');
    router.replace('/auth/login');
  } catch (err) {
    alert(
      err.response?.data?.message ||
      '회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'
    )
  } finally {
    loading.value = false
  }
}

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
.mypage-container{
  width: 100%;
  box-sizing: border-box;
}

.profile-box {
  display: flex;
  align-items: center;
  padding: 32px 0 24px 0;
  border-bottom: 1px solid var(--color-light);
}

.profile-img {
  width: 100px;
  height: 100px;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  background: var(--color-white);
  object-fit: cover;
  margin-left: 2rem;
  margin-right: 1.2rem;
  padding: 12px;
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