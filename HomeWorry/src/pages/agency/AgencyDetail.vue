<template>
  <div class="agency-profile-wrap">
    <div class="profile-row">
      <img :src="agency.profileUrl" alt="프로필" class="profile-img" />
      <div class="profile-info">
        <div class="agency-name titleBold16px">{{ agency.office_name }}</div>
        <div class="hashtags">
          <Hashtag v-for="tag in agency.hashtags" :key="tag">{{ tag }}</Hashtag>
        </div>
      </div>
    </div>
    <table class="agency-info-table">
        <tbody>
      <tr>
        <td class="bodyMedium12px">대표</td>
        <td class="bodyLight12px">{{ agency.agent_name }}</td>
      </tr>
      <tr>
        <td class="bodyMedium12px">등록번호</td>
        <td class="bodyLight12px">{{ agency.license_number }}</td>
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
        <AgencyReviewSummary :score-data="agencyScore" />
    <!-- 💡 후기 리스트 출력 부분 추가 -->
    <div class="review-list-wrap" v-if="reviews.length > 0">
      <ReviewItem
        v-for="(review, i) in reviews"
        :key="review.id"
        :index="i + 1"
        :date="review.createdAt"
        :content="review.comment"
      />
    </div>
    <div v-else class="bodyLight12px" style="text-align:center;color:var(--color-mediumgray);margin:24px 0;">
      아직 작성된 후기가 없습니다.
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import Hashtag from '@/pages/agency/components/HashTag.vue'
import BtnAgency from '@/pages/agency/components/BtnAgency.vue'
import AgencyReviewSummary from '@/pages/agency/components/AgencyReviewSummary.vue'
import ReviewItem from '@/pages/agency/components/ReviewBox.vue'
import { calculateAgencyScore } from '@/pages/agency/composables/useAllTrustScore.js'

const router = useRouter()
const route = useRoute()

const office_id = route.query.agencyId || route.params.agencyId || '1'

// API에서 받아올 agency 정보
// const agency = ref({
//   office_name: '',
//   profileUrl: '',
//   hashtags: [],
//   agent_name: '',
//   license_number: '',
//   address: '',
//   phone: '',
//   description:'',
// })

// onMounted(async () => {
//   try {
//     // const res = await axios.get(`http://localhost:8080/api/agent/${office_id}`)
//     agency.value = {
//       // ...agency.value,
//       // office_name: res.data.officeName,
//       // agent_name: res.data.agentName,
//       // license_number: res.data.agentNumber,
//       // address: res.data.address,
//       // phone: res.data.phone
//     }
//   } catch (e) {
//     alert('중개사무소 정보를 불러오지 못했습니다.')
//   }
// })

const agency = ref({})
const agencyScore = ref(null)
const reviews = ref([])

onMounted(async () => {
  try {
    const [agencyRes, reviewsRes] = await Promise.all([
      axios.get(`http://localhost:3001/agencies/${office_id}`),
      axios.get(`http://localhost:3001/reviews?agency_id=${office_id}`)
    ]);

    agency.value = agencyRes.data;
    reviews.value = reviewsRes.data;

    if (reviews.value && reviews.value.length > 0) {
      agencyScore.value = calculateAgencyScore(reviews.value);
    } else {
      agencyScore.value = {
        finalTrustScore: 0,
        averageMetricScores: {
          listing_accuracy_score: 0, cost_transparency_score: 0,
          professionalism_score: 0, accountability_score: 0,
        },
      };
    }
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.');
    console.error(e);
  }
});

// const office_id = agency.value.id

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

.review-list-wrap {
  margin-top: 28px;
  margin-bottom: 10px;
}
</style>
