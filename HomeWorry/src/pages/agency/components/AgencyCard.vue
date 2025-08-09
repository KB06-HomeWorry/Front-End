<template>
  <router-link class="agency-card-link" :to="`/agency/${id}`">
    <div class="agency-card">
      <div class="agency-card-left">
        <img :src="computedImg" alt="프로필" class="agency-profile-img" />
      </div>
      <div class="agency-card-main">
        <div class="agency-header">
          <div class="agency-name bodyMedium16px">{{ name }}</div>
          <div class="trust-badge bodyMedium10px">
            <span class="star bodyMedium10px">★</span> {{ displayTrustScore }}
          </div>
        </div>
        <div class="agency-address bodyMedium12px">{{ address }}</div>
        <div class="agency-phone bodyLight12px">{{ phone }}</div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: Number,
  name: String,
  address: String,
  phone: String,
  trustScore: [Number, String],
  // 실제 이미지 URL이 있을 때
  img: String,
  // 없을 땐 idx로 sample 돌리기
  profileIdx: { type: Number, default: 0 },
});

const sampleImgs = [
  "@/assets/icons/sample_profile1.png",
  "@/assets/icons/sample_profile1.png",
  "@/assets/icons/sample_profile1.png",
];

// 실 이미지가 props.img로 들어오면 우선, 없으면 sample
const computedImg =
  props.img && props.img.length > 0
    ? props.img
    : sampleImgs[props.profileIdx % sampleImgs.length];

/** 0~100 또는 0~5 입력을 모두 0~5 스케일로 변환해 1자리 소수로 표시 */
const displayTrustScore = computed(() => {
  const raw = Number(props.trustScore);
  if (Number.isNaN(raw)) return '0.0';

  // 6 이상이면 0~100 스케일로 판단 → 0~5 변환
  const fiveScale = raw > 5 ? raw / 20 : raw;

  // 안전 범위 클램프 후 표시 포맷
  const clamped = Math.min(5, Math.max(0, fiveScale));
  return clamped.toFixed(1);
});
</script>

<style scoped>
.agency-card {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  background: #fff;
}

.agency-card-left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-right: 6px;
}

.agency-profile-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
  background: #f3f3f3;
  border: 1px solid #eee;
  display: block;
  margin-left: 4px;
}

.agency-card-main {
  flex: 1;
  min-width: 0;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
}

.agency-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}
.agency-name {
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trust-badge {
  width: 42px;
  height: 16px;
  background: var(--color-primary-10);
  color: var(--color-primary);
  border-radius: 7px;
  display: flex;
  align-items: center; 
  justify-content: center; 
  gap: 2px;
  line-height: 16px;
  text-align: center;
  padding-top: 1px;
  padding-right: 2px;
}
.trust-badge .star {
  margin-right: 1px;
}

.agency-address {
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.agency-phone {
  color: var(--color-darkgray);
}
</style>
