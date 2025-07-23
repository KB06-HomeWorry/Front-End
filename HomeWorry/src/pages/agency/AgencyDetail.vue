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
      <div class="desc-title bodyMedium16px">중개사무소 소개</div>
      <div class="desc-content">{{ agency.description || "등록된 소개글이 없습니다." }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Hashtag from '@/pages/agency/components/HashTag.vue'
import axios from 'axios'

// API에서 받아올 agency 정보
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

onMounted(async () => {
  // json-server를 통해 GET 예시 (id=1 사용)
  try {
    const res = await axios.get('http://localhost:3001/agencies/1')
    agency.value = res.data
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.')
  }
})
</script>

<style scoped>
.agency-profile-wrap {
  margin: 2rem;
}

.profile-row {
  display: flex;
  align-items: center;
  margin: 12px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--color-light);
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
  margin-top: 12px;
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
  border-radius: 12px;
  border: 0.1px solid var(--color-mediumgray);
  padding: 20px 18px 18px 18px;
  min-height: 80px;
}

.desc-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 8px;
  letter-spacing: -0.03em;
}

.desc-content {
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
}
</style>
