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
        <img :src="profileImg" alt="프로필" class="profile-img" @error="onProfileError" />
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
        <Btn161px35px text="보유 매물 보러가기" color="#fff" @click="goToListingPage" />
        <Btn161px35px text="방문 후기 작성하기" color="#fff" @click="goToReviewPage" />
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
import Btn161px35px from '@/components/button/Btn161px35px.vue'
import AgencyReviewSummary from '@/pages/agency/components/AgencyReviewSummary.vue'
import ReviewItem from '@/pages/agency/components/ReviewBox.vue'
import { calculateAgencyScore } from '@/pages/agency/composables/useAllTrustScore.js'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import bookmarkOn from '@/assets/icons/star_filled.png'
import bookmarkOff from '@/assets/icons/star_outline.png'
import { getAgencyImage } from '@/components/utils/agencyImage'

const router = useRouter()
const route = useRoute()

const office_id = route.query.agencyId || route.params.agencyId || '1'
const userToken = localStorage.getItem('user-token')

// 화면 바인딩용 상태
const agency = ref({
  office_name: '',
  profileUrl: '',
  hashtags: [],
  agent_name: '',
  license_number: '',
  address: '',
  phone: '',
  description: '',
})

// 점수/리뷰
const agencyScore = ref({
  finalTrustScore: '',
  averageMetricScores: {
    listing_accuracy_score: '',
    cost_transparency_score: '',
    professionalism_score: '',
    accountability_score: '',
  },
})
const reviews = ref([])

// 북마크/애니
const isFavorite = ref(false)
const heartAnim = ref(false)

// 대표 이미지: 서버 URL 우선, 없으면 office_id 시드 폴백(초기값도 폴백으로)
const profileImg = ref(getAgencyImage('', String(office_id)))
function onProfileError() {
  profileImg.value = getAgencyImage('', String(office_id))
}

// ---- 즐겨찾기 ----
async function fetchFavoriteStatus() {
  try {
    const res = await axios.get(`/api/agent/${userToken}/isFavorite/${office_id}`)
    isFavorite.value = res.data
  } catch (e) {
    isFavorite.value = false
  }
}
async function toggleBookmark() {
  // 작게 팝 애니
  heartAnim.value = false
  void heartAnim.value
  heartAnim.value = true

  try {
    if (isFavorite.value) {
      await axios.delete(`/api/agent/${userToken}/favorite/${office_id}`)
      isFavorite.value = false
    } else {
      await axios.get(`/api/agent/${userToken}/favorite/${office_id}`)
      isFavorite.value = true
    }
  } catch (e) {
    alert('북마크 처리 중 오류가 발생했습니다.')
  }
}

