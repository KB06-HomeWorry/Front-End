<template>
  <div class="agency-card" @click="goToDetail" style="cursor:pointer;">
    <button
      class="bookmark-btn"
      @click.stop="onToggleFavorite"
      :aria-label="isFavorite ? '북마크 해제' : '북마크 등록'"
    >
      <img
        :src="isFavorite ? bookmarkOn : bookmarkOff"
        class="bookmark-icon"
        :alt="isFavorite ? '북마크 완료' : '북마크 등록'"
      />
    </button>
    <div class="img-wrap">
      <img :src="profileSrc" class="profile-img" alt="프로필" />
    </div>
    <div class="info-wrap">
      <div class="agency-name bodyMedium14px">{{ officeName }}</div>
      <div class="agency-address bodyLight10px">{{ shortAddress }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import bookmarkOn from '@/assets/icons/star_filled.png'
import bookmarkOff from '@/assets/icons/star_outline.png'

const router = useRouter()  

// 샘플 이미지는 상위에서 내려받음 
const props = defineProps({
  id: [String, Number],
  officeName: String,
  address: String,
  imgUrl: String,    // 실제 프로필 이미지
  isFavorite: Boolean,
  onToggleFavorite: { type: Function, required: true },
  img: { type: String, default: '' } // 프로필 이미지 없으면 들어갈 샘플이미지
})

const profileSrc = computed(() => {
  // 실제 이미지 > 샘플 이미지
  return props.imgUrl && props.imgUrl.trim() !== '' ? props.imgUrl : props.img
})

// 시, 구까지만 자르기
const shortAddress = computed(() => {
  if (!props.address) return '';
  const parts = props.address.split(' ')
  return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : props.address
})

function onToggleFavorite() {
  props.onToggleFavorite(props.id)
}

// 카드 클릭 시 상세페이지로 이동
function goToDetail() {
  router.push(`/agency/${props.id}`)
}
</script>

<style scoped>
.agency-card {
  width: 100%;
  background: #fff;
  border: 1px solid var(--color-light);
  border-radius: 12px;
  padding: 28px 10px 16px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 0;
  box-sizing: border-box;
}

/* 북마크 버튼: 우상단에 고정, 배경/테두리X */
.bookmark-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  z-index: 2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bookmark-icon {
  width: 24px;
  height: 24px;
  display: block;
}

.img-wrap {
  width: 80px;
  height: 80px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #eee;
  background: #f3f3f3;
}

.info-wrap {
  width: 100%;
  text-align: center;
}

.agency-name {
  color: var(--color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
}

.agency-address {
  color: var(--color-darkgray);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
