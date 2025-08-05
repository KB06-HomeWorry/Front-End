<template>
  <div class="listing-card">
    <div class="listing-header">
      <div class="listing-summary">
        <div class="deal-info bodyMedium14px">
          <span class="deal-type">{{ transactionType }} </span>
          <span v-if="deposit" class="deal-detail titleBold16px"> {{ deposit }} </span>
          <span v-if="monthlyRent" class="deal-detail titleBold16px"> / {{ monthlyRent }}</span>
        </div>
        <div class="address bodyLight12px">{{ addressShort }}</div>
        <div class="specs bodyMedium12px">
          <span>{{ housingType }}</span>
          <span v-if="areaInfo"> · {{ areaInfo }}</span>
          <span v-if="floorInfo"> · {{ floorInfo }}</span>
          <span v-if="direction"> · {{ direction }}</span>
        </div>
      </div>
      <img :src="roomImg" alt="매물 이미지" class="listing-image"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import roomImg from '@/assets/icons/home_villa.png';

const props = defineProps({
  transactionType: String,
  deposit: String,
  monthlyRent: String,
  address: String,
  housingType: String,
  areaInfo: String,
  floorInfo: String,
  direction: String,
});


const addressShort = computed(() => props.address || '');
</script>

<style scoped>
.listing-card {
  background: #fff;
  padding: 12px 6px;
  max-width: 393px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--color-lightgray);
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

.deal-type{
    margin-right: 6px;
}

.deal-info {
  color: var(--color-primary);
}

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

.listing-image {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  margin-left: 20px;
  background: var(--color-lightgray);
  flex-shrink: 0;
}
</style>
