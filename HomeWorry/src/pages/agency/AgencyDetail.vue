<template>
  <div>
    <SimpleHeader :title="agency.office_name">
      <template #action>
        <button
          class="bookmark-btn"
          @click="toggleBookmark"
          aria-label="북마크"
          :title="isFavorite ? '북마크 해제' : '북마크 등록'"
        >
          <img
            :src="isFavorite ? bookmarkOn : bookmarkOff"
            :class="['bookmark-icon', { pop: heartAnim }]"
            @animationend="heartAnim = false"
            alt="북마크"
          />
        </button>
      </template>
    </SimpleHeader>
  <div class="agency-profile-wrap">
    <div class="profile-row">
      <img :src="profileImg" alt="프로필" class="profile-img" />
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
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import bookmarkOn from '@/assets/icons/star_filled.png'
import bookmarkOff from '@/assets/icons/star_outline.png'

import profile1 from '@/assets/icons/sample_profile1.png'
import profile2 from '@/assets/icons/sample_profile2.png'
import profile3 from '@/assets/icons/sample_profile3.png'

const sampleImgs=[profile1,profile2,profile3]
const profileImg=ref(sampleImgs[Math.floor(Math.random()*sampleImgs.length)])

const router = useRouter()
const route = useRoute()

const office_id = route.query.agencyId || route.params.agencyId || '1'
const userToken = localStorage.getItem('user-token')

// API에서 받아올 agency 정보
const agency = ref({
  office_name: '',
  profileUrl: '',
  hashtags: [],
  agent_name: '',
  license_number: '',
  address: '',
  phone: '',
  description:'',
})

const agencyScore = ref({
  finalTrustScore:'',
  averageMetricScores:{
    listing_accuracy_score:'',
    cost_transparency_score:'',
    professionalism_score:'',
    accountability_score:''
  }
})
const reviews = ref([])

// 북마크 상태
const isFavorite = ref(false)

async function fetchFavoriteStatus() {
  try {
    const res = await axios.get(`/api/agent/${userToken}/isFavorite/${office_id}`)
    isFavorite.value = res.data
  } catch (e) {
    isFavorite.value = false
  }
}

async function toggleBookmark() {
  try {
    if (isFavorite.value) {
      // [북마크 해제]
      await axios.delete(`/api/agent/${userToken}/favorite/${office_id}`)
      isFavorite.value = false
    } else {
      // [북마크 등록]
      await axios.get(`/api/agent/${userToken}/favorite/${office_id}`)
      isFavorite.value = true
    }
  } catch (e) {
    alert('북마크 처리 중 오류가 발생했습니다.')
  }
}

onMounted(async () => {
  try {
    // 중개사 정보 조회
    const res = await axios.get(`http://localhost:8080/api/agent/${office_id}`)
    agency.value = {
      ...agency.value,
      office_name: res.data.officeName,
      agent_name: res.data.agentName,
      license_number: res.data.licenseNumber,
      address: res.data.address,
      phone: res.data.phone,
      description: res.data.description,
      hastags:res.data.hashtags || []
    }

    // 공인중개사 소개글
    if (!agency.value.description || agency.value.description.trim() === '') {
      const fallbackDescriptions = [
        "젊은 공인중개사들의 젊은 부동산",
        "안녕하세요 엄마의 마음으로 방을 구하는데 최선을 다하겠습니다^^",
        "최선다해서 금방거래되도록 노력하는 부동산입니다",
        "공감하며 마음을 함께 하겠습니다! 어떤식으로든 고객들에게 이득을 남겨드리겠습니다. 고객과의 약속 ,신뢰를 최우선으로 생각합니다.",
        "원하는 집을 찾을때까지~ 광진구 제일부동산 입니다.",
        "내집을 구하는 마음으로 정성을 다하겠습니다.",
        "저희 중개법인은 경·공매 전문 부동산학 박사 임원진을 갖추고 있는 사무소입니다.",
        "광진구에 위치한 공인중개사 사무소 입니다. 평일/공휴일 정상근무, 일요일 휴무일",
        "언제든 편하게 전화주시면 신의와 성실로 상담해드리겠습니다."
      ]
      const randIndex = Math.floor(Math.random() * fallbackDescriptions.length)
      agency.value.description = fallbackDescriptions[randIndex]
    }

    //hashtag
    if (!agency.value.hashtags || agency.value.hashtags.length === 0) {
  const hashtagPool = [
    '#상가', '#빌라', '#아파트', '#신축', '#분양', '#매매', '#임대', '#월세', '#전세',
    '#믿을수있는중개사', '#친절한공인중개사', '#발품중개', '#현장방문', '#정직한부동산',
    '#풀옵션', '#역세권', '#반려동물가능', '#테라스', '#복층', '#주차가능'
  ]

  function getRandomHashtags(pool, min = 3, max = 4) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    const count = Math.floor(Math.random() * (max - min + 1)) + min
    return shuffled.slice(0, count)
  }

  agency.value.hashtags = getRandomHashtags(hashtagPool)
}


    // 중개사 신뢰점수 조회
    const res_score = await axios.get(`http://localhost:8080/api/agent/trustScore/${office_id}`)
    agencyScore.value = {
      ...agencyScore.value,
      finalTrustScore: res_score.data.totalTrustScore,
      averageMetricScores:{
        listing_accuracy_score: res_score.data.listingAccuracyScore,
        cost_transparency_score: res_score.data.costTransparencyScore,
        professionalism_score: res_score.data.professionalismScore,
        accountability_score: res_score.data.accountabilityScore
      }
    }

    // 중개사 리뷰 목록 조회
    const res_reviews = await axios.get(`http://localhost:8080/api/agent/reviews/${office_id}`)
    reviews.value = res_reviews.data

    // 중개사 북마크 여부 조회
    await fetchFavoriteStatus()    
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.')
  }
})

const goToListingPage = () => {
  router.push(`/agency/${office_id}/listings`)
}

const goToReviewPage = () => {
  router.push(`/agency/${office_id}/review-write`)
}
</script>

<style scoped>
.bookmark-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0 0 6px;
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-right: 2px;
}
.bookmark-icon {
  width: 22px;
  height: 22px;
  display: block;
  transition: filter 0.15s;
}
/* 팡! 애니메이션 */
@keyframes pop {
  0%   { transform: scale(1); }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.bookmark-icon.pop {
  animation: pop 0.28s cubic-bezier(.4,2,.6,1) both;
}

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
