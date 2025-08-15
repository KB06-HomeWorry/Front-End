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
import fallbackImg from '@/assets/images/room/default/default1.png'

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
const FALLBACK_IMG = fallbackImg

async function hydrateIfNeeded() {
  if (!props.hydrate || !data.value?.id) return

  const hasAddress = !!data.value.address || !!data.value.details
  const hasImage =
    !!data.value.mainImage ||
    !!data.value.imageUrl ||
    (Array.isArray(data.value.images) && data.value.images.length > 0)

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

const addrText = computed(() => data.value.address || data.value.details || '')

const thumb = computed(() => {
  const firstFromArray =
    Array.isArray(data.value.images) && data.value.images.length > 0
      ? (typeof data.value.images[0] === 'string'
          ? data.value.images[0]
          : (data.value.images[0]?.url || data.value.images[0]?.src))
      : null

  return (
    data.value.mainImage ||
    data.value.imageUrl ||
    firstFromArray ||
    FALLBACK_IMG
  )
})

const linkTo = computed(() => (data.value?.id ? `/listing/${data.value.id}` : '#'))

const onImgError = (e) => {
  if (e?.target) {
    e.target.onerror = null 
    e.target.src = FALLBACK_IMG
  }
}
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
