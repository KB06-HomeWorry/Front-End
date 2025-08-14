<template>
  <div class="listing-card" @click="goDetail">
    <div class="listing-header">
      <div class="listing-summary">
        <div class="deal-info bodyMedium14px">
          <span class="deal-type">{{ transactionType }}</span>
          <span v-if="deposit" class="deal-detail titleBold16px"> {{ deposit }} </span>
          <span v-if="monthlyRent" class="deal-detail titleBold16px"> / {{ monthlyRent }}</span>
        </div>
        <div class="address bodyLight12px">{{ address }}</div>
        <div class="specs bodyMedium12px">
          <span>{{ housingType }}</span>
          <span v-if="areaInfo"> · {{ areaInfo }}</span>
          <span v-if="floorInfo"> · {{ floorInfo }}</span>
          <span v-if="direction"> · {{ direction }}</span>
        </div>
      </div>

      <!-- 이미지/북마크 버튼 영역 -->
      <div class="image-wrapper">
        <img
          :src="displayImg"
          @error="onImgError"
          alt="매물 이미지"
          class="listing-image"
        />
        <button
          class="bookmark-btn"
          @click.stop="onToggleFavorite"
          :aria-label="isBookmark ? '북마크 해제' : '북마크 등록'"
        >
          <img
            :src="isBookmark ? bookmarkOn : bookmarkOff"
            class="bookmark-icon"
            :alt="isBookmark ? '북마크 완료' : '북마크 등록'"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import bookmarkOn from '@/assets/icons/heart_filled.png'
import bookmarkOff from '@/assets/icons/heart_outline.png'
import { getListingImage } from '@/components/utils/listingImage'

const router = useRouter()

const isBookmark = ref(null)

const props = defineProps({
  id: [String, Number],
  transactionType: String,
  deposit: String,
  monthlyRent: String,
  address: String,
  housingType: String,
  areaInfo: String,
  floorInfo: String,
  direction: String,
  isFavorite: Boolean,
  onToggleFavorite: { type: Function, required: true },
  img: { type: String, default: '' },
})

function onToggleFavorite() {
  props.onToggleFavorite(props.id, isBookmark.value)
  isBookmark.value = !isBookmark.value
}

onMounted(() => {
  isBookmark.value = props.isFavorite
})

const displayImg = ref(props.img || getListingImage(props.housingType, String(props.id)))

function onImgError() {
  displayImg.value = getListingImage(props.housingType, String(props.id))
}

function goDetail() {
  router.push(`/listing/${props.id}`)
}
</script>

<style scoped>
.listing-card {
  background: #fff;
  padding: 12px 6px;
  max-width: 393px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--color-lightgray);
  cursor: pointer;
  transition: background 0.12s;
}
.listing-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.listing-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 0%;
  min-width: 0;
}
.deal-type { 
  margin-right: 6px; 
}
.deal-info, 
.deal-detail { 
  color: var(--color-primary); 
}
.address {
  color: var(--color-darkgray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}
.specs {
  color: var(--color-darkgray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  letter-spacing: -0.05em;
}
.image-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}
.listing-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  background: var(--color-lightgray);
  display: block;
}
.bookmark-btn {
  position: absolute;
  right: 2px;
  top: 2px;
  border: none;
  padding: 3px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
  transition: background 0.12s;
}
.bookmark-icon {
  width: 22px;
  height: 22px;
  display: block;
}
</style>
