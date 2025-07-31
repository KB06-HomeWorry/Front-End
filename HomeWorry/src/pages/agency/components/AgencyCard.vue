<template>
  <router-link
    class="agency-card-link"
    :to="`/agency/${id}`"
  >
  <div class="agency-card">
    <div class="agency-card-left">
      <img :src="computedImg" alt="프로필" class="agency-profile-img" />
    </div>
    <div class="agency-card-main">
      <div class="agency-header">
        <div class="agency-name bodyMedium16px">{{ name }}</div>
        <div class="trust-badge bodyMedium10px">
          <span class="star bodyMedium10px">★</span> {{ trustScore }}
        </div>
      </div>
      <div class="agency-address bodyMedium14px">{{ address }}</div>
      <div class="agency-phone bodyMedium12px">{{ phone }}</div>
    </div>
  </div>
  </router-link>
</template>

<script setup>
const props = defineProps({
  id: String,
  name: String,
  address: String,
  phone: String,
  trustScore: [Number, String],
  // 실제 이미지 URL이 있을 때
  img: String,
  // 없을 땐 idx로 sample 돌리기
  profileIdx: { type: Number, default: 0 }
})

const sampleImgs = [
  '@/assets/icons/sample_profile1.png',
  '@/assets/icons/sample_profile1.png',
  '@/assets/icons/sample_profile1.png'
]

// 실 이미지가 props.img로 들어오면 우선, 없으면 sample
const computedImg = props.img && props.img.length > 0
  ? props.img
  : sampleImgs[props.profileIdx % sampleImgs.length]
</script>

<style scoped>
.agency-card {
  display: flex;
  gap: 8px;
  padding: 12px 0 12px 0;
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
  margin-left: 4px
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
  height: 16px;
  background: rgba(17, 31, 92, 0.1);
  color: var(--color-primary);
  border-radius: 7px;
  padding: 3px 8px 3px 5px;
  display: flex;
  align-items: center;
  gap: 2px;
  line-height: 8px;
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
  color: var(--color-mediumgray);
}
</style>
