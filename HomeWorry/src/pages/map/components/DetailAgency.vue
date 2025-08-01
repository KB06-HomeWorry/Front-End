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
        <div class="agency-name bodyMedium14px">{{ name }}</div>
        <div class="agency-address bodyLight10px">{{ address }}</div>
        <div class="agency-phone bodyLight10px">{{ phone }}</div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import sample1 from '@/assets/icons/sample_profile1.png'
import sample2 from '@/assets/icons/sample_profile2.png'
import sample3 from '@/assets/icons/sample_profile3.png'

const props = defineProps({
  id: Number,
  name: String,
  address: String,
  phone: String,
  img: String,
  profileIdx: { type: Number, default: 0 }
})

const sampleImgs = [sample1, sample2, sample3]

const computedImg = props.img && props.img.length > 0
  ? props.img
  : sampleImgs[props.profileIdx % sampleImgs.length]
</script>

<style scoped>
.agency-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  align-items: center;
  background: #fff;
}

.agency-card-left {
  display: flex;
  align-items: center;
}

.agency-profile-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 12px;
  background: #f3f3f3;
  border: 1px solid #eee;
  display: block;
  margin: 0 auto;
}

.agency-card-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  justify-content: center;
}

.agency-name {
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.agency-address,
.agency-phone {
  color: var(--color-darkgray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
