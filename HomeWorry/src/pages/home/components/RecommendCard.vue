<template>
  <RouterLink class="rec-card" :to="linkTo">
    <div class="thumb-wrap">
      <img
        class="thumb"
        :src="thumb"
        :alt="`${titleText} 대표 이미지`"
        loading="lazy"
        @error="onImgError"
      />
    </div>
    <div class="body">
      <div class="title bodyMedium10px">{{ titleText }}</div>
      <div class="addr bodyLight8px">{{ addrText }}</div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import axios from 'axios'
import { getListingImage, getFallbackImage } from '@/utils/listingImage'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  hydrate: {
    type: Boolean,
    default: true
  }
})

const data = ref({ ...props.item })

async function hydrateIfNeeded() {
  if (!props.hydrate || !data.value?.id) return

  const hasAddress = !!data.value.address || !!data.value.details
  const hasImage =
    !!data.value.mainImage ||
    !!data.value.imageUrl ||
    !!data.value.thumbnail ||
    (Array.isArray(data.value.images) && data.value.images.length > 0) ||
    (Array.isArray(data.value.photos) && data.value.photos.length > 0)

  if (hasAddress && hasImage) return

  try {
    const token = localStorage.getItem('user-token')
    const id = encodeURIComponent(String(data.value.id))
    const { data: detail } = await axios.get(`/api/listing/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    data.value = { ...detail, ...data.value }
  } catch (e) {
    console.error('추천카드 상세 조회 실패', e)
  }
}

watch(
  () => props.item,
  (v) => {
    data.value = { ...v }
    hydrateIfNeeded()
  },
  { immediate: true }
)

const toNumber = (val) => {
  if (val == null) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const digits = val.replace(/[^\d]/g, '')
    return digits ? Number(digits) : 0
  }
  return 0
}

const fmt = (n) => {
  const num = toNumber(n)
  return num.toLocaleString('ko-KR')
}

// 보증금/월세 형태 우선 처리, 월세는 두 번째 숫자
const getMonthlyFromCondition = (cond) => {
  if (typeof cond !== 'string') return 0
  const nums = (cond.match(/\d+/g) || []).map(Number)
  return nums[1] ?? nums[0] ?? 0
}

const titleText = computed(() => {
  const type = data.value.housingType || data.value.listing || '매물'
  const dep = fmt(data.value.deposit)

  const monthly =
    data.value.monthlyRent != null
      ? toNumber(data.value.monthlyRent)
      : getMonthlyFromCondition(data.value.rental_condition)

  return monthly > 0 ? `${type} ${dep}/${fmt(monthly)}` : `${type} ${dep}`
})

 addrUpToDong(text) {
  if (typeof text !== 'string') return ''
  const base = text
    .replace(/\(.*?\)/g, '')   // 괄호 제거
    .replace(/\s+/g, ' ')      // 공백 정리
    .replace(/,+$/, '')        // 끝 콤마 제거
    .trim()
  if (!base) return ''

  const roadIdx = base.search(/[가-힣0-9]+(?:대로|번길|로|길)\b/)
  const head = roadIdx >= 0 ? base.slice(0, roadIdx) : base

  const dongPrefix = head.match(/^(.*?\b[가-힣0-9]+동)\b/)
  if (dongPrefix) return dongPrefix[1].trim()

  const emlPrefix = head.match(/^(.*?\b[가-힣0-9]+[읍면리])\b/)
  if (emlPrefix) return emlPrefix[1].trim()

  const guPrefix = head.match(/^(.*?\b[가-힣0-9]+구)\b/)
  if (guPrefix) return guPrefix[1].trim()

  return head.split(' ').slice(0, 2).join(' ') || base
}

const addrText = computed(() => {
  const raw = data.value.address || data.value.details || ''
  return addrUpToDong(raw)
})

// 대표이미지 없으면 타입별 고정 랜덤 폴백
const thumb = computed(() => getListingImage(data.value))

// 로딩 실패 시에도 동일 시드 폴백으로 복구
const onImgError = (e) => {
  if (e?.target) {
    e.target.onerror = null
    const seed = data.value?.id ?? data.value?.address ?? data.value?.listing ?? ''
    e.target.src = getFallbackImage(data.value?.housingType, seed)
  }
}

const linkTo = computed(() =>
  data.value?.id ? `/listing/${data.value.id}` : '#'
)
</script>

<style scoped>
.rec-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background: var(--color-primary-10);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--color-primary-05);
  overflow: hidden;
  width: 110px;
  height: 137px;
  transition: transform .12s ease, box-shadow .12s ease;
}
.rec-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px var(--color-primary-10);
}

.thumb-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.thumb {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
  background: var(--color-primary-10);
  display: block;
}

.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 6px 8px;
  text-align: center;
}

.title {
  line-height: 1;
  color: var(--color-primary);
  margin-bottom: 2px;
}

.addr {
  color: var(--color-black);
  line-height: 1;
}
</style>