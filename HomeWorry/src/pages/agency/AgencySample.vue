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
    <!-- 후기 리스트 출력 부분 -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Hashtag from '@/pages/agency/components/HashTag.vue'
import BtnAgency from '@/pages/agency/components/BtnAgency.vue'
import AgencyReviewSummary from '@/pages/agency/components/AgencyReviewSummary.vue'
import ReviewItem from '@/pages/agency/components/ReviewBox.vue'
import { calculateAgencyScore } from '@/pages/agency/composables/useAllTrustScore.js'

const router = useRouter()

// 1번 중개사 하드코딩 데이터
const agency = ref({
  id: 1,
  office_name: "멀티캠퍼스 공인중개사",
  profileUrl: "https://i.namu.wiki/i/cIYFHoiiOkDs4qh_MW63yOV_O0zPs4VMBKp4HdjOdm7rNHlRLRc5vS6P1uryiaRrGg4kQkbczdDwwpNECwpQPQ.webp",
  hashtags: ["#오피스텔", "#오피스", "#전월세", "#원룸", "#투룸"],
  agent_name: "이다연",
  license_number: "00000000",
  address: "서울 관악구 능동로 195-16(문지동) 5층",
  phone: "031-1111-2222",
  description: `🏢 안녕하세요, 멀티캠퍼스 공인중개사입니다!

저희는 오피스텔과 오피스, 다양한 전월세 매물을 전문적으로 중개하고 있습니다. 고객 한 분 한 분의 소중한 공간을 찾아드리는 것을 최우선 가치로 생각합니다.

✔ 원룸부터 투룸까지, 합리적인 가격과 꼼꼼한 매물 관리로 믿고 맡기실 수 있습니다.
✔ 친절한 상담과 신속한 계약 진행으로 스트레스 없는 거래를 약속드립니다.

✨ 언제든 문의주시면 최선을 다해 도와드리겠습니다. 
여러분의 행복한 새 출발을 응원합니다! 😊`
})

// 1번 중개사 리뷰 하드코딩
const reviews = ref([
  {
    id: 1,
    agency_id: 1,
    reviewType: "transaction",
    answers: [0, 0, 0, 0, 0, 0, 0], 
    comment: "정말 완벽하고 믿을만한 거래였습니다.",
    createdAt: "2025-07-25"
  },
  {
    id: 2,
    agency_id: 1,
    reviewType: "consultation",
    answers: [1, 1, 1, 1, 1], 
    comment: "전체적으로 무난했음.",
    createdAt: "2025-07-22"
  },
  {
    id: 3,
    agency_id: 1,
    reviewType: "transaction",
    answers: [0, 2, 0, 2, 0, 0, 2],
    comment: "매물정보, 계약 일부는 불만족.",
    createdAt: "2025-05-25"
  }
])

// 점수 계산도 하드코딩된 리뷰로 처리
const agencyScore = ref(calculateAgencyScore(reviews.value))

const goToListingPage = () => {
  router.push('/agency/listings')
}
const goToReviewPage = () => {
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
  width: 80px;
  background: #fafbfc;
  text-align: center;
}
.agency-info-table tr:last-child td {
  border-bottom: none;
}
.agency-info-table tr:first-child td:first-child {
  border-top-left-radius: 12px;
}
.agency-info-table tr:first-child td:last-child {
  border-top-right-radius: 12px;
}
.agency-info-table tr:last-child td:first-child {
  border-bottom-left-radius: 12px;
}
.agency-info-table tr:last-child td:last-child {
  border-bottom-right-radius: 12px;
}
.bodyMedium12px .bodyLight12px {
  color: var(--color-primary);
}
.hashtags {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.agency-description {
  margin-top: 12px;
  border-top: 1px solid var(--color-mediumgray);
  border-bottom: 1px solid var(--color-mediumgray);
  padding: 12px 10px;
  min-height: 80px;
}
.desc-content {
  line-height: 1.6;
  white-space: pre-line;
}
.agency-btn-row {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}
.review-list-wrap {
  margin-top: 28px;
  margin-bottom: 10px;
}
</style>