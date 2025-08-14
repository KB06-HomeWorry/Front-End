<template>
  <RouterLink class="rec-card" :to="`/listing/${item.id}`">
    <div class="thumb-wrap">
      <img class="thumb" :src="thumb" :alt="`${titleText} 대표 이미지`" loading="lazy" />
    </div>
    <div class="body">
      <div class="title bodyMedium10px">{{ titleText }}</div>
      <div class="addr bodyLight8px">{{ addrText }}</div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const fmt = (n) => {
  const num = Number(n || 0)
  return isNaN(num) ? '0' : num.toLocaleString('ko-KR')
}

const titleText = computed(() => {
  const type = props.item.housingType || props.item.listing || '매물'
  const dep = fmt(props.item.deposit)
  const rent = Number(props.item.monthlyRent || 0)
  return rent > 0 ? `${type} ${dep}/${fmt(rent)}` : `${type} ${dep}`
})

const addrText = computed(() => props.item.address || '')

const thumb = computed(() =>
  props.item.mainImage ||
  props.item.imageUrl ||
  (Array.isArray(props.item.images) && props.item.images[0]) ||
  'https://picsum.photos/seed/fallback/600/600'
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
