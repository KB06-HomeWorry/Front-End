<template>
  <div class="agency-profile-wrap">
    <div class="profile-row">
      <img :src="agency.profileUrl" alt="프로필" class="profile-img" />
      <div class="profile-info">
        <div class="agency-name titleBold16px">{{ agency.officeName }}</div>
        <div class="hashtags">
          <Hashtag v-for="tag in agency.hashtags" :key="tag">{{ tag }}</Hashtag>
        </div>
      </div>
    </div>
    <table class="agency-info-table">
        <tbody>
      <tr>
        <td class="bodyMedium12px">대표</td>
        <td class="bodyLight12px">{{ agency.ceo }}</td>
      </tr>
      <tr>
        <td class="bodyMedium12px">등록번호</td>
        <td class="bodyLight12px">{{ agency.registrationNo }}</td>
      </tr>
      <tr>
        <td class="bodyMedium12px">주소</td>
        <td class="bodyLight12px">{{ agency.address }}</td>
      </tr>
      <tr>
        <td class="bodyMedium12px">연락처</td>
        <td class="bodyLight12px">{{ agency.phone }}</td>
      </tr>
      </tbody>
    </table>
    <div class="agency-description">
      <div class="desc-content bodyLight12px">{{ agency.description || "등록된 소개글이 없습니다." }}</div>
    </div>
    <div class="agency-btn-row">
      <BtnAgency text="보유 매물 보러가기" color="#fff" @click="goToListingPage" />
      <BtnAgency text="방문 후기 작성하기" color="#fff" @click="goToReviewPage" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Hashtag from '@/pages/agency/components/HashTag.vue'
import BtnAgency from './components/BtnAgency.vue'

const router = useRouter()

// API에서 받아올 agency 정보
// 추후 설계된 DB에 맞춰서 수정 필요
const agency = ref({
  officeName: '',
  profileUrl: '',
  hashtags: [],
  ceo: '',
  registrationNo: '',
  address: '',
  phone: '',
  description:'',
})

// 추후 백엔드 엔드포인트에 맞춰서 수정 필요
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/agencies/1')
    agency.value = res.data
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.')
  }
})

// const agencyId = agency.value.id

const goToListingPage = () => {
  // 추후 백엔드 연동 시 사용
  // router.push(`/agency/${agencyId}/listings`)
  router.push('/agency/listings')
}

const goToReviewPage = () => {
  // 추후 백엔드 연동 시 사용
  // router.push(`/agency/${agencyId}/review`)
  router.push('/agency/review-write')
}
</script>

<style scoped>
.agency-profile-wrap {
  margin: 1.5rem 2rem;
}

.profile-row {
  display: flex;
  align-items: center;
  margin: 12px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.profile-info {
  flex: 1;
}

.agency-name{
    text-align: center;
    color: var(--color-primary);
}

.agency-info-table {
  width: 100%;
  border-collapse: separate;
  border-spacing:0;
  border: 0.1px solid var(--color-mediumgray);
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.agency-info-table td {
  padding: 6px 12px;
  border-bottom: 0.1px solid var(--color-mediumgray);
  line-height: 18px;
}

.agency-info-table td:first-child {
  border-right: 0.1px solid var(--color-mediumgray);
  width: 80px; /* 너비 고정 */
  background: #fafbfc; /* 항목만 배경 */
  text-align: center;
}

.agency-info-table tr:last-child td {
  border-bottom: none;
}

/* 첫 행 왼쪽 */
.agency-info-table tr:first-child td:first-child {
  border-top-left-radius: 12px;
}
/* 첫 행 오른쪽 */
.agency-info-table tr:first-child td:last-child {
  border-top-right-radius: 12px;
}
/* 마지막 행 왼쪽 */
.agency-info-table tr:last-child td:first-child {
  border-bottom-left-radius: 12px;
}
/* 마지막 행 오른쪽 */
.agency-info-table tr:last-child td:last-child {
  border-bottom-right-radius: 12px;
}

.bodyMedium12px .bodyLight12px { 
    color: var(--color-primary); 
}

.hashtags {
  display: flex;
  justify-content: center;    /* 중앙정렬 */
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;            /* 여러 줄일 때 줄바꿈 */
}

.agency-description {
  margin-top: 12px;
  border-top: 1px solid var(--color-mediumgray);
  border-bottom: 1px solid var(--color-mediumgray);
  padding: 12px 10px;
  min-height: 80px;
  /* background: var(--color-lightgray2); */
}

.desc-content {
  line-height: 1.6;
  white-space: pre-line;
}

.agency-btn-row {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  justify-content: center;   /* 중앙정렬 */
  align-items: center;
}
</style>
