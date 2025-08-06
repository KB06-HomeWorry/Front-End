<template>
  <div class="listing-page">
    <div class="listing-list">
      <ListingCard
        v-for="item in listings"
        :key="item.id"
        :id="item.id"
        :transactionType="item.transactionType"
        :deposit="item.deposit"
        :monthlyRent="item.monthlyRent"
        :address="item.address"
        :housingType="item.housingType"
        :areaInfo="item.areaInfo"
        :floorInfo="item.floorInfo"
        :direction="item.direction"
      />
    </div>
    <div v-if="listings.length === 0" class="empty-msg bodyMedium20px">
      등록된 매물이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ListingCard from '@/pages/agency/components/ListingCard.vue'; 

const listings = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/api/listing');
    const data = await response.json();
    listings.value = data.map(item => ({
      id: item.id,
      transactionType: item.transactionType,
      deposit: item.deposit,
      monthlyRent: item.monthlyRent,
      address: item.address,
      housingType: item.housingType,
      areaInfo: item.areaInfo,
      floorInfo: item.floorInfo,
      direction: item.direction
    }));
  } catch (e) {
    console.error('매물 목록 불러오기 실패:', e);
    listings.value = [];
  }
});
</script>

<style scoped>
.listing-page {
  max-width: 450px;
  margin: 0.5rem 1.5rem;
}

.listing-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.empty-msg {
  color: var(--color-primary);
  text-align: center;
  margin-top: 30px;
}
</style>