// ---- 데이터 로드 ----
onMounted(async () => {
  try {
    // 중개사 정보
    const res = await axios.get(`http://localhost:8080/api/agent/${office_id}`)
    agency.value = {
      ...agency.value,
      office_name: res.data.officeName,
      agent_name: res.data.agentName,
      license_number: res.data.licenseNumber,
      address: res.data.address,
      phone: res.data.phone,
      description: res.data.description,
      hashtags: res.data.hashtags || [], 
      profileUrl: res.data.profileUrl || res.data.profileImage || '',
    }

    // 서버 URL 우선, 없으면 폴백(시드: office_id)
    profileImg.value = getAgencyImage(agency.value.profileUrl, String(office_id))

    // 소개글 폴백
    if (!agency.value.description || agency.value.description.trim() === '') {
      const fallbackDescriptions = [

      // 1번 소개글
        `🏢 안녕하세요, 젊은 감각을 가진 공인중개사입니다!

저희는 최신 트렌드와 다양한 주거 니즈를 반영하여, 고객님의 라이프스타일에 꼭 맞는 공간을 제안해드립니다. 정직함과 신뢰를 바탕으로 항상 고객 중심의 중개를 약속합니다.

✔ 합리적인 가격, 빠른 매물 업데이트, 세심한 매물 관리를 최우선으로 합니다.
✔ 친근한 상담과 신속한 계약으로 믿고 맡기실 수 있습니다.

✨ 언제든 문의주시면 성심껏 도와드리겠습니다.
여러분의 새로운 시작을 응원합니다! 😊`,

// 2번 소개글
        `👩‍👧 안녕하세요, 여러분을 위해 발로 뛰는 중개사가 대기하고 있습니다!

한 분 한 분의 소중한 집을 찾아드리는 것을 최우선으로 생각합니다. 처음부터 끝까지 꼼꼼하게 챙기며, 따뜻한 관심으로 정직한 거래를 실현합니다.

✔ 부담 없이 상담부터 시작하세요! 
✔ 믿을 수 있는 부동산 거래, 저희 부동산이 책임집니다.

✨ 언제든 문의주시면 최선을 다하겠습니다.
고객님의 행복한 새 출발을 응원합니다! 😊`,

// 3번 소개글
        `⏱ 안녕하세요, 시간은 금이다!

빠르고 정확한 매물 소개로 고객님의 소중한 시간을 아껴드립니다. 투명한 정보 제공과 정직한 중개로 언제나 믿고 맡기실 수 있습니다.

✔ 신속한 매물 안내, 꼼꼼한 계약 진행
✔ 믿음직한 서비스로 스트레스 없는 거래를 약속드립니다.

✨ 언제든 문의주세요!
고객님의 만족을 위해 항상 최선을 다하겠습니다. 😊`,

// 4번 소개글
        `🤝 공감과 신뢰를 바탕으로 하는 정직한 중개사무소입니다!

고객 한 분 한 분의 상황에 공감하며, 가장 이득이 되는 거래를 위해 늘 고민합니다. 신뢰와 약속을 최우선 가치로 삼아, 진심을 담아 상담해드립니다.

✔ 꼼꼼한 매물 안내와 고객 맞춤형 중개 서비스
✔ 정직하고 투명한 거래를 약속합니다.

✨ 언제든 편하게 연락 주세요.
여러분의 든든한 부동산 파트너가 되겠습니다! 😊`,

// 5번 소개글
        `🔎 광진구 제일의 부동산입니다!

고객님이 원하는 집을 찾을 때까지 함께 고민하고 끝까지 책임집니다. 합리적인 가격, 세심한 매물 관리, 친절한 상담으로 신뢰받는 부동산이 되겠습니다.

✔ 다양한 매물 라인업, 꼼꼼한 비교 안내
✔ 친근하고 성실한 상담 서비스 제공

✨ 언제든 문의주시면 최선을 다하겠습니다.
여러분의 행복한 내 집 마련을 응원합니다! 😊`,


// 6번 소개글
        `🏡 내 집을 구하는 마음으로 정성을 다하는 공인중개사입니다!

고객 한 분 한 분의 입장에서 최적의 매물을 추천드리며, 내 가족이 머물 집처럼 신중하게 중개합니다. 진심을 담은 서비스로 최고의 만족을 드리겠습니다.

✔ 맞춤형 매물 추천, 투명한 정보 제공
✔ 꼼꼼하고 믿을 수 있는 계약 진행

✨ 언제든 편하게 문의주세요!
고객님의 새로운 시작을 진심으로 응원합니다. 😊`,

// 7번 소개글
        `🎓 부동산학 박사 임원진이 함께하는 전문 중개법인입니다!

경매·공매 분야에 특화된 전문가들이 실전 경험과 전문 지식으로 고객님께 맞춤 솔루션을 제공합니다. 복잡한 거래도 쉽게 풀어드릴 수 있도록 언제나 최선을 다합니다.

✔ 전문적이고 신뢰할 수 있는 매물 안내
✔ 상세하고 꼼꼼한 계약 진행 지원

✨ 언제든 문의주시면 성심껏 도와드리겠습니다.
여러분의 성공적인 거래를 응원합니다! 😊`,

// 8번 소개글
        `📍 24시간 준비되어있는 중개사무소 입니다!

지역 전문가로서 평일·공휴일 언제든 방문하실 수 있고, 일요일은 휴무입니다. 현장 방문과 꼼꼼한 상담으로 고객님께 꼭 맞는 집을 찾을 수 있도록 함께합니다.

✔ 지역별 실시간 매물 안내, 맞춤형 추천
✔ 친절하고 신속한 상담 서비스

✨ 언제든 편하게 연락 주세요!
여러분의 든든한 동반자가 되어드리겠습니다! 😊`,

// 9번 소개글
`📞 신의와 성실로 상담해드리는 공인중개사입니다!

고객님의 입장에서 생각하며, 처음부터 끝까지 친절하게 안내합니다. 부담 없이 전화 주시면 항상 최선을 다해 상담해드리겠습니다.

✔ 맞춤형 상담, 꼼꼼한 계약 진행
✔ 믿을 수 있는 부동산 거래를 약속드립니다.

✨ 언제든 문의주세요!
여러분의 만족을 위해 최선을 다하겠습니다. 😊`,
      ]
      const randIndex = Math.floor(Math.random() * fallbackDescriptions.length)
      agency.value.description = fallbackDescriptions[randIndex]
    }

    // 해시태그 폴백
    if (!agency.value.hashtags || agency.value.hashtags.length === 0) {
      const hashtagPool = [
        '#오피스텔', '#오피스', '#전월세', '#월세', '#전세', '#원룸', '#투룸',
        '#상가', '#빌라', '#아파트', '#신축', '#분양', '#매매', '#임대',
        '#신뢰감', '#친절함', '#발품중개', '#현장방문', '#정직중개', '#역세권'
      ]
      function getRandomHashtags(pool, min = 3, max = 5) {
        const shuffled = [...pool].sort(() => 0.5 - Math.random())
        const count = Math.floor(Math.random() * (max - min + 1)) + min
        return shuffled.slice(0, count)
      }
      agency.value.hashtags = getRandomHashtags(hashtagPool)
    }

    // 신뢰점수
    const res_score = await axios.get(`http://localhost:8080/api/agent/trustScore/${office_id}`)
    agencyScore.value = {
      ...agencyScore.value,
      finalTrustScore: res_score.data.totalTrustScore,
      averageMetricScores: {
        listing_accuracy_score: res_score.data.listingAccuracyScore,
        cost_transparency_score: res_score.data.costTransparencyScore,
        professionalism_score: res_score.data.professionalismScore,
        accountability_score: res_score.data.accountabilityScore
      }
    }

    // 리뷰
    const res_reviews = await axios.get(`http://localhost:8080/api/agent/reviews/${office_id}`)
    reviews.value = res_reviews.data

    // 즐겨찾기 상태
    await fetchFavoriteStatus()
  } catch (e) {
    alert('중개사무소 정보를 불러오지 못했습니다.')
    // 실패 시에도 폴백 유지
    profileImg.value = getAgencyImage('', String(office_id))
  }
})

// 이동
const goToListingPage = () => router.push(`/agency/${office_id}/listings`)
const goToReviewPage = () => router.push(`/agency/${office_id}/review-write`)
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
/* 애니메이션 */
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
  width: 80px;
  background: #fafbfc;
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
