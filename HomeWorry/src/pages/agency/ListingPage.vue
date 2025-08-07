<template>
  <div class="listing-page">
    <div class="listing-list">
      <ListingCard
        v-for="listing in listings"
        :key="listing.id"
        :id="listing.id"
        :transactionType="listing.transactionType"
        :deposit="listing.deposit"
        :monthlyRent="listing.monthlyRent"
        :address="listing.address"
        :housingType="listing.housingType"
        :areaInfo="listing.areaInfo"
        :floorInfo="listing.floorInfo"
        :direction="listing.direction"
      />
    </div>
    <div v-if="listings.length === 0" class="empty-msg bodyMedium20px">
      등록된 매물이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios'
import ListingCard from '@/pages/agency/components/ListingCard.vue'; 

const route = useRoute()

const listings = ref([]);
const officeId = route.query.agencyId || route.params.agencyId || '1'

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/listing/getAgencyList/${officeId}`)
    listings.value = res.data
    
  } catch (e) {
    alert("매물 목록 불러오기에 실패했습니다.")
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
